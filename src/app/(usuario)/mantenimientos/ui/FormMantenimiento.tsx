import { CrearMantenimientoInterface } from "@/api/mantenimientos/interface/ingresar-mantenimiento.interface";
import useGetEquiposMaquinariaActivos from "@/hooks/equipos-maquinaria/useGetEquiposMaquinariaActivos";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Mantenimiento } from "@/api/mantenimientos/interface/response-mantenimientos.interface";
import { Equipo } from "@/api/equipos-maquinaria/interface/response-equipos.interface";
import { editarMantenimiento } from "@/api/mantenimientos/accions/editar-mantenimiento";
import { ingresarMantenimiento } from "@/api/mantenimientos/accions/ingresar-mantenimiento";

interface Props {
  mantenimiento?: Mantenimiento | null;
  onSuccess: () => void;
  moneda: string;
}

const formatearFechaParaInput = (fecha: string | Date | undefined): string => {
  if (!fecha) return "";

  if (typeof fecha === "string") {
    if (fecha.includes(" ")) {
      const [date, time] = fecha.split(" ");

      const timeOnly = time.split("+")[0].split("-")[0];
      return `${date}T${timeOnly}`;
    }

    return fecha.split(".")[0];
  }

  if (fecha instanceof Date) {
    return fecha.toISOString().slice(0, 16);
  }

  return "";
};

const formatearFechaParaEnviar = (fecha: string): string => {
  if (!fecha) return "";

  if (fecha.includes("T")) {
    const offset = -new Date().getTimezoneOffset();
    const offsetSign = offset >= 0 ? "+" : "-";
    const offsetHours = Math.abs(Math.floor(offset / 60));
    const offsetMinutes = Math.abs(offset % 60);
    const offsetStr = `${offsetSign}${offsetHours.toString().padStart(2, "0")}:${offsetMinutes.toString().padStart(2, "0")}`;

    return `${fecha}:00${offsetStr}`;
  }

  return `${fecha}T00:00:00`;
};

const FormMantenimiento = ({ mantenimiento, onSuccess, moneda }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { data: equipos, isLoading: isLoadingEquipos } =
    useGetEquiposMaquinariaActivos();

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CrearMantenimientoInterface>({
    defaultValues: {
      equipoId: "",
      tipo: "",
      descripcion: "",
      fecha_inicio: "",
      fecha_final: "",
      costo: 0,
      proximoMantenimiento: "",
    },
  });

  const queryClient = useQueryClient();
  const isEditing = !!mantenimiento;
  const tipoMantenimiento = watch("tipo");
  const fechaInicio = watch("fecha_inicio");
  const fechaFinal = watch("fecha_final");

  useEffect(() => {
    if (mantenimiento) {
      setValue("equipoId", mantenimiento.equipo.id);
      setValue("tipo", mantenimiento.tipo);
      setValue("descripcion", mantenimiento.descripcion);

      const fechaInicioFormateada = formatearFechaParaInput(
        mantenimiento.fecha_inicio,
      );
      const fechaFinalFormateada = formatearFechaParaInput(
        mantenimiento.fecha_final,
      );

      setValue("fecha_inicio", fechaInicioFormateada);
      setValue("fecha_final", fechaFinalFormateada);
      setValue("costo", Number(mantenimiento.costo));
      setValue(
        "proximoMantenimiento",
        formatearFechaParaInput(mantenimiento.proximoMantenimiento)?.split(
          "T",
        )[0] || "",
      );
    } else {
      reset({
        equipoId: "",
        tipo: "",
        descripcion: "",
        fecha_inicio: "",
        fecha_final: "",
        costo: 0,
        proximoMantenimiento: "",
      });
    }
  }, [mantenimiento, setValue, reset]);

  const validateFechaFinal = (value: string) => {
    if (!fechaInicio || !value) return true;
    return (
      new Date(value) >= new Date(fechaInicio) ||
      "La fecha final debe ser mayor o igual a la fecha de inicio"
    );
  };

  const onSubmit = async (data: CrearMantenimientoInterface) => {
    try {
      const dataToSend = {
        ...data,
        fecha_inicio: formatearFechaParaEnviar(data.fecha_inicio),
        fecha_final: formatearFechaParaEnviar(data.fecha_final),
        proximoMantenimiento: data.proximoMantenimiento
          ? `${data.proximoMantenimiento}T00:00:00`
          : "",
        costo: Number(data.costo),
      };

      if (isEditing && mantenimiento) {
        await editarMantenimiento(mantenimiento.id, dataToSend);
        toast.success("Mantenimiento actualizado correctamente");
      } else {
        await ingresarMantenimiento(dataToSend);
        toast.success("Mantenimiento registrado correctamente");
      }

      reset();
      queryClient.invalidateQueries({ queryKey: ["mantenimientos"] });
      queryClient.invalidateQueries({ queryKey: ["equipos-activos"] });
      queryClient.invalidateQueries({ queryKey: ["equipos-maquinaria"] });
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
            : "Hubo un error al registrar el mantenimiento";
        setErrorMessage(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    }
  };

  if (isLoadingEquipos) {
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
            Error al {isEditing ? "actualizar" : "registrar"} el Mantenimiento
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="equipo">
            Equipo <span className="text-red-500">*</span>
          </Label>

          {!isEditing ? (
            <div className="space-y-2">
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
                    {equipos && equipos.length === 0 ? (
                      <div className="px-2 py-4 text-center text-sm text-muted-foreground">
                        No hay equipos activos disponibles
                      </div>
                    ) : (
                      equipos?.map((equipo: Equipo) => (
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
            </div>
          ) : (
            <div className="w-full p-2 border rounded-md bg-muted/50">
              {mantenimiento?.equipo && (
                <div>
                  <div className="font-medium">
                    {mantenimiento.equipo.nombre}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {mantenimiento.equipo.marca} {mantenimiento.equipo.modelo} -{" "}
                    {mantenimiento.finca.nombre}
                  </div>
                </div>
              )}
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
          <Label htmlFor="tipo">
            Tipo de Mantenimiento <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("tipo")}
            onValueChange={(value) => setValue("tipo", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className={errors.tipo ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipos de Mantenimiento</SelectLabel>
                <SelectItem value="PREVENTIVO">Preventivo</SelectItem>
                <SelectItem value="CORRECTIVO">Correctivo</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.tipo && (
            <p className="text-sm text-red-500 mt-1">{errors.tipo.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="costo">
            Costo ({moneda}) <span className="text-red-500">*</span>
          </Label>
          <Input
            id="costo"
            type="number"
            step="0.01"
            min="0"
            {...register("costo", {
              required: "El costo es requerido",
              min: {
                value: 0,
                message: "El costo debe ser mayor o igual a 0",
              },
              valueAsNumber: true,
            })}
            placeholder="0.00"
            className={errors.costo ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.costo && (
            <p className="text-sm text-red-500 mt-1">{errors.costo.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="fecha_inicio">
            Fecha y Hora de Inicio <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fecha_inicio"
            type="datetime-local"
            {...register("fecha_inicio", {
              required: "La fecha y hora de inicio es requerida",
            })}
            className={errors.fecha_inicio ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.fecha_inicio && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fecha_inicio.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="fecha_final">
            Fecha y Hora de Finalización <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fecha_final"
            type="datetime-local"
            {...register("fecha_final", {
              required: "La fecha y hora de finalización es requerida",
              validate: validateFechaFinal,
            })}
            className={errors.fecha_final ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.fecha_final && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fecha_final.message}
            </p>
          )}
        </div>

        {tipoMantenimiento === "PREVENTIVO" && (
          <div>
            <Label htmlFor="proximoMantenimiento">Próximo Mantenimiento</Label>
            <Input
              id="proximoMantenimiento"
              type="date"
              {...register("proximoMantenimiento")}
              disabled={isSubmitting}
            />
            <p className="text-xs text-muted-foreground mt-1">
              * Fecha sugerida para el próximo mantenimiento preventivo
            </p>
          </div>
        )}

        <div className="md:col-span-2">
          <Label htmlFor="descripcion">
            Descripción <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="descripcion"
            {...register("descripcion", {
              required: "La descripción es requerida",
              maxLength: {
                value: 500,
                message: "La descripción no puede exceder los 500 caracteres",
              },
            })}
            placeholder="Describa el mantenimiento realizado, piezas cambiadas, observaciones, etc."
            rows={4}
            className={errors.descripcion ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.descripcion && (
            <p className="text-sm text-red-500 mt-1">
              {errors.descripcion.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            {watch("descripcion")?.length || 0}/500 caracteres
          </p>
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
            "Actualizar Mantenimiento"
          ) : (
            "Registrar Mantenimiento"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormMantenimiento;
