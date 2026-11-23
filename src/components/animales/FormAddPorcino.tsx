"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
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
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { FormPorcinoData } from "@/api/animales/interfaces/crear-porcino.interface";
import {
  condicionCorporalOptions,
  etapaPorcinoOptions,
  tipoAlimentacionPorcinoOptions,
  tipoRegistroPorcinoOptions,
} from "@/helpers/data/animales/animales-data";
import { CreateAnimalPorcino } from "@/api/animales/accions/crear-animal";

interface Props {
  selectedEspecieId: string;
}

const FormAddPorcino = ({ selectedEspecieId }: Props) => {
  const t = useTranslations("FormAddPorcino");

  const router = useRouter();
  const queryClient = useQueryClient();
  const { cliente } = useAuthStore();

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [showIdentifierHelp, setShowIdentifierHelp] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormPorcinoData>({
    defaultValues: {
      identificador: "",
      cantidad_inicial_porcino: 1,
      cantidad_actual_porcino: 1,
      desparasitado: false,
      mortalidad: false,
      cuarentena_porcino: false,
    },
  });

  const sexoItems = [
    { value: "macho", label: t("fields.sexoMacho") },
    { value: "hembra", label: t("fields.sexoHembra") },
  ];

  const { data: razas } = useGetRazasByEspecie(selectedEspecieId);
  const { data: fincas } = useFincasPropietarios(cliente?.id ?? "");

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

  const fincasItems =
    fincas?.data.fincas.map((finca) => ({
      label: finca.nombre_finca,
      value: finca.id,
    })) || [];

  const mutation = useMutation({
    mutationFn: (data: FormData) => CreateAnimalPorcino(data),
    onSuccess: () => {
      toast.success(t("messages.porcinoCreado"));
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      reset();
      setSelectedImages([]);
      setImagePreviews([]);
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

  const onSubmit = (data: FormPorcinoData) => {
    if (!cliente?.id) return;

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
      formData.append(key, String(value));
    });

    formData.append("especie", String(selectedEspecieId));

    if (data.razaIds && data.razaIds.length > 0) {
      formData.append("razaIds", JSON.stringify(data.razaIds));
    }

    if (data.tipo_alimentacion && data.tipo_alimentacion.length > 0) {
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
    }

    selectedImages.forEach((image) => formData.append("images", image));

    mutation.mutate(formData as any);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            {t("header.title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            {t.rich("header.subtitle", {
              red: (chunks) => <span className="text-red-500">{chunks}</span>,
            })}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.identificacion")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.sexo")} <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={watch("sexo") || ""}
                  onValueChange={(value) => setValue("sexo", value)}
                  className="space-y-2"
                >
                  {sexoItems.map((sexo) => (
                    <div
                      key={sexo.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={sexo.value}
                        id={`sexo-${sexo.value}`}
                      />
                      <Label htmlFor={`sexo-${sexo.value}`} className="text-sm">
                        {sexo.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.sexo && (
                  <p className="text-sm text-red-500">{errors.sexo.message}</p>
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
                      placeholder={t("fields.identificadorPlaceholder")}
                      className="w-full font-mono text-lg tracking-wider uppercase"
                    />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.nombre")}
                </Label>
                <Input
                  {...register("nombre_animal")}
                  placeholder={t("fields.nombrePlaceholder")}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.color")}
                </Label>
                <Input
                  {...register("color")}
                  placeholder={t("fields.colorPlaceholder")}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.finca")} <span className="text-red-500">*</span>
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
                <p className="text-sm text-red-500">{errors.fincaId.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.caracteristicas")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.raza")} <span className="text-red-500">*</span>
                </Label>
                <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto bg-gray-50">
                  {razas?.data.map((raza) => (
                    <div key={raza.id} className="flex items-center space-x-2">
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
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.tipoRegistro")}
                </Label>
                <Select
                  value={watch("tipo_registro_porcino") || ""}
                  onValueChange={(value) =>
                    setValue("tipo_registro_porcino", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("fields.tipoRegistroPlaceholder")}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoRegistroPorcinoOptions.map((opcion) => (
                      <SelectItem key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.etapa")}
                </Label>
                <Select
                  value={watch("etapa_porcino") || ""}
                  onValueChange={(value) => setValue("etapa_porcino", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("fields.etapaPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {etapaPorcinoOptions.map((opcion) => (
                      <SelectItem key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.corralGalera")}
                </Label>
                <Input
                  {...register("corral_galera")}
                  placeholder={t("fields.corralGaleraPlaceholder")}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.lote")}
                </Label>
                <Input
                  {...register("lote")}
                  placeholder={t("fields.lotePlaceholder")}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.proveedor")}
              </Label>
              <Input
                {...register("proveedor")}
                placeholder={t("fields.proveedorPlaceholder")}
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.fechaIngreso")}
                </Label>
                <Input
                  type="date"
                  {...register("fecha_ingreso_porcino")}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.cantidadInicial")}
                </Label>
                <Input
                  type="number"
                  min={1}
                  {...register("cantidad_inicial_porcino", {
                    valueAsNumber: true,
                  })}
                  placeholder={t("fields.cantidadInicialPlaceholder")}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.cantidadActual")}
                </Label>
                <Input
                  type="number"
                  min={0}
                  {...register("cantidad_actual_porcino", {
                    valueAsNumber: true,
                  })}
                  placeholder={t("fields.cantidadActualPlaceholder")}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.peso")}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.pesoInicial")}
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  min={0}
                  {...register("peso_inicial_porcino", { valueAsNumber: true })}
                  placeholder={t("fields.pesoInicialPlaceholder")}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.pesoPromedio")}
                </Label>
                <Input
                  type="number"
                  min={0}
                  {...register("peso_promedio")}
                  placeholder={t("fields.pesoPromedioPlaceholder")}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.gananciaPeso")}
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  {...register("ganancia_peso", { valueAsNumber: true })}
                  placeholder={t("fields.gananciaPesoPlaceholder")}
                  className="w-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.fechaPesaje")}
              </Label>
              <Input
                type="date"
                {...register("fecha_pesaje_porcino")}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.alimentacion")}
            </h3>
            <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
              {tipoAlimentacionPorcinoOptions.map((alimento) => {
                const alimentoSeleccionado = watch("tipo_alimentacion")?.find(
                  (a: any) => a.alimento === alimento.value,
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
                                  (a: any) => a.alimento !== alimento.value,
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
                            ).map((item: any) =>
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
                                  ).map((item: any) =>
                                    item.alimento === alimento.value
                                      ? { ...item, porcentaje_comprado: value }
                                      : item,
                                  );
                                  setValue("tipo_alimentacion", updated);
                                }}
                                placeholder={t(
                                  "alimentacion.porcentajeEjemplo",
                                  { value: 60 },
                                )}
                                className="w-full"
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
                                  ).map((item: any) =>
                                    item.alimento === alimento.value
                                      ? { ...item, porcentaje_producido: value }
                                      : item,
                                  );
                                  setValue("tipo_alimentacion", updated);
                                }}
                                placeholder={t(
                                  "alimentacion.porcentajeEjemplo",
                                  { value: 40 },
                                )}
                                className="w-full"
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
                  {t("fields.consumoDiario")}
                </Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  {...register("consumo_diario_porcino", {
                    valueAsNumber: true,
                  })}
                  placeholder={t("fields.consumoDiarioPlaceholder")}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.sanidad")}
            </h3>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="desparasitado"
                checked={watch("desparasitado")}
                onCheckedChange={(checked) =>
                  setValue("desparasitado", checked === true)
                }
              />
              <Label
                htmlFor="desparasitado"
                className="text-sm font-medium cursor-pointer"
              >
                {t("fields.desparasitado")}
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="cuarentena"
                checked={watch("cuarentena_porcino")}
                onCheckedChange={(checked) =>
                  setValue("cuarentena_porcino", checked === true)
                }
              />
              <Label
                htmlFor="cuarentena"
                className="text-sm font-medium cursor-pointer"
              >
                {t("fields.enCuarentena")}
              </Label>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.condicionCorporal")}
              </Label>
              <Select
                value={watch("condicion_corporal") || ""}
                onValueChange={(value) => setValue("condicion_corporal", value)}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("fields.condicionCorporalPlaceholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {condicionCorporalOptions.map((opcion) => (
                    <SelectItem key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.vacunas")}
              </Label>
              <Textarea
                {...register("vacunas")}
                placeholder={t("fields.vacunasPlaceholder")}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.bajasMortalidad")}
                </Label>
                <Input
                  type="number"
                  min={0}
                  {...register("bajas_mortalidad_porcino", {
                    valueAsNumber: true,
                  })}
                  placeholder={t("fields.bajasMortalidadPlaceholder")}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.salida")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.fechaSalida")}
                </Label>
                <Input
                  type="date"
                  {...register("fecha_salida_porcino")}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.pesoSalida")}
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  min={0}
                  {...register("peso_salida_porcino", { valueAsNumber: true })}
                  placeholder={t("fields.pesoSalidaPlaceholder")}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.comprador")}
                </Label>
                <Input
                  {...register("comprador_porcino")}
                  placeholder={t("fields.compradorPlaceholder")}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.precio")}
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  {...register("precio_porcino", { valueAsNumber: true })}
                  placeholder={t("fields.precioPlaceholder")}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.rendimientoCanal")}
              </Label>
              <Input
                type="number"
                step="0.1"
                min={0}
                {...register("rendimiento_canal_porcino", {
                  valueAsNumber: true,
                })}
                placeholder={t("fields.rendimientoCanalPlaceholder")}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.observaciones")}
            </h3>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.nombreCriadorOrigen")}
              </Label>
              <Input
                {...register("nombre_criador_origen_animal")}
                placeholder={t("fields.nombreCriadorOrigenPlaceholder")}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.observaciones")}
              </Label>
              <Textarea
                {...register("observaciones")}
                placeholder={t("fields.observacionesPlaceholder")}
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">{t("fields.fotos")}</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                <Input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageSelect}
                  disabled={selectedImages.length >= 5}
                  className="w-full cursor-pointer"
                />
                <p className="text-xs text-gray-500 mt-2">
                  {t("imagenes.maxInfo")}
                </p>
              </div>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-2">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative aspect-square">
                      <img
                        src={preview}
                        alt={t("imagenes.alt", { index: index + 1 })}
                        className="w-full h-full object-cover rounded-lg border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 text-xs"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t flex justify-end">
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
                  {t("buttons.creando")}
                </>
              ) : (
                <>
                  {t("buttons.crearPorcino")}
                  <svg
                    className="w-4 h-4 ml-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default FormAddPorcino;
