import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import {
  AvicolaData,
  EtapaAvicola,
} from "@/api/animales/interfaces/crear-avicola.interface";
import { TipoAve } from "@/interfaces/enums/animales/animales-enums";
import {
  alimentoOptionsAves,
  calificacionHuevosOptions,
  etapaAvicolaOptions,
  tipoAveOptions,
} from "@/helpers/data/animales/animales-data";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { CreateAnimalAvicolas } from "@/api/animales/accions/crear-animal";
import { useTranslations } from "next-intl";

interface Props {
  selectedEspecieId: string;
}

const FormAddAvicola = ({ selectedEspecieId }: Props) => {
  const t = useTranslations("FormAddAvicola");

  const router = useRouter();
  const queryClient = useQueryClient();
  const { cliente } = useAuthStore();
  const [showIdentifierHelp, setShowIdentifierHelp] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { data: razas } = useGetRazasByEspecie(selectedEspecieId);
  const { data: fincas } = useFincasPropietarios(cliente?.id ?? "");
  const fincasItems =
    fincas?.data.fincas.map((finca) => ({
      label: finca.nombre_finca,
      value: finca.id,
    })) || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<AvicolaData & { identificador_temp: string }>({
    defaultValues: {
      lote_activo: true,
      identificador: "",
    },
  });

  useEffect(() => {
    const cantidadLote = watch("cantidad_lote");
    const huevosDiarios = watch("huevos_diarios");

    if (
      cantidadLote &&
      cantidadLote > 0 &&
      huevosDiarios !== undefined &&
      huevosDiarios !== null &&
      huevosDiarios >= 0
    ) {
      const porcentaje = (huevosDiarios / cantidadLote) * 100;
      const porcentajeCalculado = Math.min(100, Number(porcentaje.toFixed(2)));
      setValue("porcentaje_postura", String(porcentajeCalculado));
    } else {
      setValue("porcentaje_postura", String(0));
    }
  }, [watch("cantidad_lote"), watch("huevos_diarios")]);

  const cantidadLote = watch("cantidad_lote");
  const huevosDiarios = watch("huevos_diarios");
  const porcentajePostura = watch("porcentaje_postura");
  const razaIdsSeleccionadas = watch("razaIds") || [];

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + selectedImages.length > 5) {
      toast.error(t("messages.maxImagenes"));
      return;
    }

    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 1024 * 1024;

      if (!isValidType) {
        toast.error(t("messages.imagenInvalida", { name: file.name }));
        return false;
      }
      if (!isValidSize) {
        toast.error(t("messages.imagenExcede", { name: file.name }));
        return false;
      }
      return true;
    });

    setSelectedImages((prev) => [...prev, ...validFiles]);

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const mutation = useMutation({
    mutationFn: (data: FormData) => CreateAnimalAvicolas(data),
    onSuccess: () => {
      toast.success(t("messages.avicolaCreado"));
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      reset();
      router.push("/animales");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("messages.errorCrear");

        toast.error(errorMessage);
      } else {
        toast.error(t("messages.errorInesperado"));
      }
    },
  });

  const onSubmit = (data: AvicolaData) => {
    if (!cliente?.id) return;
    if (!selectedEspecieId) {
      toast.error(t("validation.especieInvalida"));
      return;
    }
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        key === "razaIds" ||
        key === "tipo_alimentacion"
      ) {
        return;
      }
      if (key === "lote_activo") {
        formData.append(key, String(value));
        return;
      }
      formData.append(key, String(value));
    });

    formData.append("especie", selectedEspecieId);
    formData.append("razaIds", JSON.stringify(data.razaIds));
    data.tipo_alimentacion.forEach((item, index) => {
      formData.append(`tipo_alimentacion[${index}][alimento]`, item.alimento);
      formData.append(`tipo_alimentacion[${index}][origen]`, item.origen);

      if (item.porcentaje_comprado != null) {
        formData.append(
          `tipo_alimentacion[${index}][porcentaje_comprado]`,
          String(item.porcentaje_comprado),
        );
      }

      if (item.porcentaje_producido != null) {
        formData.append(
          `tipo_alimentacion[${index}][porcentaje_producido]`,
          String(item.porcentaje_producido),
        );
      }
    });
    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    mutation.mutate(formData as any);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {t("header.title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t.rich("header.subtitle", {
              red: (chunks) => <span className="text-red-500">{chunks}</span>,
            })}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Identificación */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.identificacion")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.tipoAve")} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={watch("tipo_ave") || ""}
                  onValueChange={(value) =>
                    setValue("tipo_ave", value as TipoAve)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("fields.tipoAvePlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoAveOptions.map((tipo) => (
                      <SelectItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tipo_ave && (
                  <p className="text-sm text-red-500">
                    {errors.tipo_ave.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.identificador")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      {...register("identificador")}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 6);
                        e.target.value = value;
                        setValue("identificador", value);
                      }}
                      placeholder={t("fields.identificadorPlaceholder")}
                      maxLength={6}
                      className="w-full font-mono text-lg tracking-wider uppercase"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <span className="text-xs text-muted-foreground">
                        {t("fields.chars6")}
                      </span>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip
                      open={showIdentifierHelp}
                      onOpenChange={setShowIdentifierHelp}
                    >
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="shrink-0"
                        >
                          <InfoIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-xs">
                          {t("fields.identificadorHelp")}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {errors.identificador && (
                  <p className="text-sm text-red-500">
                    {errors.identificador.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Razas del Lote */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.razas")} <span className="text-red-500">*</span>
            </h3>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.razasInfo")}
              </Label>
              <div className="border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto bg-gray-50">
                {razas?.data && razas.data.length > 0 ? (
                  razas.data.map((raza) => (
                    <div
                      key={raza.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Checkbox
                        checked={watch("razaIds")?.includes(raza.id) || false}
                        onCheckedChange={(checked) => {
                          const currentValues = watch("razaIds") || [];
                          if (checked) {
                            setValue("razaIds", [...currentValues, raza.id]);
                          } else {
                            setValue(
                              "razaIds",
                              currentValues.filter((id) => id !== raza.id),
                            );
                          }
                        }}
                        id={`raza-${raza.id}`}
                      />
                      <Label htmlFor={`raza-${raza.id}`} className="text-sm">
                        {raza.nombre}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    {t("fields.noRazas")}
                  </p>
                )}
              </div>
              {errors.razaIds && (
                <p className="text-sm text-red-500">{errors.razaIds.message}</p>
              )}
              {razaIdsSeleccionadas.length > 0 && (
                <p className="text-xs text-green-600">
                  {t("fields.razasSeleccionadas", {
                    count: razaIdsSeleccionadas.length,
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Información del Lote */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.infoLote")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.cantidadLote")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  {...register("cantidad_lote", { valueAsNumber: true })}
                  placeholder={t("fields.cantidadLotePlaceholder")}
                />
                {errors.cantidad_lote && (
                  <p className="text-sm text-red-500">
                    {errors.cantidad_lote.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.galpon")}
                </Label>
                <Input
                  {...register("galpon")}
                  placeholder={t("fields.galponPlaceholder")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.proveedorAves")}
                </Label>
                <Input
                  {...register("proveedor_aves")}
                  placeholder={t("fields.proveedorAvesPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.mortalidadDiaria")}
                </Label>
                <Input
                  type="number"
                  min={0}
                  {...register("mortalidad_diaria", { valueAsNumber: true })}
                  placeholder={t("fields.mortalidadDiariaPlaceholder")}
                />
              </div>
            </div>
          </div>

          {/* Etapa del Lote */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.etapa")}
            </h3>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.etapaActual")}{" "}
                <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("etapa_avicola") || ""}
                onValueChange={(value) =>
                  setValue("etapa_avicola", value as EtapaAvicola)
                }
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("fields.etapaActualPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {etapaAvicolaOptions.map((etapa) => (
                    <SelectItem key={etapa.value} value={etapa.value}>
                      {etapa.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.etapa_avicola && (
                <p className="text-sm text-red-500">
                  {errors.etapa_avicola.message}
                </p>
              )}

              <div className="mt-2 p-3 bg-blue-50 rounded-md border border-blue-100">
                <p className="text-xs text-blue-700">
                  <span className="font-semibold">
                    {t("fields.etapasInfoTitle")}
                  </span>
                </p>
                <ul className="text-xs text-blue-600 mt-1 space-y-1 list-disc list-inside">
                  <li>
                    <span className="font-medium">
                      {t("fields.etapaRecepcionTitle")}
                    </span>{" "}
                    {t("fields.etapaRecepcionDesc")}
                  </li>
                  <li>
                    <span className="font-medium">
                      {t("fields.etapaCriaTitle")}
                    </span>{" "}
                    {t("fields.etapaCriaDesc")}
                  </li>
                  <li>
                    <span className="font-medium">
                      {t("fields.etapaCrecimientoTitle")}
                    </span>{" "}
                    {t("fields.etapaCrecimientoDesc")}
                  </li>
                  <li>
                    <span className="font-medium">
                      {t("fields.etapaEngordeTitle")}
                    </span>{" "}
                    {t("fields.etapaEngordeDesc")}
                  </li>
                  <li>
                    <span className="font-medium">
                      {t("fields.etapaAyunoTitle")}
                    </span>{" "}
                    {t("fields.etapaAyunoDesc")}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Alimentación */}
          <div className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
                {t("sections.alimentacion")}
              </h3>

              <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                {alimentoOptionsAves.map((alimento) => {
                  const alimentoSeleccionado = watch("tipo_alimentacion")?.find(
                    (a) => a.alimento === alimento.value,
                  );

                  return (
                    <div
                      key={alimento.value}
                      className="bg-white rounded-lg p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            checked={!!alimentoSeleccionado}
                            onCheckedChange={(checked) => {
                              const isChecked = checked === true;
                              const currentAlimentacion =
                                watch("tipo_alimentacion") || [];

                              if (isChecked) {
                                setValue("tipo_alimentacion", [
                                  ...currentAlimentacion,
                                  {
                                    alimento: alimento.value,
                                    origen: "comprado",
                                  },
                                ]);
                              } else {
                                setValue(
                                  "tipo_alimentacion",
                                  currentAlimentacion.filter(
                                    (a) => a.alimento !== alimento.value,
                                  ),
                                );
                              }
                            }}
                          />
                          <Label className="font-medium">
                            {alimento.label}
                          </Label>
                        </div>
                      </div>

                      {alimentoSeleccionado && (
                        <div className="pl-6 space-y-3">
                          <RadioGroup
                            value={alimentoSeleccionado.origen}
                            onValueChange={(origen) => {
                              const updated = (
                                watch("tipo_alimentacion") || []
                              ).map((item) =>
                                item.alimento === alimento.value
                                  ? { ...item, origen }
                                  : item,
                              );
                              setValue("tipo_alimentacion", updated);
                            }}
                            className="flex flex-wrap gap-4"
                          >
                            {[
                              "comprado",
                              "producido",
                              "comprado y producido",
                            ].map((origen) => (
                              <div
                                key={origen}
                                className="flex items-center space-x-2"
                              >
                                <RadioGroupItem
                                  value={origen}
                                  id={`${alimento.value}-${origen}`}
                                />
                                <Label
                                  htmlFor={`${alimento.value}-${origen}`}
                                  className="text-sm"
                                >
                                  {origen === "comprado"
                                    ? t("alimentacion.origenComprado")
                                    : origen === "producido"
                                      ? t("alimentacion.origenProducido")
                                      : t("alimentacion.origenAmbos")}
                                </Label>
                              </div>
                            ))}
                          </RadioGroup>

                          {alimentoSeleccionado.origen ===
                            "comprado y producido" && (
                            <div className="grid grid-cols-2 gap-3">
                              <div className="space-y-1">
                                <Label className="text-xs">
                                  {t("alimentacion.porcentajeComprado")}
                                </Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={
                                    alimentoSeleccionado.porcentaje_comprado ||
                                    ""
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined;
                                    const updated = (
                                      watch("tipo_alimentacion") || []
                                    ).map((item) =>
                                      item.alimento === alimento.value
                                        ? {
                                            ...item,
                                            porcentaje_comprado: value,
                                          }
                                        : item,
                                    );
                                    setValue("tipo_alimentacion", updated);
                                  }}
                                  placeholder={t(
                                    "alimentacion.porcentajeEjemplo",
                                    {
                                      value: 60,
                                    },
                                  )}
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs">
                                  {t("alimentacion.porcentajeProducido")}
                                </Label>
                                <Input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={
                                    alimentoSeleccionado.porcentaje_producido ||
                                    ""
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value
                                      ? parseInt(e.target.value)
                                      : undefined;
                                    const updated = (
                                      watch("tipo_alimentacion") || []
                                    ).map((item) =>
                                      item.alimento === alimento.value
                                        ? {
                                            ...item,
                                            porcentaje_producido: value,
                                          }
                                        : item,
                                    );
                                    setValue("tipo_alimentacion", updated);
                                  }}
                                  placeholder={t(
                                    "alimentacion.porcentajeEjemplo",
                                    {
                                      value: 40,
                                    },
                                  )}
                                />
                              </div>
                              {alimentoSeleccionado.porcentaje_comprado !==
                                undefined &&
                                alimentoSeleccionado.porcentaje_producido !==
                                  undefined &&
                                alimentoSeleccionado.porcentaje_comprado +
                                  alimentoSeleccionado.porcentaje_producido !==
                                  100 && (
                                  <p className="text-xs text-red-500 col-span-2">
                                    {t("alimentacion.porcentajeSumaError")}
                                  </p>
                                )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.consumoAlimento")}
              </Label>
              <Input
                {...register("consumo_alimento")}
                placeholder={t("fields.consumoAlimentoPlaceholder")}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.tipoConcentrado")}
                </Label>
                <Input
                  {...register("tipo_concentrado")}
                  placeholder={t("fields.tipoConcentradoPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.consumoAgua")}
                </Label>
                <Input
                  {...register("consumo_agua")}
                  placeholder={t("fields.consumoAguaPlaceholder")}
                />
              </div>
            </div>
          </div>

          {/* Producción de Huevos */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.produccionHuevos")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.huevosDiarios")}
                </Label>
                <Input
                  type="number"
                  min={0}
                  {...register("huevos_diarios", { valueAsNumber: true })}
                  placeholder={t("fields.huevosDiariosPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.huevosRotos")}
                </Label>
                <Input
                  type="number"
                  min={0}
                  {...register("huevos_rotos", { valueAsNumber: true })}
                  placeholder={t("fields.huevosRotosPlaceholder")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.calificacionHuevos")}
                </Label>
                <Select
                  value={watch("calificacion_huevos") || ""}
                  onValueChange={(value) =>
                    setValue("calificacion_huevos", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("fields.calificacionHuevosPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {calificacionHuevosOptions.map((opcion) => (
                      <SelectItem key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.porcentajePostura")}
                  <span className="text-xs text-muted-foreground ml-2">
                    {t("fields.porcentajePosturaDesc")}
                  </span>
                </Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  step={0.01}
                  {...register("porcentaje_postura")}
                  readOnly
                  className="bg-gray-50 cursor-not-allowed"
                  placeholder={t("fields.porcentajePosturaPlaceholder")}
                />
                {cantidadLote && huevosDiarios && (
                  <p className="text-xs text-green-600">
                    {t("fields.porcentajeCalculado", {
                      porcentaje: porcentajePostura ?? "",
                      huevos: huevosDiarios,
                      aves: cantidadLote,
                    })}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.fechaPostura")}
              </Label>
              <Input type="date" {...register("fecha_postura")} />
            </div>
          </div>

          {/* Sanidad */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.sanidad")}
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.vacunasLote")}
                </Label>
                <Textarea
                  {...register("vacunas_lote")}
                  placeholder={t("fields.vacunasLotePlaceholder")}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.tratamientos")}
                </Label>
                <Textarea
                  {...register("tratamientos")}
                  placeholder={t("fields.tratamientosPlaceholder")}
                  className="min-h-[80px]"
                />
              </div>
            </div>
          </div>

          {/* Desempeño */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.desempeno")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.pesoPromedio")}
                </Label>
                <Input
                  {...register("peso_promedio")}
                  placeholder={t("fields.pesoPromedioPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.tipoProduccion")}
                </Label>
                <Select
                  value={watch("tipo_produccion") || ""}
                  onValueChange={(value) => setValue("tipo_produccion", value)}
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("fields.tipoProduccionPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="huevos">
                      {t("fields.tipoProduccionHuevos")}
                    </SelectItem>
                    <SelectItem value="carne">
                      {t("fields.tipoProduccionCarne")}
                    </SelectItem>
                    <SelectItem value="mixta">
                      {t("fields.tipoProduccionMixta")}
                    </SelectItem>
                    <SelectItem value="reproduccion">
                      {t("fields.tipoProduccionReproduccion")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Ubicación y Origen */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.ubicacion")}
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.finca")}
                </Label>
                <Select
                  value={watch("fincaId") || ""}
                  onValueChange={(value) => setValue("fincaId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("fields.fincaPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {fincasItems.map((finca) => (
                      <SelectItem key={finca.value} value={finca.value}>
                        {finca.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.fincaId && (
                  <p className="text-sm text-red-500">
                    {errors.fincaId.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Estado del Lote */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.estado")}
            </h3>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={watch("lote_activo")}
                onCheckedChange={(checked) =>
                  setValue("lote_activo", checked === true)
                }
                id="lote_activo"
              />
              <Label htmlFor="lote_activo" className="text-sm font-medium">
                {t("fields.loteActivo")}
              </Label>
            </div>
          </div>

          {/* Imágenes del Lote */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.imagenes")}
            </h3>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-2">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {t("imagenes.dropzone")}
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    disabled={selectedImages.length >= 5}
                    className="w-full max-w-xs cursor-pointer text-sm file:mr-2 file:py-2 file:px-3 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 file:border-none file:rounded-md hover:file:bg-blue-100 disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-500 mt-3">
                    {t("imagenes.maxInfo")}
                    <br />
                    <span className="text-blue-600">
                      {t("imagenes.contador", { count: selectedImages.length })}
                    </span>
                  </p>
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={preview}
                        alt={t("imagenes.alt", { index: index + 1 })}
                        className="w-full h-full object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all shadow-md active:scale-95 opacity-0 group-hover:opacity-100"
                        aria-label={t("imagenes.eliminar")}
                      >
                        ×
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs">
                          {t("imagenes.imagen", { index: index + 1 })}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Botones */}
          <div className="pt-4 border-t flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/animales")}
            >
              {t("buttons.cancelar")}
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  {t("buttons.creando")}
                </>
              ) : (
                t("buttons.ingresarLote")
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default FormAddAvicola;
