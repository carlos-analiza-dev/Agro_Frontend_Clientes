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
import { Textarea } from "@/components/ui/textarea";
import React, { useEffect, useState } from "react";
import SummarySymtomps from "./SummarySymtomps";
import { Loader2, Plus } from "lucide-react";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useForm } from "react-hook-form";
import { ConsultarDiagnosticoInterface } from "@/api/diagnostico/interface/consultar-diagnostico.interface";
import { ObtenerDiagnostico } from "@/api/diagnostico/accions/obtener-diagnosticos";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ResponseEspecies } from "@/api/especies/interfaces/response-especies.interface";

interface Props {
  setDiagnosticoResultado: (value: string | null) => void;
  setIsPending: (value: boolean) => void;
  setSintomasValue: (value: string[]) => void;
  setEspecieValue: (value: string) => void;
  setRazaValue: (value: string) => void;
  setEdadValue: (value: number) => void;
}

const FormDiagnostico = ({
  setDiagnosticoResultado,
  setIsPending,
  setSintomasValue,
  setEspecieValue,
  setRazaValue,
  setEdadValue,
}: Props) => {
  const [selectedEspecieId, setSelectedEspecieId] = useState<string>("");
  const [selectedEspecieNombre, setSelectedEspecieNombre] =
    useState<string>("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sintomasInput, setSintomasInput] = useState<string>("");

  const { data: especies, isLoading: isLoadingEspecies } = useGetEspecies();
  const { data: razas, isLoading: isLoadingRazas } =
    useGetRazasByEspecie(selectedEspecieId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors: formErrors },
  } = useForm<ConsultarDiagnosticoInterface>({
    defaultValues: {
      especie: "",
      raza: "",
      edad: undefined,
      sintomas: [],
    },
  });

  const especieValue = watch("especie");
  const razaValue = watch("raza");
  const edadValue = watch("edad");
  const sintomasValue = watch("sintomas");

  useEffect(() => {
    setEspecieValue(especieValue || "");
    setRazaValue(razaValue || "");
    setEdadValue(edadValue || 0);
    setSintomasValue(sintomasValue || []);
  }, [
    especieValue,
    razaValue,
    edadValue,
    sintomasValue,
    setEspecieValue,
    setRazaValue,
    setEdadValue,
    setSintomasValue,
  ]);

  useEffect(() => {
    if (selectedEspecieId) {
      setValue("raza", "");
    }
  }, [selectedEspecieId, setValue]);

  const mutation = useMutation({
    mutationFn: (data: ConsultarDiagnosticoInterface) =>
      ObtenerDiagnostico(data),
    onSuccess: (response) => {
      setDiagnosticoResultado(response.diagnostico);
      toast.success("Diagnóstico generado exitosamente");
      setErrors({});
      setIsPending(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : messages || "Error al generar diagnóstico";
        toast.error(errorMessage);
      } else {
        toast.error("Error al conectar con el servicio de diagnóstico");
      }
      setIsPending(false);
    },
  });

  const validateForm = (data: ConsultarDiagnosticoInterface): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.especie) {
      newErrors.especie = "La especie es requerida";
    }

    if (!data.raza) {
      newErrors.raza = "La raza es requerida";
    }

    if (!data.edad || data.edad <= 0) {
      newErrors.edad = "La edad debe ser mayor a 0";
    } else if (data.edad > 30) {
      newErrors.edad = "La edad no puede ser mayor a 30 años";
    }

    if (!data.sintomas || data.sintomas.length === 0) {
      newErrors.sintomas = "Los síntomas son requeridos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (data: ConsultarDiagnosticoInterface) => {
    const formattedData = {
      ...data,
      sintomas: Array.isArray(data.sintomas) ? data.sintomas : [],
    };

    if (!validateForm(formattedData)) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    setIsPending(true);
    mutation.mutate(formattedData);
  };

  const handleEspecieChange = (especieId: string) => {
    const especieSeleccionada = especies?.data.find(
      (e: ResponseEspecies) => e.id === especieId,
    );

    setSelectedEspecieId(especieId);
    setSelectedEspecieNombre(especieSeleccionada?.nombre || "");
    setValue("especie", especieSeleccionada?.nombre || "");

    if (errors.especie) {
      setErrors((prev) => ({ ...prev, especie: "" }));
    }
  };

  const handleRazaChange = (razaNombre: string) => {
    setValue("raza", razaNombre);
    if (errors.raza) {
      setErrors((prev) => ({ ...prev, raza: "" }));
    }
  };

  const handleSintomasInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setSintomasInput(e.target.value);
  };

  const agregarSintoma = () => {
    if (!sintomasInput.trim()) return;

    const nuevoSintoma = sintomasInput.trim();

    if (nuevoSintoma.length === 0) return;

    if (sintomasValue.includes(nuevoSintoma)) {
      toast.info("Este síntoma ya fue agregado");
      setSintomasInput("");
      return;
    }

    const sintomasActualizados = [...sintomasValue, nuevoSintoma];
    setValue("sintomas", sintomasActualizados);

    setSintomasInput("");

    if (errors.sintomas) {
      setErrors((prev) => ({ ...prev, sintomas: "" }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      agregarSintoma();
    }
  };

  const eliminarSintoma = (index: number) => {
    const nuevosSintomas = sintomasValue.filter((_, i) => i !== index);
    setValue("sintomas", nuevosSintomas);
  };

  const limpiarSintomas = () => {
    setValue("sintomas", []);
    setSintomasInput("");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="especie" className="font-bold">
          Especie <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={handleEspecieChange}
          value={selectedEspecieId}
          disabled={isLoadingEspecies}
        >
          <SelectTrigger
            id="especie"
            className={errors.especie ? "border-red-500" : ""}
          >
            <SelectValue placeholder="Selecciona la especie" />
          </SelectTrigger>
          <SelectContent>
            {especies?.data.map((especie: ResponseEspecies) => (
              <SelectItem key={especie.id} value={especie.id}>
                {especie.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.especie && (
          <p className="text-sm font-medium text-red-500">{errors.especie}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="raza" className="font-bold">
          Raza <span className="text-red-500">*</span>
        </Label>
        <Select
          onValueChange={handleRazaChange}
          value={razaValue}
          disabled={!selectedEspecieId || isLoadingRazas}
        >
          <SelectTrigger
            id="raza"
            className={errors.raza ? "border-red-500" : ""}
          >
            <SelectValue
              placeholder={
                isLoadingRazas
                  ? "Cargando razas..."
                  : !selectedEspecieId
                    ? "Primero selecciona una especie"
                    : "Selecciona la raza"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {razas?.data.map((raza) => (
              <SelectItem key={raza.id} value={raza.nombre}>
                {raza.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {errors.raza && (
          <p className="text-sm font-medium text-red-500">{errors.raza}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="edad" className="font-bold">
          Edad (años) <span className="text-red-500">*</span>
        </Label>
        <Input
          id="edad"
          type="number"
          step="0.1"
          min={0}
          max={30}
          placeholder="Ej: 3"
          className={errors.edad ? "border-red-500" : ""}
          {...register("edad", {
            valueAsNumber: true,
          })}
        />
        {errors.edad && (
          <p className="text-sm font-medium text-red-500">{errors.edad}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="sintomas" className="font-bold">
          Síntomas <span className="text-red-500">*</span>
        </Label>

        <div className="flex flex-col sm:flex-row gap-2">
          <Textarea
            id="sintomas"
            placeholder="Escribe un síntoma y presiona Enter o haz clic en Agregar"
            className={`min-h-[80px] w-full sm:flex-1 ${
              errors.sintomas ? "border-red-500" : ""
            }`}
            value={sintomasInput}
            onChange={handleSintomasInputChange}
            onKeyDown={handleKeyDown}
          />

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={agregarSintoma}
              className="flex-1 sm:flex-none h-10"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar
            </Button>

            {sintomasValue?.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                onClick={limpiarSintomas}
                className="flex-1 sm:flex-none h-10 text-red-500 hover:text-red-600"
              >
                Limpiar
              </Button>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Escribe un síntoma y presiona Enter o haz clic en "Agregar"
        </p>

        {errors.sintomas && (
          <p className="text-sm font-medium text-red-500">{errors.sintomas}</p>
        )}
      </div>

      {Array.isArray(sintomasValue) && sintomasValue.length > 0 && (
        <SummarySymtomps
          sintomasValue={sintomasValue}
          eliminarSintoma={eliminarSintoma}
        />
      )}

      <Button type="submit" className="w-full" disabled={mutation.isPending}>
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generando diagnóstico...
          </>
        ) : (
          "Obtener Diagnóstico"
        )}
      </Button>
    </form>
  );
};

export default FormDiagnostico;
