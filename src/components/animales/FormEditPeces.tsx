"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Button } from "../ui/button";
import { Checkbox } from "../ui/checkbox";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { InfoIcon, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useForm, useFieldArray } from "react-hook-form";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import {
  EtapaPez,
  PecesData,
} from "@/api/animales/interfaces/crear-peces.interface";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { ActualizarPeces } from "@/api/animales/accions/update-animal";
import { etapaOptions } from "@/helpers/data/animales/animales-data";

interface Props {
  animalId: string;
  animal: Animal;
}

const FormEditPeces = ({ animalId, animal }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cliente } = useAuthStore();
  const [showIdentifierHelp, setShowIdentifierHelp] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);

  const especieId = animal?.especie?.id || "";

  const { data: razas } = useGetRazasByEspecie(especieId);
  const { data: fincas } = useFincasPropietarios(cliente?.id ?? "");

  const fincasItems =
    fincas?.data.fincas.map((finca) => ({
      label: finca.nombre_finca,
      value: finca.id,
    })) || [];

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm<PecesData>({
    defaultValues: {
      identificador: "",
      lote_activo: true,
      muestreos: [],
      calidad_agua: {
        historial_recambios: [],
      },
      sanidad: {},
      cosecha: {},
    },
  });

  const {
    fields: muestreoFields,
    append: appendMuestreo,
    remove: removeMuestreo,
  } = useFieldArray({
    control,
    name: "muestreos",
  });

  const {
    fields: recambioFields,
    append: appendRecambio,
    remove: removeRecambio,
  } = useFieldArray({
    control,
    name: "calidad_agua.historial_recambios",
  });

  useEffect(() => {
    if (animal) {
      const parseJsonField = (field: any) => {
        if (typeof field === "string") {
          try {
            return JSON.parse(field);
          } catch {
            return field;
          }
        }
        return field;
      };

      const muestreos = parseJsonField(animal.muestreos) || [];
      const calidad_agua = parseJsonField(animal.calidad_agua) || {};
      const sanidad = parseJsonField(animal.sanidad) || {};
      const cosecha = parseJsonField(animal.cosecha) || {};

      reset({
        especie: animal?.especie?.id || "",
        identificador: animal.identificador || "",
        fincaId: animal.finca?.id || "",
        razaIds: animal.razas?.map((raza) => raza.id) || [],
        estanque_tanque_jaula: animal.estanque_tanque_jaula || "",
        proveedor_alevines: animal.proveedor_alevines || "",
        fecha_siembra: animal.fecha_siembra
          ? new Date(animal.fecha_siembra).toISOString().split("T")[0]
          : "",
        cantidad_inicial: animal.cantidad_inicial || 0,
        talla_peso_inicial: animal.talla_peso_inicial || "",
        densidad_por_m3_m2: animal.densidad_por_m3_m2 || 0,
        cantidad_actual: animal.cantidad_actual || 0,
        mortalidad_diaria_acum: animal.mortalidad_diaria_acum || "",
        muestreos: muestreos,
        etapa: (animal.etapa as EtapaPez) || undefined,
        peso_promedio: animal.peso_promedio_pez || 0,
        biomasa_estimada: animal.biomasa_estimada || 0,
        talla: animal.talla_pez || 0,
        fecha_muestreo: animal.fecha_muestreo_pez
          ? new Date(animal.fecha_muestreo_pez).toISOString().split("T")[0]
          : "",
        calidad_agua: calidad_agua,
        tipo_concentrado: animal.tipo_concentrado_pez || "",
        proteina_porcentaje: animal.proteina_porcentaje || 0,
        racion_diaria: animal.racion_diaria || "",
        consumo: animal.consumo_pez || "",
        conversion_alimenticia: animal.conversion_alimenticia || 0,
        sanidad: sanidad,
        cosecha: cosecha,
        lote_activo:
          animal.lote_activo !== undefined ? animal.lote_activo : true,
      });

      setIsFormReady(true);
    }
  }, [animal, reset]);

  const mutation = useMutation({
    mutationFn: (data: PecesData) => ActualizarPeces(animalId, data),
    onSuccess: () => {
      toast.success("Lote de peces actualizado correctamente");
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      queryClient.invalidateQueries({ queryKey: ["animal-id", animalId] });
      router.push("/animales");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el lote de peces";

        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    },
  });

  const onSubmit = (data: PecesData) => {
    if (!cliente?.id) return;

    if (!data.fincaId) {
      toast.error("Debes seleccionar una finca");
      return;
    }

    if (!data.razaIds || data.razaIds.length === 0) {
      toast.error("Debes seleccionar al menos una raza");
      return;
    }

    if (!data.identificador || data.identificador.trim() === "") {
      toast.error("El identificador es obligatorio");
      return;
    }

    if (!data.fecha_siembra) {
      toast.error("La fecha de siembra es obligatoria");
      return;
    }

    if (!data.cantidad_inicial || data.cantidad_inicial <= 0) {
      toast.error("La cantidad inicial debe ser mayor a 0");
      return;
    }

    mutation.mutate(data);
  };

  const handleSelectChange = (field: keyof PecesData, value: any) => {
    setValue(field, value);
  };

  if (!isFormReady) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Cargando datos del lote...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-4">
            <div>
              <CardTitle className="text-2xl font-bold">
                Editar Lote de Peces
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Actualiza la información del lote piscícola. Los campos con{" "}
                <span className="text-red-500">*</span> son obligatorios.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Identificación
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Estanque / Tanque / Jaula{" "}
                  <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("estanque_tanque_jaula")}
                  placeholder="Ej: Estanque 1, Tanque A, Jaula 3"
                />
                {errors.estanque_tanque_jaula && (
                  <p className="text-sm text-red-500">
                    {errors.estanque_tanque_jaula.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Identificador del Lote <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      {...register("identificador")}
                      onChange={(e) => {
                        const value = e.target.value.slice(0, 6);
                        e.target.value = value;
                        setValue("identificador", value);
                      }}
                      placeholder="Ej: 123ABC"
                      maxLength={6}
                      className="w-full font-mono text-lg tracking-wider uppercase"
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                      <span className="text-xs text-muted-foreground">
                        6 caracteres
                      </span>
                    </div>
                  </div>
                  <TooltipProvider>
                    <Tooltip
                      open={showIdentifierHelp}
                      onOpenChange={setShowIdentifierHelp}
                    >
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          className="shrink-0"
                        >
                          <InfoIcon className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="right" className="max-w-xs">
                        <p className="text-xs">
                          Código de identificación del lote (máximo 6
                          caracteres)
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                {errors.identificador && (
                  <p className="text-sm text-red-500">
                    {errors.identificador.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Proveedor de Alevines
              </Label>
              <Input
                {...register("proveedor_alevines")}
                placeholder="Nombre del proveedor"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Razas del Lote <span className="text-red-500">*</span>
            </h3>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Selecciona las razas que componen el lote
              </Label>
              <div className="border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto bg-gray-50">
                {razas?.data && razas.data.length > 0 ? (
                  razas.data.map((raza) => (
                    <div
                      key={raza.id}
                      className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md transition-colors"
                    >
                      <Checkbox
                        checked={watch("razaIds")?.includes(raza.id) || false}
                        onCheckedChange={(checked) => {
                          const currentValues = watch("razaIds") || [];
                          if (checked) {
                            setValue("razaIds", [...currentValues, raza.id]);
                          } else {
                            setValue(
                              "razaIds",
                              currentValues.filter((id) => id !== raza.id),
                            );
                          }
                        }}
                        id={`raza-${raza.id}`}
                      />
                      <Label htmlFor={`raza-${raza.id}`} className="text-sm">
                        {raza.nombre}
                      </Label>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No hay razas disponibles para esta especie
                  </p>
                )}
              </div>
              {errors.razaIds && (
                <p className="text-sm text-red-500">{errors.razaIds.message}</p>
              )}
              {watch("razaIds") && watch("razaIds").length > 0 && (
                <p className="text-xs text-green-600">
                  ✓ {watch("razaIds").length} raza(s) seleccionada(s)
                </p>
              )}
            </div>
          </div>

          {/* SIEMBRA */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Siembra
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Fecha de Siembra <span className="text-red-500">*</span>
                </Label>
                <Input type="date" {...register("fecha_siembra")} />
                {errors.fecha_siembra && (
                  <p className="text-sm text-red-500">
                    {errors.fecha_siembra.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Cantidad Inicial <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  min={1}
                  {...register("cantidad_inicial", { valueAsNumber: true })}
                  placeholder="Ej: 1000"
                />
                {errors.cantidad_inicial && (
                  <p className="text-sm text-red-500">
                    {errors.cantidad_inicial.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Talla / Peso Inicial
                </Label>
                <Input
                  {...register("talla_peso_inicial")}
                  placeholder="Ej: 5cm / 2g"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Densidad (por m³ / m²)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("densidad_por_m3_m2", { valueAsNumber: true })}
                  placeholder="Ej: 50"
                />
              </div>
            </div>
          </div>

          {/* POBLACIÓN */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Población
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Cantidad Actual</Label>
                <Input
                  type="number"
                  min={0}
                  {...register("cantidad_actual", { valueAsNumber: true })}
                  placeholder="Ej: 950"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Etapa</Label>
                <Select
                  value={watch("etapa") || ""}
                  onValueChange={(value) =>
                    handleSelectChange("etapa", value as EtapaPez)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    {etapaOptions.map((etapa) => (
                      <SelectItem key={etapa.value} value={etapa.value}>
                        {etapa.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Mortalidad Diaria / Acumulada
              </Label>
              <Input
                {...register("mortalidad_diaria_acum")}
                placeholder="Ej: 5/día o 50 acumuladas"
              />
            </div>
          </div>

          {/* MUESTREOS */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Muestreos
            </h3>

            {muestreoFields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded-lg p-4 space-y-3 bg-gray-50"
              >
                <div className="flex justify-between items-center">
                  <Label className="font-medium">Muestreo #{index + 1}</Label>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => removeMuestreo(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Fecha</Label>
                    <Input
                      type="date"
                      {...register(`muestreos.${index}.fecha_muestreo`)}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Peso (g)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      {...register(`muestreos.${index}.peso`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Ej: 150"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Talla (cm)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      {...register(`muestreos.${index}.talla`, {
                        valueAsNumber: true,
                      })}
                      placeholder="Ej: 15"
                    />
                  </div>
                </div>
              </div>
            ))}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                appendMuestreo({ fecha_muestreo: "", peso: 0, talla: 0 })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Muestreo
            </Button>
          </div>

          {/* CRECIMIENTO */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Crecimiento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Peso Promedio (g)</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("peso_promedio", { valueAsNumber: true })}
                  placeholder="Ej: 250"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Biomasa Estimada (kg)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("biomasa_estimada", { valueAsNumber: true })}
                  placeholder="Ej: 237.5"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Talla (cm)</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register("talla", { valueAsNumber: true })}
                  placeholder="Ej: 20"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Fecha de Muestreo</Label>
                <Input type="date" {...register("fecha_muestreo")} />
              </div>
            </div>
          </div>

          {/* CALIDAD DE AGUA */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Calidad de Agua
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Temperatura (°C)</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register("calidad_agua.temperatura", {
                    valueAsNumber: true,
                  })}
                  placeholder="Ej: 28"
                />
                <p className="text-xs text-muted-foreground">
                  ⟦Tilapia ideal 26–30 °C⟧
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Oxígeno Disuelto (mg/L)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register("calidad_agua.oxigeno_disuelto", {
                    valueAsNumber: true,
                  })}
                  placeholder="Ej: 5.5"
                />
                <p className="text-xs text-muted-foreground">
                  ⟦Mantener {">"} 4 mg/L⟧
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">pH</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register("calidad_agua.ph", { valueAsNumber: true })}
                  placeholder="Ej: 7.5"
                />
                <p className="text-xs text-muted-foreground">⟦Rango 6.5 – 9⟧</p>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Amonio (NH₃)</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("calidad_agua.amonio", { valueAsNumber: true })}
                  placeholder="Ej: 0.5"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Nitrito (NO₂)</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("calidad_agua.nitrito", { valueAsNumber: true })}
                  placeholder="Ej: 0.05"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Turbidez</Label>
              <Input
                {...register("calidad_agua.turbidez")}
                placeholder="Ej: 5 NTU"
              />
            </div>

            {/* HISTORIAL DE RECAMBIOS */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">
                Historial de Recambios de Agua
              </Label>

              {recambioFields.map((field, index) => (
                <div
                  key={field.id}
                  className="border rounded-lg p-4 space-y-3 bg-gray-50"
                >
                  <div className="flex justify-between items-center">
                    <Label className="font-medium">Recambio #{index + 1}</Label>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeRecambio(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Fecha</Label>
                      <Input
                        type="date"
                        {...register(
                          `calidad_agua.historial_recambios.${index}.fecha_recambio`,
                        )}
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">% de Agua Recambiada</Label>
                      <Input
                        type="number"
                        step="0.1"
                        {...register(
                          `calidad_agua.historial_recambios.${index}.porcentaje_recambio`,
                          { valueAsNumber: true },
                        )}
                        placeholder="Ej: 20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <Label className="text-xs">Volumen (m³)</Label>
                      <Input
                        type="number"
                        step="0.1"
                        {...register(
                          `calidad_agua.historial_recambios.${index}.volumen_m3`,
                          { valueAsNumber: true },
                        )}
                        placeholder="Ej: 10"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Motivo</Label>
                      <Input
                        {...register(
                          `calidad_agua.historial_recambios.${index}.motivo`,
                        )}
                        placeholder="Calidad / Rutina / Floración algas"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Responsable</Label>
                    <Input
                      {...register(
                        `calidad_agua.historial_recambios.${index}.responsable`,
                      )}
                      placeholder="Nombre del responsable"
                    />
                  </div>
                </div>
              ))}

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  appendRecambio({
                    fecha_recambio: "",
                    porcentaje_recambio: 0,
                    volumen_m3: 0,
                    motivo: "",
                    responsable: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                Agregar Recambio
              </Button>
            </div>
          </div>

          {/* ALIMENTACIÓN */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Alimentación
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Tipo de Concentrado
                </Label>
                <Input
                  {...register("tipo_concentrado")}
                  placeholder="Ej: Iniciador, Crecimiento, Engorde"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Proteína %</Label>
                <Input
                  type="number"
                  step="0.1"
                  {...register("proteina_porcentaje", { valueAsNumber: true })}
                  placeholder="Ej: 28"
                />
                <p className="text-xs text-muted-foreground">
                  ⟦24 – 32 % según etapa⟧
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Ración Diaria</Label>
                <Input {...register("racion_diaria")} placeholder="Ej: 15 kg" />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Consumo</Label>
                <Input {...register("consumo")} placeholder="Ej: 12.5 kg/día" />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Conversión Alimenticia
              </Label>
              <Input
                type="number"
                step="0.01"
                {...register("conversion_alimenticia", { valueAsNumber: true })}
                placeholder="Ej: 1.8"
              />
            </div>
          </div>

          {/* SANIDAD */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Sanidad
            </h3>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Signos Clínicos</Label>
                <Textarea
                  {...register("sanidad.signos_clinicos")}
                  placeholder="Ej: Manchas, heridas, comportamiento anormal"
                  className="min-h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Tratamientos</Label>
                <Textarea
                  {...register("sanidad.tratamientos")}
                  placeholder="Ej: Antibióticos, antiparasitarios"
                  className="min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">
                    Baños / Salinidad
                  </Label>
                  <Input
                    {...register("sanidad.banos_salinidad")}
                    placeholder="Ej: Baño de sal al 3%"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">Laboratorio</Label>
                  <Input
                    {...register("sanidad.laboratorio")}
                    placeholder="Nombre del laboratorio"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* COSECHA */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Cosecha
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Fecha de Cosecha</Label>
                <Input type="date" {...register("cosecha.fecha_cosecha")} />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Kilos Cosechados</Label>
                <Input
                  type="number"
                  step="0.01"
                  {...register("cosecha.kilos_cosechados", {
                    valueAsNumber: true,
                  })}
                  placeholder="Ej: 500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Sobrevivencia %</Label>
                <Input
                  type="number"
                  step="0.1"
                  min={0}
                  max={100}
                  {...register("cosecha.sobrevivencia_porcentaje", {
                    valueAsNumber: true,
                  })}
                  placeholder="Ej: 85"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Comprador</Label>
                <Input
                  {...register("cosecha.comprador")}
                  placeholder="Nombre del comprador"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Precio</Label>
              <Input
                type="number"
                step="0.01"
                {...register("cosecha.precio", { valueAsNumber: true })}
                placeholder="Ej: 5000"
              />
            </div>
          </div>

          {/* ESTADO DEL LOTE */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Estado del Lote
            </h3>

            <div className="flex items-center space-x-2">
              <Checkbox
                checked={watch("lote_activo")}
                onCheckedChange={(checked) =>
                  setValue("lote_activo", checked === true)
                }
                id="lote_activo"
              />
              <Label htmlFor="lote_activo" className="text-sm font-medium">
                Lote Activo
              </Label>
            </div>
          </div>

          {/* UBICACIÓN */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Ubicación
            </h3>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Finca <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("fincaId") || ""}
                onValueChange={(value) => handleSelectChange("fincaId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una finca" />
                </SelectTrigger>
                <SelectContent>
                  {fincasItems.map((finca) => (
                    <SelectItem key={finca.value} value={finca.value}>
                      {finca.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.fincaId && (
                <p className="text-sm text-red-500">{errors.fincaId.message}</p>
              )}
            </div>
          </div>

          {/* BOTONES */}
          <div className="pt-4 border-t flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/animales")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="bg-cyan-600 hover:bg-cyan-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {mutation.isPending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Actualizando...
                </>
              ) : (
                "Actualizar Lote de Peces"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default FormEditPeces;
