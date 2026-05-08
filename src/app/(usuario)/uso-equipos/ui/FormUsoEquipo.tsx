"use client";

import { IngresarUsoEquipoInterface } from "@/api/uso-equipos/interfaces/crear-uso-equipo.interface";
import useGetActividadesByTrabajador from "@/hooks/actividades/useGetActividadesByTrabajador";
import useGetEquiposMaquinariaActivos from "@/hooks/equipos-maquinaria/useGetEquiposMaquinariaActivos";
import useGetAllTrabajadores from "@/hooks/trabajadores/useGetAllTrabajadores";
import { useEffect, useState, useCallback } from "react";
import { useForm } from "react-hook-form";
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
import { AlertCircleIcon } from "lucide-react";
import { UsosEquipo } from "@/api/uso-equipos/interfaces/response-uso-equipos.interface";
import {
  formatearFechaParaEnviar,
  formatearFechaParaInput,
} from "@/helpers/funciones/mantenimiento/fechas_format";
import { editarUso } from "@/api/uso-equipos/accions/editar-uso-equipo";
import { ingresarUso } from "@/api/uso-equipos/accions/ingresar-uso-equipo";
import { formatDate } from "@/helpers/funciones/formatDate";

interface Props {
  usoEquipo?: UsosEquipo | null;
  onSuccess: () => void;
  moneda?: string;
}

const FormUsoEquipo = ({ usoEquipo, onSuccess, moneda = "Lps" }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [selectedOperadorId, setSelectedOperadorId] = useState<string>("");
  const [fechaActividad, setFechaActividad] = useState<string>("");
  const [horasCalculadas, setHorasCalculadas] = useState<number>(0);

  const { data: equiposActivos, isLoading: isLoadingEquipos } =
    useGetEquiposMaquinariaActivos();
  const { data: trabajadores, isLoading: isLoadingTrabajadores } =
    useGetAllTrabajadores();
  const { data: actividades, isLoading: isLoadingActividades } =
    useGetActividadesByTrabajador(selectedOperadorId, fechaActividad);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<IngresarUsoEquipoInterface>({
    defaultValues: {
      equipoId: "",
      actividadId: "",
      operadorId: "",
      fechaInicio: "",
      fechaFin: "",
      horasTrabajadas: 0,
    },
  });

  const queryClient = useQueryClient();
  const isEditing = !!usoEquipo;
  const fechaInicio = watch("fechaInicio");
  const fechaFin = watch("fechaFin");
  const operadorId = watch("operadorId");

  const calcularHorasTrabajadas = useCallback(() => {
    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);

      if (inicio < fin) {
        const diffHoras = (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
        const horas = Math.round(diffHoras * 10) / 10;
        setHorasCalculadas(horas);
        setValue("horasTrabajadas", horas);
        return horas;
      }
    }
    setHorasCalculadas(0);
    setValue("horasTrabajadas", 0);
    return 0;
  }, [fechaInicio, fechaFin, setValue]);

  useEffect(() => {
    calcularHorasTrabajadas();
  }, [calcularHorasTrabajadas]);

  useEffect(() => {
    if (usoEquipo) {
      setValue("equipoId", usoEquipo.equipo.id);
      setValue("actividadId", usoEquipo.actividad?.id || "");
      setValue("operadorId", usoEquipo.operador?.id || "");

      setValue("fechaInicio", formatearFechaParaInput(usoEquipo.fechaInicio));
      setValue("fechaFin", formatearFechaParaInput(usoEquipo.fechaFin));
      setValue("horasTrabajadas", Number(usoEquipo.horasTrabajadas));

      setHorasCalculadas(Number(usoEquipo.horasTrabajadas));
      setSelectedOperadorId(usoEquipo.operador?.id || "");

      if (usoEquipo.fechaInicio) {
        const fechaObj = new Date(usoEquipo.fechaInicio);
        const fechaYYYYMMDD = fechaObj.toISOString().split("T")[0];
        setFechaActividad(fechaYYYYMMDD);
      }
    } else {
      reset({
        equipoId: "",
        actividadId: "",
        operadorId: "",
        fechaInicio: "",
        fechaFin: "",
        horasTrabajadas: 0,
      });
      setSelectedOperadorId("");
      setFechaActividad("");
      setHorasCalculadas(0);
    }
  }, [usoEquipo, setValue, reset]);

  useEffect(() => {
    if (operadorId) {
      setSelectedOperadorId(operadorId);
    }
  }, [operadorId]);

  useEffect(() => {
    if (fechaInicio) {
      const fecha = fechaInicio.split("T")[0];
      setFechaActividad(fecha);
    }
  }, [fechaInicio]);

  const validateFechas = () => {
    if (!fechaInicio || !fechaFin) return true;
    const inicio = new Date(fechaInicio);
    const fin = new Date(fechaFin);

    if (inicio >= fin) {
      return "La fecha de fin debe ser posterior a la fecha de inicio";
    }
    return true;
  };

  const handleFechaInicioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("fechaInicio", value);

    setTimeout(() => calcularHorasTrabajadas(), 0);
  };

  const handleFechaFinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("fechaFin", value);

    setTimeout(() => calcularHorasTrabajadas(), 0);
  };

  const onSubmit = async (data: IngresarUsoEquipoInterface) => {
    try {
      const dataToSend = {
        ...data,
        fechaInicio: formatearFechaParaEnviar(data.fechaInicio),
        fechaFin: formatearFechaParaEnviar(data.fechaFin),
        horasTrabajadas: Number(data.horasTrabajadas),
      };

      if (isEditing && usoEquipo) {
        await editarUso(usoEquipo.id, dataToSend);
        toast.success("Uso de equipo actualizado correctamente");
      } else {
        await ingresarUso(dataToSend);
        toast.success("Uso de equipo registrado correctamente");
      }

      reset();
      queryClient.invalidateQueries({ queryKey: ["uso-equipos"] });
      queryClient.invalidateQueries({ queryKey: ["equipos-activos"] });

      if (onSuccess) {
        onSuccess();
        setErrorMessage("");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al registrar el uso del equipo";
        setErrorMessage(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    }
  };

  if (isLoadingEquipos || isLoadingTrabajadores) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>
            Error al {isEditing ? "actualizar" : "registrar"} el Uso de Equipo
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="equipoId">
            Equipo <span className="text-red-500">*</span>
          </Label>

          {!isEditing ? (
            <Select
              value={watch("equipoId")}
              onValueChange={(value) => setValue("equipoId", value)}
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={errors.equipoId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Seleccionar equipo" />
              </SelectTrigger>
              <SelectContent className="max-h-80">
                <SelectGroup>
                  <SelectLabel>Equipos Activos</SelectLabel>
                  {equiposActivos && equiposActivos.length === 0 ? (
                    <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                      No hay equipos activos disponibles
                    </div>
                  ) : (
                    equiposActivos?.map((equipo) => (
                      <SelectItem key={equipo.id} value={equipo.id}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{equipo.nombre}</span>
                          <span className="text-xs text-muted-foreground">
                            {equipo.marca} {equipo.modelo} •{" "}
                            {equipo.finca?.nombre_finca}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            <div className="w-full p-2 border rounded-md bg-muted/50">
              <div>
                <div className="font-medium">{usoEquipo?.equipo.nombre}</div>
                <div className="text-sm text-muted-foreground">
                  {usoEquipo?.equipo.marca} {usoEquipo?.equipo.modelo}
                </div>
              </div>
            </div>
          )}

          <input
            type="hidden"
            {...register("equipoId", {
              required: "Debe seleccionar un equipo",
            })}
          />
          {errors.equipoId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.equipoId.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="operadorId">
            Operador <span className="text-red-500">*</span>
          </Label>

          {!isEditing ? (
            <Select
              value={watch("operadorId")}
              onValueChange={(value) => {
                setValue("operadorId", value);
                setValue("actividadId", "");
              }}
              disabled={isSubmitting}
            >
              <SelectTrigger
                className={errors.operadorId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Seleccionar operador" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Operadores</SelectLabel>
                  {trabajadores?.map((trabajador) => (
                    <SelectItem key={trabajador.id} value={trabajador.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{trabajador.nombre}</span>
                        <span className="text-xs text-muted-foreground">
                          {trabajador.email}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          ) : (
            // En modo edición, mostrar un div con la información del operador
            <div className="w-full p-2 border rounded-md bg-muted/50">
              <div className="font-medium">{usoEquipo?.operador?.nombre}</div>
              <div className="text-sm text-muted-foreground">
                {usoEquipo?.operador?.email}
              </div>
            </div>
          )}

          <input
            type="hidden"
            {...register("operadorId", {
              required: "Debe seleccionar un operador",
            })}
            value={watch("operadorId")}
          />
          {errors.operadorId && (
            <p className="text-sm text-red-500 mt-1">
              {errors.operadorId.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="actividadId">
            Actividad Realizada
            {!watch("operadorId") && (
              <span className="text-xs text-muted-foreground ml-2">
                (Seleccione un operador primero)
              </span>
            )}
            {watch("operadorId") && !fechaActividad && (
              <span className="text-xs text-muted-foreground ml-2">
                (Seleccione fecha de inicio primero)
              </span>
            )}
          </Label>
          <Select
            value={watch("actividadId") || "ninguna"}
            onValueChange={(value) =>
              setValue("actividadId", value === "ninguna" ? "" : value)
            }
            disabled={isSubmitting || !watch("operadorId") || !fechaActividad}
          >
            <SelectTrigger
              className={errors.actividadId ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Seleccionar actividad" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              <SelectGroup>
                <SelectLabel>Actividades del día</SelectLabel>
                <SelectItem value="ninguna">Ninguna actividad</SelectItem>
                {isLoadingActividades ? (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    Cargando actividades...
                  </div>
                ) : actividades && actividades.length === 0 ? (
                  <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                    No hay actividades para esta fecha
                  </div>
                ) : (
                  actividades?.map((actividad) => (
                    <SelectItem key={actividad.id} value={actividad.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">
                          {actividad.descripcion}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {actividad.fecha && formatDate(actividad.fecha)}
                        </span>
                      </div>
                    </SelectItem>
                  ))
                )}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="fechaInicio">
            Fecha y Hora de Inicio <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fechaInicio"
            type="datetime-local"
            {...register("fechaInicio", {
              required: "La fecha y hora de inicio es requerida",
            })}
            onChange={handleFechaInicioChange}
            className={errors.fechaInicio ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.fechaInicio && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fechaInicio.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="fechaFin">
            Fecha y Hora de Fin <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fechaFin"
            type="datetime-local"
            {...register("fechaFin", {
              required: "La fecha y hora de fin es requerida",
              validate: validateFechas,
            })}
            onChange={handleFechaFinChange}
            className={errors.fechaFin ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.fechaFin && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fechaFin.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="horasTrabajadas">
            Horas Trabajadas <span className="text-red-500">*</span>
          </Label>
          <Input
            id="horasTrabajadas"
            type="number"
            step="0.5"
            min="0"
            value={horasCalculadas}
            {...register("horasTrabajadas", {
              required: "Las horas trabajadas son requeridas",
              min: {
                value: 0,
                message: "Las horas deben ser mayor o igual a 0",
              },
              valueAsNumber: true,
            })}
            placeholder="0.0"
            className={errors.horasTrabajadas ? "border-red-500" : ""}
            disabled={true}
          />
          <p className="text-xs text-muted-foreground mt-1">
            * Se calcula automáticamente según las fechas seleccionadas
          </p>
          {errors.horasTrabajadas && (
            <p className="text-sm text-red-500 mt-1">
              {errors.horasTrabajadas.message}
            </p>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => onSuccess()}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              {isEditing ? "Actualizando..." : "Guardando..."}
            </span>
          ) : isEditing ? (
            "Actualizar Uso de Equipo"
          ) : (
            "Registrar Uso de Equipo"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormUsoEquipo;
