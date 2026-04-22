"use client";
import { CrearConfigTrabajadorInterface } from "@/api/configuraciones-trabajadores/interface/crear-config.interface";
import { Configuraciones } from "@/api/configuraciones-trabajadores/interface/response-config-trabajadores.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  Plus,
  Trash2,
  DollarSign,
  Clock,
  Briefcase,
  Calendar,
  TrendingUp,
  CalendarDays,
  Sun,
  Moon,
  Star,
} from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import useGetTrabajadores from "@/hooks/trabajadores/useGetTrabajadores";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { CreateConfigTrabajador } from "@/api/configuraciones-trabajadores/accions/crear-configuracion";
import { EditarConfigTrabajador } from "@/api/configuraciones-trabajadores/accions/editar-configuracion";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";

interface Props {
  onSuccess: () => void;
  configuracion?: Configuraciones | null;
  setSelectedConfig?: Dispatch<SetStateAction<Configuraciones | null>>;
  moneda: string;
}

const FormConfigTrabajadores = ({
  onSuccess,
  configuracion,
  moneda,
  setSelectedConfig,
}: Props) => {
  const isEditing = !!configuracion;
  const queryClient = useQueryClient();
  const { data: trabajadores, isLoading: loadingTrabajadores } =
    useGetTrabajadores();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [valorHoraNormal, setValorHoraNormal] = useState<number>(0);
  const [valorHoraExtraDiurna, setValorHoraExtraDiurna] = useState<number>(0);
  const [valorHoraExtraNocturna, setValorHoraExtraNocturna] =
    useState<number>(0);
  const [valorHoraExtraFestiva, setValorHoraExtraFestiva] = useState<number>(0);
  const [salarioSemanal, setSalarioSemanal] = useState<number>(0);
  const [salarioMensual, setSalarioMensual] = useState<number>(0);
  const [horasPorDia, setHorasPorDia] = useState<number>(0);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CrearConfigTrabajadorInterface>({
    defaultValues: {
      trabajadorId: "",
      fechaContratacion: new Date().toISOString().split("T")[0],
      cargo: "",
      salarioDiario: 0,
      factorHoraExtraDiurnas: 1.5,
      factorHoraExtraNocturnas: 1.75,
      factorHoraExtraFestivas: 2.0,
      diasTrabajadosSemanal: 5,
      horasJornadaSemanal: 40,
      bonificacionesFijas: [],
      deduccionesFijas: [],
      activo: true,
    },
  });

  const {
    fields: bonificacionesFields,
    append: appendBonificacion,
    remove: removeBonificacion,
  } = useFieldArray({
    control,
    name: "bonificacionesFijas",
  });

  const {
    fields: deduccionesFields,
    append: appendDeduccion,
    remove: removeDeduccion,
  } = useFieldArray({
    control,
    name: "deduccionesFijas",
  });

  const salarioDiario = watch("salarioDiario");
  const diasTrabajadosSemanal = watch("diasTrabajadosSemanal");
  const horasJornadaSemanal = watch("horasJornadaSemanal");
  const factorHoraExtraDiurnas = watch("factorHoraExtraDiurnas");
  const factorHoraExtraNocturnas = watch("factorHoraExtraNocturnas");
  const factorHoraExtraFestivas = watch("factorHoraExtraFestivas");

  useEffect(() => {
    if (
      salarioDiario > 0 &&
      diasTrabajadosSemanal > 0 &&
      horasJornadaSemanal > 0
    ) {
      const horasPorDiaCalc = horasJornadaSemanal / diasTrabajadosSemanal;
      setHorasPorDia(horasPorDiaCalc);

      const valorHoraNormalCalc = salarioDiario / horasPorDiaCalc;
      setValorHoraNormal(valorHoraNormalCalc);

      const valorHoraExtraDiurnaCalc =
        valorHoraNormalCalc * factorHoraExtraDiurnas;
      const valorHoraExtraNocturnaCalc =
        valorHoraNormalCalc * factorHoraExtraNocturnas;
      const valorHoraExtraFestivaCalc =
        valorHoraNormalCalc * factorHoraExtraFestivas;

      setValorHoraExtraDiurna(valorHoraExtraDiurnaCalc);
      setValorHoraExtraNocturna(valorHoraExtraNocturnaCalc);
      setValorHoraExtraFestiva(valorHoraExtraFestivaCalc);

      const salarioSemanalCalc = salarioDiario * diasTrabajadosSemanal;
      setSalarioSemanal(salarioSemanalCalc);

      const salarioMensualCalc = salarioSemanalCalc * 4.33;
      setSalarioMensual(Math.round(salarioMensualCalc));
    } else {
      setHorasPorDia(0);
      setValorHoraNormal(0);
      setValorHoraExtraDiurna(0);
      setValorHoraExtraNocturna(0);
      setValorHoraExtraFestiva(0);
      setSalarioSemanal(0);
      setSalarioMensual(0);
    }
  }, [
    salarioDiario,
    diasTrabajadosSemanal,
    horasJornadaSemanal,
    factorHoraExtraDiurnas,
    factorHoraExtraNocturnas,
    factorHoraExtraFestivas,
  ]);

  useEffect(() => {
    if (configuracion) {
      reset({
        trabajadorId: configuracion.trabajadorId,
        fechaContratacion: configuracion.fechaContratacion,
        cargo: configuracion.cargo || "",
        salarioDiario: Number(configuracion.salarioDiario),
        factorHoraExtraDiurnas:
          Number(configuracion.factorHoraExtraDiurnas) || 1.5,
        factorHoraExtraNocturnas:
          Number(configuracion.factorHoraExtraNocturnas) || 1.75,
        factorHoraExtraFestivas:
          Number(configuracion.factorHoraExtraFestivas) || 2.0,
        diasTrabajadosSemanal: configuracion.diasTrabajadosSemanal,
        horasJornadaSemanal: configuracion.horasJornadaSemanal,
        bonificacionesFijas: configuracion.bonificacionesFijas || [],
        deduccionesFijas: configuracion.deduccionesFijas || [],
        activo: configuracion.activo,
      });
    }
  }, [configuracion, reset]);

  const createMutation = useMutation({
    mutationFn: CreateConfigTrabajador,
    onSuccess: () => {
      toast.success("Configuración creada exitosamente");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["config-trabajadores"] });
      onSuccess();
    },
    onError: (error) => {
      handleMutationError(error, "crear");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: CrearConfigTrabajadorInterface;
    }) => EditarConfigTrabajador(id, data),
    onSuccess: () => {
      toast.success("Configuración actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["config-trabajadores"] });
      onSuccess();
    },
    onError: (error) => {
      handleMutationError(error, "actualizar");
    },
  });

  const resetForm = () => {
    reset({
      trabajadorId: "",
      fechaContratacion: new Date().toISOString().split("T")[0],
      cargo: "",
      salarioDiario: 0,
      factorHoraExtraDiurnas: 1.5,
      factorHoraExtraNocturnas: 1.75,
      factorHoraExtraFestivas: 2.0,
      diasTrabajadosSemanal: 5,
      horasJornadaSemanal: 40,
      bonificacionesFijas: [],
      deduccionesFijas: [],
      activo: true,
    });
  };

  const handleMutationError = (error: unknown, action: string) => {
    if (isAxiosError(error)) {
      const messages = error.response?.data?.message;
      const errorMessage = Array.isArray(messages)
        ? messages[0]
        : typeof messages === "string"
          ? messages
          : `Hubo un error al ${action} la configuración`;
      toast.error(errorMessage);
    } else {
      toast.error(
        `Hubo un error al ${action} la configuración. Inténtalo de nuevo.`,
      );
    }
  };

  const onSubmit = (data: CrearConfigTrabajadorInterface) => {
    if (isEditing && configuracion) {
      data.trabajadorId = configuracion.trabajadorId;
      updateMutation.mutate({ id: configuracion.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const trabajadoresDisponibles =
    trabajadores?.trabajadores?.filter((trabajador: any) => {
      if (isEditing && configuracion?.trabajadorId === trabajador.id)
        return true;
      return !trabajador.configuracionActiva;
    }) || [];

  const totalBonificaciones =
    watch("bonificacionesFijas")?.reduce(
      (sum, b) => sum + (Number(b.montoMensual) || 0),
      0,
    ) || 0;

  const totalDeducciones =
    watch("deduccionesFijas")?.reduce(
      (sum, d) => sum + (Number(d.montoMensual) || 0),
      0,
    ) || 0;

  const totalNetoMensual =
    salarioMensual + totalBonificaciones - totalDeducciones;

  const handleCancel = () => {
    resetForm();
    if (setSelectedConfig) {
      setSelectedConfig(null);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Información Laboral
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trabajadorId" className="text-sm md:text-base">
                Trabajador <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("trabajadorId")}
                onValueChange={(value) => setValue("trabajadorId", value)}
                disabled={isEditing}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona un trabajador" />
                </SelectTrigger>
                <SelectContent>
                  {loadingTrabajadores ? (
                    <SelectItem value="loading" disabled>
                      Cargando trabajadores...
                    </SelectItem>
                  ) : trabajadoresDisponibles.length > 0 ? (
                    trabajadoresDisponibles.map((trabajador: any) => (
                      <SelectItem key={trabajador.id} value={trabajador.id}>
                        {trabajador.nombre} - {trabajador.identificacion}
                      </SelectItem>
                    ))
                  ) : (
                    <SelectItem value="no-trabajadores" disabled>
                      No hay trabajadores disponibles
                    </SelectItem>
                  )}
                </SelectContent>
              </Select>
              {errors.trabajadorId && (
                <p className="text-sm font-medium text-red-500">
                  {errors.trabajadorId.message as string}
                </p>
              )}
              {isEditing && (
                <p className="text-xs text-muted-foreground">
                  El trabajador no se puede modificar en edición
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="fechaContratacion"
                className="text-sm md:text-base"
              >
                Fecha de Contratación <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fechaContratacion"
                  type="date"
                  className="pl-10 w-full"
                  {...register("fechaContratacion", {
                    required: "La fecha de contratación es requerida",
                  })}
                />
              </div>
              {errors.fechaContratacion && (
                <p className="text-sm font-medium text-red-500">
                  {errors.fechaContratacion.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cargo" className="text-sm md:text-base">
                Cargo
              </Label>
              <Input
                id="cargo"
                placeholder="Ej: Ordeñador, Vaquero, Capataz"
                className="w-full"
                {...register("cargo")}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm md:text-base">Estado</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="activo"
                  checked={watch("activo")}
                  onCheckedChange={(checked) => setValue("activo", checked)}
                />
                <Label htmlFor="activo" className="cursor-pointer">
                  {watch("activo") ? "Activo" : "Inactivo"}
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="p-4 md:p-6">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Configuración Salarial
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="salarioDiario" className="text-sm md:text-base">
                Salario Diario ({moneda}){" "}
                <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="salarioDiario"
                  type="number"
                  step="0.01"
                  className="pl-10 w-full"
                  placeholder="0.00"
                  {...register("salarioDiario", {
                    required: "El salario diario es requerido",
                    min: {
                      value: 0.01,
                      message: "El salario debe ser mayor a 0",
                    },
                    valueAsNumber: true,
                  })}
                />
              </div>
              {errors.salarioDiario && (
                <p className="text-sm font-medium text-red-500">
                  {errors.salarioDiario.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="diasTrabajadosSemanal"
                className="text-sm md:text-base"
              >
                Días por Semana <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="diasTrabajadosSemanal"
                  type="number"
                  step="1"
                  className="pl-10 w-full"
                  placeholder="5"
                  {...register("diasTrabajadosSemanal", {
                    required: "Los días trabajados son requeridos",
                    min: { value: 1, message: "Mínimo 1 día" },
                    max: { value: 7, message: "Máximo 7 días" },
                    valueAsNumber: true,
                  })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Días que trabaja a la semana
              </p>
              {errors.diasTrabajadosSemanal && (
                <p className="text-sm font-medium text-red-500">
                  {errors.diasTrabajadosSemanal.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="horasJornadaSemanal"
                className="text-sm md:text-base"
              >
                Horas Semanales <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="horasJornadaSemanal"
                  type="number"
                  step="1"
                  className="pl-10 w-full"
                  placeholder="40"
                  {...register("horasJornadaSemanal", {
                    required: "Las horas semanales son requeridas",
                    min: { value: 1, message: "Mínimo 1 hora" },
                    max: { value: 80, message: "Máximo 80 horas" },
                    valueAsNumber: true,
                  })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Total de horas a la semana
              </p>
              {errors.horasJornadaSemanal && (
                <p className="text-sm font-medium text-red-500">
                  {errors.horasJornadaSemanal.message as string}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
            <div className="space-y-2">
              <Label
                htmlFor="factorHoraExtraDiurnas"
                className="flex items-center gap-2 text-sm md:text-base"
              >
                <Sun className="h-4 w-4 text-yellow-500" />
                Factor Hora Extra Diurnas
              </Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="factorHoraExtraDiurnas"
                  type="number"
                  step="0.1"
                  className="pl-10 w-full"
                  {...register("factorHoraExtraDiurnas", {
                    required: "El factor de hora extra diurnas es requerido",
                    min: { value: 1, message: "Mínimo 1.0" },
                    max: { value: 3, message: "Máximo 3.0" },
                    valueAsNumber: true,
                  })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Horas extras antes de las 6:00 PM
              </p>
              {errors.factorHoraExtraDiurnas && (
                <p className="text-sm font-medium text-red-500">
                  {errors.factorHoraExtraDiurnas.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="factorHoraExtraNocturnas"
                className="flex items-center gap-2 text-sm md:text-base"
              >
                <Moon className="h-4 w-4 text-blue-500" />
                Factor Hora Extra Nocturnas
              </Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="factorHoraExtraNocturnas"
                  type="number"
                  step="0.1"
                  className="pl-10 w-full"
                  {...register("factorHoraExtraNocturnas", {
                    required: "El factor de hora extra nocturnas es requerido",
                    min: { value: 1, message: "Mínimo 1.0" },
                    max: { value: 3, message: "Máximo 3.0" },
                    valueAsNumber: true,
                  })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Horas extras después de las 6:00 PM
              </p>
              {errors.factorHoraExtraNocturnas && (
                <p className="text-sm font-medium text-red-500">
                  {errors.factorHoraExtraNocturnas.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="factorHoraExtraFestivas"
                className="flex items-center gap-2 text-sm md:text-base"
              >
                <Star className="h-4 w-4 text-purple-500" />
                Factor Hora Extra Festivas
              </Label>
              <div className="relative">
                <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="factorHoraExtraFestivas"
                  type="number"
                  step="0.1"
                  className="pl-10 w-full"
                  {...register("factorHoraExtraFestivas", {
                    required: "El factor de hora extra festivas es requerido",
                    min: { value: 1, message: "Mínimo 1.0" },
                    max: { value: 3, message: "Máximo 3.0" },
                    valueAsNumber: true,
                  })}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Horas extras en domingos o días festivos
              </p>
              {errors.factorHoraExtraFestivas && (
                <p className="text-sm font-medium text-red-500">
                  {errors.factorHoraExtraFestivas.message as string}
                </p>
              )}
            </div>
          </div>

          {salarioDiario > 0 &&
            diasTrabajadosSemanal > 0 &&
            horasJornadaSemanal > 0 && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg overflow-x-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Horas por Día
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {horasPorDia.toFixed(1)} horas
                    </p>
                    <p className="text-xs text-gray-500">
                      {diasTrabajadosSemanal} días/semana
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Valor Hora Normal
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(valorHoraNormal, moneda)}
                    </p>
                    <p className="text-xs text-gray-500">por hora</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Salario Semanal
                    </p>
                    <p className="text-xl font-bold text-purple-600">
                      {formatCurrency(salarioSemanal, moneda)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {diasTrabajadosSemanal} días ×{" "}
                      {formatCurrency(salarioDiario, moneda)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Salario Mensual
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      {formatCurrency(salarioMensual, moneda)}
                    </p>
                    <p className="text-xs text-gray-500">Base mensual</p>
                  </div>
                </div>

                <div className="border-t mt-4 pt-4">
                  <p className="text-sm font-semibold mb-2">
                    Valores de Horas Extras:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-2 bg-white/50 dark:bg-black/20 rounded">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm">Diurnas:</span>
                      </div>
                      <span className="font-semibold text-yellow-600">
                        {formatCurrency(valorHoraExtraDiurna, moneda)}/hora
                      </span>
                      <span className="text-xs text-gray-500">
                        ({factorHoraExtraDiurnas}x)
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-2 bg-white/50 dark:bg-black/20 rounded">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Nocturnas:</span>
                      </div>
                      <span className="font-semibold text-blue-600">
                        {formatCurrency(valorHoraExtraNocturna, moneda)}/hora
                      </span>
                      <span className="text-xs text-gray-500">
                        ({factorHoraExtraNocturnas}x)
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 p-2 bg-white/50 dark:bg-black/20 rounded">
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-purple-500" />
                        <span className="text-sm">Festivas:</span>
                      </div>
                      <span className="font-semibold text-purple-600">
                        {formatCurrency(valorHoraExtraFestiva, moneda)}/hora
                      </span>
                      <span className="text-xs text-gray-500">
                        ({factorHoraExtraFestivas}x)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 md:p-6">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Plus className="h-5 w-5 text-green-600" />
            Bonificaciones Fijas
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size={isMobile ? "default" : "sm"}
            onClick={() =>
              appendBonificacion({ concepto: "", montoMensual: 0 })
            }
            className="gap-1 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" /> Agregar
          </Button>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          {bonificacionesFields.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay bonificaciones registradas. Click en "Agregar" para añadir.
            </p>
          ) : (
            <div className="space-y-3">
              {bonificacionesFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row gap-3 items-start"
                >
                  <div className="flex-1 w-full">
                    <Input
                      placeholder="Concepto (Ej: Bono transporte)"
                      className="w-full"
                      {...register(`bonificacionesFijas.${index}.concepto`, {
                        required: "El concepto es requerido",
                      })}
                    />
                  </div>
                  <div className="w-full sm:w-40">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        step="0.01"
                        className="pl-10 w-full"
                        placeholder="Monto mensual"
                        {...register(
                          `bonificacionesFijas.${index}.montoMensual`,
                          {
                            required: "El monto es requerido",
                            min: {
                              value: 0.01,
                              message: "Monto debe ser mayor a 0",
                            },
                            valueAsNumber: true,
                          },
                        )}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeBonificacion(index)}
                    className="text-red-500 hover:text-red-700 w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 md:p-6">
          <CardTitle className="text-base md:text-lg flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Deducciones Fijas
          </CardTitle>
          <Button
            type="button"
            variant="outline"
            size={isMobile ? "default" : "sm"}
            onClick={() => appendDeduccion({ concepto: "", montoMensual: 0 })}
            className="gap-1 w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" /> Agregar
          </Button>
        </CardHeader>
        <CardContent className="p-4 md:p-6 pt-0">
          {deduccionesFields.length === 0 ? (
            <p className="text-gray-500 text-center py-4">
              No hay deducciones registradas. Click en "Agregar" para añadir.
            </p>
          ) : (
            <div className="space-y-3">
              {deduccionesFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex flex-col sm:flex-row gap-3 items-start"
                >
                  <div className="flex-1 w-full">
                    <Input
                      placeholder="Concepto (Ej: Préstamo)"
                      className="w-full"
                      {...register(`deduccionesFijas.${index}.concepto`, {
                        required: "El concepto es requerido",
                      })}
                    />
                  </div>
                  <div className="w-full sm:w-40">
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="number"
                        step="0.01"
                        className="pl-10 w-full"
                        placeholder="Monto mensual"
                        {...register(`deduccionesFijas.${index}.montoMensual`, {
                          required: "El monto es requerido",
                          min: {
                            value: 0.01,
                            message: "Monto debe ser mayor a 0",
                          },
                          valueAsNumber: true,
                        })}
                      />
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeDeduccion(index)}
                    className="text-red-500 hover:text-red-700 w-full sm:w-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {(bonificacionesFields.length > 0 ||
        deduccionesFields.length > 0 ||
        salarioMensual > 0) && (
        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-base md:text-lg">
              Resumen Mensual
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 pt-0">
            <div className="space-y-3">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                <span className="text-gray-600">Salario Base Mensual:</span>
                <span className="font-semibold">
                  {formatCurrency(salarioMensual, moneda)}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-sm text-gray-500">
                <span>Desglose:</span>
                <span>
                  {formatCurrency(salarioDiario, moneda)}/día ×{" "}
                  {diasTrabajadosSemanal} días/semana × 4.33 semanas
                </span>
              </div>
              {bonificacionesFields.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-green-600">
                  <span>Total Bonificaciones:</span>
                  <span className="font-semibold">
                    {formatCurrency(totalBonificaciones, moneda)}
                  </span>
                </div>
              )}
              {deduccionesFields.length > 0 && (
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-red-600">
                  <span>Total Deducciones:</span>
                  <span className="font-semibold">
                    {formatCurrency(totalDeducciones, moneda)}
                  </span>
                </div>
              )}
              <div className="border-t pt-3">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-lg font-bold">
                  <span>Total Neto Mensual:</span>
                  <span className="text-blue-600">
                    {formatCurrency(totalNetoMensual, moneda)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="sticky bottom-0 bg-background border-t pt-4 pb-2 -mb-2 mt-6">
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isPending}
            className="w-full sm:w-auto order-3 sm:order-1"
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={resetForm}
            disabled={isPending}
            className="w-full sm:w-auto order-2"
          >
            Limpiar
          </Button>
          <Button
            type="submit"
            disabled={isPending}
            className="w-full sm:w-auto order-1 sm:order-3"
          >
            {isPending
              ? isEditing
                ? "Actualizando..."
                : "Creando..."
              : isEditing
                ? "Actualizar Configuración"
                : "Crear Configuración"}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default FormConfigTrabajadores;
