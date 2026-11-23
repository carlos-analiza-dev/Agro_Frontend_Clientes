"use client";

import { useEffect, useState } from "react";
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
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { ActualizarAvicola } from "@/api/animales/accions/update-animal";
import { useTranslations } from "next-intl";

interface Props {
  animalId: string;
  animal: Animal;
}

const FormEditAvicola = ({ animalId, animal }: Props) => {
  const t = useTranslations("FormAddAvicola");
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cliente } = useAuthStore();
  const [showIdentifierHelp, setShowIdentifierHelp] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);

  const especieId = animal?.especie?.id || "";

  const { data: razas } = useGetRazasByEspecie(especieId);
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
  } = useForm<AvicolaData>({
    defaultValues: {
      identificador: "",
      tipo_ave: undefined,
      razaIds: [],
      cantidad_lote: 0,
      tipo_alimentacion: [],
      etapa_avicola: undefined,
    },
  });

  useEffect(() => {
    if (animal) {
      reset({
        especie: animal?.especie?.id || "",
        identificador: animal.identificador || "",
        tipo_ave: (animal.tipo_ave as TipoAve) || undefined,
        razaIds: animal.razas?.map((raza) => raza.id) || [],
        cantidad_lote: animal.cantidad_lote || 0,
        galpon: animal.galpon || "",
        proveedor_aves: animal.proveedor_aves || "",
        mortalidad_diaria: animal.mortalidad_diaria || 0,
        consumo_alimento: animal.consumo_alimento || "",
        consumo_agua: animal.consumo_agua || "",
        tipo_concentrado: animal.tipo_concentrado || "",
        huevos_diarios: animal.huevos_diarios || 0,
        huevos_rotos: animal.huevos_rotos || 0,
        calificacion_huevos: animal.calificacion_huevos || "",
        porcentaje_postura: animal.porcentaje_postura || "",
        fecha_postura: animal.fecha_postura
          ? new Date(animal.fecha_postura).toISOString().split("T")[0]
          : "",
        vacunas_lote: animal.vacunas_lote || "",
        tratamientos: animal.tratamientos || "",
        peso_promedio: animal.peso_promedio || "",
        tipo_produccion: animal.tipo_produccion || "",
        fincaId: animal.finca?.id || "",
        tipo_alimentacion: animal.tipo_alimentacion || [],
        etapa_avicola: (animal.etapa_avicola as EtapaAvicola) || undefined,
      });

      setIsFormReady(true);
    }
  }, [animal, reset]);

  const mutation = useMutation({
    mutationFn: (data: AvicolaData) => ActualizarAvicola(animalId, data),
    onSuccess: () => {
      toast.success(t("messages.avicolaActualizado"));
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      queryClient.invalidateQueries({ queryKey: ["animal-id", animalId] });
      router.push("/animales");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("messages.errorActualizar");

        toast.error(errorMessage);
      } else {
        toast.error(t("messages.errorInesperado"));
      }
    },
  });

  const onSubmit = (data: AvicolaData) => {
    if (!cliente?.id) return;

    if (!data.fincaId) {
      toast.error(t("validation.seleccionarFinca"));
      return;
    }

    if (!data.razaIds || data.razaIds.length === 0) {
      toast.error(t("validation.seleccionarRaza"));
      return;
    }

    if (!data.identificador || data.identificador.trim() === "") {
      toast.error(t("validation.identificadorObligatorio"));
      return;
    }

    mutation.mutate(data);
  };

  const handleSelectChange = (field: keyof AvicolaData, value: any) => {
    setValue(field, value);
  };

  if (!isFormReady) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Cargando datos del lote...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                {t("header.editTitle")}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {t.rich("header.editSubtitle", {
                  red: (chunks) => (
                    <span className="text-red-500">{chunks}</span>
                  ),
                })}
              </p>
            </div>
          </div>
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
                    handleSelectChange("tipo_ave", value as TipoAve)
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

          {/* Razas */}
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
              {watch("razaIds") && watch("razaIds").length > 0 && (
                <p className="text-xs text-green-600">
                  {t("fields.razasSeleccionadas", {
                    count: watch("razaIds").length,
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

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.etapa")} <span className="text-red-500">*</span>
            </h3>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.etapaActual")}
              </Label>
              <Select
                value={watch("etapa_avicola") || ""}
                onValueChange={(value) =>
                  handleSelectChange("etapa_avicola", value as EtapaAvicola)
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

              <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-md border border-blue-100 dark:border-blue-900">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  <span className="font-semibold">
                    {t("fields.etapasInfoTitle")}
                  </span>
                </p>
                <ul className="text-xs text-blue-600 dark:text-blue-400 mt-1 space-y-1 list-disc list-inside">
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
                        <Label className="font-medium">{alimento.label}</Label>
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
                                  alimentoSeleccionado.porcentaje_comprado || ""
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.consumoAlimento")}
                </Label>
                <Input
                  {...register("consumo_alimento")}
                  placeholder={t("fields.consumoAlimentoPlaceholder")}
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

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.tipoConcentrado")}
              </Label>
              <Input
                {...register("tipo_concentrado")}
                placeholder={t("fields.tipoConcentradoPlaceholder")}
              />
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
                    handleSelectChange("calificacion_huevos", value)
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
                </Label>
                <Input
                  type="number"
                  min={0}
                  max={100}
                  {...register("porcentaje_postura")}
                  placeholder={t("fields.porcentajePosturaPlaceholder")}
                />
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
                  onValueChange={(value) =>
                    handleSelectChange("tipo_produccion", value)
                  }
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
                  onValueChange={(value) =>
                    handleSelectChange("fincaId", value)
                  }
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
              className="bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                  {t("buttons.actualizando")}
                </>
              ) : (
                t("buttons.actualizarLote")
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default FormEditAvicola;
