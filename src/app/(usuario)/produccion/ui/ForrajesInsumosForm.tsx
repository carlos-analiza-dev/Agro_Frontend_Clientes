"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";

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

import { ForrajesInsumo } from "@/api/produccion/interface/obter-producciones-userId.interface";
import { InsumoTipo } from "@/api/produccion/interface/crear-produccion-finca.interface";
import {
  meses,
  tiposHeno,
  tiposInsumo,
} from "@/helpers/data/dataProduccionFinca";

interface InsumoItem {
  id: string;
  tipo: InsumoTipo;
  tipo_heno?: string;
  estacionalidad_heno?: string;
  meses_produccion_heno?: string[];
  produccion_manzana?: string;
  tiempo_estimado_cultivo?: string;
  descripcion_otro?: string;
}

interface Props {
  forrajesInsumos: ForrajesInsumo | null;
  onDataChange?: (data: ForrajesInsumo) => void;
}

const ForrajesInsumosForm = ({ forrajesInsumos, onDataChange }: Props) => {
  const t = useTranslations("forrajesInsumosForm");

  const [insumos, setInsumos] = useState<InsumoItem[]>([]);

  useEffect(() => {
    if (forrajesInsumos?.insumos) {
      const formattedInsumos = forrajesInsumos.insumos.map((insumo, index) => ({
        id: insumo.id || `insumo-${index}`,
        tipo: insumo.tipo,
        tipo_heno: insumo.tipo_heno || "",
        estacionalidad_heno: insumo.estacionalidad_heno || "",
        meses_produccion_heno: insumo.meses_produccion_heno || [],
        produccion_manzana: insumo.produccion_manzana || "",
        tiempo_estimado_cultivo: insumo.tiempo_estimado_cultivo || "",
        descripcion_otro: insumo.descripcion_otro || "",
      }));

      setInsumos(formattedInsumos);
    }
  }, [forrajesInsumos]);

  const notifyDataChange = (currentInsumos: InsumoItem[]) => {
    if (onDataChange) {
      const forrajesData: ForrajesInsumo = {
        id: forrajesInsumos?.id || "",
        insumos: currentInsumos.map((insumo) => ({
          id: insumo.id,
          tipo: insumo.tipo,
          tipo_heno: insumo.tipo_heno,
          estacionalidad_heno: insumo.estacionalidad_heno,
          meses_produccion_heno: insumo.meses_produccion_heno,
          produccion_manzana: insumo.produccion_manzana,
          tiempo_estimado_cultivo: insumo.tiempo_estimado_cultivo,
          descripcion_otro: insumo.descripcion_otro,
        })),
      };

      onDataChange(forrajesData);
    }
  };

  const addNewInsumo = () => {
    const newInsumo: InsumoItem = {
      id: `insumo-${Date.now()}`,
      tipo: "Heno" as InsumoTipo,
    };

    const newInsumos = [...insumos, newInsumo];

    setInsumos(newInsumos);
    notifyDataChange(newInsumos);
  };

  const removeInsumo = (index: number) => {
    const newInsumos = insumos.filter((_, i) => i !== index);

    setInsumos(newInsumos);
    notifyDataChange(newInsumos);
  };

  const updateInsumo = (index: number, field: keyof InsumoItem, value: any) => {
    const newInsumos = [...insumos];

    newInsumos[index] = {
      ...newInsumos[index],
      [field]: value,
    };

    setInsumos(newInsumos);
    notifyDataChange(newInsumos);
  };

  const updateMesesProduccion = (
    index: number,
    mes: string,
    checked: boolean,
  ) => {
    const currentMeses = insumos[index]?.meses_produccion_heno || [];

    const newMeses = checked
      ? [...currentMeses, mes]
      : currentMeses.filter((m) => m !== mes);

    updateInsumo(index, "meses_produccion_heno", newMeses);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <BarrelIcon className="h-5 w-5" />
          {t("title")}
          <Badge variant="secondary" className="ml-2">
            {t("summary.supplies", { count: insumos.length })}
          </Badge>
        </CardTitle>

        <Button onClick={addNewInsumo} size="sm">
          <Plus className="h-4 w-4 mr-1" />
          {t("buttons.add")}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {insumos.map((insumo, index) => {
          const isHeno = insumo.tipo === "Heno";
          const isOtros = insumo.tipo === "Otros";

          return (
            <Card key={insumo.id} className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold">
                      {t("fields.supplyNumber", { number: index + 1 })}
                    </h4>
                    <Badge variant="outline">{insumo.tipo}</Badge>
                  </div>

                  {insumos.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeInsumo(index)}
                      className="h-8 w-8 p-0 text-destructive"
                      aria-label={t("buttons.remove")}
                      title={t("buttons.remove")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label>{t("fields.supplyType")}</Label>
                    <Select
                      value={insumo.tipo}
                      onValueChange={(value: InsumoTipo) =>
                        updateInsumo(index, "tipo", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("placeholders.selectType")}
                        />
                      </SelectTrigger>

                      <SelectContent>
                        {tiposInsumo.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {isHeno ? (
                    <>
                      <div className="space-y-2">
                        <Label>{t("fields.hayType")}</Label>
                        <Select
                          value={insumo.tipo_heno || ""}
                          onValueChange={(value) =>
                            updateInsumo(index, "tipo_heno", value)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t("placeholders.selectHayType")}
                            />
                          </SelectTrigger>

                          <SelectContent>
                            {tiposHeno.map((tipo) => (
                              <SelectItem key={tipo} value={tipo}>
                                {tipo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>{t("fields.seasonality")}</Label>
                        <Input
                          placeholder={t("placeholders.harvestSeasonality")}
                          value={insumo.estacionalidad_heno || ""}
                          onChange={(e) =>
                            updateInsumo(
                              index,
                              "estacionalidad_heno",
                              e.target.value,
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>{t("fields.productionMonths")}</Label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {meses.map((mes) => (
                            <div
                              key={mes}
                              className="flex items-center space-x-2"
                            >
                              <Checkbox
                                id={`mes-${index}-${mes}`}
                                checked={(
                                  insumo.meses_produccion_heno || []
                                ).includes(mes)}
                                onCheckedChange={(checked) =>
                                  updateMesesProduccion(
                                    index,
                                    mes,
                                    checked as boolean,
                                  )
                                }
                              />

                              <Label
                                htmlFor={`mes-${index}-${mes}`}
                                className="text-sm cursor-pointer"
                              >
                                {mes}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      {!isOtros && (
                        <>
                          <div className="space-y-2">
                            <Label>{t("fields.productionPerHectare")}</Label>
                            <Input
                              type="number"
                              placeholder={t("placeholders.productionExample")}
                              value={insumo.produccion_manzana || ""}
                              onChange={(e) =>
                                updateInsumo(
                                  index,
                                  "produccion_manzana",
                                  e.target.value,
                                )
                              }
                            />
                          </div>

                          <div className="space-y-2">
                            <Label>{t("fields.estimatedTime")}</Label>
                            <Input
                              placeholder={t("placeholders.timeExample")}
                              value={insumo.tiempo_estimado_cultivo || ""}
                              onChange={(e) =>
                                updateInsumo(
                                  index,
                                  "tiempo_estimado_cultivo",
                                  e.target.value,
                                )
                              }
                            />
                          </div>
                        </>
                      )}

                      {isOtros && (
                        <div className="space-y-2">
                          <Label>{t("fields.description")}</Label>
                          <Input
                            placeholder={t("placeholders.describeSupply")}
                            value={insumo.descripcion_otro || ""}
                            onChange={(e) =>
                              updateInsumo(
                                index,
                                "descripcion_otro",
                                e.target.value,
                              )
                            }
                          />
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}

        {insumos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <BarrelIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t("empty.message")}</p>

            <Button onClick={addNewInsumo} variant="outline" className="mt-2">
              <Plus className="h-4 w-4 mr-1" />
              {t("buttons.addFirst")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ForrajesInsumosForm;
