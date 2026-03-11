"use client";

import React from "react";
import {
  Control,
  Controller,
  FieldArrayWithId,
  UseFormWatch,
} from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Activity, DollarSign } from "lucide-react";
import { CreateProduccionFinca } from "@/api/produccion/interface/crear-produccion-finca.interface";

interface AlternativaSectionProps {
  control: Control<CreateProduccionFinca>;
  fields: FieldArrayWithId<
    CreateProduccionFinca,
    "alternativa.actividades",
    "id"
  >[];
  append: (obj: {
    tipo: string;
    cantidad_producida: string;
    unidad_medida: string;
    ingresos_anuales?: number;
  }) => void;
  remove: (index: number) => void;
  watch: UseFormWatch<CreateProduccionFinca>;
}

const AlternativaSection: React.FC<AlternativaSectionProps> = ({
  control,
  fields,
  append,
  remove,
  watch,
}) => {
  const addNewActividad = () => {
    append({
      tipo: "",
      cantidad_producida: "",
      unidad_medida: "",
      ingresos_anuales: undefined,
    });
  };

  return (
    <Card className="border-0 md:border shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Activity className="h-4 w-4 md:h-5 md:w-5" />
          Actividades Alternativas
          <Badge variant="secondary" className="ml-2 text-xs">
            {fields.length} actividad{fields.length !== 1 ? "es" : ""}
          </Badge>
        </CardTitle>
        <Button
          onClick={addNewActividad}
          size="sm"
          className="w-full sm:w-auto h-9 text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Agregar Actividad
        </Button>
      </CardHeader>

      <CardContent className="px-4 py-3 md:px-6 md:py-4 space-y-3 md:space-y-4">
        {fields.map((field, index) => (
          <Card
            key={field.id}
            className="bg-muted/50 border-0 md:border shadow-sm"
          >
            <CardContent className="p-3 md:p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                  <h4 className="font-semibold text-sm md:text-base">
                    Actividad {index + 1}
                  </h4>
                  {watch(`alternativa.actividades.${index}.tipo`) && (
                    <Badge variant="outline" className="text-xs">
                      {watch(`alternativa.actividades.${index}.tipo`)}
                    </Badge>
                  )}
                </div>

                {fields.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="h-8 w-8 p-0 text-destructive self-end sm:self-auto"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="space-y-3 md:space-y-4">
                <div className="space-y-1.5">
                  <Label className="text-xs md:text-sm">
                    Tipo de actividad
                  </Label>
                  <Controller
                    control={control}
                    name={`alternativa.actividades.${index}.tipo`}
                    render={({ field }) => (
                      <Input
                        placeholder="Ej: Abonos orgánicos, Turismo rural..."
                        className="h-9 md:h-10 text-sm"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs md:text-sm">
                      Cantidad producida
                    </Label>
                    <Controller
                      control={control}
                      name={`alternativa.actividades.${index}.cantidad_producida`}
                      render={({ field }) => (
                        <Input
                          placeholder="Ej: 500 kg"
                          className="h-9 md:h-10 text-sm"
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs md:text-sm">
                      Unidad de medida
                    </Label>
                    <Controller
                      control={control}
                      name={`alternativa.actividades.${index}.unidad_medida`}
                      render={({ field }) => (
                        <Input
                          placeholder="Ej: kilogramos"
                          className="h-9 md:h-10 text-sm"
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label className="flex items-center gap-1 text-xs md:text-sm">
                      <DollarSign className="h-3 w-3 md:h-3.5 md:w-3.5" />
                      Ingresos anuales ($)
                    </Label>
                    <Controller
                      control={control}
                      name={`alternativa.actividades.${index}.ingresos_anuales`}
                      render={({ field }) => (
                        <Input
                          type="number"
                          placeholder="Ej: 1200"
                          className="h-9 md:h-10 text-sm"
                          value={field.value?.toString() || ""}
                          onChange={(e) =>
                            field.onChange(
                              e.target.value
                                ? Number(e.target.value)
                                : undefined,
                            )
                          }
                        />
                      )}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-8 md:py-12 text-muted-foreground">
            <Activity className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 opacity-50" />
            <p className="text-sm md:text-base">
              No hay actividades alternativas agregadas
            </p>
            <p className="text-xs md:text-sm mt-2 text-muted-foreground/80 max-w-md mx-auto">
              Ej: Turismo rural, artesanías, procesamiento de alimentos, abonos
              orgánicos, etc.
            </p>
            <Button
              onClick={addNewActividad}
              variant="outline"
              size="sm"
              className="mt-4 md:mt-6 h-9 text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar primera actividad
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AlternativaSection;
