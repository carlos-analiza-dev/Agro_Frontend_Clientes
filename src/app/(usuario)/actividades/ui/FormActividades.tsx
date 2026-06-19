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
import { Loader2, Search, X } from "lucide-react";
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
import { cn } from "@/lib/utils";

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
  const [searchTrabajadorTerm, setSearchTrabajadorTerm] = useState<string>("");
  const [isTrabajadorSearchOpen, setIsTrabajadorSearchOpen] =
    useState<boolean>(false);

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

  const filteredTrabajadores =
    trabajadores?.filter((trabajador: any) => {
      const searchTerm = searchTrabajadorTerm.toLowerCase().trim();
      if (!searchTerm) return true;

      const nombre = trabajador.nombre?.toLowerCase() || "";
      const identificacion = trabajador.identificacion?.toLowerCase() || "";
      const email = trabajador.email?.toLowerCase() || "";
      const telefono = trabajador.telefono?.toLowerCase() || "";

      return (
        nombre.includes(searchTerm) ||
        identificacion.includes(searchTerm) ||
        email.includes(searchTerm) ||
        telefono.includes(searchTerm)
      );
    }) || [];

  const selectedTrabajador = trabajadores?.find(
    (trabajador: any) => trabajador.id === currentTrabajadorId,
  );

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
    setSearchTrabajadorTerm("");
    setIsTrabajadorSearchOpen(false);
  };

  const handleSelectTrabajador = (trabajadorId: string) => {
    setValue("trabajadorId", trabajadorId);
    setSearchTrabajadorTerm("");
    setIsTrabajadorSearchOpen(false);
  };

  const handleClearTrabajador = () => {
    setValue("trabajadorId", "");
    setSearchTrabajadorTerm("");
    setIsTrabajadorSearchOpen(false);
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
          <Label htmlFor="trabajadorSearch">
            Trabajador <span className="text-red-500">*</span>
          </Label>
          {isEditing ? (
            <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
              <span className="text-sm">
                {actividad?.trabajador?.nombre || "No asignado"}
              </span>
            </div>
          ) : (
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
                <input
                  type="text"
                  id="trabajadorSearch"
                  placeholder={
                    selectedTrabajador
                      ? `${selectedTrabajador.nombre}`
                      : "Buscar trabajador por nombre, identificación, email o teléfono..."
                  }
                  value={searchTrabajadorTerm}
                  onChange={(e) => {
                    setSearchTrabajadorTerm(e.target.value);
                    setIsTrabajadorSearchOpen(true);
                  }}
                  onFocus={() => setIsTrabajadorSearchOpen(true)}
                  className={cn(
                    "w-full pl-9 pr-10 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
                    selectedTrabajador && "bg-blue-50 border-blue-300",
                    errors.trabajadorId && "border-red-500",
                  )}
                />
                {selectedTrabajador && (
                  <button
                    type="button"
                    onClick={handleClearTrabajador}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {isTrabajadorSearchOpen && searchTrabajadorTerm && (
                <div className="absolute z-50 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-y-auto bg-white">
                  {filteredTrabajadores.length > 0 ? (
                    filteredTrabajadores.map((trabajador: any) => (
                      <div
                        key={trabajador.id}
                        onClick={() => handleSelectTrabajador(trabajador.id)}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50",
                          currentTrabajadorId === trabajador.id && "bg-blue-50",
                        )}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {trabajador.nombre}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
                            {trabajador.identificacion && (
                              <span className="truncate">
                                ID: {trabajador.identificacion}
                              </span>
                            )}
                            {trabajador.telefono && (
                              <span>• {trabajador.telefono}</span>
                            )}
                            {trabajador.email && (
                              <span className="truncate">
                                • {trabajador.email}
                              </span>
                            )}
                          </div>
                        </div>
                        {currentTrabajadorId === trabajador.id && (
                          <div className="h-2 w-2 rounded-full bg-blue-600 flex-shrink-0" />
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-sm">
                      <p className="text-gray-500">
                        No se encontraron trabajadores
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Intenta con otro término de búsqueda
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {!isEditing && selectedTrabajador && !searchTrabajadorTerm && (
            <div className="mt-2 p-2 bg-blue-50 rounded-md border border-blue-200">
              <div className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">
                    {selectedTrabajador.nombre}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-gray-600 flex-wrap">
                    {selectedTrabajador.identificacion && (
                      <span className="truncate">
                        ID: {selectedTrabajador.identificacion}
                      </span>
                    )}
                    {selectedTrabajador.telefono && (
                      <span>• {selectedTrabajador.telefono}</span>
                    )}
                    {selectedTrabajador.email && (
                      <span className="truncate">
                        • {selectedTrabajador.email}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
