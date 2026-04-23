"use client";
import { CrearJornadaInterface } from "@/api/jornadas-trabajador/interface/crear-jornada.interface";
import { Jornada } from "@/api/jornadas-trabajador/interface/response-jornadas.interface";
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
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  Calendar,
  User,
  Clock,
  Sun,
  Moon,
  Star,
  FileText,
  Briefcase,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CreateJornadaTrabajador } from "@/api/jornadas-trabajador/accions/crear-jornada";
import { EditarJornadaTrabajador } from "@/api/jornadas-trabajador/accions/editar-jornada";
import useGetAllTrabajadores from "@/hooks/trabajadores/useGetAllTrabajadores";

interface Props {
  onSuccess: () => void;
  jornada?: Jornada | null;
  setSelectedJornada?: (jornada: Jornada | null) => void;
}

const FormJornadaTrabajador = ({
  onSuccess,
  jornada,
  setSelectedJornada,
}: Props) => {
  const isEditing = !!jornada;
  const queryClient = useQueryClient();
  const { data: trabajadores, isLoading: loadingTrabajadores } =
    useGetAllTrabajadores();

  const [totalHorasExtras, setTotalHorasExtras] = useState<number>(0);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
    watch,
  } = useForm<CrearJornadaInterface>({
    defaultValues: {
      trabajadorId: "",
      fecha: new Date().toISOString().split("T")[0],
      trabajo: true,
      laborRealizada: "",
      horasExtrasDiurnas: 0,
      horasExtrasNocturnas: 0,
      horasExtrasFestivas: 0,
      observaciones: "",
    },
  });

  const trabajo = watch("trabajo");
  const horasExtrasDiurnas = watch("horasExtrasDiurnas");
  const horasExtrasNocturnas = watch("horasExtrasNocturnas");
  const horasExtrasFestivas = watch("horasExtrasFestivas");

  useEffect(() => {
    const total =
      (Number(horasExtrasDiurnas) || 0) +
      (Number(horasExtrasNocturnas) || 0) +
      (Number(horasExtrasFestivas) || 0);
    setTotalHorasExtras(total);
  }, [horasExtrasDiurnas, horasExtrasNocturnas, horasExtrasFestivas]);

  useEffect(() => {
    if (jornada) {
      reset({
        trabajadorId: jornada.trabajadorId,
        fecha: jornada.fecha,
        trabajo: jornada.trabajo,
        laborRealizada: jornada.laborRealizada || "",
        horasExtrasDiurnas: Number(jornada.horasExtrasDiurnas) || 0,
        horasExtrasNocturnas: Number(jornada.horasExtrasNocturnas) || 0,
        horasExtrasFestivas: Number(jornada.horasExtrasFestivas) || 0,
        observaciones: jornada.observaciones || "",
      });
    }
  }, [jornada, reset]);

  const createMutation = useMutation({
    mutationFn: CreateJornadaTrabajador,
    onSuccess: () => {
      toast.success("Jornada registrada exitosamente");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["jornadas"] });
      onSuccess();
    },
    onError: (error) => {
      handleMutationError(error, "registrar");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: CrearJornadaInterface }) =>
      EditarJornadaTrabajador(id, data),
    onSuccess: () => {
      toast.success("Jornada actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["jornadas"] });
      onSuccess();
    },
    onError: (error) => {
      handleMutationError(error, "actualizar");
    },
  });

  const resetForm = () => {
    reset({
      trabajadorId: "",
      fecha: new Date().toISOString().split("T")[0],
      trabajo: true,
      laborRealizada: "",
      horasExtrasDiurnas: 0,
      horasExtrasNocturnas: 0,
      horasExtrasFestivas: 0,
      observaciones: "",
    });
  };

  const handleMutationError = (error: unknown, action: string) => {
    if (isAxiosError(error)) {
      const messages = error.response?.data?.message;
      const errorMessage = Array.isArray(messages)
        ? messages[0]
        : typeof messages === "string"
          ? messages
          : `Hubo un error al ${action} la jornada`;
      toast.error(errorMessage);
    } else {
      toast.error(`Hubo un error al ${action} la jornada. Inténtalo de nuevo.`);
    }
  };

  const onSubmit = (data: CrearJornadaInterface) => {
    if (isEditing && jornada) {
      data.trabajadorId = jornada.trabajadorId;
      updateMutation.mutate({ id: jornada.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  const handleCancel = () => {
    resetForm();
    if (setSelectedJornada) {
      setSelectedJornada(null);
    }
    onSuccess();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Información de la Jornada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="trabajadorId">
                Trabajador <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("trabajadorId")}
                onValueChange={(value) => setValue("trabajadorId", value)}
                disabled={isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un trabajador" />
                </SelectTrigger>
                <SelectContent>
                  {loadingTrabajadores ? (
                    <SelectItem value="loading" disabled>
                      Cargando trabajadores...
                    </SelectItem>
                  ) : trabajadores && trabajadores?.length > 0 ? (
                    trabajadores?.map((trabajador: any) => (
                      <SelectItem key={trabajador.id} value={trabajador.id}>
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {trabajador.nombre} - {trabajador.identificacion}
                        </div>
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
              <Label htmlFor="fecha">
                Fecha <span className="text-red-500">*</span>
              </Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="fecha"
                  type="date"
                  className="pl-10"
                  {...register("fecha", {
                    required: "La fecha es requerida",
                  })}
                />
              </div>
              {errors.fecha && (
                <p className="text-sm font-medium text-red-500">
                  {errors.fecha.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>¿Trabajó?</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="trabajo"
                  checked={trabajo}
                  onCheckedChange={(checked) => setValue("trabajo", checked)}
                />
                <Label htmlFor="trabajo" className="cursor-pointer">
                  {trabajo ? "Sí, trabajó" : "No trabajó"}
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Horas Extras
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label
                htmlFor="horasExtrasDiurnas"
                className="flex items-center gap-2"
              >
                <Sun className="h-4 w-4 text-yellow-500" />
                Horas Extras Diurnas
              </Label>
              <Input
                id="horasExtrasDiurnas"
                type="number"
                step="1"
                min="0"
                max="12"
                placeholder="0"
                {...register("horasExtrasDiurnas", {
                  min: { value: 0, message: "No puede ser negativo" },
                  max: { value: 12, message: "Máximo 12 horas" },
                  valueAsNumber: true,
                })}
              />
              <p className="text-xs text-muted-foreground">
                Horas extras antes de las 6:00 PM
              </p>
              {errors.horasExtrasDiurnas && (
                <p className="text-sm font-medium text-red-500">
                  {errors.horasExtrasDiurnas.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="horasExtrasNocturnas"
                className="flex items-center gap-2"
              >
                <Moon className="h-4 w-4 text-blue-500" />
                Horas Extras Nocturnas
              </Label>
              <Input
                id="horasExtrasNocturnas"
                type="number"
                step="1"
                min="0"
                max="12"
                placeholder="0"
                {...register("horasExtrasNocturnas", {
                  min: { value: 0, message: "No puede ser negativo" },
                  max: { value: 12, message: "Máximo 12 horas" },
                  valueAsNumber: true,
                })}
              />
              <p className="text-xs text-muted-foreground">
                Horas extras después de las 6:00 PM
              </p>
              {errors.horasExtrasNocturnas && (
                <p className="text-sm font-medium text-red-500">
                  {errors.horasExtrasNocturnas.message as string}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="horasExtrasFestivas"
                className="flex items-center gap-2"
              >
                <Star className="h-4 w-4 text-purple-500" />
                Horas Extras Festivas
              </Label>
              <Input
                id="horasExtrasFestivas"
                type="number"
                step="1"
                min="0"
                max="12"
                placeholder="0"
                {...register("horasExtrasFestivas", {
                  min: { value: 0, message: "No puede ser negativo" },
                  max: { value: 12, message: "Máximo 12 horas" },
                  valueAsNumber: true,
                })}
              />
              <p className="text-xs text-muted-foreground">
                Horas extras en domingos o días festivos
              </p>
              {errors.horasExtrasFestivas && (
                <p className="text-sm font-medium text-red-500">
                  {errors.horasExtrasFestivas.message as string}
                </p>
              )}
            </div>
          </div>

          {totalHorasExtras > 0 && (
            <div className="bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Total de Horas Extras:
                </span>
                <span className="text-2xl font-bold text-orange-600">
                  {totalHorasExtras.toFixed(1)} horas
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalles de la Jornada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="laborRealizada">Labor Realizada</Label>
            <Textarea
              id="laborRealizada"
              placeholder="Describa las actividades realizadas durante la jornada..."
              className="min-h-[100px]"
              {...register("laborRealizada")}
            />
            {errors.laborRealizada && (
              <p className="text-sm font-medium text-red-500">
                {errors.laborRealizada.message as string}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              placeholder="Notas adicionales, incidencias, etc."
              className="min-h-[80px]"
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
          Cancelar
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={resetForm}
          disabled={isPending}
          className="w-full sm:w-auto"
        >
          Limpiar
        </Button>
        <Button className="w-full sm:w-auto" type="submit" disabled={isPending}>
          {isPending
            ? isEditing
              ? "Actualizando..."
              : "Registrando..."
            : isEditing
              ? "Actualizar Jornada"
              : "Registrar Jornada"}
        </Button>
      </div>
    </form>
  );
};

export default FormJornadaTrabajador;
