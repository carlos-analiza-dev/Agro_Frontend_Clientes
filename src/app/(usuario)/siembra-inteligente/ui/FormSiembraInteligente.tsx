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
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { SiembraInteligenteInterface } from "@/api/diagnostico/interface/consulta-siembra.interface";
import { ObtenerConsultaSiembra } from "@/api/diagnostico/accions/obtener-siembra-agricola";
import {
  tiposClima,
  tiposTerreno,
  unidadesMedida,
} from "@/helpers/data/consulta-inteligente/tipos";

interface Props {
  setConsultaResultado: (value: string | null) => void;
  setIsPending: (value: boolean) => void;
  setCultivoValue: (value: string) => void;
  setTipoTerrenoValue: (value: string) => void;
  setClimaValue: (value: string) => void;
  setAreaValue: (value: number) => void;
  setUnidadValue: (value: string) => void;
}

const FormSiembraInteligente = ({
  setConsultaResultado,
  setIsPending,
  setCultivoValue,
  setTipoTerrenoValue,
  setClimaValue,
  setAreaValue,
  setUnidadValue,
}: Props) => {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [unidadMedida, setUnidadMedida] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors: formErrors },
  } = useForm<SiembraInteligenteInterface>({
    defaultValues: {
      cultivo: "",
      tipoTerreno: "",
      clima: "",
      area: undefined,
      unidad: "",
    },
  });

  const cultivoValue = watch("cultivo");
  const tipoTerrenoValue = watch("tipoTerreno");
  const climaValue = watch("clima");
  const areaValue = watch("area");
  const unidadValue = watch("unidad");

  useEffect(() => {
    setCultivoValue(cultivoValue || "");
    setTipoTerrenoValue(tipoTerrenoValue || "");
    setClimaValue(climaValue || "");
    setAreaValue(areaValue || 0);
    setUnidadValue(unidadValue || "");
  }, [
    cultivoValue,
    tipoTerrenoValue,
    climaValue,
    areaValue,
    unidadValue,
    setCultivoValue,
    setTipoTerrenoValue,
    setClimaValue,
    setAreaValue,
    setUnidadValue,
  ]);

  const mutation = useMutation({
    mutationFn: (data: SiembraInteligenteInterface) =>
      ObtenerConsultaSiembra(data),
    onSuccess: (response) => {
      setConsultaResultado(response.respuesta);
      toast.success(
        "Recomendación de densidad de siembra generada exitosamente",
      );
      setErrors({});
      setIsPending(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : messages || "Error al generar recomendación";
        toast.error(errorMessage);
      } else {
        toast.error("Error al conectar con el servicio de densidad de siembra");
      }
      setIsPending(false);
    },
  });

  const validateForm = (data: SiembraInteligenteInterface): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.cultivo) {
      newErrors.cultivo = "El cultivo es requerido";
    }

    if (!data.tipoTerreno) {
      newErrors.tipoTerreno = "El tipo de terreno es requerido";
    }

    if (!data.clima) {
      newErrors.clima = "El clima es requerido";
    }

    if (!data.area || data.area <= 0) {
      newErrors.area = "El área debe ser mayor a 0";
    }

    if (!data.unidad) {
      newErrors.unidad = "La unidad de medida es requerida";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (data: SiembraInteligenteInterface) => {
    if (!validateForm(data)) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsPending(true);
    mutation.mutate(data);
  };

  const handleTipoTerrenoChange = (terrenoNombre: string) => {
    setValue("tipoTerreno", terrenoNombre);
    if (errors.tipoTerreno) {
      setErrors((prev) => ({ ...prev, tipoTerreno: "" }));
    }
  };

  const handleClimaChange = (climaNombre: string) => {
    setValue("clima", climaNombre);
    if (errors.clima) {
      setErrors((prev) => ({ ...prev, clima: "" }));
    }
  };

  const handleUnidadChange = (unidad: string) => {
    setUnidadMedida(unidad);
    setValue("unidad", unidad);
    if (errors.unidad) {
      setErrors((prev) => ({ ...prev, unidad: "" }));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cultivo" className="font-bold">
          Cultivo <span className="text-red-500">*</span>
        </Label>
        <Input
          id="cultivo"
          placeholder="Ej: Maíz, Frijol, Tomate, Café, etc."
          className={errors.cultivo ? "border-red-500" : ""}
          {...register("cultivo")}
        />
        {errors.cultivo && (
          <p className="text-sm font-medium text-red-500">{errors.cultivo}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipoTerreno" className="font-bold">
          Tipo de Terreno <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={handleTipoTerrenoChange}
          value={tipoTerrenoValue}
        >
          <SelectTrigger
            id="tipoTerreno"
            className={errors.tipoTerreno ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Selecciona el tipo de terreno" />
          </SelectTrigger>
          <SelectContent>
            {tiposTerreno.map((terreno) => (
              <SelectItem key={terreno.id} value={terreno.nombre}>
                {terreno.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.tipoTerreno && (
          <p className="text-sm font-medium text-red-500">
            {errors.tipoTerreno}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="clima" className="font-bold">
          Clima <span className="text-red-500">*</span>
        </Label>
        <Select onValueChange={handleClimaChange} value={climaValue}>
          <SelectTrigger
            id="clima"
            className={errors.clima ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Selecciona el clima de tu zona" />
          </SelectTrigger>
          <SelectContent>
            {tiposClima.map((clima) => (
              <SelectItem key={clima.id} value={clima.nombre}>
                {clima.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.clima && (
          <p className="text-sm font-medium text-red-500">{errors.clima}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label className="font-bold">
          Unidad de Medida <span className="text-red-500">*</span>
        </Label>
        <div className="space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {unidadesMedida.map((medida) => (
              <div key={medida.value} className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={medida.value}
                  name="unidadMedida"
                  checked={unidadMedida === medida.value}
                  onChange={() => handleUnidadChange(medida.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <label
                  htmlFor={medida.value}
                  className="text-sm font-medium leading-none cursor-pointer"
                >
                  {medida.label}
                </label>
              </div>
            ))}
          </div>
          {errors.unidad && (
            <p className="text-sm font-medium text-red-500">{errors.unidad}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="area" className="font-bold">
          Área del Terreno <span className="text-red-500">*</span>
        </Label>
        <Input
          id="area"
          type="number"
          step="0.1"
          min={0.1}
          placeholder={`Ej: 5.5 ${unidadMedida ? `(${unidadMedida})` : ""}`}
          className={errors.area ? "border-red-500" : ""}
          {...register("area", {
            valueAsNumber: true,
          })}
        />
        {errors.area && (
          <p className="text-sm font-medium text-red-500">{errors.area}</p>
        )}
        {unidadMedida && (
          <p className="text-xs text-muted-foreground">
            El área ingresada está en{" "}
            {unidadesMedida.find((u) => u.value === unidadMedida)?.label}
          </p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Calculando densidad óptima...
          </>
        ) : (
          "Calcular Densidad de Siembra"
        )}
      </Button>
    </form>
  );
};

export default FormSiembraInteligente;
