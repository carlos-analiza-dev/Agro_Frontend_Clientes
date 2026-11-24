"use client";

import { CrearPlanillaInterface } from "@/api/planillas-trabajadores/interfaces/crear-planilla.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Calendar, FileText, CalendarDays } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import { TipoPeriodoPago } from "@/interfaces/enums/planillas.enums";
import { CrearPlanilla } from "@/api/planillas-trabajadores/accions/crear-planilla";
import { EditarPlanilla } from "@/api/planillas-trabajadores/accions/editar-planilla";
import { Planilla } from "@/api/planillas-trabajadores/interfaces/response-planillas.interface";

interface Props {
  onSuccess: () => void;
  planilla?: Planilla | null;
  setSelectedPlanilla?: Dispatch<SetStateAction<Planilla | null>>;
}

const FormPlanilla = ({ onSuccess, planilla, setSelectedPlanilla }: Props) => {
  const t = useTranslations("formPlanilla");
  const isEditing = !!planilla;
  const queryClient = useQueryClient();

  const [diasPeriodoMin, setDiasPeriodoMin] = useState<number>(1);
  const [diasPeriodoMax, setDiasPeriodoMax] = useState<number>(31);
  const [selectedTipoPeriodo, setSelectedTipoPeriodo] =
    useState<TipoPeriodoPago>(TipoPeriodoPago.MENSUAL);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CrearPlanillaInterface>({
    defaultValues: {
      nombre: "",
      descripcion: "",
      tipoPeriodo: TipoPeriodoPago.MENSUAL,
      observaciones: "",
      diasPeriodo: 30,
      fechaInicio: new Date().toISOString().split("T")[0],
      fechaFin: new Date().toISOString().split("T")[0],
      fechaPago: new Date().toISOString().split("T")[0],
    },
  });

  const tipoPeriodo = watch("tipoPeriodo");
  const fechaInicio = watch("fechaInicio");
  const diasPeriodo = watch("diasPeriodo");

  useEffect(() => {
    setSelectedTipoPeriodo(tipoPeriodo);
  }, [tipoPeriodo]);

  useEffect(() => {
    if (tipoPeriodo === TipoPeriodoPago.QUINCENAL) {
      setValue("diasPeriodo", 15);
      setDiasPeriodoMin(1);
      setDiasPeriodoMax(15);
    } else if (tipoPeriodo === TipoPeriodoPago.MENSUAL) {
      setValue("diasPeriodo", 30);
      setDiasPeriodoMin(1);
      setDiasPeriodoMax(31);
    } else if (tipoPeriodo === TipoPeriodoPago.SEMANAL) {
      setValue("diasPeriodo", 7);
      setDiasPeriodoMin(1);
      setDiasPeriodoMax(7);
    }
  }, [tipoPeriodo, setValue]);

  useEffect(() => {
    if (fechaInicio && diasPeriodo > 0) {
      const fechaInicioDate = new Date(fechaInicio);
      const fechaFinDate = new Date(fechaInicioDate);
      fechaFinDate.setDate(fechaInicioDate.getDate() + diasPeriodo - 1);

      const fechaFinStr = fechaFinDate.toISOString().split("T")[0];
      setValue("fechaFin", fechaFinStr);
    }
  }, [fechaInicio, diasPeriodo, setValue]);

  useEffect(() => {
    if (planilla) {
      let tipoPeriodoValido: TipoPeriodoPago = TipoPeriodoPago.MENSUAL;

      if (
        planilla.tipoPeriodo === "SEMANAL" ||
        planilla.tipoPeriodo === TipoPeriodoPago.SEMANAL
      ) {
        tipoPeriodoValido = TipoPeriodoPago.SEMANAL;
      } else if (
        planilla.tipoPeriodo === "QUINCENAL" ||
        planilla.tipoPeriodo === TipoPeriodoPago.QUINCENAL
      ) {
        tipoPeriodoValido = TipoPeriodoPago.QUINCENAL;
      } else if (
        planilla.tipoPeriodo === "MENSUAL" ||
        planilla.tipoPeriodo === TipoPeriodoPago.MENSUAL
      ) {
        tipoPeriodoValido = TipoPeriodoPago.MENSUAL;
      }

      reset({
        nombre: planilla.nombre,
        descripcion: planilla.descripcion || "",
        tipoPeriodo: tipoPeriodoValido,
        observaciones: planilla.observaciones || "",
        diasPeriodo: planilla.diasPeriodo,
        fechaInicio: planilla.fechaInicio,
        fechaFin: planilla.fechaFin,
        fechaPago: planilla.fechaPago,
      });

      setSelectedTipoPeriodo(tipoPeriodoValido);

      if (tipoPeriodoValido === TipoPeriodoPago.QUINCENAL) {
        setDiasPeriodoMin(1);
        setDiasPeriodoMax(15);
      } else if (tipoPeriodoValido === TipoPeriodoPago.MENSUAL) {
        setDiasPeriodoMin(1);
        setDiasPeriodoMax(31);
      } else if (tipoPeriodoValido === TipoPeriodoPago.SEMANAL) {
        setDiasPeriodoMin(1);
        setDiasPeriodoMax(7);
      }
    }
  }, [planilla, reset]);

  const createMutation = useMutation({
    mutationFn: CrearPlanilla,
    onSuccess: () => {
      toast.success(t("messages.createSuccess"));
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["planillas"] });
      onSuccess();
    },
    onError: (error) => {
      handleMutationError(error, "create");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CrearPlanillaInterface }) =>
      EditarPlanilla(id, data),
    onSuccess: () => {
      toast.success(t("messages.updateSuccess"));
      queryClient.invalidateQueries({ queryKey: ["planillas"] });
      onSuccess();
    },
    onError: (error) => {
      handleMutationError(error, "update");
    },
  });

  const resetForm = () => {
    reset({
      nombre: "",
      descripcion: "",
      tipoPeriodo: TipoPeriodoPago.MENSUAL,
      observaciones: "",
      diasPeriodo: 30,
      fechaInicio: new Date().toISOString().split("T")[0],
      fechaFin: new Date().toISOString().split("T")[0],
      fechaPago: new Date().toISOString().split("T")[0],
    });

    setSelectedTipoPeriodo(TipoPeriodoPago.MENSUAL);

    if (setSelectedPlanilla) {
      setSelectedPlanilla(null);
    }
  };

  const handleMutationError = (error: unknown, action: "create" | "update") => {
    if (isAxiosError(error)) {
      const messages = error.response?.data?.message;
      const errorMessage = Array.isArray(messages)
        ? messages[0]
        : typeof messages === "string"
          ? messages
          : t(`errors.${action}`);

      toast.error(errorMessage);
    } else {
      toast.error(t(`errors.${action}Unexpected`));
    }
  };

  const onSubmit = (data: CrearPlanillaInterface) => {
    if (isEditing && planilla) {
      updateMutation.mutate({ id: planilla.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleCancel = () => {
    resetForm();

    if (setSelectedPlanilla) {
      setSelectedPlanilla(null);
    }

    onSuccess();
  };

  const handleTipoPeriodoChange = (value: string) => {
    const nuevoTipo = value as TipoPeriodoPago;
    setSelectedTipoPeriodo(nuevoTipo);
    setValue("tipoPeriodo", nuevoTipo);
  };

  const getTipoPeriodoLabel = (tipo: TipoPeriodoPago) => {
    switch (tipo) {
      case TipoPeriodoPago.SEMANAL:
        return t("periodTypes.weekly");
      case TipoPeriodoPago.QUINCENAL:
        return t("periodTypes.biweekly");
      case TipoPeriodoPago.MENSUAL:
        return t("periodTypes.monthly");
      default:
        return String(tipo);
    }
  };

  const getPeriodDescription = () => {
    if (tipoPeriodo === TipoPeriodoPago.SEMANAL) {
      return t("periodDescriptions.weekly");
    }

    if (tipoPeriodo === TipoPeriodoPago.QUINCENAL) {
      return t("periodDescriptions.biweekly");
    }

    return t("periodDescriptions.monthly");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("sections.generalInformation")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">
                {t("fields.payrollName")}{" "}
                <span className="text-red-500">*</span>
              </Label>

              <Input
                id="nombre"
                placeholder={t("placeholders.payrollName")}
                {...register("nombre", {
                  required: t("validation.nameRequired"),
                  minLength: {
                    value: 3,
                    message: t("validation.nameMinLength"),
                  },
                })}
              />

              {errors.nombre && (
                <p className="text-sm font-medium text-red-500">
                  {errors.nombre.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">{t("fields.description")}</Label>

              <Input
                id="descripcion"
                placeholder={t("placeholders.description")}
                {...register("descripcion")}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {t("sections.periodConfiguration")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoPeriodo">
                {t("fields.periodType")} <span className="text-red-500">*</span>
              </Label>

              <Select
                value={selectedTipoPeriodo}
                onValueChange={handleTipoPeriodoChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("placeholders.periodType")} />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value={TipoPeriodoPago.SEMANAL}>
                    {t("periodTypes.weeklyOption")}
                  </SelectItem>

                  <SelectItem value={TipoPeriodoPago.QUINCENAL}>
                    {t("periodTypes.biweeklyOption")}
                  </SelectItem>

                  <SelectItem value={TipoPeriodoPago.MENSUAL}>
                    {t("periodTypes.monthlyOption")}
                  </SelectItem>
                </SelectContent>
              </Select>

              {errors.tipoPeriodo && (
                <p className="text-sm font-medium text-red-500">
                  {errors.tipoPeriodo.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="diasPeriodo">
                {t("fields.periodDays")} <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

                <Input
                  id="diasPeriodo"
                  type="number"
                  className="pl-10"
                  {...register("diasPeriodo", {
                    required: t("validation.periodDaysRequired"),
                    min: {
                      value: diasPeriodoMin,
                      message: t("validation.minimumDays", {
                        count: diasPeriodoMin,
                      }),
                    },
                    max: {
                      value: diasPeriodoMax,
                      message: t("validation.maximumDays", {
                        count: diasPeriodoMax,
                      }),
                    },
                    valueAsNumber: true,
                  })}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                {getPeriodDescription()}
              </p>

              {errors.diasPeriodo && (
                <p className="text-sm font-medium text-red-500">
                  {errors.diasPeriodo.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaInicio">
                {t("fields.startDate")} <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

                <Input
                  id="fechaInicio"
                  type="date"
                  className="pl-10"
                  {...register("fechaInicio", {
                    required: t("validation.startDateRequired"),
                  })}
                />
              </div>

              {errors.fechaInicio && (
                <p className="text-sm font-medium text-red-500">
                  {errors.fechaInicio.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaFin">
                {t("fields.endDate")} <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

                <Input
                  id="fechaFin"
                  type="date"
                  className="pl-10"
                  disabled
                  {...register("fechaFin", {
                    required: t("validation.endDateRequired"),
                  })}
                />
              </div>

              <p className="text-xs text-muted-foreground">
                {t("hints.automaticEndDate")}
              </p>

              {errors.fechaFin && (
                <p className="text-sm font-medium text-red-500">
                  {errors.fechaFin.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaPago">
                {t("fields.paymentDate")}{" "}
                <span className="text-red-500">*</span>
              </Label>

              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

                <Input
                  id="fechaPago"
                  type="date"
                  className="pl-10"
                  {...register("fechaPago", {
                    required: t("validation.paymentDateRequired"),
                  })}
                />
              </div>

              {errors.fechaPago && (
                <p className="text-sm font-medium text-red-500">
                  {errors.fechaPago.message as string}
                </p>
              )}
            </div>
          </div>

          {fechaInicio && watch("fechaFin") && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("summary.period")}
                  </p>

                  <p className="text-lg font-semibold text-blue-600">
                    {watch("fechaInicio")} {t("summary.to")} {watch("fechaFin")}
                  </p>

                  <p className="text-xs text-gray-500">
                    {t("summary.days", { count: watch("diasPeriodo") })}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("summary.periodType")}
                  </p>

                  <p className="text-lg font-semibold text-purple-600 capitalize">
                    {getTipoPeriodoLabel(watch("tipoPeriodo"))}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {t("summary.paymentDate")}
                  </p>

                  <p className="text-lg font-semibold text-green-600">
                    {watch("fechaPago")}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("sections.additionalInformation")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="observaciones">{t("fields.observations")}</Label>

            <Textarea
              id="observaciones"
              placeholder={t("placeholders.observations")}
              className="min-h-[100px]"
              {...register("observaciones")}
            />

            {errors.observaciones && (
              <p className="text-sm font-medium text-red-500">
                {errors.observaciones.message as string}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {t("buttons.cancel")}
        </Button>

        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          {t("buttons.clear")}
        </Button>

        <Button type="submit" disabled={isPending} className="w-full sm:w-auto">
          {isPending
            ? isEditing
              ? t("buttons.updating")
              : t("buttons.creating")
            : isEditing
              ? t("buttons.update")
              : t("buttons.create")}
        </Button>
      </div>
    </form>
  );
};

export default FormPlanilla;
