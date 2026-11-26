"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

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
  Type,
  Map,
  Layers,
  Save,
  Navigation,
} from "lucide-react";

import { TipoExplotacion } from "@/helpers/data/tipoExplotacion";
import useGetDeptosActivesByPais from "@/hooks/departamentos/useGetDeptosActivesByPais";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { toast } from "react-toastify";
import { CrearFinca } from "@/api/fincas/interfaces/crear-finca.interface";
import { CreateFinca } from "@/api/fincas/accions/crear-finca";
import EspecieCantidadPicker from "./ui/EspecieCantidadPicker";
import MapaSeleccionDireccion from "@/components/maps/MapaSeleccionDireccion";

const createFincaSchema = (t: (key: any) => string) =>
  z
    .object({
      nombre_finca: z.string().min(1, t("validation.farmNameRequired")),
      ubicacion: z.string().min(1, t("validation.locationRequired")),
      abreviatura: z.string().optional(),
      pais_id: z.string().min(1, t("validation.countryRequired")),
      departamentoId: z.string().min(1, t("validation.departmentRequired")),
      municipioId: z.string().min(1, t("validation.municipalityRequired")),
      tamaño_total: z.string().min(1, t("validation.totalSizeRequired")),
      area_ganaderia: z.string().optional(),
      area_agricola: z.string().optional(),
      tipo_explotacion: z.array(
        z.object({
          tipo_explotacion: z.string(),
        }),
      ),
      especies_maneja: z
        .array(
          z.object({
            especie: z.string(),
            cantidad: z
              .number()
              .min(1, t("validation.quantityGreaterThanZero")),
          }),
        )
        .min(1, t("validation.minimumOneSpecies")),
      latitud: z.number().optional(),
      longitud: z.number().optional(),
    })
    .refine(
      (data) => !!data.area_ganaderia?.trim() || !!data.area_agricola?.trim(),
      {
        message: t("validation.minimumOneArea"),
        path: ["area_ganaderia"],
      },
    );

type FincaFormData = z.infer<ReturnType<typeof createFincaSchema>>;

export default function CrearFincaPage() {
  const t = useTranslations("crearFinca");

  const fincaSchema = createFincaSchema(t);

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
  const especiesManeja = watch("especies_maneja") || [];

  const cantidadAnimalesTotal = especiesManeja.reduce(
    (sum, item) => sum + (item.cantidad || 0),
    0,
  );

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
      const totalAnimales = data.especies_maneja.reduce(
        (sum, item) => sum + item.cantidad,
        0,
      );

      if (totalAnimales === 0) {
        toast.error(t("messages.minimumOneAnimal"));
        return;
      }

      const fincaData: CrearFinca = {
        ...data,
        cantidad_animales: totalAnimales,
        medida_finca: unidadMedida,
        pais_id: paisId,
        propietario_id: cliente?.id || "",
      };

      const response = await CreateFinca(fincaData);

      queryClient.invalidateQueries({ queryKey: ["fincas-propietario"] });
      queryClient.invalidateQueries({ queryKey: ["especies-fincas"] });

      if (response.status === 201) {
        toast.success(t("messages.createSuccess"));
        setExplotacionSeleccionada([]);
        reset();
        router.push("/animales/crear-animal");
      }
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;

        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("messages.createError");

        toast.error(errorMessage);
      } else {
        toast.error(t("messages.unexpectedError"));
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

  return (
    <div className="min-h-screen bg-background p-4">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Home className="h-6 w-6" />
            {t("title")}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <ScrollArea className="h-[calc(100vh-200px)] pr-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre_finca">{t("fields.farmName")}</Label>

                  <div className="relative">
                    <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="nombre_finca"
                      placeholder={t("placeholders.farmName")}
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
                  <Label htmlFor="ubicacion">{t("fields.location")}</Label>

                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="ubicacion"
                      placeholder={t("placeholders.location")}
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
                      aria-label={t("buttons.selectLocation")}
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

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="abreviatura">
                      {t("fields.abbreviation")}
                    </Label>

                    <div className="relative">
                      <Type className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="abreviatura"
                        placeholder={t("placeholders.abbreviation")}
                        className="pl-10"
                        {...register("abreviatura")}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paisId && (
                    <div className="space-y-2">
                      <Label htmlFor="departamentoId">
                        {t("fields.department")}
                      </Label>

                      <Select
                        onValueChange={(value) =>
                          setValue("departamentoId", value)
                        }
                      >
                        <SelectTrigger>
                          <Map className="h-4 w-4 mr-2" />
                          <SelectValue
                            placeholder={t("placeholders.department")}
                          />
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
                    <Label htmlFor="municipioId">
                      {t("fields.municipality")}
                    </Label>

                    <Select
                      onValueChange={(value) => setValue("municipioId", value)}
                    >
                      <SelectTrigger>
                        <MapPin className="h-4 w-4 mr-2" />
                        <SelectValue
                          placeholder={t("placeholders.municipality")}
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {municipiosItems.length > 0 ? (
                          municipiosItems.map((mun) => (
                            <SelectItem key={mun.value} value={mun.value}>
                              {mun.label}
                            </SelectItem>
                          ))
                        ) : (
                          <p className="p-2 text-sm text-muted-foreground">
                            {t("messages.noMunicipalities")}
                          </p>
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
                  <Label>{t("fields.farmMeasurement")}</Label>

                  <p className="text-sm font-medium">
                    {t("fields.selectedMeasure")}: {unidadMedida}
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      {
                        value: "ha",
                        label: t("units.hectare"),
                      },
                      {
                        value: "mz",
                        label: t("units.manzana"),
                      },
                      {
                        value: "m2",
                        label: t("units.squareMeters"),
                      },
                      {
                        value: "ac",
                        label: t("units.acres"),
                      },
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="tamaño_total">
                      {t("fields.totalSize", { unit: unidadMedida })}
                    </Label>

                    <div className="relative">
                      <Map className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="tamaño_total"
                        type="number"
                        placeholder={t("placeholders.totalSize", {
                          unit: unidadMedida,
                        })}
                        className="pl-10"
                        min={0}
                        step={0.5}
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
                      {t("fields.livestockArea", { unit: unidadMedida })}
                    </Label>

                    <div className="relative">
                      <Layers className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="area_ganaderia"
                        type="number"
                        placeholder={t("placeholders.livestockArea", {
                          unit: unidadMedida,
                        })}
                        className="pl-10"
                        min={0}
                        {...register("area_ganaderia")}
                      />
                    </div>

                    {errors.area_ganaderia && (
                      <p className="text-sm text-destructive">
                        {errors.area_ganaderia.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area_agricola">
                      {t("fields.agriculturalArea", { unit: unidadMedida })}
                    </Label>

                    <div className="relative">
                      <Layers className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="area_agricola"
                        type="number"
                        placeholder={t("placeholders.agriculturalArea", {
                          unit: unidadMedida,
                        })}
                        className="pl-10"
                        min={0}
                        {...register("area_agricola")}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>{t("fields.exploitationType")}</Label>

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
                          {t(`tipoExplotacion.${explotacion.id}`)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>{t("fields.speciesAndQuantities")}</Label>

                  <EspecieCantidadPicker
                    value={watch("especies_maneja") || []}
                    onChange={(val) => setValue("especies_maneja", val)}
                    cantidadTotal={cantidadAnimalesTotal}
                  />

                  {errors.especies_maneja && (
                    <p className="text-sm text-destructive">
                      {errors.especies_maneja.message}
                    </p>
                  )}
                </div>
              </div>
            </ScrollArea>

            <div className="flex justify-end pt-4">
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                <Save className="h-4 w-4" />
                {isSubmitting ? t("buttons.creating") : t("buttons.saveFarm")}
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
