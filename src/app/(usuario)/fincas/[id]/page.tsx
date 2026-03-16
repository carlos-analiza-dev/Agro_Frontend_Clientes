"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Home,
  MapPin,
  PawPrint,
  Type,
  Map,
  Layers,
  Save,
  ArrowLeft,
} from "lucide-react";

import { ActualizarFinca } from "@/api/fincas/accions/update-finca";
import { CrearFinca } from "@/api/fincas/interfaces/crear-finca.interface";
import { TipoExplotacion } from "@/helpers/data/tipoExplotacion";
import useFincasById from "@/hooks/fincas/useFincasById";
import EspecieCantidadPicker from "../crear-fincas/ui/EspecieCantidadPicker";
import MapaSeleccionDireccion from "../crear-fincas/ui/MapaSeleccionDireccion";
import ButtonBack from "@/components/generics/ButtonBack";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";

const fincaSchema = z.object({
  nombre_finca: z.string().min(1, "El nombre de la finca es requerido"),
  cantidad_animales: z.number().min(1, "Debe haber al menos 1 animal"),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  abreviatura: z.string().optional(),
  tamaño_total: z.string().min(1, "El tamaño total es requerido"),
  area_ganaderia: z.string().min(1, "El área de ganadería es requerida"),
  tipo_explotacion: z.array(z.object({ tipo_explotacion: z.string() })),
  especies_maneja: z.array(
    z.object({ especie: z.string(), cantidad: z.number() }),
  ),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
});

type FincaFormData = z.infer<typeof fincaSchema>;

type UnidadMedida = "ha" | "mz" | "m2" | "km2" | "ac" | "ft2" | "yd2";

export default function FincaDetailsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [unidadMedida, setUnidadMedida] = useState<UnidadMedida>("ha");
  const [explotacionSeleccionada, setExplotacionSeleccionada] = useState<
    string[]
  >([]);

  const params = useParams();

  const fincaId = params.id as string;
  const { data: finca, isLoading, isError } = useFincasById(fincaId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FincaFormData>({
    defaultValues: {
      especies_maneja: [],
      tipo_explotacion: [],
    },
  });

  const cantidadAnimales = watch("cantidad_animales");

  useEffect(() => {
    if (finca?.data) {
      const fincaData = finca.data;
      const unidadesValidas: UnidadMedida[] = [
        "ha",
        "mz",
        "m2",
        "km2",
        "ac",
        "ft2",
        "yd2",
      ];
      const medidaFinca = unidadesValidas.includes(
        fincaData.medida_finca as UnidadMedida,
      )
        ? (fincaData.medida_finca as UnidadMedida)
        : "ha";

      reset({
        nombre_finca: fincaData.nombre_finca,
        abreviatura: fincaData.abreviatura || "",
        ubicacion: fincaData.ubicacion,
        latitud: fincaData.latitud,
        longitud: fincaData.longitud,
        cantidad_animales: fincaData.cantidad_animales,
        tamaño_total: fincaData.tamaño_total,
        area_ganaderia: fincaData.area_ganaderia,
        especies_maneja: fincaData.especies_maneja || [],
        tipo_explotacion: fincaData.tipo_explotacion || [],
      });

      setUnidadMedida(medidaFinca);

      if (finca.data.tipo_explotacion) {
        const explotacion = finca.data.tipo_explotacion.map(
          (a) => a.tipo_explotacion,
        );
        setExplotacionSeleccionada(explotacion);
      }
    }
  }, [finca, reset]);

  const onSubmit = async (data: FincaFormData) => {
    try {
      const sumaEspecies = data.especies_maneja.reduce(
        (sum, item) => sum + item.cantidad,
        0,
      );

      if (sumaEspecies !== data.cantidad_animales) {
        toast.error(
          `La suma de especies debe ser igual a ${data.cantidad_animales}`,
        );
        return;
      }

      const fincaData: Partial<CrearFinca> = {
        ...data,
        medida_finca: unidadMedida,
      };

      const response = await ActualizarFinca(fincaId, fincaData);

      if (response.status === 200) {
        toast.success("Finca actualizada correctamente");

        router.push("/fincas");
        reset();
        queryClient.invalidateQueries({ queryKey: ["fincas-propietario"] });
        queryClient.invalidateQueries({ queryKey: ["finca", fincaId] });
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message || "No se pudo actualizar la finca";
        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado al actualizar la finca");
      }
    }
  };

  const handleAlimentoChange = (alimento: string) => {
    const nuevasExplotacion = explotacionSeleccionada.includes(alimento)
      ? explotacionSeleccionada.filter((a) => a !== alimento)
      : [...explotacionSeleccionada, alimento];

    setExplotacionSeleccionada(nuevasExplotacion);
    setValue(
      "tipo_explotacion",
      nuevasExplotacion.map((a) => ({ tipo_explotacion: a })),
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <Skeleton className="h-8 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isError || !finca) {
    return (
      <div className="min-h-screen bg-background p-4 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-destructive mb-2">Error</h2>
            <p className="text-muted-foreground mb-4">
              No se pudo cargar la información de la finca
            </p>
            <Button onClick={() => router.push("/fincas")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a fincas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <ButtonBack isMobil={isMobile} />
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6"></div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Home className="h-6 w-6" />
              Editar Finca
            </CardTitle>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <ScrollArea className="h-[calc(100vh-250px)] pr-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre_finca">Nombre de la finca</Label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="nombre_finca"
                        placeholder="Nombre de la finca"
                        className="pl-10"
                        {...register("nombre_finca")}
                      />
                    </div>
                    {errors.nombre_finca && (
                      <p className="text-sm text-destructive">
                        {errors.nombre_finca.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ubicacion">Ubicación</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="ubicacion"
                        placeholder="Ubicación"
                        className="pl-10 cursor-pointer"
                        readOnly
                        value={watch("ubicacion") || ""}
                        onClick={() => setModalVisible(true)}
                      />
                    </div>
                    {errors.ubicacion && (
                      <p className="text-sm text-destructive">
                        {errors.ubicacion.message}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="cantidad_animales">
                        Cantidad de animales
                      </Label>
                      <div className="relative">
                        <PawPrint className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="cantidad_animales"
                          type="number"
                          placeholder="Número de animales"
                          className="pl-10"
                          {...register("cantidad_animales", {
                            valueAsNumber: true,
                          })}
                        />
                      </div>
                      {errors.cantidad_animales && (
                        <p className="text-sm text-destructive">
                          {errors.cantidad_animales.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="abreviatura">
                        Abreviatura (opcional)
                      </Label>
                      <div className="relative">
                        <Type className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="abreviatura"
                          placeholder="Abreviatura"
                          className="pl-10"
                          {...register("abreviatura")}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Unidad de medida</Label>
                    <p className="text-sm font-medium">
                      Medida seleccionada: {unidadMedida}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                      {[
                        { value: "ha", label: "Hectárea (ha)" },
                        { value: "mz", label: "Manzana (mz)" },
                        { value: "m2", label: "Metros cuadrados (m²)" },
                        { value: "ac", label: "Acres (ac)" },
                      ].map((medida) => (
                        <div
                          key={medida.value}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={medida.value}
                            checked={unidadMedida === medida.value}
                            onCheckedChange={() =>
                              setUnidadMedida(medida.value as UnidadMedida)
                            }
                          />
                          <label
                            htmlFor={medida.value}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {medida.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="tamaño_total">
                        Tamaño total ({unidadMedida})
                      </Label>
                      <div className="relative">
                        <Map className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="tamaño_total"
                          type="number"
                          placeholder={`Tamaño total en ${unidadMedida}`}
                          className="pl-10"
                          {...register("tamaño_total")}
                        />
                      </div>
                      {errors.tamaño_total && (
                        <p className="text-sm text-destructive">
                          {errors.tamaño_total.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="area_ganaderia">
                        Área de ganadería ({unidadMedida})
                      </Label>
                      <div className="relative">
                        <Layers className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="area_ganaderia"
                          type="number"
                          placeholder={`Área de ganadería en ${unidadMedida}`}
                          className="pl-10"
                          {...register("area_ganaderia")}
                        />
                      </div>
                      {errors.area_ganaderia && (
                        <p className="text-sm text-destructive">
                          {errors.area_ganaderia.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Tipo de explotación</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {TipoExplotacion.map((explotacion) => (
                        <div
                          key={explotacion.id}
                          className="flex items-center space-x-2"
                        >
                          <Checkbox
                            id={explotacion.explotacion}
                            checked={explotacionSeleccionada.includes(
                              explotacion.explotacion,
                            )}
                            onCheckedChange={() =>
                              handleAlimentoChange(explotacion.explotacion)
                            }
                          />
                          <label
                            htmlFor={explotacion.explotacion}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            {explotacion.explotacion}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Especies y cantidades</Label>
                    <EspecieCantidadPicker
                      value={watch("especies_maneja") || []}
                      onChange={(val) => setValue("especies_maneja", val)}
                      cantidadTotal={cantidadAnimales || 0}
                    />
                  </div>

                  <div className="flex justify-end pt-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="gap-2"
                    >
                      <Save className="h-4 w-4" />
                      {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </form>
          </CardContent>
        </Card>
      </div>

      <MapaSeleccionDireccion
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLocationSelect={(direccion, coords) => {
          setValue("ubicacion", direccion);
          setValue("latitud", coords.latitude);
          setValue("longitud", coords.longitude);
        }}
        initialCoords={
          watch("latitud") && watch("longitud")
            ? {
                latitude: Number(watch("latitud")),
                longitude: Number(watch("longitud")),
              }
            : undefined
        }
      />
    </div>
  );
}
