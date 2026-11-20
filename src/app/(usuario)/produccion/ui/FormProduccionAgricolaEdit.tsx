"use client";

import { Agricola } from "@/api/produccion/interface/obter-producciones-userId.interface";
import {
  Cultivo as CultivoCreate,
  CultivoTipo,
} from "@/api/produccion/interface/crear-produccion-finca.interface";
import React, { useState, useEffect } from "react";
import { useTranslations, useLocale } from "next-intl";
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
import { meses, tiposCultivo } from "@/helpers/data/dataProduccionFinca";

interface Props {
  produccionAgricola: Agricola | null;
  onDataChange?: (data: Agricola) => void;
}

const FormProduccionAgricolaEdit = ({
  produccionAgricola,
  onDataChange,
}: Props) => {
  const t = useTranslations("formProduccionAgricolaEdit");
  const locale = useLocale();

  const [cultivos, setCultivos] = useState<CultivoCreate[]>([]);

  useEffect(() => {
    if (produccionAgricola?.cultivos) {
      const cultivosMapeados: CultivoCreate[] = produccionAgricola.cultivos.map(
        (cultivo) => ({
          tipo: cultivo.tipo as any,
          descripcion: cultivo.descripcion || "",
          estacionalidad: cultivo.estacionalidad || "",
          tiempo_estimado_cultivo: cultivo.tiempo_estimado_cultivo,
          meses_produccion: cultivo.meses_produccion || [],
          cantidad_producida_hectareas: cultivo.cantidad_producida_hectareas,
        }),
      );

      setCultivos(cultivosMapeados);
    } else {
      setCultivos([]);
    }
  }, [produccionAgricola]);

  const handleCultivoChange = (
    index: number,
    field: keyof CultivoCreate,
    value: any,
  ) => {
    const updatedCultivos = [...cultivos];

    updatedCultivos[index] = {
      ...updatedCultivos[index],
      [field]: value,
    };

    setCultivos(updatedCultivos);
    notifyDataChange(updatedCultivos);
  };

  const handleMesesChange = (index: number, mes: string, checked: boolean) => {
    const updatedCultivos = [...cultivos];
    const currentMeses = updatedCultivos[index].meses_produccion || [];

    if (checked) {
      updatedCultivos[index].meses_produccion = [...currentMeses, mes];
    } else {
      updatedCultivos[index].meses_produccion = currentMeses.filter(
        (m) => m !== mes,
      );
    }

    setCultivos(updatedCultivos);
    notifyDataChange(updatedCultivos);
  };

  const addNewCultivo = () => {
    const newCultivo: CultivoCreate = {
      tipo: "" as CultivoTipo,
      descripcion: "",
      estacionalidad: "",
      tiempo_estimado_cultivo: "",
      meses_produccion: [],
      cantidad_producida_hectareas: "",
    };

    const updatedCultivos = [...cultivos, newCultivo];
    setCultivos(updatedCultivos);
    notifyDataChange(updatedCultivos);
  };

  const removeCultivo = (index: number) => {
    const updatedCultivos = cultivos.filter((_, i) => i !== index);
    setCultivos(updatedCultivos);
    notifyDataChange(updatedCultivos);
  };

  const notifyDataChange = (updatedCultivos: CultivoCreate[]) => {
    if (onDataChange && produccionAgricola) {
      onDataChange({
        ...produccionAgricola,
        cultivos: updatedCultivos,
      });
    }
  };

  const getMonthLabel = (mes: string) => {
    const monthIndex = meses.findIndex(
      (item) => item.toLowerCase() === mes.toLowerCase(),
    );

    if (monthIndex === -1) return mes;

    return new Intl.DateTimeFormat(locale, {
      month: "long",
    }).format(new Date(2024, monthIndex, 1));
  };

  const getCropLabel = (tipo: string) => {
    const index = tiposCultivo.findIndex((item) => item === tipo);

    return index !== -1 ? t(`cropTypes.${index}`) : tipo;
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Sprout className="h-5 w-5" />
          {t("title")}
          <Badge variant="secondary" className="ml-2">
            {t("cropCount", { count: cultivos.length })}
          </Badge>
        </CardTitle>

        <Button onClick={addNewCultivo} size="sm" type="button">
          <Plus className="h-4 w-4 mr-1" />
          {t("buttons.add")}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4">
        {cultivos.map((cultivo, index) => (
          <Card key={index} className="bg-muted/50">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold">
                  {t("cropNumber", { number: index + 1 })}
                </h4>

                {cultivos.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeCultivo(index)}
                    className="h-8 w-8 p-0 text-destructive"
                    type="button"
                    aria-label={t("buttons.remove")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t("fields.cropType")} *</Label>

                  <Select
                    value={cultivo.tipo}
                    onValueChange={(value) =>
                      handleCultivoChange(index, "tipo", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t("placeholders.cropType")} />
                    </SelectTrigger>

                    <SelectContent>
                      {tiposCultivo.map((tipo, tipoIndex) => (
                        <SelectItem key={tipo} value={tipo}>
                          {getCropLabel(tipo)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("fields.description")}</Label>
                  <Input
                    placeholder={t("placeholders.description")}
                    value={cultivo.descripcion || ""}
                    onChange={(e) =>
                      handleCultivoChange(index, "descripcion", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("fields.seasonality")} *</Label>
                  <Input
                    placeholder={t("placeholders.seasonality")}
                    value={cultivo.estacionalidad || ""}
                    onChange={(e) =>
                      handleCultivoChange(
                        index,
                        "estacionalidad",
                        e.target.value,
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("fields.duration")} *</Label>
                  <Input
                    placeholder={t("placeholders.duration")}
                    value={cultivo.tiempo_estimado_cultivo || ""}
                    onChange={(e) =>
                      handleCultivoChange(
                        index,
                        "tiempo_estimado_cultivo",
                        e.target.value,
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>{t("fields.productionPerHectare")} *</Label>
                  <Input
                    placeholder={t("placeholders.productionPerHectare")}
                    value={cultivo.cantidad_producida_hectareas || ""}
                    onChange={(e) =>
                      handleCultivoChange(
                        index,
                        "cantidad_producida_hectareas",
                        e.target.value,
                      )
                    }
                  />
                </div>
              </div>

              <div className="mt-4 space-y-2">
                <Label>{t("fields.productionMonths")} *</Label>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {meses.map((mes) => (
                    <div key={mes} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mes-${index}-${mes}`}
                        checked={
                          cultivo.meses_produccion?.includes(mes) || false
                        }
                        onCheckedChange={(checked) =>
                          handleMesesChange(index, mes, checked as boolean)
                        }
                      />

                      <Label
                        htmlFor={`mes-${index}-${mes}`}
                        className="text-sm cursor-pointer"
                      >
                        {getMonthLabel(mes)}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {cultivos.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <Sprout className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>{t("empty.title")}</p>

            <Button onClick={addNewCultivo} className="mt-2" type="button">
              <Plus className="h-4 w-4 mr-1" />
              {t("buttons.addFirst")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormProduccionAgricolaEdit;
