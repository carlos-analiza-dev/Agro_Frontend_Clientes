"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Loader2, Save, Tractor } from "lucide-react";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { CreateProduccionFinca } from "@/api/produccion/interface/crear-produccion-finca.interface";
import { CrearProduccionFinca } from "@/api/produccion/accions/crear-produccion-finca";
import { toast } from "react-toastify";
import GanaderaSection from "../ui/GanaderaSection";
import AgricolaSection from "../ui/AgricolaSection";
import ForrajesSection from "../ui/ForrajesSection";
import AlternativaSection from "../ui/AlternativaSection";
import ApiculturaSection from "../ui/ApiculturaSection";

type ProductionSection =
  | "ganadera"
  | "alternativa"
  | "forrajes"
  | "agricola"
  | "apicultura";

const CrearProduccionPage = () => {
  const { cliente } = useAuthStore();
  const userId = cliente?.id || "";
  const queryClient = useQueryClient();
  const router = useRouter();
  const [section, setSection] = useState<ProductionSection>("ganadera");
  const [fincaSeleccionada, setFincaSeleccionada] = useState<Finca | null>(
    null,
  );
  const { data: fincas } = useFincasPropietarios(userId);

  const { control, handleSubmit, watch, setValue, reset } =
    useForm<CreateProduccionFinca>();

  const {
    fields: cultivosFields,
    append: appendCultivo,
    remove: removeCultivo,
  } = useFieldArray({
    control,
    name: "agricola.cultivos",
  });

  const {
    fields: insumosFields,
    append: appendInsumo,
    remove: removeInsumo,
  } = useFieldArray({
    control,
    name: "forrajesInsumo.insumos",
  });

  const {
    fields: actividadesFields,
    append: appendActividad,
    remove: removeActividad,
  } = useFieldArray({
    control,
    name: "alternativa.actividades",
  });

  const fincasItems =
    fincas?.data.fincas.map((finca) => ({
      label: finca.nombre_finca,
      value: finca.id,
    })) || [];

  const sectionConfig = {
    ganadera: { label: "Ganadería", icon: "🐄" },
    forrajes: { label: "Forrajes", icon: "🌾" },
    agricola: { label: "Agrícola", icon: "🌱" },
    apicultura: { label: "Apicultura", icon: "🐝" },
    alternativa: { label: "Alternativa", icon: "🔄" },
  };

  const mutate_produccion = useMutation({
    mutationFn: (data: CreateProduccionFinca) => CrearProduccionFinca(data),
    onSuccess: () => {
      toast.success("Producción creada con éxito");
      queryClient.invalidateQueries({ queryKey: ["producciones-user"] });
      reset();
      router.back();
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al ingresar la producción";

        toast.error(errorMessage);
      } else {
        toast.error("Contacte al administrador");
      }
    },
  });

  const onSubmit = (data: CreateProduccionFinca) => {
    const dataUpdate = { ...data, userId: userId };
    mutate_produccion.mutate(dataUpdate);
  };

  const renderSection = () => {
    if (!fincaSeleccionada) {
      return (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <Tractor className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base px-4">
                Selecciona una finca para habilitar las secciones de producción
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    switch (section) {
      case "ganadera":
        return <GanaderaSection control={control} watch={watch} />;
      case "agricola":
        return (
          <AgricolaSection
            control={control}
            fields={cultivosFields}
            append={appendCultivo}
            remove={removeCultivo}
            watch={watch}
            fincaSeleccionada={fincaSeleccionada}
          />
        );
      case "forrajes":
        return (
          <ForrajesSection
            control={control}
            fields={insumosFields}
            append={appendInsumo}
            remove={removeInsumo}
            watch={watch}
            fincaSeleccionada={fincaSeleccionada}
          />
        );
      case "alternativa":
        return (
          <AlternativaSection
            control={control}
            fields={actividadesFields}
            append={appendActividad}
            remove={removeActividad}
            watch={watch}
          />
        );
      case "apicultura":
        return <ApiculturaSection control={control} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="px-4 py-3 md:px-6 md:py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/produccion")}
            className="gap-2 -ml-2"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Volver</span>
          </Button>
          <h1 className="text-lg md:text-xl font-semibold truncate">
            Nueva Producción
          </h1>
          <div className="w-16 md:w-20" />
        </div>
      </div>

      <div className="px-4 py-4 md:px-6 md:py-6 max-w-4xl mx-auto">
        <Card className="w-full shadow-sm">
          <CardHeader className="px-4 py-4 md:px-6 md:py-6">
            <CardTitle className="text-lg md:text-2xl font-bold flex items-center gap-2">
              <Tractor className="h-5 w-5 md:h-6 md:w-6" />
              <span>Crear Nueva Producción</span>
            </CardTitle>
          </CardHeader>

          <CardContent className="px-4 py-4 md:px-6 md:py-6 space-y-4 md:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="finca" className="text-sm md:text-base">
                Seleccionar Finca <span className="text-red-500">*</span>
              </Label>
              <Controller
                control={control}
                name="fincaId"
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const finca = fincas?.data.fincas.find(
                        (f) => f.id === value,
                      );
                      setFincaSeleccionada(finca || null);
                    }}
                  >
                    <SelectTrigger id="finca" className="h-11 md:h-10">
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
                )}
              />
            </div>

            <Separator className="my-2" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
              {[
                { name: "produccion_mixta", label: "Producción mixta" },
                {
                  name: "transformacion_artesanal",
                  label: "Transformación artesanal",
                },
                { name: "consumo_propio", label: "Consumo propio" },
                { name: "produccion_venta", label: "Producción para venta" },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <Label
                    htmlFor={item.name}
                    className="text-sm md:text-base cursor-pointer flex-1 pr-2"
                  >
                    {item.label}
                  </Label>
                  <Controller
                    control={control}
                    name={item.name as any}
                    render={({ field }) => (
                      <Switch
                        id={item.name}
                        checked={field.value ?? false}
                        onCheckedChange={field.onChange}
                      />
                    )}
                  />
                </div>
              ))}
            </div>

            <Separator className="my-2" />

            <div className="space-y-3 md:space-y-4">
              <Label className="text-sm md:text-base font-medium">
                Sección de Producción
              </Label>

              <div className="-mx-4 px-4 overflow-x-auto pb-2 md:pb-0 md:overflow-visible">
                <Tabs
                  value={section}
                  onValueChange={(value) =>
                    setSection(value as ProductionSection)
                  }
                >
                  <TabsList className="inline-flex w-auto min-w-full md:grid md:grid-cols-5 gap-1 p-1">
                    {Object.entries(sectionConfig).map(([key, config]) => (
                      <TabsTrigger
                        key={key}
                        value={key}
                        disabled={!fincaSeleccionada}
                        className="flex items-center gap-1 md:gap-2 px-3 py-2 text-sm"
                      >
                        <span className="text-base">{config.icon}</span>
                        <span className="text-xs md:text-sm whitespace-nowrap">
                          {config.label}
                        </span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>

              <ScrollArea className="h-[400px] md:h-[500px] w-full rounded-md border p-3 md:p-4">
                {renderSection()}
              </ScrollArea>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleSubmit(onSubmit)}
                disabled={mutate_produccion.isPending || !fincaSeleccionada}
                className="w-full md:w-auto md:min-w-[200px] h-12 md:h-10 text-sm md:text-base"
                size="lg"
              >
                {mutate_produccion.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Producción
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrearProduccionPage;
