import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
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
import { InfoIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useForm } from "react-hook-form";
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { FormPorcinoData } from "@/api/animales/interfaces/crear-porcino.interface";
import {
  condicionCorporalOptions,
  etapaPorcinoOptions,
  sexoPorcinoOptions,
  tipoAlimentacionPorcinoOptions,
  tipoRegistroPorcinoOptions,
} from "@/helpers/data/animales/animales-data";
import { UpdateAnimalPorcino } from "@/api/animales/accions/update-animal";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";

interface Props {
  animalId: string;
  animal: Animal;
}

const FormEditPorcino = ({ animalId, animal }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cliente } = useAuthStore();
  const [showIdentifierHelp, setShowIdentifierHelp] = useState(false);
  const [isFormReady, setIsFormReady] = useState(false);

  const especieId = animal?.especie?.id || "";

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormPorcinoData>({
    defaultValues: {
      identificador: "",
      cantidad_inicial_porcino: 1,
      cantidad_actual_porcino: 1,
      desparasitado: false,
      mortalidad: false,
      cuarentena_porcino: false,
    },
  });

  const { data: razas } = useGetRazasByEspecie(especieId);
  const { data: fincas } = useFincasPropietarios(cliente?.id ?? "");

  useEffect(() => {
    if (animal) {
      reset({
        identificador: animal.identificador || "",
        nombre_animal: animal.nombre_animal || "",
        fincaId: animal.finca?.id || "",
        sexo: animal.sexo || "",
        color: animal.color || "",
        razaIds: animal.razas?.map((raza) => raza.id) || [],
        tipo_registro_porcino: animal.tipo_registro_porcino || "",
        etapa_porcino: animal.etapa_porcino || "",
        corral_galera: animal.corral_galera || "",
        lote: animal.lote || "",
        proveedor: animal.proveedor || "",
        fecha_ingreso_porcino: animal.fecha_ingreso_porcino
          ? new Date(animal.fecha_ingreso_porcino).toISOString().split("T")[0]
          : "",
        cantidad_inicial_porcino: animal.cantidad_inicial_porcino || 1,
        cantidad_actual_porcino: animal.cantidad_actual_porcino || 1,
        peso_inicial_porcino: animal.peso_inicial_porcino || undefined,
        peso_promedio: animal.peso_promedio || "",
        ganancia_peso: animal.ganancia_peso || undefined,
        fecha_pesaje_porcino: animal.fecha_pesaje_porcino
          ? new Date(animal.fecha_pesaje_porcino).toISOString().split("T")[0]
          : "",
        tipo_alimentacion: animal.tipo_alimentacion || [],
        consumo_diario_porcino: animal.consumo_diario_porcino || undefined,
        vacunas: animal.vacunas || "",
        tratamientos: animal.tratamientos || "",
        condicion_corporal: animal.condicion_corporal || "",
        desparasitado: animal.desparasitado || false,
        mortalidad: animal.mortalidad || false,
        bajas_mortalidad_porcino: animal.bajas_mortalidad_porcino || 0,
        cuarentena_porcino: animal.cuarentena_porcino || false,
        fecha_salida_porcino: animal.fecha_salida_porcino
          ? new Date(animal.fecha_salida_porcino).toISOString().split("T")[0]
          : "",
        peso_salida_porcino: animal.peso_salida_porcino || undefined,
        comprador_porcino: animal.comprador_porcino || "",
        precio_porcino: animal.precio_porcino || undefined,
        rendimiento_canal_porcino:
          animal.rendimiento_canal_porcino || undefined,
        nombre_criador_origen_animal: animal.nombre_criador_origen_animal || "",
        observaciones: animal.observaciones || "",
        especie: animal.especie?.id || "",
      });

      setIsFormReady(true);
    }
  }, [animal, reset]);

  const fincasItems =
    fincas?.data.fincas.map((finca) => ({
      label: finca.nombre_finca,
      value: finca.id,
    })) || [];

  const mutation = useMutation({
    mutationFn: (data: FormPorcinoData) =>
      UpdateAnimalPorcino(animalId, data as any),
    onSuccess: () => {
      toast.success("Porcino actualizado correctamente");
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
            : "Hubo un error al actualizar el porcino";
        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    },
  });

  const onSubmit = (data: FormPorcinoData) => {
    if (!cliente?.id) return;

    if (!data.fincaId) {
      toast.error("Debes seleccionar una finca");
      return;
    }

    if (!data.identificador || data.identificador.trim() === "") {
      toast.error("El identificador es obligatorio");
      return;
    }

    if (!data.razaIds || data.razaIds.length === 0) {
      toast.error("Debes seleccionar al menos una raza");
      return;
    }

    mutation.mutate(data);
  };

  if (!isFormReady) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-muted-foreground">
            Cargando datos del porcino...
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            Editar Porcino
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Actualiza la información del porcino. Los campos con{" "}
            <span className="text-red-500">*</span> son obligatorios.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Identificación */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Identificación
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Sexo <span className="text-red-500">*</span>
                </Label>
                <RadioGroup
                  value={watch("sexo") || ""}
                  onValueChange={(value) => setValue("sexo", value)}
                  className="space-y-2"
                >
                  {sexoPorcinoOptions.map((sexo) => (
                    <div
                      key={sexo.value}
                      className="flex items-center space-x-2"
                    >
                      <RadioGroupItem
                        value={sexo.value}
                        id={`sexo-${sexo.value}`}
                      />
                      <Label htmlFor={`sexo-${sexo.value}`} className="text-sm">
                        {sexo.label}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                {errors.sexo && (
                  <p className="text-sm text-red-500">{errors.sexo.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Identificador <span className="text-red-500">*</span>
                </Label>
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      {...register("identificador")}
                      placeholder="Ej: PORC-001, P001, etc."
                      className="w-full font-mono text-lg tracking-wider uppercase"
                    />
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
                          Identificador único del porcino
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Nombre (opcional)</Label>
                <Input
                  {...register("nombre_animal")}
                  placeholder="Ej: Lucero, Toro, etc."
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Color / capa</Label>
                <Input
                  {...register("color")}
                  placeholder="Ej: Blanco, Negro, Manchado"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Finca <span className="text-red-500">*</span>
              </Label>
              <Select
                value={watch("fincaId") || ""}
                onValueChange={(value) => setValue("fincaId", value)}
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

          {/* Características */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Características
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Raza <span className="text-red-500">*</span>
                </Label>
                <div className="border rounded-lg p-3 space-y-2 max-h-48 overflow-y-auto bg-gray-50">
                  {razas?.data.map((raza) => (
                    <div key={raza.id} className="flex items-center space-x-2">
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
                  ))}
                </div>
                {errors.razaIds && (
                  <p className="text-sm text-red-500">
                    {errors.razaIds.message}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo de Registro</Label>
                <Select
                  value={watch("tipo_registro_porcino") || ""}
                  onValueChange={(value) =>
                    setValue("tipo_registro_porcino", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de registro" />
                  </SelectTrigger>
                  <SelectContent>
                    {tipoRegistroPorcinoOptions.map((opcion) => (
                      <SelectItem key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Etapa</Label>
                <Select
                  value={watch("etapa_porcino") || ""}
                  onValueChange={(value) => setValue("etapa_porcino", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona la etapa" />
                  </SelectTrigger>
                  <SelectContent>
                    {etapaPorcinoOptions.map((opcion) => (
                      <SelectItem key={opcion.value} value={opcion.value}>
                        {opcion.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Corral/Galera</Label>
                <Input
                  {...register("corral_galera")}
                  placeholder="Ej: Corral A, Galera 1"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Lote</Label>
                <Input
                  {...register("lote")}
                  placeholder="Ej: Lote 2024-1"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Proveedor</Label>
              <Input
                {...register("proveedor")}
                placeholder="Nombre del proveedor"
                className="w-full"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Fecha de Ingreso</Label>
                <Input
                  type="date"
                  {...register("fecha_ingreso_porcino")}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Cantidad Inicial</Label>
                <Input
                  type="number"
                  min={1}
                  {...register("cantidad_inicial_porcino", {
                    valueAsNumber: true,
                  })}
                  placeholder="Ej: 100"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Cantidad Actual</Label>
                <Input
                  type="number"
                  min={0}
                  {...register("cantidad_actual_porcino", {
                    valueAsNumber: true,
                  })}
                  placeholder="Ej: 95"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Peso y Crecimiento */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Peso y Crecimiento
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Peso Inicial (kg)</Label>
                <Input
                  type="number"
                  step="0.1"
                  min={0}
                  {...register("peso_inicial_porcino", {
                    valueAsNumber: true,
                  })}
                  placeholder="Ej: 8.5"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Peso Promedio (kg)
                </Label>
                <Input
                  type="number"
                  min={0}
                  {...register("peso_promedio")}
                  placeholder="Ej: 45.5"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Ganancia de Peso (kg/día)
                </Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  {...register("ganancia_peso", { valueAsNumber: true })}
                  placeholder="Ej: 0.25"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Fecha de Pesaje</Label>
              <Input
                type="date"
                {...register("fecha_pesaje_porcino")}
                className="w-full"
              />
            </div>
          </div>

          {/* Alimentación */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Alimentación
            </h3>

            <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
              {tipoAlimentacionPorcinoOptions.map((alimento) => {
                const alimentoSeleccionado = watch("tipo_alimentacion")?.find(
                  (a: any) => a.alimento === alimento.value,
                );

                return (
                  <div
                    key={alimento.value}
                    className="bg-white rounded-lg p-4 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={!!alimentoSeleccionado}
                          onCheckedChange={(checked) => {
                            const isChecked = checked === true;
                            const currentAlimentacion =
                              watch("tipo_alimentacion") || [];

                            if (isChecked) {
                              setValue("tipo_alimentacion", [
                                ...currentAlimentacion,
                                {
                                  alimento: alimento.value,
                                  origen: "comprado",
                                },
                              ]);
                            } else {
                              setValue(
                                "tipo_alimentacion",
                                currentAlimentacion.filter(
                                  (a: any) => a.alimento !== alimento.value,
                                ),
                              );
                            }
                          }}
                        />
                        <Label className="font-medium">{alimento.label}</Label>
                      </div>
                    </div>

                    {alimentoSeleccionado && (
                      <div className="pl-6 space-y-3">
                        <RadioGroup
                          value={alimentoSeleccionado.origen}
                          onValueChange={(origen) => {
                            const updated = (
                              watch("tipo_alimentacion") || []
                            ).map((item: any) =>
                              item.alimento === alimento.value
                                ? { ...item, origen }
                                : item,
                            );
                            setValue("tipo_alimentacion", updated);
                          }}
                          className="flex flex-wrap gap-4"
                        >
                          {[
                            "comprado",
                            "producido",
                            "comprado y producido",
                          ].map((origen) => (
                            <div
                              key={origen}
                              className="flex items-center space-x-2"
                            >
                              <RadioGroupItem
                                value={origen}
                                id={`${alimento.value}-${origen}`}
                              />
                              <Label
                                htmlFor={`${alimento.value}-${origen}`}
                                className="text-sm"
                              >
                                {origen === "comprado"
                                  ? "Comprado"
                                  : origen === "producido"
                                    ? "Producido"
                                    : "Comprado y producido"}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>

                        {alimentoSeleccionado.origen ===
                          "comprado y producido" && (
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">% Comprado</Label>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={
                                  alimentoSeleccionado.porcentaje_comprado || ""
                                }
                                onChange={(e) => {
                                  const value = e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined;
                                  const updated = (
                                    watch("tipo_alimentacion") || []
                                  ).map((item: any) =>
                                    item.alimento === alimento.value
                                      ? {
                                          ...item,
                                          porcentaje_comprado: value,
                                        }
                                      : item,
                                  );
                                  setValue("tipo_alimentacion", updated);
                                }}
                                placeholder="Ej: 60"
                                className="w-full"
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">% Producido</Label>
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                value={
                                  alimentoSeleccionado.porcentaje_producido ||
                                  ""
                                }
                                onChange={(e) => {
                                  const value = e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined;
                                  const updated = (
                                    watch("tipo_alimentacion") || []
                                  ).map((item: any) =>
                                    item.alimento === alimento.value
                                      ? {
                                          ...item,
                                          porcentaje_producido: value,
                                        }
                                      : item,
                                  );
                                  setValue("tipo_alimentacion", updated);
                                }}
                                placeholder="Ej: 40"
                                className="w-full"
                              />
                            </div>
                            {alimentoSeleccionado.porcentaje_comprado !==
                              undefined &&
                              alimentoSeleccionado.porcentaje_producido !==
                                undefined &&
                              alimentoSeleccionado.porcentaje_comprado +
                                alimentoSeleccionado.porcentaje_producido !==
                                100 && (
                                <p className="text-xs text-red-500 col-span-2">
                                  ⚠️ La suma de porcentajes debe ser 100%
                                </p>
                              )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Consumo Diario (kg)
                </Label>
                <Input
                  type="number"
                  min={0}
                  step="0.1"
                  {...register("consumo_diario_porcino", {
                    valueAsNumber: true,
                  })}
                  placeholder="Ej: 2.5"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Sanidad */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Sanidad
            </h3>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="desparasitado"
                checked={watch("desparasitado")}
                onCheckedChange={(checked) =>
                  setValue("desparasitado", checked === true)
                }
              />
              <Label
                htmlFor="desparasitado"
                className="text-sm font-medium cursor-pointer"
              >
                Desparasitado
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="cuarentena"
                checked={watch("cuarentena_porcino")}
                onCheckedChange={(checked) =>
                  setValue("cuarentena_porcino", checked === true)
                }
              />
              <Label
                htmlFor="cuarentena"
                className="text-sm font-medium cursor-pointer"
              >
                En Cuarentena
              </Label>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Condición Corporal</Label>
              <Select
                value={watch("condicion_corporal") || ""}
                onValueChange={(value) => setValue("condicion_corporal", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la condición corporal" />
                </SelectTrigger>
                <SelectContent>
                  {condicionCorporalOptions.map((opcion) => (
                    <SelectItem key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Vacunas</Label>
              <Textarea
                {...register("vacunas")}
                placeholder="Ej: Parvovirus, Leptospirosis, Erisipela"
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tratamientos</Label>
              <Textarea
                {...register("tratamientos")}
                placeholder="Ej: Antibióticos, Vitaminas, Desparasitantes"
                className="min-h-[80px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Bajas / Mortalidad
                </Label>
                <Input
                  type="number"
                  min={0}
                  {...register("bajas_mortalidad_porcino", {
                    valueAsNumber: true,
                  })}
                  placeholder="Ej: 5"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Salida */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Salida del Animal
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Fecha de Salida</Label>
                <Input
                  type="date"
                  {...register("fecha_salida_porcino")}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Peso de Salida (kg)
                </Label>
                <Input
                  type="number"
                  step="0.1"
                  min={0}
                  {...register("peso_salida_porcino", {
                    valueAsNumber: true,
                  })}
                  placeholder="Ej: 95.5"
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Comprador</Label>
                <Input
                  {...register("comprador_porcino")}
                  placeholder="Nombre del comprador"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Precio ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min={0}
                  {...register("precio_porcino", { valueAsNumber: true })}
                  placeholder="Ej: 5000"
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Rendimiento de Canal (%)
              </Label>
              <Input
                type="number"
                step="0.1"
                min={0}
                {...register("rendimiento_canal_porcino", {
                  valueAsNumber: true,
                })}
                placeholder="Ej: 75.5"
                className="w-full"
              />
            </div>
          </div>

          {/* Observaciones */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Observaciones
            </h3>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Nombre del Criador/Origen
              </Label>
              <Input
                {...register("nombre_criador_origen_animal")}
                placeholder="Nombre del criador o lugar de origen"
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Observaciones</Label>
              <Textarea
                {...register("observaciones")}
                placeholder="Observaciones adicionales sobre el porcino"
                className="min-h-[100px]"
              />
            </div>
          </div>

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
              className="bg-pink-600 hover:bg-pink-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                "Actualizar Porcino"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default FormEditPorcino;
