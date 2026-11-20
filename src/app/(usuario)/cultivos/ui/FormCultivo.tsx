"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, CalendarDays, Sprout } from "lucide-react";
import { CrearCultivoInterface } from "@/api/cultivos/interface/crear-cultivo.interface";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { Cultivo } from "@/api/cultivos/interface/response-cultivos.interface";
import {
  TipoCultivoEnum,
  TipoSistemaRiego,
  MetodoSiembra,
  TipoSuelo,
} from "@/interfaces/enums/cultivos/tipo-cultivo.enums";
import { editarCultivo } from "@/api/cultivos/accions/editar-cultivo";
import { ingresarCultivo } from "@/api/cultivos/accions/crear-cultivo";
import { ciclosCultivo } from "@/helpers/data/cultivos/estados-cultivo";
import { formatDate } from "@/helpers/funciones/formatDate";
import { UnidadMedida } from "@/api/precios-producto-ganadero/interface/unidad-precio-producto";
import { unidades_productos } from "@/helpers/data/medida-productos-ganadero";

interface Props {
  fincas: Finca[] | undefined;
  cultivo?: Cultivo | null;
  onSuccess: () => void;
  moneda: string;
}

const formatearFecha = (fecha: string | Date | undefined): string => {
  if (!fecha) return new Date().toISOString().split("T")[0];

  if (typeof fecha === "string") return fecha.split("T")[0];

  if (fecha instanceof Date) return fecha.toISOString().split("T")[0];

  return new Date().toISOString().split("T")[0];
};

const calcularFechaCosecha = (
  fechaSiembra: string,
  tipoCultivo: TipoCultivoEnum,
): string => {
  if (!fechaSiembra || !tipoCultivo) return "";

  const ciclo = ciclosCultivo[tipoCultivo];
  if (!ciclo) return "";

  const fechaSiembraDate = new Date(fechaSiembra);
  const fechaCosechaDate = new Date(fechaSiembraDate);
  fechaCosechaDate.setDate(fechaCosechaDate.getDate() + ciclo.maduracion);

  return fechaCosechaDate.toISOString().split("T")[0];
};

const FormCultivo = ({ fincas, cultivo, onSuccess, moneda }: Props) => {
  const t = useTranslations("formCultivo");

  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [fechaCosechaSugerida, setFechaCosechaSugerida] = useState<string>("");
  const [showEconomics, setShowEconomics] = useState(false);

  const queryClient = useQueryClient();
  const isEditing = !!cultivo;

  // Traduce la etiqueta visible sin modificar el valor enviado al backend.
  const traducirOpcion = (
    grupo: string,
    key: string,
    value: string,
  ): string => {
    const translationKey = `options.${grupo}.${key}`;

    return t.has(translationKey) ? t(translationKey) : value;
  };

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CrearCultivoInterface>({
    defaultValues: {
      nombre_cultivo: "",
      variedad: "",
      tipo_cultivo: TipoCultivoEnum.MAIZ,
      area_sembrada: 0,
      fecha_siembra: new Date().toISOString().split("T")[0],
      fecha_cosecha_estimada: "",
      temporada: "",
      tipo_suelo: TipoSuelo.FRANCO,
      ph_suelo: "",
      metodo_siembra: MetodoSiembra.DIRECTA,
      sistema_riego: TipoSistemaRiego.SECANO,
      produccion_estimada: 0,
      unidad_produccion: "kg",
      costo_semilla: 0,
      costo_fertilizantes: 0,
      costo_mano_obra: 0,
      otros_costos: 0,
      ingreso_estimado: 0,
      ganancia_estimada: 0,
      fincaId: "",
      isActive: true,
    },
  });

  const tipoCultivoSeleccionado = watch("tipo_cultivo");
  const fechaSiembraSeleccionada = watch("fecha_siembra");
  const fincaIdSeleccionada = watch("fincaId");
  const fincaSeleccionada = fincas?.find((f) => f.id === fincaIdSeleccionada);

  const costo_semilla = watch("costo_semilla") || 0;
  const costo_fertilizantes = watch("costo_fertilizantes") || 0;
  const costo_mano_obra = watch("costo_mano_obra") || 0;
  const otros_costos = watch("otros_costos") || 0;
  const ingreso_estimado = watch("ingreso_estimado") || 0;

  useEffect(() => {
    const costosTotales =
      costo_semilla + costo_fertilizantes + costo_mano_obra + otros_costos;

    const ganancia = ingreso_estimado - costosTotales;

    if (ganancia !== watch("ganancia_estimada")) {
      setValue("ganancia_estimada", ganancia > 0 ? ganancia : 0);
    }
  }, [
    costo_semilla,
    costo_fertilizantes,
    costo_mano_obra,
    otros_costos,
    ingreso_estimado,
    setValue,
    watch,
  ]);

  useEffect(() => {
    if (tipoCultivoSeleccionado && fechaSiembraSeleccionada) {
      const fechaCosecha = calcularFechaCosecha(
        fechaSiembraSeleccionada,
        tipoCultivoSeleccionado,
      );

      if (fechaCosecha) {
        setFechaCosechaSugerida(fechaCosecha);

        const currentFechaCosecha = watch("fecha_cosecha_estimada");

        if (!currentFechaCosecha || (!isEditing && !cultivo)) {
          setValue("fecha_cosecha_estimada", fechaCosecha);
        }
      }
    } else {
      setFechaCosechaSugerida("");
    }
  }, [
    tipoCultivoSeleccionado,
    fechaSiembraSeleccionada,
    setValue,
    isEditing,
    cultivo,
    watch,
  ]);

  useEffect(() => {
    if (cultivo) {
      setValue("nombre_cultivo", cultivo.nombre_cultivo || "");
      setValue("variedad", cultivo.variedad || "");
      setValue("tipo_cultivo", cultivo.tipo_cultivo || TipoCultivoEnum.MAIZ);
      setValue(
        "area_sembrada",
        parseFloat(cultivo.area_sembrada as string) || 0,
      );
      setValue("unidad_medida", cultivo.unidad_medida || "hectáreas");
      setValue("fecha_siembra", formatearFecha(cultivo.fecha_siembra));
      setValue(
        "fecha_cosecha_estimada",
        formatearFecha(cultivo.fecha_cosecha_estimada),
      );
      setValue("temporada", cultivo.temporada || "");
      setValue("tipo_suelo", cultivo.tipo_suelo || TipoSuelo.FRANCO);
      setValue("ph_suelo", cultivo.ph_suelo || "");
      setValue(
        "metodo_siembra",
        cultivo.metodo_siembra || MetodoSiembra.DIRECTA,
      );
      setValue(
        "sistema_riego",
        cultivo.sistema_riego || TipoSistemaRiego.SECANO,
      );
      setValue("produccion_estimada", Number(cultivo.produccion_estimada) || 0);
      setValue("unidad_produccion", cultivo.unidad_produccion || "kg");
      setValue("costo_semilla", Number(cultivo.costo_semilla) || 0);
      setValue("costo_fertilizantes", Number(cultivo.costo_fertilizantes) || 0);
      setValue("costo_mano_obra", Number(cultivo.costo_mano_obra) || 0);
      setValue("otros_costos", Number(cultivo.otros_costos) || 0);
      setValue("ingreso_estimado", Number(cultivo.ingreso_estimado) || 0);
      setValue("ganancia_estimada", Number(cultivo.ganancia_estimada) || 0);
      setValue("fincaId", cultivo.finca?.id || "");

      if (
        cultivo.costo_semilla ||
        cultivo.costo_fertilizantes ||
        cultivo.ingreso_estimado
      ) {
        setShowEconomics(true);
      }
    } else {
      reset({
        nombre_cultivo: "",
        variedad: "",
        tipo_cultivo: TipoCultivoEnum.MAIZ,
        area_sembrada: 0,
        unidad_medida: "hectáreas",
        fecha_siembra: new Date().toISOString().split("T")[0],
        fecha_cosecha_estimada: "",
        temporada: "",
        tipo_suelo: TipoSuelo.FRANCO,
        ph_suelo: "",
        metodo_siembra: MetodoSiembra.DIRECTA,
        sistema_riego: TipoSistemaRiego.SECANO,
        produccion_estimada: 0,
        unidad_produccion: "kg",
        costo_semilla: 0,
        costo_fertilizantes: 0,
        costo_mano_obra: 0,
        otros_costos: 0,
        ingreso_estimado: 0,
        ganancia_estimada: 0,
        fincaId: "",
        isActive: true,
      });

      setShowEconomics(false);
    }

    setIsLoading(false);
  }, [cultivo, setValue, reset]);

  const onSubmit = async (data: CrearCultivoInterface) => {
    try {
      const dataToSend = {
        ...data,
        area_sembrada: Number(data.area_sembrada),
        produccion_estimada: Number(data.produccion_estimada) || 0,
        costo_semilla: Number(data.costo_semilla) || 0,
        costo_fertilizantes: Number(data.costo_fertilizantes) || 0,
        costo_mano_obra: Number(data.costo_mano_obra) || 0,
        otros_costos: Number(data.otros_costos) || 0,
        ingreso_estimado: Number(data.ingreso_estimado) || 0,
        ganancia_estimada: Number(data.ganancia_estimada) || 0,
      };

      if (isEditing && cultivo) {
        await editarCultivo(cultivo.id, dataToSend);
        toast.success(t("messages.updateSuccess"));
      } else {
        await ingresarCultivo(dataToSend);
        toast.success(t("messages.createSuccess"));
      }

      reset();
      queryClient.invalidateQueries({ queryKey: ["cultivos"] });

      if (onSuccess) {
        onSuccess();
        setErrorMessage("");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const apiErrorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("messages.submitError");

        setErrorMessage(apiErrorMessage);
        toast.error(apiErrorMessage);
      } else {
        toast.error(t("messages.unexpectedError"));
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
      </div>
    );
  }

  const tiposCultivoOptions = Object.entries(TipoCultivoEnum).map(
    ([key, value]) => ({ key, value }),
  );

  const tipoSueloOptions = Object.entries(TipoSuelo).map(([key, value]) => ({
    key,
    value,
  }));

  const metodoSiembraOptions = Object.entries(MetodoSiembra).map(
    ([key, value]) => ({ key, value }),
  );

  const sistemaRiegoOptions = Object.entries(TipoSistemaRiego).map(
    ([key, value]) => ({ key, value }),
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>
            {t("error.title", {
              action: isEditing
                ? t("error.actions.update")
                : t("error.actions.create"),
            })}
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {fechaSiembraSeleccionada && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950">
          <Sprout className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 dark:text-green-300">
            {t("cycle.title")}
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300 text-sm">
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              💡{" "}
              {t("cycle.suggestion", {
                crop: tipoCultivoSeleccionado,
                date: formatDate(fechaCosechaSugerida),
              })}
            </p>
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">
          {t("sections.basic")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="nombre_cultivo">
              {t("fields.cropName")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre_cultivo"
              {...register("nombre_cultivo", {
                required: t("validation.cropNameRequired"),
                maxLength: {
                  value: 150,
                  message: t("validation.cropNameMaxLength"),
                },
              })}
              placeholder={t("placeholders.cropName")}
              className={errors.nombre_cultivo ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.nombre_cultivo && (
              <p className="text-sm text-red-500 mt-1">
                {errors.nombre_cultivo.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="tipo_cultivo">
              {t("fields.cropType")} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("tipo_cultivo")}
              onValueChange={(value) =>
                setValue("tipo_cultivo", value as TipoCultivoEnum)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={errors.tipo_cultivo ? "border-red-500" : ""}
              >
                <SelectValue placeholder={t("placeholders.cropType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("groups.cropTypes")}</SelectLabel>
                  {tiposCultivoOptions.map((tipo) => (
                    <SelectItem key={tipo.key} value={tipo.value}>
                      {traducirOpcion("cropTypes", tipo.key, tipo.value)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.tipo_cultivo && (
              <p className="text-sm text-red-500 mt-1">
                {errors.tipo_cultivo.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="fincaId">
              {t("fields.farm")} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("fincaId")}
              onValueChange={(value) => setValue("fincaId", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger className={errors.fincaId ? "border-red-500" : ""}>
                <SelectValue placeholder={t("placeholders.farm")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("groups.farms")}</SelectLabel>
                  {fincas?.map((finca) => (
                    <SelectItem key={finca.id} value={finca.id}>
                      {finca.nombre_finca}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.fincaId && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fincaId.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="variedad">{t("fields.variety")}</Label>
            <Input
              id="variedad"
              {...register("variedad", {
                maxLength: {
                  value: 100,
                  message: t("validation.varietyMaxLength"),
                },
              })}
              placeholder={t("placeholders.variety")}
              className={errors.variedad ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.variedad && (
              <p className="text-sm text-red-500 mt-1">
                {errors.variedad.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="area_sembrada">
              {t("fields.plantedArea")}{" "}
              {fincaIdSeleccionada && `- ${fincaSeleccionada?.medida_finca}`}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Input
              id="area_sembrada"
              type="number"
              step="0.01"
              min="0.01"
              {...register("area_sembrada", {
                required: t("validation.plantedAreaRequired"),
                min: {
                  value: 0.01,
                  message: t("validation.plantedAreaMin"),
                },
                valueAsNumber: true,
              })}
              placeholder={t("placeholders.plantedArea")}
              className={errors.area_sembrada ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.area_sembrada && (
              <p className="text-sm text-red-500 mt-1">
                {errors.area_sembrada.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="temporada">{t("fields.season")}</Label>
            <Input
              id="temporada"
              {...register("temporada", {
                maxLength: {
                  value: 50,
                  message: t("validation.seasonMaxLength"),
                },
              })}
              placeholder={t("placeholders.season")}
              className={errors.temporada ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.temporada && (
              <p className="text-sm text-red-500 mt-1">
                {errors.temporada.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="fecha_siembra">
              {t("fields.plantingDate")} <span className="text-red-500">*</span>
            </Label>
            <Input
              id="fecha_siembra"
              type="date"
              {...register("fecha_siembra", {
                required: t("validation.plantingDateRequired"),
              })}
              className={errors.fecha_siembra ? "border-red-500" : ""}
              disabled={isSubmitting}
            />
            {errors.fecha_siembra && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fecha_siembra.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="fecha_cosecha_estimada">
              {t("fields.estimatedHarvest")}
              {fechaCosechaSugerida && (
                <span className="text-xs text-muted-foreground ml-2">
                  (
                  {t("cycle.suggestedDate", {
                    date: formatDate(fechaCosechaSugerida),
                  })}
                  )
                </span>
              )}
            </Label>
            <div className="relative">
              <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="fecha_cosecha_estimada"
                type="date"
                {...register("fecha_cosecha_estimada")}
                className={`pl-9 ${errors.fecha_cosecha_estimada ? "border-red-500" : ""}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.fecha_cosecha_estimada && (
              <p className="text-sm text-red-500 mt-1">
                {errors.fecha_cosecha_estimada.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">
          {t("sections.soilAndPlanting")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tipo_suelo">
              {t("fields.soilType")} <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("tipo_suelo")}
              onValueChange={(value) =>
                setValue("tipo_suelo", value as TipoSuelo)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={errors.tipo_suelo ? "border-red-500" : ""}
              >
                <SelectValue placeholder={t("placeholders.soilType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("groups.soilTypes")}</SelectLabel>
                  {tipoSueloOptions.map((suelo) => (
                    <SelectItem key={suelo.key} value={suelo.value}>
                      {traducirOpcion("soilTypes", suelo.key, suelo.value)}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.tipo_suelo && (
              <p className="text-sm text-red-500 mt-1">
                {errors.tipo_suelo.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="ph_suelo">{t("fields.soilPh")}</Label>
            <Input
              id="ph_suelo"
              type="number"
              step="0.1"
              min="0"
              max="14"
              {...register("ph_suelo")}
              placeholder={t("placeholders.soilPh")}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <Label htmlFor="metodo_siembra">
              {t("fields.plantingMethod")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("metodo_siembra")}
              onValueChange={(value) =>
                setValue("metodo_siembra", value as MetodoSiembra)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={errors.metodo_siembra ? "border-red-500" : ""}
              >
                <SelectValue placeholder={t("placeholders.plantingMethod")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("groups.plantingMethods")}</SelectLabel>
                  {metodoSiembraOptions.map((metodo) => (
                    <SelectItem key={metodo.key} value={metodo.value}>
                      {traducirOpcion(
                        "plantingMethods",
                        metodo.key,
                        metodo.value,
                      )}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.metodo_siembra && (
              <p className="text-sm text-red-500 mt-1">
                {errors.metodo_siembra.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="sistema_riego">
              {t("fields.irrigationSystem")}{" "}
              <span className="text-red-500">*</span>
            </Label>
            <Select
              value={watch("sistema_riego")}
              onValueChange={(value) =>
                setValue("sistema_riego", value as TipoSistemaRiego)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={errors.sistema_riego ? "border-red-500" : ""}
              >
                <SelectValue placeholder={t("placeholders.irrigationSystem")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("groups.irrigationSystems")}</SelectLabel>
                  {sistemaRiegoOptions.map((riego) => (
                    <SelectItem key={riego.key} value={riego.value}>
                      {traducirOpcion(
                        "irrigationSystems",
                        riego.key,
                        riego.value,
                      )}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
            {errors.sistema_riego && (
              <p className="text-sm text-red-500 mt-1">
                {errors.sistema_riego.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold border-b pb-2">
          {t("sections.production")}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="produccion_estimada">
              {t("fields.estimatedProduction")}
            </Label>
            <div className="flex gap-2">
              <Input
                id="produccion_estimada"
                type="number"
                step="0.01"
                min="0"
                {...register("produccion_estimada", {
                  valueAsNumber: true,
                })}
                placeholder={t("placeholders.estimatedProduction")}
                className="flex-1"
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="unidad_produccion">
              {t("fields.measurementUnit")}
            </Label>
            <Select
              value={watch("unidad_produccion")}
              onValueChange={(value) =>
                setValue("unidad_produccion", value as UnidadMedida)
              }
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={errors.unidad_produccion ? "border-red-500" : ""}
              >
                <SelectValue placeholder={t("placeholders.measurementUnit")} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>{t("groups.units")}</SelectLabel>
                  {unidades_productos.map((unidad) => (
                    <SelectItem key={unidad.id} value={unidad.value}>
                      {unidad.value}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setShowEconomics(!showEconomics)}
          className="text-sm font-semibold text-green-600 hover:text-green-700 flex items-center gap-2"
        >
          {showEconomics ? "▼" : "▶"}{" "}
          {showEconomics ? t("economics.hide") : t("economics.show")}{" "}
          {t("sections.economic")}
        </button>

        {showEconomics && (
          <div className="space-y-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h3 className="text-md font-semibold">
              {t("economics.costsAndIncome")}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="costo_semilla">{t("fields.seedCost")}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">
                    {moneda}
                  </span>
                  <Input
                    id="costo_semilla"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("costo_semilla", {
                      valueAsNumber: true,
                    })}
                    placeholder="0.00"
                    className="pl-7"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="costo_fertilizantes">
                  {t("fields.fertilizerCost")}
                </Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">
                    {moneda}
                  </span>
                  <Input
                    id="costo_fertilizantes"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("costo_fertilizantes", {
                      valueAsNumber: true,
                    })}
                    placeholder="0.00"
                    className="pl-7"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="costo_mano_obra">{t("fields.laborCost")}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">
                    {moneda}
                  </span>
                  <Input
                    id="costo_mano_obra"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("costo_mano_obra", {
                      valueAsNumber: true,
                    })}
                    placeholder="0.00"
                    className="pl-7"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="otros_costos">{t("fields.otherCosts")}</Label>
                <div className="relative">
                  <span className="absolute left-3 top-3 text-muted-foreground">
                    {moneda}
                  </span>
                  <Input
                    id="otros_costos"
                    type="number"
                    step="0.01"
                    min="0"
                    {...register("otros_costos", {
                      valueAsNumber: true,
                    })}
                    placeholder="0.00"
                    className="pl-7"
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="border-t pt-4 mt-2 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="ingreso_estimado">
                      {t("fields.estimatedIncome")}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground">
                        {moneda}
                      </span>
                      <Input
                        id="ingreso_estimado"
                        type="number"
                        step="0.01"
                        min="0"
                        {...register("ingreso_estimado", {
                          valueAsNumber: true,
                        })}
                        placeholder="0.00"
                        className="pl-7 border-green-500"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="ganancia_estimada">
                      {t("fields.estimatedProfit")}
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-muted-foreground">
                        {moneda}
                      </span>
                      <Input
                        id="ganancia_estimada"
                        type="number"
                        step="0.01"
                        {...register("ganancia_estimada")}
                        placeholder="0.00"
                        className="pl-7 bg-green-50 dark:bg-green-950 font-semibold"
                        disabled
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      *{t("economics.automaticCalculation")}
                    </p>
                  </div>

                  <div className="flex items-end">
                    <div className="text-sm text-muted-foreground">
                      <p>
                        {t("economics.totalCosts")}: {moneda}
                        {(
                          costo_semilla +
                          costo_fertilizantes +
                          costo_mano_obra +
                          otros_costos
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess()}
          disabled={isSubmitting}
        >
          {t("buttons.cancel")}
        </Button>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              {isEditing ? t("buttons.updating") : t("buttons.saving")}
            </span>
          ) : isEditing ? (
            t("buttons.updateCrop")
          ) : (
            t("buttons.createCrop")
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormCultivo;
