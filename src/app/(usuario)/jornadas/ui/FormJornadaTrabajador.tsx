"use client";
import { CrearJornadaInterface } from "@/api/jornadas-trabajador/interface/crear-jornada.interface";
import { Jornada } from "@/api/jornadas-trabajador/interface/response-jornadas.interface";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  Search,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { CreateJornadaTrabajador } from "@/api/jornadas-trabajador/accions/crear-jornada";
import { EditarJornadaTrabajador } from "@/api/jornadas-trabajador/accions/editar-jornada";
import useGetAllTrabajadores from "@/hooks/trabajadores/useGetAllTrabajadores";
import { cn } from "@/lib/utils";

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
  const [searchTrabajadorTerm, setSearchTrabajadorTerm] = useState<string>("");
  const [isTrabajadorSearchOpen, setIsTrabajadorSearchOpen] =
    useState<boolean>(false);

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
  const currentTrabajadorId = watch("trabajadorId");

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
    setSearchTrabajadorTerm("");
    setIsTrabajadorSearchOpen(false);
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
              <Label htmlFor="trabajadorSearch">
                Trabajador <span className="text-red-500">*</span>
              </Label>
              {isEditing ? (
                <div className="flex items-center h-10 px-3 border rounded-md bg-gray-50">
                  <span className="text-sm">
                    {jornada?.trabajador?.nombre || "No asignado"}
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
                      disabled={loadingTrabajadores}
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
                      {loadingTrabajadores ? (
                        <div className="py-6 text-center text-sm text-gray-500">
                          Cargando trabajadores...
                        </div>
                      ) : filteredTrabajadores.length > 0 ? (
                        filteredTrabajadores.map((trabajador: any) => (
                          <div
                            key={trabajador.id}
                            onClick={() =>
                              handleSelectTrabajador(trabajador.id)
                            }
                            className={cn(
                              "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-gray-50",
                              currentTrabajadorId === trabajador.id &&
                                "bg-blue-50",
                            )}
                          >
                            <User className="h-4 w-4 text-gray-400 flex-shrink-0" />
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
                    <User className="h-4 w-4 text-blue-600 flex-shrink-0" />
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
