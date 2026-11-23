"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
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
import { InfoIcon, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import {
  EtapaPez,
  PecesData,
} from "@/api/animales/interfaces/crear-peces.interface";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { ActualizarPeces } from "@/api/animales/accions/update-animal";
import { etapaOptions } from "@/helpers/data/animales/animales-data";
import { useTranslations } from "next-intl";

interface Props {
  animalId: string;
  animal: Animal;
}

const FormEditPeces = ({ animalId, animal }: Props) => {
  const t = useTranslations("FormAddPeces");
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
    control,
    formState: { errors },
    reset,
  } = useForm<PecesData>({
    defaultValues: {
      identificador: "",
      lote_activo: true,
      muestreos: [],
      calidad_agua: {
        historial_recambios: [],
      },
      sanidad: {},
    },
  });

  const {
    fields: muestreoFields,
    append: appendMuestreo,
    remove: removeMuestreo,
  } = useFieldArray({
    control,
    name: "muestreos",
  });

  const {
    fields: recambioFields,
    append: appendRecambio,
    remove: removeRecambio,
  } = useFieldArray({
    control,
    name: "calidad_agua.historial_recambios",
  });

  useEffect(() => {
    if (animal) {
      const parseJsonField = (field: any) => {
        if (typeof field === "string") {
          try {
            return JSON.parse(field);
          } catch {
            return field;
          }
        }
        return field;
      };

      const muestreos = parseJsonField(animal.muestreos) || [];
      const calidad_agua = parseJsonField(animal.calidad_agua) || {};
      const sanidad = parseJsonField(animal.sanidad) || {};

      reset({
        especie: animal?.especie?.id || "",
        identificador: animal.identificador || "",
        fincaId: animal.finca?.id || "",
        razaIds: animal.razas?.map((raza) => raza.id) || [],
        estanque_tanque_jaula: animal.estanque_tanque_jaula || "",
        proveedor_alevines: animal.proveedor_alevines || "",
        fecha_siembra: animal.fecha_siembra
          ? new Date(animal.fecha_siembra).toISOString().split("T")[0]
          : "",
        cantidad_inicial: animal.cantidad_inicial || 0,
        talla_peso_inicial: animal.talla_peso_inicial || "",
        densidad_por_m3_m2: animal.densidad_por_m3_m2 || 0,
        cantidad_actual: animal.cantidad_actual || 0,
        mortalidad_diaria_acum: animal.mortalidad_diaria_acum || "",
        muestreos: muestreos,
        etapa: (animal.etapa as EtapaPez) || undefined,
        peso_promedio: animal.peso_promedio_pez || 0,
        biomasa_estimada: animal.biomasa_estimada || 0,
        talla: animal.talla_pez || 0,
        fecha_muestreo: animal.fecha_muestreo_pez
          ? new Date(animal.fecha_muestreo_pez).toISOString().split("T")[0]
          : "",
        calidad_agua: calidad_agua,
        tipo_concentrado: animal.tipo_concentrado_pez || "",
        proteina_porcentaje: animal.proteina_porcentaje || 0,
        racion_diaria: animal.racion_diaria || "",
        consumo: animal.consumo_pez || "",
        conversion_alimenticia: animal.conversion_alimenticia || 0,
        sanidad: sanidad,

        lote_activo:
          animal.lote_activo !== undefined ? animal.lote_activo : true,
      });

      setIsFormReady(true);
    }
  }, [animal, reset]);

  const mutation = useMutation({
    mutationFn: (data: PecesData) => ActualizarPeces(animalId, data),
    onSuccess: () => {
      toast.success(t("messages.pecesActualizado"));
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

  const onSubmit = (data: PecesData) => {
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

    if (!data.fecha_siembra) {
      toast.error(t("validation.fechaSiembraObligatoria"));
      return;
    }

    if (!data.cantidad_inicial || data.cantidad_inicial <= 0) {
      toast.error(t("validation.cantidadInicialMayorCero"));
      return;
    }

    mutation.mutate(data);
  };
  const handleSelectChange = (field: keyof PecesData, value: any) => {
    setValue(field, value);
  };

  if (!isFormReady) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            {t("loading.cargandoLote")}
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
                  {t("fields.estanqueTanqueJaula")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("estanque_tanque_jaula")}
                  placeholder={t("fields.estanqueTanqueJaulaPlaceholder")}
                />
                {errors.estanque_tanque_jaula && (
                  <p className="text-sm text-red-500">
                    {errors.estanque_tanque_jaula.message}
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

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.proveedorAlevines")}
              </Label>
              <Input
                {...register("proveedor_alevines")}
                placeholder={t("fields.proveedorAlevinesPlaceholder")}
              />
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
              {watch("razaIds") && watch("razaIds").length > 0 && (
                <p className="text-xs text-green-600">
                  {t("fields.razasSeleccionadas", {
                    count: watch("razaIds").length,
                  })}
                </p>
              )}
            </div>
          </div>

          {/* Siembra */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.siembra")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.fechaSiembra")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input type="date" {...register("fecha_siembra")} />
                {errors.fecha_siembra && (
                  <p className="text-sm text-red-500">
                    {errors.fecha_siembra.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.cantidadInicial")}{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  {...register("cantidad_inicial", { valueAsNumber: true })}
                  placeholder={t("fields.cantidadInicialPlaceholder")}
                />
                {errors.cantidad_inicial && (
                  <p className="text-sm text-red-500">
                    {errors.cantidad_inicial.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.tallaPesoInicial")}
                </Label>
                <Input
                  {...register("talla_peso_inicial")}
                  placeholder={t("fields.tallaPesoInicialPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.densidad")}
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("densidad_por_m3_m2", { valueAsNumber: true })}
                  placeholder={t("fields.densidadPlaceholder")}
                />
              </div>
            </div>
          </div>

          {/* Población */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.poblacion")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.cantidadActual")}
                </Label>
                <Input
                  type="number"
                  min={0}
                  {...register("cantidad_actual", { valueAsNumber: true })}
                  placeholder={t("fields.cantidadActualPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.etapa")}
                </Label>
                <Select
                  value={watch("etapa") || ""}
                  onValueChange={(value) =>
                    handleSelectChange("etapa", value as EtapaPez)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("fields.etapaPlaceholder")} />
                  </SelectTrigger>
                  <SelectContent>
                    {etapaOptions.map((etapa) => (
                      <SelectItem key={etapa.value} value={etapa.value}>
                        {etapa.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.mortalidadDiariaAcum")}
              </Label>
              <Input
                {...register("mortalidad_diaria_acum")}
                placeholder={t("fields.mortalidadDiariaAcumPlaceholder")}
              />
            </div>
          </div>

          {/* Muestreos */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.muestreos")}
            </h3>

            {muestreoFields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded-lg p-4 space-y-3 bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <Label className="font-medium">
                    {t("fields.muestreo", { index: index + 1 })}
                  </Label>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMuestreo(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">{t("fields.fecha")}</Label>
                    <Input
                      type="date"
                      {...register(`muestreos.${index}.fecha_muestreo`)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">{t("fields.pesoGramos")}</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`muestreos.${index}.peso`, {
                        valueAsNumber: true,
                      })}
                      placeholder={t("fields.pesoGramosPlaceholder")}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">{t("fields.tallaCm")}</Label>
                    <Input
                      type="number"
                      step="0.1"
                      {...register(`muestreos.${index}.talla`, {
                        valueAsNumber: true,
                      })}
                      placeholder={t("fields.tallaCmPlaceholder")}
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendMuestreo({ fecha_muestreo: "", peso: 0, talla: 0 })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              {t("fields.agregarMuestreo")}
            </Button>
          </div>

          {/* Crecimiento */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.crecimiento")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.pesoPromedio")}
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("peso_promedio", { valueAsNumber: true })}
                  placeholder={t("fields.pesoPromedioPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.biomasaEstimada")}
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("biomasa_estimada", { valueAsNumber: true })}
                  placeholder={t("fields.biomasaEstimadaPlaceholder")}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.talla")}
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register("talla", { valueAsNumber: true })}
                  placeholder={t("fields.tallaPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.fechaMuestreo")}
                </Label>
                <Input type="date" {...register("fecha_muestreo")} />
              </div>
            </div>
          </div>

          {/* Calidad de Agua */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.calidadAgua")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.temperatura")}
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register("calidad_agua.temperatura", {
                    valueAsNumber: true,
                  })}
                  placeholder={t("fields.temperaturaPlaceholder")}
                />
                <p className="text-xs text-muted-foreground">
                  {t("fields.temperaturaInfo")}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.oxigenoDisuelto")}
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register("calidad_agua.oxigeno_disuelto", {
                    valueAsNumber: true,
                  })}
                  placeholder={t("fields.oxigenoDisueltoPlaceholder")}
                />
                <p className="text-xs text-muted-foreground">
                  {t("fields.oxigenoDisueltoInfo")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">{t("fields.ph")}</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register("calidad_agua.ph", { valueAsNumber: true })}
                  placeholder={t("fields.phPlaceholder")}
                />
                <p className="text-xs text-muted-foreground">
                  {t("fields.phInfo")}
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.amonio")}
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("calidad_agua.amonio", { valueAsNumber: true })}
                  placeholder={t("fields.amonioPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.nitrito")}
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("calidad_agua.nitrito", { valueAsNumber: true })}
                  placeholder={t("fields.nitritoPlaceholder")}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.turbidez")}
              </Label>
              <Input
                {...register("calidad_agua.turbidez")}
                placeholder={t("fields.turbidezPlaceholder")}
              />
            </div>

            <div className="space-y-3">
              <Label className="text-sm font-medium">
                {t("sections.recambios")}
              </Label>

              {recambioFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border rounded-lg p-4 space-y-3 bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <Label className="font-medium">
                      {t("fields.recambio", { index: index + 1 })}
                    </Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeRecambio(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">{t("fields.fecha")}</Label>
                      <Input
                        type="date"
                        {...register(
                          `calidad_agua.historial_recambios.${index}.fecha_recambio`,
                        )}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">
                        {t("fields.porcentajeRecambio")}
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        {...register(
                          `calidad_agua.historial_recambios.${index}.porcentaje_recambio`,
                          { valueAsNumber: true },
                        )}
                        placeholder={t("fields.porcentajeRecambioPlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">{t("fields.volumenM3")}</Label>
                      <Input
                        type="number"
                        step="0.1"
                        {...register(
                          `calidad_agua.historial_recambios.${index}.volumen_m3`,
                          { valueAsNumber: true },
                        )}
                        placeholder={t("fields.volumenM3Placeholder")}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t("fields.motivo")}</Label>
                      <Input
                        {...register(
                          `calidad_agua.historial_recambios.${index}.motivo`,
                        )}
                        placeholder={t("fields.motivoPlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">{t("fields.responsable")}</Label>
                    <Input
                      {...register(
                        `calidad_agua.historial_recambios.${index}.responsable`,
                      )}
                      placeholder={t("fields.responsablePlaceholder")}
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendRecambio({
                    fecha_recambio: "",
                    porcentaje_recambio: 0,
                    volumen_m3: 0,
                    motivo: "",
                    responsable: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("fields.agregarRecambio")}
              </Button>
            </div>
          </div>

          {/* Alimentación */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.alimentacion")}
            </h3>

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
                  {t("fields.proteinaPorcentaje")}
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register("proteina_porcentaje", { valueAsNumber: true })}
                  placeholder={t("fields.proteinaPorcentajePlaceholder")}
                />
                <p className="text-xs text-muted-foreground">
                  {t("fields.proteinaPorcentajeInfo")}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.racionDiaria")}
                </Label>
                <Input
                  {...register("racion_diaria")}
                  placeholder={t("fields.racionDiariaPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.consumo")}
                </Label>
                <Input
                  {...register("consumo")}
                  placeholder={t("fields.consumoPlaceholder")}
                />
              </div>
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
                  {t("fields.signosClinicos")}
                </Label>
                <Textarea
                  {...register("sanidad.signos_clinicos")}
                  placeholder={t("fields.signosClinicosPlaceholder")}
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  {t("fields.tratamientos")}
                </Label>
                <Textarea
                  {...register("sanidad.tratamientos")}
                  placeholder={t("fields.tratamientosPlaceholder")}
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.banosSalinidad")}
                  </Label>
                  <Input
                    {...register("sanidad.banos_salinidad")}
                    placeholder={t("fields.banosSalinidadPlaceholder")}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    {t("fields.laboratorio")}
                  </Label>
                  <Input
                    {...register("sanidad.laboratorio")}
                    placeholder={t("fields.laboratorioPlaceholder")}
                  />
                </div>
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

          {/* Ubicación */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              {t("sections.ubicacion")}
            </h3>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                {t("fields.finca")} <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("fincaId") || ""}
                onValueChange={(value) => handleSelectChange("fincaId", value)}
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
              className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                t("buttons.actualizarLotePeces")
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default FormEditPeces;
