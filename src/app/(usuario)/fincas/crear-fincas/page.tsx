"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";

import { z } from "zod";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Home,
  MapPin,
  PawPrint,
  Type,
  Globe,
  Map,
  Layers,
  Save,
  Navigation,
  ArrowLeft,
} from "lucide-react";

import { TipoExplotacion } from "@/helpers/data/tipoExplotacion";
import useGetDeptosActivesByPais from "@/hooks/departamentos/useGetDeptosActivesByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { toast } from "react-toastify";
import { CrearFinca } from "@/api/fincas/interfaces/crear-finca.interface";
import { CreateFinca } from "@/api/fincas/accions/crear-finca";
import EspecieCantidadPicker from "./ui/EspecieCantidadPicker";
import MapaSeleccionDireccion from "./ui/MapaSeleccionDireccion";

const fincaSchema = z.object({
  nombre_finca: z.string().min(1, "El nombre de la finca es requerido"),
  cantidad_animales: z.number().min(1, "Debe haber al menos 1 animal"),
  ubicacion: z.string().min(1, "La ubicación es requerida"),
  abreviatura: z.string().optional(),
  pais_id: z.string().min(1, "Debe seleccionar un país"),
  departamentoId: z.string().min(1, "Debe seleccionar un departamento"),
  municipioId: z.string().min(1, "Debe seleccionar un municipio"),
  tamaño_total: z.string().min(1, "El tamaño total es requerido"),
  area_ganaderia: z.string().min(1, "El área de ganadería es requerida"),
  tipo_explotacion: z.array(z.object({ tipo_explotacion: z.string() })),
  especies_maneja: z.array(
    z.object({ especie: z.string(), cantidad: z.number() })
  ),
  latitud: z.number().optional(),
  longitud: z.number().optional(),
});

type FincaFormData = z.infer<typeof fincaSchema>;

export default function CrearFincaPage() {
  const { cliente } = useAuthStore();
  const paisId = cliente?.pais.id || "";
  const router = useRouter();
  const queryClient = useQueryClient();
  const [modalVisible, setModalVisible] = useState(false);
  const [unidadMedida, setUnidadMedida] = useState<
    "ha" | "mz" | "m2" | "km2" | "ac" | "ft2" | "yd2"
  >("ha");
  const [explotacionSeleccionada, setExplotacionSeleccionada] = useState<
    string[]
  >([]);

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

  const selectedDeptoId = watch("departamentoId");
  const cantidadAnimales = watch("cantidad_animales");
  const { data: deptos } = useGetDeptosActivesByPais(paisId);
  const { data: municipios } = useGetMunicipiosActivosByDepto(selectedDeptoId);

  const departmentItems =
    deptos?.data.map((depto) => ({
      label: depto.nombre,
      value: depto.id.toString(),
    })) || [];

  const municipiosItems =
    municipios?.data.map((mun) => ({
      label: mun.nombre,
      value: mun.id.toString(),
    })) || [];

  const onSubmit = async (data: FincaFormData) => {
    try {
      const sumaEspecies = data.especies_maneja.reduce(
        (sum, item) => sum + item.cantidad,
        0
      );

      if (sumaEspecies !== data.cantidad_animales) {
        toast.error(
          `La suma de especies debe ser igual a ${data.cantidad_animales}`
        );
        return;
      }

      const fincaData: CrearFinca = {
        ...data,
        medida_finca: unidadMedida,
        pais_id: paisId,
        propietario_id: cliente?.id || "",
      };

      const response = await CreateFinca(fincaData);
      queryClient.invalidateQueries({ queryKey: ["fincas-propietario"] });

      if (response.status === 201) {
        toast.success("Finca creada correctamente");
        setExplotacionSeleccionada([]);
        reset();
        router.push("/fincas");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al crear la finca";

        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
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
      nuevasExplotacion.map((a) => ({ tipo_explotacion: a }))
    );
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex items-center justify-between mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/fincas")}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Home className="h-6 w-6" />
            Crear Nueva Finca
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
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
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="absolute right-1 top-1 h-8 w-8"
                      onClick={() => setModalVisible(true)}
                    >
                      <Navigation className="h-4 w-4" />
                    </Button>
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
                      Abreviatura de finca (opcional)
                    </Label>
                    <div className="relative">
                      <Type className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="abreviatura"
                        placeholder="Abreviatura de finca"
                        className="pl-10"
                        {...register("abreviatura")}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paisId && (
                    <div className="space-y-2">
                      <Label htmlFor="departamentoId">Departamento</Label>
                      <Select
                        onValueChange={(value) =>
                          setValue("departamentoId", value)
                        }
                      >
                        <SelectTrigger>
                          <Map className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Departamento" />
                        </SelectTrigger>
                        <SelectContent>
                          {departmentItems.map((depto) => (
                            <SelectItem key={depto.value} value={depto.value}>
                              {depto.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.departamentoId && (
                        <p className="text-sm text-destructive">
                          {errors.departamentoId.message}
                        </p>
                      )}
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="municipioId">Municipio</Label>
                    <Select
                      onValueChange={(value) => setValue("municipioId", value)}
                    >
                      <SelectTrigger>
                        <MapPin className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Municipio" />
                      </SelectTrigger>
                      <SelectContent>
                        {municipiosItems && municipiosItems.length > 0 ? (
                          municipiosItems.map((mun) => (
                            <SelectItem key={mun.value} value={mun.value}>
                              {mun.label}
                            </SelectItem>
                          ))
                        ) : (
                          <p>No se encontraron municipios</p>
                        )}
                      </SelectContent>
                    </Select>
                    {errors.municipioId && (
                      <p className="text-sm text-destructive">
                        {errors.municipioId.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>¿Con qué medidas conoces tu finca?</Label>
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
                            setUnidadMedida(medida.value as any)
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
                            explotacion.explotacion
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
              </div>
            </ScrollArea>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Save className="h-4 w-4" />
                {isSubmitting ? "Creando..." : "Guardar Finca"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <MapaSeleccionDireccion
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onLocationSelect={(direccion, coords) => {
          setValue("ubicacion", direccion);
          setValue("latitud", coords.latitude);
          setValue("longitud", coords.longitude);
        }}
      />
    </div>
  );
}
