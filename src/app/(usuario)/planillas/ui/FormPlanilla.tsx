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
import {
  Calendar,
  FileText,
  CalendarDays,
  Clock,
  DollarSign,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
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
  const isEditing = !!planilla;
  const queryClient = useQueryClient();

  const [diasPeriodoMin, setDiasPeriodoMin] = useState<number>(1);
  const [diasPeriodoMax, setDiasPeriodoMax] = useState<number>(31);

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
    if (tipoPeriodo === TipoPeriodoPago.QUINCENAL) {
      setValue("diasPeriodo", 15);
      setDiasPeriodoMin(1);
      setDiasPeriodoMax(15);
    } else if (tipoPeriodo === TipoPeriodoPago.MENSUAL) {
      setValue("diasPeriodo", 30);
      setDiasPeriodoMin(1);
      setDiasPeriodoMax(31);
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
      reset({
        nombre: planilla.nombre,
        descripcion: planilla.descripcion || "",
        tipoPeriodo: planilla.tipoPeriodo as TipoPeriodoPago,
        observaciones: planilla.observaciones || "",
        diasPeriodo: planilla.diasPeriodo,
        fechaInicio: planilla.fechaInicio,
        fechaFin: planilla.fechaFin,
        fechaPago: planilla.fechaPago,
      });
    }
  }, [planilla, reset]);

  const createMutation = useMutation({
    mutationFn: CrearPlanilla,
    onSuccess: () => {
      toast.success("Planilla creada exitosamente");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["planillas"] });
      onSuccess();
    },
    onError: (error) => {
      handleMutationError(error, "crear");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CrearPlanillaInterface }) =>
      EditarPlanilla(id, data),
    onSuccess: () => {
      toast.success("Planilla actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["planillas"] });
      onSuccess();
    },
    onError: (error) => {
      handleMutationError(error, "actualizar");
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
  };

  const handleMutationError = (error: unknown, action: string) => {
    if (isAxiosError(error)) {
      const messages = error.response?.data?.message;
      const errorMessage = Array.isArray(messages)
        ? messages[0]
        : typeof messages === "string"
          ? messages
          : `Hubo un error al ${action} la planilla`;
      toast.error(errorMessage);
    } else {
      toast.error(
        `Hubo un error al ${action} la planilla. Inténtalo de nuevo.`,
      );
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

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre de la Planilla <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                placeholder="Ej: Planilla Mayo 2024"
                {...register("nombre", {
                  required: "El nombre es requerido",
                  minLength: {
                    value: 3,
                    message: "El nombre debe tener al menos 3 caracteres",
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
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                placeholder="Ej: Primera quincena de mayo"
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
            Configuración del Período
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="tipoPeriodo">
                Tipo de Período <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("tipoPeriodo")}
                onValueChange={(value) =>
                  setValue("tipoPeriodo", value as TipoPeriodoPago)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el tipo de período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={TipoPeriodoPago.SEMANAL}>
                    Semanal (7 días)
                  </SelectItem>
                  <SelectItem value={TipoPeriodoPago.QUINCENAL}>
                    Quincenal (15 días)
                  </SelectItem>
                  <SelectItem value={TipoPeriodoPago.MENSUAL}>
                    Mensual (30 días)
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
                Días del Período <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="diasPeriodo"
                  type="number"
                  className="pl-10"
                  {...register("diasPeriodo", {
                    required: "Los días del período son requeridos",
                    min: {
                      value: diasPeriodoMin,
                      message: `Mínimo ${diasPeriodoMin} día${diasPeriodoMin > 1 ? "s" : ""}`,
                    },
                    max: {
                      value: diasPeriodoMax,
                      message: `Máximo ${diasPeriodoMax} días`,
                    },
                    valueAsNumber: true,
                  })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {tipoPeriodo === TipoPeriodoPago.QUINCENAL
                  ? "La quincena tiene entre 1 y 15 días"
                  : "El mes tiene entre 1 y 31 días"}
              </p>
              {errors.diasPeriodo && (
                <p className="text-sm font-medium text-red-500">
                  {errors.diasPeriodo.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaInicio">
                Fecha de Inicio <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fechaInicio"
                  type="date"
                  className="pl-10"
                  {...register("fechaInicio", {
                    required: "La fecha de inicio es requerida",
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
                Fecha de Fin <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fechaFin"
                  type="date"
                  className="pl-10"
                  disabled
                  {...register("fechaFin", {
                    required: "La fecha de fin es requerida",
                  })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Calculada automáticamente según la fecha de inicio y los días
                del período
              </p>
              {errors.fechaFin && (
                <p className="text-sm font-medium text-red-500">
                  {errors.fechaFin.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fechaPago">
                Fecha de Pago <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fechaPago"
                  type="date"
                  className="pl-10"
                  {...register("fechaPago", {
                    required: "La fecha de pago es requerida",
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
                    Período
                  </p>
                  <p className="text-lg font-semibold text-blue-600">
                    {watch("fechaInicio")} al {watch("fechaFin")}
                  </p>
                  <p className="text-xs text-gray-500">
                    {watch("diasPeriodo")} días
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Tipo de Período
                  </p>
                  <p className="text-lg font-semibold text-purple-600 capitalize">
                    {watch("tipoPeriodo")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Fecha de Pago
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
            Información Adicional
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              placeholder="Notas adicionales sobre la planilla..."
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

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={handleCancel}
          disabled={isPending}
        >
          Cancelar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          disabled={isPending}
        >
          Limpiar
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending
            ? isEditing
              ? "Actualizando..."
              : "Creando..."
            : isEditing
              ? "Actualizar Planilla"
              : "Crear Planilla"}
        </Button>
      </div>
    </form>
  );
};

export default FormPlanilla;
