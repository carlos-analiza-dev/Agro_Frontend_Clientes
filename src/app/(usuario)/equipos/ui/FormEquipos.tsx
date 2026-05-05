import { useEffect, useState } from "react";
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
import { CrearEquipoInterface } from "@/api/equipos-maquinaria/interface/crear-equipo.interface";
import { Equipo } from "@/api/equipos-maquinaria/interface/response-equipos.interface";
import { EstadoMaquinaria } from "@/interfaces/enums/maquinaria/maquinaria.enums";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { editarEquipo } from "@/api/equipos-maquinaria/accions/editar-equipo";
import { ingresarEquipo } from "@/api/equipos-maquinaria/accions/ingresar-equipo";
import { TIPOS_EQUIPO } from "@/helpers/data/maquinaria-equipos/tipos-equipos";

interface Props {
  equipo?: Equipo | null;
  onSuccess: () => void;
  moneda: string;
}

const formatearFecha = (fecha: string | Date | undefined): string => {
  if (!fecha) return new Date().toISOString().split("T")[0];

  if (typeof fecha === "string") {
    return fecha.split("T")[0];
  }

  if (fecha instanceof Date) {
    return fecha.toISOString().split("T")[0];
  }

  return new Date().toISOString().split("T")[0];
};

const FormEquipos = ({ equipo, onSuccess, moneda }: Props) => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  const { data: fincas, isLoading: isLoadingFincas } =
    useFincasPropietarios(clienteId);

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CrearEquipoInterface>({
    defaultValues: {
      nombre: "",
      tipo: "",
      marca: "",
      modelo: "",
      numeroSerie: "",
      fechaCompra: new Date().toISOString().split("T")[0],
      costoCompra: 0,
      estado: EstadoMaquinaria.ACTIVO,
      horasUso: 0,
      vidaUtilHoras: 0,
      fincaId: "",
    },
  });

  const queryClient = useQueryClient();
  const isEditing = !!equipo;

  useEffect(() => {
    if (equipo) {
      setValue("nombre", equipo.nombre || "");
      setValue("tipo", equipo.tipo || "");
      setValue("marca", equipo.marca || "");
      setValue("modelo", equipo.modelo || "");
      setValue("numeroSerie", equipo.numeroSerie || "");
      setValue("fechaCompra", formatearFecha(equipo.fechaCompra));
      setValue("costoCompra", parseFloat(equipo.costoCompra) || 0);
      setValue("estado", equipo.estado || EstadoMaquinaria.ACTIVO);
      setValue("horasUso", parseFloat(equipo.horasUso) || 0);
      setValue("vidaUtilHoras", parseFloat(equipo.vidaUtilHoras) || 0);
      setValue("fincaId", equipo.fincaId || "");
    } else {
      reset({
        nombre: "",
        tipo: "",
        marca: "",
        modelo: "",
        numeroSerie: "",
        fechaCompra: new Date().toISOString().split("T")[0],
        costoCompra: 0,
        estado: EstadoMaquinaria.ACTIVO,
        horasUso: 0,
        vidaUtilHoras: 0,
        fincaId: "",
      });
    }
    setIsLoading(false);
  }, [equipo, setValue, reset]);

  const onSubmit = async (data: CrearEquipoInterface) => {
    try {
      const dataToSend = {
        ...data,
        costoCompra: Number(data.costoCompra),
        horasUso: Number(data.horasUso),
        vidaUtilHoras: Number(data.vidaUtilHoras),
      };

      if (isEditing && equipo) {
        await editarEquipo(equipo.id, dataToSend);
        toast.success("Equipo actualizado correctamente");
      } else {
        await ingresarEquipo(dataToSend);
        toast.success("Equipo registrado correctamente");
      }

      reset();
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
            : "Hubo un error al registrar el equipo";
        setErrorMessage(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    }
  };

  if (isLoading || isLoadingFincas) {
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
            Error al {isEditing ? "actualizar" : "registrar"} el Equipo
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="nombre">
            Nombre del Equipo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nombre"
            {...register("nombre", {
              required: "El nombre del equipo es requerido",
              maxLength: {
                value: 150,
                message: "El nombre no puede exceder los 150 caracteres",
              },
            })}
            placeholder="Ej: Tractor John Deere 5060E"
            className={errors.nombre ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.nombre && (
            <p className="text-sm text-red-500 mt-1">{errors.nombre.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="tipo">
            Tipo de Equipo <span className="text-red-500">*</span>
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
                <SelectLabel>Tipos de Equipo</SelectLabel>
                {TIPOS_EQUIPO.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.tipo && (
            <p className="text-sm text-red-500 mt-1">{errors.tipo.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="fincaId">
            Finca <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("fincaId")}
            onValueChange={(value) => setValue("fincaId", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className={errors.fincaId ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar finca" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Fincas</SelectLabel>
                {fincas?.data?.fincas?.map((finca) => (
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
          <Label htmlFor="marca">Marca</Label>
          <Input
            id="marca"
            {...register("marca", {
              maxLength: {
                value: 100,
                message: "La marca no puede exceder los 100 caracteres",
              },
            })}
            placeholder="Ej: John Deere"
            className={errors.marca ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.marca && (
            <p className="text-sm text-red-500 mt-1">{errors.marca.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="modelo">Modelo</Label>
          <Input
            id="modelo"
            {...register("modelo", {
              maxLength: {
                value: 100,
                message: "El modelo no puede exceder los 100 caracteres",
              },
            })}
            placeholder="Ej: 5060E"
            className={errors.modelo ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.modelo && (
            <p className="text-sm text-red-500 mt-1">{errors.modelo.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="numeroSerie">Número de Serie</Label>
          <Input
            id="numeroSerie"
            {...register("numeroSerie", {
              maxLength: {
                value: 100,
                message:
                  "El número de serie no puede exceder los 100 caracteres",
              },
            })}
            placeholder="Ej: JD5060E2024001"
            className={errors.numeroSerie ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.numeroSerie && (
            <p className="text-sm text-red-500 mt-1">
              {errors.numeroSerie.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="estado">
            Estado <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("estado")}
            onValueChange={(value) => setValue("estado", value)}
            disabled={isSubmitting}
          >
            <SelectTrigger className={errors.estado ? "border-red-500" : ""}>
              <SelectValue placeholder="Seleccionar estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Estados</SelectLabel>
                <SelectItem value={EstadoMaquinaria.ACTIVO}>Activo</SelectItem>
                <SelectItem value={EstadoMaquinaria.MANTENIMIENTO}>
                  Mantenimiento
                </SelectItem>
                <SelectItem value={EstadoMaquinaria.INCACTIVO}>
                  Inactivo
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.estado && (
            <p className="text-sm text-red-500 mt-1">{errors.estado.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="fechaCompra">Fecha de Compra</Label>
          <Input
            id="fechaCompra"
            type="date"
            {...register("fechaCompra")}
            className={errors.fechaCompra ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.fechaCompra && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fechaCompra.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="costoCompra">Costo de Compra ({moneda})</Label>
          <Input
            id="costoCompra"
            type="number"
            step="0.01"
            min="0"
            {...register("costoCompra", {
              min: {
                value: 0,
                message: "El costo debe ser mayor o igual a 0",
              },
              valueAsNumber: true,
            })}
            placeholder="0.00"
            className={errors.costoCompra ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.costoCompra && (
            <p className="text-sm text-red-500 mt-1">
              {errors.costoCompra.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="horasUso">Horas de Uso (Horómetro)</Label>
          <Input
            id="horasUso"
            type="number"
            step="0.5"
            min="0"
            {...register("horasUso", {
              min: {
                value: 0,
                message: "Las horas deben ser mayores o iguales a 0",
              },
              valueAsNumber: true,
            })}
            placeholder="0"
            className={errors.horasUso ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.horasUso && (
            <p className="text-sm text-red-500 mt-1">
              {errors.horasUso.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="vidaUtilHoras">Vida Útil (Horas)</Label>
          <Input
            id="vidaUtilHoras"
            type="number"
            step="100"
            min="0"
            {...register("vidaUtilHoras", {
              min: {
                value: 0,
                message: "La vida útil debe ser mayor o igual a 0",
              },
              valueAsNumber: true,
            })}
            placeholder="Ej: 8000"
            className={errors.vidaUtilHoras ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.vidaUtilHoras && (
            <p className="text-sm text-red-500 mt-1">
              {errors.vidaUtilHoras.message}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">
            * Vida útil estimada del equipo en horas de operación
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
            "Actualizar Equipo"
          ) : (
            "Registrar Equipo"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormEquipos;
