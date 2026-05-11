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
import { AlertCircleIcon, CalendarDays, Sprout } from "lucide-react";
import { CrearCultivoInterface } from "@/api/cultivos/interface/crear-cultivo.interface";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { Cultivo } from "@/api/cultivos/interface/response-cultivos.interface";
import { TipoCultivoEnum } from "@/interfaces/enums/cultivos/tipo-cultivo.enums";
import { editarCultivo } from "@/api/cultivos/accions/editar-cultivo";
import { ingresarCultivo } from "@/api/cultivos/accions/crear-cultivo";
import { ciclosCultivo } from "@/helpers/data/cultivos/estados-cultivo";
import { formatDate } from "@/helpers/funciones/formatDate";

interface Props {
  fincas: Finca[] | undefined;
  cultivo?: Cultivo | null;
  onSuccess: () => void;
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

const calcularFechaCosecha = (
  fechaSiembra: string,
  tipoCultivo: TipoCultivoEnum,
): string => {
  if (!fechaSiembra || !tipoCultivo) return "";

  const ciclo = ciclosCultivo[tipoCultivo];
  if (!ciclo) return "";

  const fechaSiembraDate = new Date(fechaSiembra);
  const fechaCosechaDate = new Date(fechaSiembraDate);
  fechaCosechaDate.setDate(fechaCosechaDate.getDate() + ciclo.maduracion);

  return fechaCosechaDate.toISOString().split("T")[0];
};

const FormCultivo = ({ fincas, cultivo, onSuccess }: Props) => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [fechaCosechaSugerida, setFechaCosechaSugerida] = useState<string>("");
  const queryClient = useQueryClient();
  const isEditing = !!cultivo;

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CrearCultivoInterface>({
    defaultValues: {
      nombre_cultivo: "",
      variedad: "",
      tipo_cultivo: TipoCultivoEnum.MAIZ,
      area_sembrada: 0,
      fecha_siembra: new Date().toISOString().split("T")[0],
      fecha_cosecha_estimada: "",
      temporada: "",
      fincaId: "",
    },
  });

  const tipoCultivoSeleccionado = watch("tipo_cultivo");
  const fechaSiembraSeleccionada = watch("fecha_siembra");
  const fincaIdSeleccionada = watch("fincaId");
  const fincaSeleccionada = fincas?.find((f) => f.id === fincaIdSeleccionada);

  useEffect(() => {
    if (tipoCultivoSeleccionado && fechaSiembraSeleccionada) {
      const fechaCosecha = calcularFechaCosecha(
        fechaSiembraSeleccionada,
        tipoCultivoSeleccionado,
      );

      if (fechaCosecha) {
        setFechaCosechaSugerida(fechaCosecha);

        const currentFechaCosecha = watch("fecha_cosecha_estimada");
        if (!currentFechaCosecha || (!isEditing && !cultivo)) {
          setValue("fecha_cosecha_estimada", fechaCosecha);
        }
      }
    } else {
      setFechaCosechaSugerida("");
    }
  }, [
    tipoCultivoSeleccionado,
    fechaSiembraSeleccionada,
    setValue,
    isEditing,
    cultivo,
    watch,
  ]);

  useEffect(() => {
    if (cultivo) {
      setValue("nombre_cultivo", cultivo.nombre_cultivo || "");
      setValue("variedad", cultivo.variedad || "");
      setValue("tipo_cultivo", cultivo.tipo_cultivo || TipoCultivoEnum.MAIZ);
      setValue(
        "area_sembrada",
        parseFloat(cultivo.area_sembrada as string) || 0,
      );
      setValue("fecha_siembra", formatearFecha(cultivo.fecha_siembra));
      setValue(
        "fecha_cosecha_estimada",
        formatearFecha(cultivo.fecha_cosecha_estimada),
      );
      setValue("temporada", cultivo.temporada || "");
      setValue("fincaId", cultivo.finca?.id || "");
    } else {
      reset({
        nombre_cultivo: "",
        variedad: "",
        tipo_cultivo: TipoCultivoEnum.MAIZ,
        area_sembrada: 0,
        fecha_siembra: new Date().toISOString().split("T")[0],
        fecha_cosecha_estimada: "",
        temporada: "",
        fincaId: "",
      });
    }
    setIsLoading(false);
  }, [cultivo, setValue, reset]);

  const onSubmit = async (data: CrearCultivoInterface) => {
    try {
      const dataToSend = {
        ...data,
        area_sembrada: Number(data.area_sembrada),
      };

      if (isEditing && cultivo) {
        await editarCultivo(cultivo.id, dataToSend);
        toast.success("Cultivo actualizado correctamente");
      } else {
        await ingresarCultivo(dataToSend);
        toast.success("Cultivo registrado correctamente");
      }

      reset();
      queryClient.invalidateQueries({ queryKey: ["cultivos"] });

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
            : "Hubo un error al registrar el cultivo";
        setErrorMessage(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  const tiposCultivoOptions = Object.entries(TipoCultivoEnum).map(
    ([key, value]) => ({
      key,
      value,
    }),
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {errorMessage && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircleIcon className="h-4 w-4" />
          <AlertTitle>
            Error al {isEditing ? "actualizar" : "registrar"} el Cultivo
          </AlertTitle>
          <AlertDescription className="whitespace-pre-line">
            {errorMessage}
          </AlertDescription>
        </Alert>
      )}

      {fechaSiembraSeleccionada && (
        <Alert className="bg-green-50 border-green-200 dark:bg-green-950">
          <Sprout className="h-4 w-4 text-green-600" />
          <AlertTitle className="text-green-800 dark:text-green-300">
            Información del ciclo
          </AlertTitle>
          <AlertDescription className="text-green-700 dark:text-green-300 text-sm">
            <p className="text-xs text-green-600 dark:text-green-400 mt-1">
              💡 Según el ciclo de {tipoCultivoSeleccionado}, la cosecha
              estimada sería el {formatDate(fechaCosechaSugerida)}
            </p>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <Label htmlFor="nombre_cultivo">
            Nombre del Cultivo <span className="text-red-500">*</span>
          </Label>
          <Input
            id="nombre_cultivo"
            {...register("nombre_cultivo", {
              required: "El nombre del cultivo es requerido",
              maxLength: {
                value: 150,
                message: "El nombre no puede exceder los 150 caracteres",
              },
            })}
            placeholder="Ej: Maíz Híbrido Blanco"
            className={errors.nombre_cultivo ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.nombre_cultivo && (
            <p className="text-sm text-red-500 mt-1">
              {errors.nombre_cultivo.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="tipo_cultivo">
            Cultivo <span className="text-red-500">*</span>
          </Label>
          <Select
            value={watch("tipo_cultivo")}
            onValueChange={(value) =>
              setValue("tipo_cultivo", value as TipoCultivoEnum)
            }
            disabled={isSubmitting}
          >
            <SelectTrigger
              className={errors.tipo_cultivo ? "border-red-500" : ""}
            >
              <SelectValue placeholder="Seleccionar tipo de cultivo" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Tipos de Cultivo</SelectLabel>
                {tiposCultivoOptions.map((tipo) => (
                  <SelectItem key={tipo.key} value={tipo.value}>
                    {tipo.value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.tipo_cultivo && (
            <p className="text-sm text-red-500 mt-1">
              {errors.tipo_cultivo.message}
            </p>
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
                {fincas?.map((finca) => (
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
          <Label htmlFor="variedad">Variedad</Label>
          <Input
            id="variedad"
            {...register("variedad", {
              maxLength: {
                value: 100,
                message: "La variedad no puede exceder los 100 caracteres",
              },
            })}
            placeholder="Ej: NB-6, Híbrido blanco"
            className={errors.variedad ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.variedad && (
            <p className="text-sm text-red-500 mt-1">
              {errors.variedad.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="area_sembrada">
            Área Sembrada{" "}
            {fincaIdSeleccionada && `- ${fincaSeleccionada?.medida_finca}`}{" "}
            <span className="text-red-500">*</span>
          </Label>
          <Input
            id="area_sembrada"
            type="number"
            step="0.01"
            min="0.01"
            {...register("area_sembrada", {
              required: "El área sembrada es requerida",
              min: {
                value: 0.01,
                message: "El área debe ser mayor a 0",
              },
              valueAsNumber: true,
            })}
            placeholder="Ej: 5.5"
            className={errors.area_sembrada ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.area_sembrada && (
            <p className="text-sm text-red-500 mt-1">
              {errors.area_sembrada.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="temporada">Temporada</Label>
          <Input
            id="temporada"
            {...register("temporada", {
              maxLength: {
                value: 50,
                message: "La temporada no puede exceder los 50 caracteres",
              },
            })}
            placeholder="Ej: Primera, Segunda, Postrera"
            className={errors.temporada ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.temporada && (
            <p className="text-sm text-red-500 mt-1">
              {errors.temporada.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="fecha_siembra">
            Fecha de Siembra <span className="text-red-500">*</span>
          </Label>
          <Input
            id="fecha_siembra"
            type="date"
            {...register("fecha_siembra", {
              required: "La fecha de siembra es requerida",
            })}
            className={errors.fecha_siembra ? "border-red-500" : ""}
            disabled={isSubmitting}
          />
          {errors.fecha_siembra && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fecha_siembra.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="fecha_cosecha_estimada">
            Fecha Estimada de Cosecha
            {fechaCosechaSugerida && (
              <span className="text-xs text-muted-foreground ml-2">
                (Sugerida: {formatDate(fechaCosechaSugerida)})
              </span>
            )}
          </Label>
          <div className="relative">
            <CalendarDays className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="fecha_cosecha_estimada"
              type="date"
              {...register("fecha_cosecha_estimada")}
              className={`pl-9 ${errors.fecha_cosecha_estimada ? "border-red-500" : ""}`}
              disabled={isSubmitting}
            />
          </div>
          {errors.fecha_cosecha_estimada && (
            <p className="text-sm text-red-500 mt-1">
              {errors.fecha_cosecha_estimada.message}
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
            "Actualizar Cultivo"
          ) : (
            "Registrar Cultivo"
          )}
        </Button>
      </div>
    </form>
  );
};

export default FormCultivo;
