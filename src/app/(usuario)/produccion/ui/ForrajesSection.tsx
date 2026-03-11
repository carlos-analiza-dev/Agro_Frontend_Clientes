"use client";
import {
  meses,
  tiposHeno,
  tiposInsumo,
} from "@/helpers/data/dataProduccionFinca";
import React from "react";
import { Control, Controller, UseFormWatch } from "react-hook-form";
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
import { Plus, Trash2, BarrelIcon } from "lucide-react";
import {
  CreateProduccionFinca,
  InsumoTipo,
} from "@/api/produccion/interface/crear-produccion-finca.interface";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";

interface InsumoItem {
  id: string;
  tipo: InsumoTipo;
  tipo_heno?: string;
  estacionalidad_heno?: string;
  meses_produccion_heno?: string[];
  produccion_manzana?: string;
  tiempo_estimado_cultivo?: string;
}

interface ForrajesSectionProps {
  control: Control<CreateProduccionFinca>;
  fields: InsumoItem[];
  append: (obj: { tipo: InsumoTipo }) => void;
  remove: (index: number) => void;
  watch: UseFormWatch<CreateProduccionFinca>;
  fincaSeleccionada: Finca | null;
}

const ForrajesSection: React.FC<ForrajesSectionProps> = ({
  control,
  fields,
  append,
  remove,
  watch,
  fincaSeleccionada,
}) => {
  const addNewInsumo = () => {
    append({
      tipo: "Heno" as InsumoTipo,
    });
  };

  return (
    <Card className="border-0 md:border shadow-sm">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-4 py-3 md:px-6 md:py-4">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <BarrelIcon className="h-4 w-4 md:h-5 md:w-5" />
          Forrajes e Insumos
          <Badge variant="secondary" className="ml-2 text-xs">
            {fields.length} insumo{fields.length !== 1 ? "s" : ""}
          </Badge>
        </CardTitle>
        <Button
          onClick={addNewInsumo}
          size="sm"
          className="w-full sm:w-auto h-9 text-sm"
        >
          <Plus className="h-4 w-4 mr-1" />
          Agregar Insumo
        </Button>
      </CardHeader>

      <CardContent className="px-4 py-3 md:px-6 md:py-4 space-y-3 md:space-y-4">
        {fields.map((field, index) => {
          const currentTipo = watch(`forrajesInsumo.insumos.${index}.tipo`);
          const isHeno = currentTipo === "Heno";

          return (
            <Card
              key={field.id}
              className="bg-muted/50 border-0 md:border shadow-sm"
            >
              <CardContent className="p-3 md:p-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <h4 className="font-semibold text-sm md:text-base">
                      Insumo {index + 1}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {currentTipo}
                    </Badge>
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
                    <Label className="text-xs md:text-sm font-medium">
                      Tipo de insumo
                    </Label>
                    <Controller
                      control={control}
                      name={`forrajesInsumo.insumos.${index}.tipo`}
                      render={({ field }) => (
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="h-9 md:h-10 text-sm">
                            <SelectValue placeholder="Seleccione tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            {tiposInsumo.map((tipo) => (
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

                  {isHeno ? (
                    <>
                      <div className="space-y-1.5">
                        <Label className="text-xs md:text-sm">
                          Tipo de heno
                        </Label>
                        <Controller
                          control={control}
                          name={`forrajesInsumo.insumos.${index}.tipo_heno`}
                          render={({ field }) => (
                            <Select
                              value={field.value || ""}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger className="h-9 md:h-10 text-sm">
                                <SelectValue placeholder="Seleccione tipo de heno" />
                              </SelectTrigger>
                              <SelectContent>
                                {tiposHeno.map((tipo) => (
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
                        <Label className="text-xs md:text-sm">
                          Estacionalidad
                        </Label>
                        <Controller
                          control={control}
                          name={`forrajesInsumo.insumos.${index}.estacionalidad_heno`}
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

                      <div className="space-y-2">
                        <Label className="text-xs md:text-sm">
                          Meses de producción
                        </Label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                          {meses.map((mes) => (
                            <Controller
                              key={mes}
                              control={control}
                              name={`forrajesInsumo.insumos.${index}.meses_produccion_heno`}
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
                    </>
                  ) : (
                    <>
                      <div className="space-y-1.5">
                        <Label className="text-xs md:text-sm">
                          Producción por{" "}
                          {fincaSeleccionada?.medida_finca || "hectárea"}
                        </Label>
                        <Controller
                          control={control}
                          name={`forrajesInsumo.insumos.${index}.produccion_manzana`}
                          render={({ field }) => (
                            <Input
                              type="number"
                              placeholder="Ej: 15 toneladas"
                              className="h-9 md:h-10 text-sm"
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <Label className="text-xs md:text-sm">
                          Tiempo estimado de cultivo
                        </Label>
                        <Controller
                          control={control}
                          name={`forrajesInsumo.insumos.${index}.tiempo_estimado_cultivo`}
                          render={({ field }) => (
                            <Input
                              placeholder="Ej: 3 meses"
                              className="h-9 md:h-10 text-sm"
                              value={field.value || ""}
                              onChange={field.onChange}
                            />
                          )}
                        />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {fields.length === 0 && (
          <div className="text-center py-8 md:py-12 text-muted-foreground">
            <BarrelIcon className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-3 md:mb-4 opacity-50" />
            <p className="text-sm md:text-base">No hay insumos agregados</p>
            <Button
              onClick={addNewInsumo}
              variant="outline"
              size="sm"
              className="mt-3 md:mt-4 h-9 text-sm"
            >
              <Plus className="h-4 w-4 mr-1" />
              Agregar primer insumo
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ForrajesSection;
