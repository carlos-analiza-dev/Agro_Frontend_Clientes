import React, { useEffect, useState } from "react";
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
import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import {
  EtapaPez,
  PecesData,
} from "@/api/animales/interfaces/crear-peces.interface";
import { CreateAnimalPeces } from "@/api/animales/accions/crear-animal";
import { etapaOptions } from "@/helpers/data/animales/animales-data";

interface Props {
  selectedEspecieId: string;
}

const FormAddPeces = ({ selectedEspecieId }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cliente } = useAuthStore();
  const [showIdentifierHelp, setShowIdentifierHelp] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const { data: razas } = useGetRazasByEspecie(selectedEspecieId);
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

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length + selectedImages.length > 5) {
      toast.error("Máximo 5 imágenes permitidas");
      return;
    }

    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 5 * 1024 * 1024;

      if (!isValidType) {
        toast.error(`El archivo ${file.name} no es una imagen válida`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`La imagen ${file.name} excede el límite de 5MB`);
        return false;
      }
      return true;
    });

    setSelectedImages((prev) => [...prev, ...validFiles]);

    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
    URL.revokeObjectURL(imagePreviews[index]);
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => {
      imagePreviews.forEach((preview) => URL.revokeObjectURL(preview));
    };
  }, []);

  const mutation = useMutation({
    mutationFn: (data: FormData) => CreateAnimalPeces(data),
    onSuccess: () => {
      toast.success("Lote de peces creado correctamente");
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      reset();
      router.push("/animales");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear el lote de peces";

        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    },
  });

  const onSubmit = (data: PecesData) => {
    if (!cliente?.id) return;
    if (!selectedEspecieId) {
      toast.error("No se ha seleccionado una especie válida");
      return;
    }

    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (
        value === undefined ||
        value === null ||
        key === "razaIds" ||
        key === "muestreos" ||
        key === "calidad_agua" ||
        key === "sanidad" ||
        key === "cosecha"
      ) {
        return;
      }

      if (key === "lote_activo") {
        formData.append(key, String(value));
        return;
      }

      if (typeof value !== "object") {
        formData.append(key, String(value));
      }
    });

    formData.append("especie", selectedEspecieId);
    formData.append("lote_activo", String(data.lote_activo ?? true));
    formData.append("razaIds", JSON.stringify(data.razaIds));

    if (data.muestreos && data.muestreos.length > 0) {
      data.muestreos.forEach((muestreo, index) => {
        if (muestreo.fecha_muestreo) {
          formData.append(
            `muestreos[${index}][fecha_muestreo]`,
            muestreo.fecha_muestreo,
          );
        }
        if (muestreo.peso !== undefined && muestreo.peso !== null) {
          formData.append(`muestreos[${index}][peso]`, String(muestreo.peso));
        }
        if (muestreo.talla !== undefined && muestreo.talla !== null) {
          formData.append(`muestreos[${index}][talla]`, String(muestreo.talla));
        }
      });
    }

    if (data.sanidad) {
      Object.entries(data.sanidad).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(`sanidad[${key}]`, String(value));
        }
      });
    }

    if (data.cosecha) {
      Object.entries(data.cosecha).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(`cosecha[${key}]`, String(value));
        }
      });
    }

    if (data.calidad_agua) {
      const { historial_recambios, ...calidadCampos } = data.calidad_agua;

      Object.entries(calidadCampos).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(`calidad_agua[${key}]`, String(value));
        }
      });

      if (historial_recambios && historial_recambios.length > 0) {
        historial_recambios.forEach((recambio, index) => {
          if (recambio.fecha_recambio) {
            formData.append(
              `calidad_agua[historial_recambios][${index}][fecha_recambio]`,
              recambio.fecha_recambio,
            );
          }
          if (
            recambio.porcentaje_recambio !== undefined &&
            recambio.porcentaje_recambio !== null
          ) {
            formData.append(
              `calidad_agua[historial_recambios][${index}][porcentaje_recambio]`,
              String(recambio.porcentaje_recambio),
            );
          }
          if (
            recambio.volumen_m3 !== undefined &&
            recambio.volumen_m3 !== null
          ) {
            formData.append(
              `calidad_agua[historial_recambios][${index}][volumen_m3]`,
              String(recambio.volumen_m3),
            );
          }
          if (recambio.motivo) {
            formData.append(
              `calidad_agua[historial_recambios][${index}][motivo]`,
              recambio.motivo,
            );
          }
          if (recambio.responsable) {
            formData.append(
              `calidad_agua[historial_recambios][${index}][responsable]`,
              recambio.responsable,
            );
          }
        });
      }
    }

    selectedImages.forEach((image) => {
      formData.append("images", image);
    });

    mutation.mutate(formData as any);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card className="max-w-4xl mx-auto">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            Datos del Lote de Peces
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Completa la información del lote piscícola. Los campos con{" "}
            <span className="text-red-500">*</span> son obligatorios.
          </p>
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    setValue("etapa", value as EtapaPez)
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
                type="number"
                placeholder="Ej: 1, 2,3"
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

          {/* IMÁGENES */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider border-b pb-2">
              Imágenes del Lote
            </h3>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="mb-2">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    Arrastra y suelta imágenes o haz clic para seleccionar
                  </p>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageSelect}
                    disabled={selectedImages.length >= 5}
                    className="w-full max-w-xs cursor-pointer text-sm file:mr-2 file:py-2 file:px-3 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 file:border-none file:rounded-md hover:file:bg-blue-100 disabled:opacity-50"
                  />
                  <p className="text-xs text-gray-500 mt-3">
                    <span className="font-medium">Máximo 5 imágenes</span> ·
                    Formatos: JPG, PNG, GIF · Máximo 5MB cada una
                    <br />
                    <span className="text-blue-600">
                      {selectedImages.length}/5 imágenes seleccionadas
                    </span>
                  </p>
                </div>
              </div>

              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg border shadow-sm hover:shadow-md transition-shadow"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-all shadow-md active:scale-95 opacity-0 group-hover:opacity-100"
                        aria-label="Eliminar imagen"
                      >
                        ×
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-white text-xs">
                          Imagen {index + 1}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
              className="bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
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
                  Creando...
                </>
              ) : (
                "Ingresar Lote de Peces"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </form>
  );
};

export default FormAddPeces;
