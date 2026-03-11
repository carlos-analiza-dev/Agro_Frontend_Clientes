"use client";
import { calidadHuevosData } from "@/helpers/data/calidadHuevos";
import React from "react";
import { Control, Controller, UseFormWatch } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Beef,
  Drumstick,
  Feather,
  Leaf,
  Droplet,
  Milk,
  Egg,
} from "lucide-react";

import {
  CreateProduccionFinca,
  TipoProduccionGanadera,
} from "@/api/produccion/interface/crear-produccion-finca.interface";
import { tiposProduccion } from "@/helpers/data/dataProduccionFinca copy";
import { unidadLeche } from "@/helpers/data/dataProduccionFinca";

interface Props {
  control: Control<CreateProduccionFinca>;
  watch: UseFormWatch<CreateProduccionFinca>;
}

const GanaderaSection: React.FC<Props> = ({ control, watch }) => {
  const itemsHuevos =
    calidadHuevosData.map((calidad) => ({
      label: calidad.label,
      value: calidad.value.toString(),
    })) || [];

  const sectionIcons = {
    [TipoProduccionGanadera.LECHE]: Milk,
    [TipoProduccionGanadera.CARNE_BOVINA]: Beef,
    [TipoProduccionGanadera.CARNE_PORCINA]: Drumstick,
    [TipoProduccionGanadera.CARNE_AVE]: Feather,
    [TipoProduccionGanadera.HUEVO]: Egg,
    [TipoProduccionGanadera.CARNE_CAPRINO]: Droplet,
    [TipoProduccionGanadera.GANADO_PIE]: Beef,
    [TipoProduccionGanadera.OTRO]: Beef,
  };

  const sectionTitles = {
    [TipoProduccionGanadera.LECHE]: "Producción de Leche",
    [TipoProduccionGanadera.CARNE_BOVINA]: "Producción de Carne Bovina",
    [TipoProduccionGanadera.CARNE_PORCINA]: "Producción de Carne Porcina",
    [TipoProduccionGanadera.CARNE_AVE]: "Producción Carne de Ave",
    [TipoProduccionGanadera.HUEVO]: "Producción de Huevo",
    [TipoProduccionGanadera.CARNE_CAPRINO]: "Producción de Carne Caprino",
    [TipoProduccionGanadera.GANADO_PIE]: "Ganado en Pie",
    [TipoProduccionGanadera.OTRO]: "Otro tipo de producción",
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Card className="border-0 md:border shadow-sm">
        <CardHeader className="px-4 py-3 md:px-6 md:py-4">
          <CardTitle className="flex items-center gap-2 text-base md:text-xl">
            <Beef className="h-4 w-4 md:h-5 md:w-5" />
            Producción Ganadera
          </CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-3 md:px-6 md:py-4 space-y-4 md:space-y-6">
          <div className="space-y-3">
            <Label className="text-sm md:text-base font-semibold">
              Tipos de Producción:
            </Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-3">
              {tiposProduccion.map((tipo) => {
                const IconComponent =
                  sectionIcons[tipo as TipoProduccionGanadera];
                return (
                  <Controller
                    key={tipo}
                    control={control}
                    name="ganadera.tiposProduccion"
                    render={({ field: { value = [], onChange } }) => (
                      <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                        <Checkbox
                          id={`tipo-${tipo}`}
                          checked={value.includes(tipo)}
                          onCheckedChange={(checked) => {
                            const newValue = checked
                              ? [...value, tipo]
                              : value.filter((item) => item !== tipo);
                            onChange(newValue);
                          }}
                        />
                        <Label
                          htmlFor={`tipo-${tipo}`}
                          className="flex items-center gap-2 text-xs md:text-sm font-normal cursor-pointer flex-1"
                        >
                          {IconComponent && (
                            <IconComponent className="h-3 w-3 md:h-4 md:w-4 flex-shrink-0" />
                          )}
                          <span className="line-clamp-2">{tipo}</span>
                        </Label>
                      </div>
                    )}
                  />
                );
              })}
            </div>
          </div>

          <Separator className="my-2" />

          <div className="space-y-4 md:space-y-6">
            {watch("ganadera.tiposProduccion")?.includes(
              TipoProduccionGanadera.LECHE,
            ) && (
              <Card className="border-l-4 border-l-blue-500 shadow-sm">
                <CardHeader className="px-3 py-2 md:px-4 md:py-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base font-semibold">
                    <Milk className="h-3 w-3 md:h-4 md:w-4" />
                    {sectionTitles[TipoProduccionGanadera.LECHE]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 py-2 md:px-4 md:py-3 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="produccionLecheCantidad"
                        className="text-xs md:text-sm"
                      >
                        Cantidad de producción
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.produccionLecheCantidad"
                        render={({ field }) => (
                          <Input
                            id="produccionLecheCantidad"
                            type="number"
                            placeholder="Cantidad"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="produccionLecheUnidad"
                        className="text-xs md:text-sm"
                      >
                        Unidad de medida
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.produccionLecheUnidad"
                        render={({ field }) => (
                          <Select
                            value={field.value || ""}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="h-9 md:h-10 text-sm">
                              <SelectValue placeholder="Seleccionar unidad" />
                            </SelectTrigger>
                            <SelectContent>
                              {unidadLeche.map((unidad) => (
                                <SelectItem
                                  key={unidad}
                                  value={unidad}
                                  className="text-sm"
                                >
                                  {unidad}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="vacasOrdeño"
                        className="text-xs md:text-sm"
                      >
                        Vacas en ordeño
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.vacasOrdeño"
                        render={({ field }) => (
                          <Input
                            id="vacasOrdeño"
                            type="number"
                            placeholder="Cantidad"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="vacasSecas"
                        className="text-xs md:text-sm"
                      >
                        Vacas secas
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.vacasSecas"
                        render={({ field }) => (
                          <Input
                            id="vacasSecas"
                            type="number"
                            placeholder="Cantidad"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="terneros" className="text-xs md:text-sm">
                        Terneros
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.terneros"
                        render={({ field }) => (
                          <Input
                            id="terneros"
                            type="number"
                            placeholder="Cantidad"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label className="text-xs md:text-sm">
                      Fecha promedio de secado
                    </Label>
                    <Controller
                      control={control}
                      name="ganadera.fechaPromedioSecado"
                      render={({ field }) => (
                        <Input
                          type="date"
                          className="h-9 md:h-10 text-sm"
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {watch("ganadera.tiposProduccion")?.includes(
              TipoProduccionGanadera.CARNE_BOVINA,
            ) && (
              <Card className="border-l-4 border-l-green-500 shadow-sm">
                <CardHeader className="px-3 py-2 md:px-4 md:py-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base font-semibold">
                    <Beef className="h-3 w-3 md:h-4 md:w-4" />
                    {sectionTitles[TipoProduccionGanadera.CARNE_BOVINA]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 py-2 md:px-4 md:py-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="cabezasEngordeBovino"
                        className="text-xs md:text-sm"
                      >
                        Cabezas en engorde
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.cabezasEngordeBovino"
                        render={({ field }) => (
                          <Input
                            id="cabezasEngordeBovino"
                            type="number"
                            placeholder="Cantidad"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="kilosSacrificioBovino"
                        className="text-xs md:text-sm"
                      >
                        Kilos de sacrificio
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.kilosSacrificioBovino"
                        render={({ field }) => (
                          <Input
                            id="kilosSacrificioBovino"
                            type="number"
                            placeholder="Kilos"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {watch("ganadera.tiposProduccion")?.includes(
              TipoProduccionGanadera.CARNE_PORCINA,
            ) && (
              <Card className="border-l-4 border-l-pink-500 shadow-sm">
                <CardHeader className="px-3 py-2 md:px-4 md:py-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base font-semibold">
                    <Drumstick className="h-3 w-3 md:h-4 md:w-4" />
                    {sectionTitles[TipoProduccionGanadera.CARNE_PORCINA]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 py-2 md:px-4 md:py-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="cerdosEngorde"
                        className="text-xs md:text-sm"
                      >
                        Cabezas en engorde
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.cerdosEngorde"
                        render={({ field }) => (
                          <Input
                            id="cerdosEngorde"
                            type="number"
                            placeholder="Cantidad"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="pesoPromedioCerdo"
                        className="text-xs md:text-sm"
                      >
                        Peso promedio (Kg)
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.pesoPromedioCerdo"
                        render={({ field }) => (
                          <Input
                            id="pesoPromedioCerdo"
                            type="number"
                            placeholder="Peso"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="edadSacrificioProcino"
                        className="text-xs md:text-sm"
                      >
                        Edad sacrificio
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.edadSacrificioProcino"
                        render={({ field }) => (
                          <Input
                            id="edadSacrificioProcino"
                            type="number"
                            placeholder="Edad"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {watch("ganadera.tiposProduccion")?.includes(
              TipoProduccionGanadera.CARNE_AVE,
            ) && (
              <Card className="border-l-4 border-l-yellow-500 shadow-sm">
                <CardHeader className="px-3 py-2 md:px-4 md:py-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base font-semibold">
                    <Feather className="h-3 w-3 md:h-4 md:w-4" />
                    {sectionTitles[TipoProduccionGanadera.CARNE_AVE]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 py-2 md:px-4 md:py-3">
                  <div className="space-y-1.5">
                    <Label
                      htmlFor="mortalidadLoteAves"
                      className="text-xs md:text-sm"
                    >
                      Mortalidad del lote (%)
                    </Label>
                    <Controller
                      control={control}
                      name="ganadera.mortalidadLoteAves"
                      render={({ field }) => (
                        <Input
                          id="mortalidadLoteAves"
                          type="number"
                          placeholder="Porcentaje"
                          className="h-9 md:h-10 text-sm"
                          value={field.value?.toString() || ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {watch("ganadera.tiposProduccion")?.includes(
              TipoProduccionGanadera.HUEVO,
            ) && (
              <Card className="border-l-4 border-l-orange-500 shadow-sm">
                <CardHeader className="px-3 py-2 md:px-4 md:py-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base font-semibold">
                    <Egg className="h-3 w-3 md:h-4 md:w-4" />
                    {sectionTitles[TipoProduccionGanadera.HUEVO]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 py-2 md:px-4 md:py-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="huevosPorDia"
                        className="text-xs md:text-sm"
                      >
                        Huevos por día
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.huevosPorDia"
                        render={({ field }) => (
                          <Input
                            id="huevosPorDia"
                            type="number"
                            placeholder="Cantidad"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="gallinasPonedoras"
                        className="text-xs md:text-sm"
                      >
                        Gallinas ponedoras
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.gallinasPonedoras"
                        render={({ field }) => (
                          <Input
                            id="gallinasPonedoras"
                            type="number"
                            placeholder="Cantidad"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="calidadHuevo"
                        className="text-xs md:text-sm"
                      >
                        Calidad del huevo
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.calidadHuevo"
                        render={({ field }) => (
                          <Select
                            value={field.value?.toString() || ""}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="h-9 md:h-10 text-sm">
                              <SelectValue placeholder="Seleccionar calidad" />
                            </SelectTrigger>
                            <SelectContent>
                              {itemsHuevos.map((item) => (
                                <SelectItem
                                  key={item.value}
                                  value={item.value}
                                  className="text-sm"
                                >
                                  {item.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {watch("ganadera.tiposProduccion")?.includes(
              TipoProduccionGanadera.CARNE_CAPRINO,
            ) && (
              <Card className="border-l-4 border-l-emerald-500 shadow-sm">
                <CardHeader className="px-3 py-2 md:px-4 md:py-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base font-semibold">
                    <Leaf className="h-3 w-3 md:h-4 md:w-4" />
                    {sectionTitles[TipoProduccionGanadera.CARNE_CAPRINO]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 py-2 md:px-4 md:py-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="animalesEngordeCaprino"
                        className="text-xs md:text-sm"
                      >
                        Animales en engorde
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.animalesEngordeCaprino"
                        render={({ field }) => (
                          <Input
                            id="animalesEngordeCaprino"
                            type="number"
                            placeholder="Cantidad"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="pesoPromedioCaprino"
                        className="text-xs md:text-sm"
                      >
                        Peso promedio (kg)
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.pesoPromedioCaprino"
                        render={({ field }) => (
                          <Input
                            id="pesoPromedioCaprino"
                            type="number"
                            placeholder="Peso"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="edadSacrificioCaprino"
                        className="text-xs md:text-sm"
                      >
                        Edad al sacrificio
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.edadSacrificioCaprino"
                        render={({ field }) => (
                          <Input
                            id="edadSacrificioCaprino"
                            type="number"
                            placeholder="Edad"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {watch("ganadera.tiposProduccion")?.includes(
              TipoProduccionGanadera.GANADO_PIE,
            ) && (
              <Card className="border-l-4 border-l-purple-500 shadow-sm">
                <CardHeader className="px-3 py-2 md:px-4 md:py-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base font-semibold">
                    <Beef className="h-3 w-3 md:h-4 md:w-4" />
                    {sectionTitles[TipoProduccionGanadera.GANADO_PIE]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 py-2 md:px-4 md:py-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="animalesDisponibles"
                        className="text-xs md:text-sm"
                      >
                        Animales disponibles
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.animalesDisponibles"
                        render={({ field }) => (
                          <Input
                            id="animalesDisponibles"
                            type="number"
                            placeholder="Cantidad"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="pesoPromedioCabeza"
                        className="text-xs md:text-sm"
                      >
                        Peso promedio por cabeza (kg)
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.pesoPromedioCabeza"
                        render={({ field }) => (
                          <Input
                            id="pesoPromedioCabeza"
                            type="number"
                            placeholder="Peso"
                            className="h-9 md:h-10 text-sm"
                            value={field.value?.toString() || ""}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        )}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {watch("ganadera.tiposProduccion")?.includes(
              TipoProduccionGanadera.OTRO,
            ) && (
              <Card className="border-l-4 border-l-gray-500 shadow-sm">
                <CardHeader className="px-3 py-2 md:px-4 md:py-3">
                  <CardTitle className="flex items-center gap-2 text-sm md:text-base font-semibold">
                    <Beef className="h-3 w-3 md:h-4 md:w-4" />
                    {sectionTitles[TipoProduccionGanadera.OTRO]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-3 py-2 md:px-4 md:py-3 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="otroProductoNombre"
                        className="text-xs md:text-sm"
                      >
                        Nombre del producto
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.otroProductoNombre"
                        render={({ field }) => (
                          <Input
                            id="otroProductoNombre"
                            placeholder="Nombre del producto"
                            className="h-9 md:h-10 text-sm"
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label
                        htmlFor="otroProductoUnidadMedida"
                        className="text-xs md:text-sm"
                      >
                        Unidad de medida
                      </Label>
                      <Controller
                        control={control}
                        name="ganadera.otroProductoUnidadMedida"
                        render={({ field }) => (
                          <Input
                            id="otroProductoUnidadMedida"
                            placeholder="Unidad de medida"
                            className="h-9 md:h-10 text-sm"
                            value={field.value || ""}
                            onChange={field.onChange}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <Label
                      htmlFor="otroProductoProduccionMensual"
                      className="text-xs md:text-sm"
                    >
                      Producción mensual
                    </Label>
                    <Controller
                      control={control}
                      name="ganadera.otroProductoProduccionMensual"
                      render={({ field }) => (
                        <Input
                          id="otroProductoProduccionMensual"
                          type="number"
                          placeholder="Producción mensual"
                          className="h-9 md:h-10 text-sm"
                          value={field.value?.toString() || ""}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GanaderaSection;
