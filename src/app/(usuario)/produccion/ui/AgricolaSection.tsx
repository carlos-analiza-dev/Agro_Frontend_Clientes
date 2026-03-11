"use client";
import { meses, tiposCultivo } from "@/helpers/data/dataProduccionFinca";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Sprout } from "lucide-react";
import {
  CreateProduccionFinca,
  CultivoTipo,
} from "@/api/produccion/interface/crear-produccion-finca.interface";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";

interface AgricolaSectionProps {
  control: Control<CreateProduccionFinca>;
  fields: FieldArrayWithId<CreateProduccionFinca, "agricola.cultivos", "id">[];
  append: (obj: {
    tipo: CultivoTipo;
    estacionalidad: string;
    tiempo_estimado_cultivo: string;
    meses_produccion: string[];
    cantidad_producida_hectareas: string;
  }) => void;
  remove: (index: number) => void;
  watch: UseFormWatch<CreateProduccionFinca>;
  fincaSeleccionada: Finca;
}

const AgricolaSection: React.FC<AgricolaSectionProps> = ({
  control,
  fields,
  append,
  remove,
  watch,
  fincaSeleccionada,
}) => {
  const addNewCultivo = () => {
    append({
      tipo: "" as CultivoTipo,
      estacionalidad: "",
      tiempo_estimado_cultivo: "",
      meses_produccion: [],
      cantidad_producida_hectareas: "",
    });
  };

  return (
    <Card className="border-0 md:border shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <Sprout className="h-4 w-4 md:h-5 md:w-5" />
          Producción Agrícola
          <Badge variant="secondary" className="ml-2 text-xs">
            {fields.length} cultivo{fields.length !== 1 ? "s" : ""}
          </Badge>
        </CardTitle>
        <Button
          onClick={addNewCultivo}
          size="sm"
          className="w-full sm:w-auto h-9 text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Agregar Cultivo
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
                <h4 className="font-semibold text-sm md:text-base">
                  Cultivo {index + 1}
                </h4>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="space-y-1.5">
                  <Label className="text-xs md:text-sm">Tipo de cultivo</Label>
                  <Controller
                    control={control}
                    name={`agricola.cultivos.${index}.tipo`}
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="h-9 md:h-10 text-sm">
                          <SelectValue placeholder="Seleccione tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {tiposCultivo.map((tipo) => (
                            <SelectItem
                              key={tipo}
                              value={tipo}
                              className="text-sm"
                            >
                              {tipo}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs md:text-sm">Estacionalidad</Label>
                  <Controller
                    control={control}
                    name={`agricola.cultivos.${index}.estacionalidad`}
                    render={({ field }) => (
                      <Input
                        placeholder="Ej: Primavera/Verano"
                        className="h-9 md:h-10 text-sm"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs md:text-sm">
                    Duración del cultivo
                  </Label>
                  <Controller
                    control={control}
                    name={`agricola.cultivos.${index}.tiempo_estimado_cultivo`}
                    render={({ field }) => (
                      <Input
                        placeholder="Ej: 6 meses"
                        className="h-9 md:h-10 text-sm"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label className="text-xs md:text-sm">
                    Producción por {fincaSeleccionada.medida_finca}
                  </Label>
                  <Controller
                    control={control}
                    name={`agricola.cultivos.${index}.cantidad_producida_hectareas`}
                    render={({ field }) => (
                      <Input
                        type="number"
                        placeholder="Ej: 3000 kg"
                        className="h-9 md:h-10 text-sm"
                        value={field.value || ""}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label className="text-xs md:text-sm">
                  Meses de producción
                </Label>
                <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {meses.map((mes) => (
                    <Controller
                      key={mes}
                      control={control}
                      name={`agricola.cultivos.${index}.meses_produccion`}
                      render={({ field: { value = [], onChange } }) => (
                        <div className="flex items-center space-x-1.5">
                          <Checkbox
                            id={`mes-${index}-${mes}`}
                            checked={value.includes(mes)}
                            onCheckedChange={(checked) => {
                              const newValue = checked
                                ? [...value, mes]
                                : value.filter((item) => item !== mes);
                              onChange(newValue);
                            }}
                            className="h-4 w-4"
                          />
                          <Label
                            htmlFor={`mes-${index}-${mes}`}
                            className="text-xs sm:text-sm cursor-pointer"
                          >
                            {mes}
                          </Label>
                        </div>
                      )}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {fields.length === 0 && (
          <div className="text-center py-8 md:py-12 text-muted-foreground">
            <Sprout className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 opacity-50" />
            <p className="text-sm md:text-base">No hay cultivos agregados</p>
            <Button
              onClick={addNewCultivo}
              variant="outline"
              size="sm"
              className="mt-3 md:mt-4 h-9 text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar primer cultivo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AgricolaSection;
