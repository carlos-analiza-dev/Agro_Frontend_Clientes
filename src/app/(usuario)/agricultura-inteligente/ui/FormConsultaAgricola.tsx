"use client";

import { useTranslations } from "next-intl";
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
import { Loader2, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useMutation } from "@tanstack/react-query";
import { ConsultaAgricolaInterface } from "@/api/diagnostico/interface/consulta-agricola.interface";
import { ObtenerConsultaAgricola } from "@/api/diagnostico/accions/obtener-consulta-agricola";
import SummaryProblemas from "./SummaryProblemas";
import { tiposSuelos } from "@/helpers/data/tiposSuelo";
import { tiposClima } from "@/helpers/data/consulta-inteligente/tipos";

interface Props {
  setConsultaResultado: (value: string | null) => void;
  setIsPending: (value: boolean) => void;
  setCultivoValue: (value: string) => void;
  setTipoSueloValue: (value: string) => void;
  setClimaValue: (value: string) => void;
  setProblemasValue: (value: string[]) => void;
}

const FormConsultaAgricola = ({
  setConsultaResultado,
  setIsPending,
  setCultivoValue,
  setTipoSueloValue,
  setClimaValue,
  setProblemasValue,
}: Props) => {
  const t = useTranslations("formConsultaAgricola");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [problemasInput, setProblemasInput] = useState<string>("");

  const { register, handleSubmit, setValue, watch } =
    useForm<ConsultaAgricolaInterface>({
      defaultValues: {
        cultivo: "",
        tipoSuelo: "",
        clima: "",
        problemas: [],
      },
    });

  const cultivoValue = watch("cultivo");
  const tipoSueloValue = watch("tipoSuelo");
  const climaValue = watch("clima");
  const problemasValue = watch("problemas");

  useEffect(() => {
    setCultivoValue(cultivoValue || "");
    setTipoSueloValue(tipoSueloValue || "");
    setClimaValue(climaValue || "");
    setProblemasValue(problemasValue || []);
  }, [
    cultivoValue,
    tipoSueloValue,
    climaValue,
    problemasValue,
    setCultivoValue,
    setTipoSueloValue,
    setClimaValue,
    setProblemasValue,
  ]);

  const mutation = useMutation({
    mutationFn: (data: ConsultaAgricolaInterface) =>
      ObtenerConsultaAgricola(data),
    onSuccess: (response) => {
      setConsultaResultado(response.respuesta);
      toast.success(t("messages.success"));
      setErrors({});
      setIsPending(false);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : messages || t("errors.generateConsultation");

        toast.error(errorMessage);
      } else {
        toast.error(t("errors.connection"));
      }

      setIsPending(false);
    },
  });

  const validateForm = (data: ConsultaAgricolaInterface): boolean => {
    const newErrors: Record<string, string> = {};

    if (!data.cultivo) {
      newErrors.cultivo = t("validation.cropRequired");
    }

    if (!data.tipoSuelo) {
      newErrors.tipoSuelo = t("validation.soilRequired");
    }

    if (!data.clima) {
      newErrors.clima = t("validation.climateRequired");
    }

    if (!data.problemas || data.problemas.length === 0) {
      newErrors.problemas = t("validation.problemsRequired");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = (data: ConsultaAgricolaInterface) => {
    const formattedData = {
      ...data,
      problemas: Array.isArray(data.problemas) ? data.problemas : [],
    };

    if (!validateForm(formattedData)) {
      toast.error(t("validation.completeRequired"));
      return;
    }

    setIsPending(true);
    mutation.mutate(formattedData);
  };

  const handleTipoSueloChange = (sueloNombre: string) => {
    setValue("tipoSuelo", sueloNombre);

    if (errors.tipoSuelo) {
      setErrors((prev) => ({ ...prev, tipoSuelo: "" }));
    }
  };

  const handleClimaChange = (climaNombre: string) => {
    setValue("clima", climaNombre);

    if (errors.clima) {
      setErrors((prev) => ({ ...prev, clima: "" }));
    }
  };

  const handleProblemasInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    setProblemasInput(e.target.value);
  };

  const agregarProblema = () => {
    if (!problemasInput.trim()) return;

    const nuevoProblema = problemasInput.trim();

    if (nuevoProblema.length === 0) return;

    if (problemasValue.includes(nuevoProblema)) {
      toast.info(t("messages.duplicateProblem"));
      setProblemasInput("");
      return;
    }

    const problemasActualizados = [...problemasValue, nuevoProblema];
    setValue("problemas", problemasActualizados);

    setProblemasInput("");

    if (errors.problemas) {
      setErrors((prev) => ({ ...prev, problemas: "" }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      agregarProblema();
    }
  };

  const eliminarProblema = (index: number) => {
    const nuevosProblemas = problemasValue.filter((_, i) => i !== index);
    setValue("problemas", nuevosProblemas);
  };

  const limpiarProblemas = () => {
    setValue("problemas", []);
    setProblemasInput("");
  };

  // Traduce las etiquetas mediante el ID, conservando el valor original.
  const getSoilLabel = (id: string | number, fallback: string) => {
    const key = `soilTypes.${id}`;
    return t.has(key) ? t(key) : fallback;
  };

  const getClimateLabel = (id: string | number, fallback: string) => {
    const key = `climateTypes.${id}`;
    return t.has(key) ? t(key) : fallback;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cultivo" className="font-bold">
          {t("fields.crop")} <span className="text-red-500">*</span>
        </Label>

        <Input
          id="cultivo"
          placeholder={t("placeholders.crop")}
          className={errors.cultivo ? "border-red-500" : ""}
          {...register("cultivo")}
        />

        {errors.cultivo && (
          <p className="text-sm font-medium text-red-500">{errors.cultivo}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="tipoSuelo" className="font-bold">
          {t("fields.soilType")} <span className="text-red-500">*</span>
        </Label>

        <Select onValueChange={handleTipoSueloChange} value={tipoSueloValue}>
          <SelectTrigger
            id="tipoSuelo"
            className={errors.tipoSuelo ? "border-red-500" : ""}
          >
            <SelectValue placeholder={t("placeholders.soilType")} />
          </SelectTrigger>

          <SelectContent>
            {tiposSuelos.map((suelo) => (
              <SelectItem key={suelo.id} value={suelo.value}>
                {getSoilLabel(suelo.id, suelo.value)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.tipoSuelo && (
          <p className="text-sm font-medium text-red-500">{errors.tipoSuelo}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="clima" className="font-bold">
          {t("fields.climate")} <span className="text-red-500">*</span>
        </Label>

        <Select onValueChange={handleClimaChange} value={climaValue}>
          <SelectTrigger
            id="clima"
            className={errors.clima ? "border-red-500" : ""}
          >
            <SelectValue placeholder={t("placeholders.climate")} />
          </SelectTrigger>

          <SelectContent>
            {tiposClima.map((clima) => (
              <SelectItem key={clima.id} value={clima.nombre}>
                {getClimateLabel(clima.id, clima.nombre)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {errors.clima && (
          <p className="text-sm font-medium text-red-500">{errors.clima}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="problemas" className="font-bold">
          {t("fields.observedProblems")} <span className="text-red-500">*</span>
        </Label>

        <div className="flex flex-col sm:flex-row gap-2">
          <Textarea
            id="problemas"
            placeholder={t("placeholders.problem")}
            className={`min-h-[80px] w-full sm:flex-1 ${
              errors.problemas ? "border-red-500" : ""
            }`}
            value={problemasInput}
            onChange={handleProblemasInputChange}
            onKeyDown={handleKeyDown}
          />

          <div className="flex sm:flex-col gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={agregarProblema}
              className="flex-1 sm:flex-none h-10"
            >
              <Plus className="h-4 w-4 mr-1" />
              {t("buttons.add")}
            </Button>

            {problemasValue?.length > 0 && (
              <Button
                type="button"
                variant="ghost"
                onClick={limpiarProblemas}
                className="flex-1 sm:flex-none h-10 text-red-500 hover:text-red-600"
              >
                {t("buttons.clear")}
              </Button>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          {t("hints.addProblems")}
        </p>

        {errors.problemas && (
          <p className="text-sm font-medium text-red-500">{errors.problemas}</p>
        )}
      </div>

      {Array.isArray(problemasValue) && problemasValue.length > 0 && (
        <SummaryProblemas
          problemasValue={problemasValue}
          eliminarProblema={eliminarProblema}
        />
      )}

      <Button
        id="id-btn-agricola"
        type="submit"
        className="w-full bg-green-600 hover:bg-green-700"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t("buttons.generating")}
          </>
        ) : (
          t("buttons.getDiagnosis")
        )}
      </Button>
    </form>
  );
};

export default FormConsultaAgricola;
