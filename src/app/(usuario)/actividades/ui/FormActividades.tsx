import { CrearActividadInterface } from "@/api/actividades/interfaces/crear-actividad.interface";
import { crearActividad } from "@/api/actividades/accions/crear-actividad";
import { editarActividad } from "@/api/actividades/accions/editar-actividad";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetAllTrabajadores from "@/hooks/trabajadores/useGetAllTrabajadores";
import { Cliente } from "@/interfaces/auth/cliente";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FrecuenciaActividad,
  TipoActividad,
} from "@/interfaces/enums/actividaes.enums";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { format } from "date-fns";
import {
  frecuenciasActividad,
  tiposActividad,
} from "@/helpers/data/actividades/actividadesdData";
import { Input } from "@/components/ui/input";
import { Actividade } from "@/api/actividades/interfaces/response-actividades.interface";

interface Props {
  cliente: Cliente | undefined;
  onSuccess?: () => void;
  actividad?: Actividade | null;
}

const FormActividades = ({ cliente, onSuccess, actividad }: Props) => {
  const propietarioId = cliente?.id ?? "";
  const queryClient = useQueryClient();
  const isEditing = !!actividad;
  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CrearActividadInterface>({
    defaultValues: {
      trabajadorId: "",
      fincaId: "",
      fecha: format(new Date(), "yyyy-MM-dd"),
      tipo: undefined,
      frecuencia: FrecuenciaActividad.DIARIA,
      descripcion: "",
    },
  });

  const { data: trabajadores, isLoading: cargandoTrabajadores } =
    useGetAllTrabajadores();
  const { data: fincas, isLoading: cargandoFincas } =
    useFincasPropietarios(propietarioId);

  const currentTipo = watch("tipo");
  const currentFrecuencia = watch("frecuencia");
  const currentTrabajadorId = watch("trabajadorId");
  const currentFincaId = watch("fincaId");

  useEffect(() => {
    if (actividad && fincas && trabajadores && !isDataLoaded) {
      reset({
        trabajadorId: actividad.trabajador?.id || "",
        fincaId: actividad.finca?.id || "",
        fecha: actividad.fecha,
        tipo: actividad.tipo,
        frecuencia: actividad.frecuencia,
        descripcion: actividad.descripcion || "",
      });

      setIsDataLoaded(true);
    }
  }, [actividad, fincas, trabajadores, reset, isDataLoaded]);

  useEffect(() => {
    setIsDataLoaded(false);
  }, [actividad?.id]);

  const createMutation = useMutation({
    mutationFn: crearActividad,
    onSuccess: () => {
      toast.success("Actividad creada exitosamente");
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["actividades"] });
      onSuccess?.();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear la actividad";
        toast.error(errorMessage);
      } else {
        toast.error("Hubo un error al crear la actividad. Inténtalo de nuevo.");
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CrearActividadInterface>;
    }) => editarActividad(id, data),
    onSuccess: () => {
      toast.success("Actividad actualizada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["actividades"] });
      onSuccess?.();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar la actividad";
        toast.error(errorMessage);
      } else {
        toast.error(
          "Hubo un error al actualizar la actividad. Inténtalo de nuevo.",
        );
      }
    },
  });

  const resetForm = () => {
    reset({
      trabajadorId: "",
      fincaId: "",
      fecha: format(new Date(), "yyyy-MM-dd"),
      tipo: undefined,
      frecuencia: FrecuenciaActividad.DIARIA,
      descripcion: "",
    });
  };

  const onSubmit = (data: CrearActividadInterface) => {
    if (isEditing && actividad) {
      const updateData: Partial<CrearActividadInterface> = {
        fecha: data.fecha,
        tipo: data.tipo,
        frecuencia: data.frecuencia,
        descripcion: data.descripcion,
      };

      if (data.fincaId && data.fincaId !== actividad.finca?.id) {
        updateData.fincaId = data.fincaId;
      }

      updateMutation.mutate({ id: actividad.id, data: updateData });
    } else {
      createMutation.mutate(data);
    }
  };

  const isPending = createMutation.isPending || updateMutation.isPending;

  if (cargandoTrabajadores || cargandoFincas) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="trabajadorId">
            Trabajador <span className="text-red-500">*</span>
          </Label>
          {isEditing ? (
            <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
              <span className="text-sm">
                {actividad?.trabajador?.nombre || "No asignado"}
              </span>
            </div>
          ) : (
            <Select
              value={currentTrabajadorId || ""}
              onValueChange={(value) => setValue("trabajadorId", value)}
            >
              <SelectTrigger
                className={errors.trabajadorId ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Selecciona un trabajador" />
              </SelectTrigger>
              <SelectContent>
                {trabajadores && trabajadores.length > 0 ? (
                  trabajadores.map((trabajador: any) => (
                    <SelectItem key={trabajador.id} value={trabajador.id}>
                      {trabajador.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-trabajadores" disabled>
                    No hay trabajadores disponibles
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          )}
          {errors.trabajadorId && (
            <p className="text-sm font-medium text-red-500">
              {errors.trabajadorId.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fincaId">
            Finca <span className="text-red-500">*</span>
          </Label>
          <Select
            value={currentFincaId || ""}
            onValueChange={(value) => setValue("fincaId", value)}
          >
            <SelectTrigger className={errors.fincaId ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecciona una finca" />
            </SelectTrigger>
            <SelectContent>
              {fincas && fincas.data?.fincas?.length > 0 ? (
                fincas.data.fincas.map((finca: any) => (
                  <SelectItem key={finca.id} value={finca.id}>
                    {finca.nombre_finca || finca.nombre}
                  </SelectItem>
                ))
              ) : (
                <SelectItem value="no-fincas" disabled>
                  No hay fincas disponibles
                </SelectItem>
              )}
            </SelectContent>
          </Select>
          {errors.fincaId && (
            <p className="text-sm font-medium text-red-500">
              {errors.fincaId.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="fecha">
            Fecha <span className="text-red-500">*</span>
          </Label>
          <Input
            type="date"
            {...register("fecha", {
              required: "La fecha es obligatoria",
            })}
            className={errors.fecha ? "border-red-500" : ""}
          />
          {errors.fecha && (
            <p className="text-sm font-medium text-red-500">
              {errors.fecha.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="tipo">
            Tipo de Actividad <span className="text-red-500">*</span>
          </Label>
          <Select
            value={currentTipo || ""}
            onValueChange={(value) => setValue("tipo", value as TipoActividad)}
          >
            <SelectTrigger className={errors.tipo ? "border-red-500" : ""}>
              <SelectValue placeholder="Selecciona un tipo" />
            </SelectTrigger>
            <SelectContent>
              {tiposActividad.map((tipo) => (
                <SelectItem key={tipo.value} value={tipo.value}>
                  {tipo.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.tipo && (
            <p className="text-sm font-medium text-red-500">
              {errors.tipo.message as string}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="frecuencia">Frecuencia</Label>
          <Select
            value={currentFrecuencia || ""}
            onValueChange={(value) =>
              setValue("frecuencia", value as FrecuenciaActividad)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una frecuencia" />
            </SelectTrigger>
            <SelectContent>
              {frecuenciasActividad.map((frecuencia) => (
                <SelectItem key={frecuencia.value} value={frecuencia.value}>
                  {frecuencia.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            placeholder="Describe los detalles de la actividad..."
            className="min-h-[100px] resize-y"
            {...register("descripcion", {
              maxLength: {
                value: 500,
                message: "La descripción no puede tener más de 500 caracteres",
              },
            })}
          />
          {errors.descripcion && (
            <p className="text-sm font-medium text-red-500">
              {errors.descripcion.message as string}
            </p>
          )}
          <p className="text-xs text-muted-foreground text-right">
            {watch("descripcion")?.length || 0}/500 caracteres
          </p>
        </div>
      </div>

      <div className="mt-6">
        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {isEditing ? "Actualizando actividad..." : "Creando actividad..."}
            </>
          ) : (
            <>{isEditing ? "Actualizar Actividad" : "Crear Actividad"}</>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormActividades;
