"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Activity, DollarSign } from "lucide-react";
import {
  Alternativa,
  Actividade,
} from "@/api/produccion/interface/obter-producciones-userId.interface";

interface FormProduccionAlternativaProps {
  produccionAlternativa: Alternativa | null;
  onDataChange?: (data: Alternativa | null) => void;
}

const FormProduccionAlternativa: React.FC<FormProduccionAlternativaProps> = ({
  produccionAlternativa,
  onDataChange,
}) => {
  const t = useTranslations("formProduccionAlternativa");

  const [actividades, setActividades] = useState<Actividade[]>([]);

  useEffect(() => {
    if (produccionAlternativa?.actividades?.length) {
      setActividades(
        produccionAlternativa.actividades.map((act) => ({
          ...act,
          unidad_medida: act.unidad_medida || "",
          ingresos_anuales: act.ingresos_anuales || 0,
        })),
      );
    } else {
      setActividades([
        {
          tipo: "",
          cantidad_producida: "",
          unidad_medida: "",
          ingresos_anuales: 0,
        },
      ]);
    }
  }, [produccionAlternativa?.id]);

  const updateActividadesAndNotify = (newActividades: Actividade[]) => {
    setActividades(newActividades);

    if (onDataChange) {
      const data: Alternativa = {
        id: produccionAlternativa?.id || "",
        actividades: newActividades
          .filter((act) => act.tipo.trim() !== "")
          .map((act) => ({
            tipo: act.tipo,
            cantidad_producida: act.cantidad_producida,
            unidad_medida: act.unidad_medida || undefined,
            ingresos_anuales: act.ingresos_anuales || 0,
          })),
      };

      onDataChange(data);
    }
  };

  const addActividad = () => {
    const newActividades = [
      ...actividades,
      {
        tipo: "",
        cantidad_producida: "",
        unidad_medida: "",
        ingresos_anuales: 0,
        descripcion: "",
      },
    ];

    updateActividadesAndNotify(newActividades);
  };

  const removeActividad = (index: number) => {
    if (actividades.length > 1) {
      const newActividades = actividades.filter((_, i) => i !== index);
      updateActividadesAndNotify(newActividades);
    }
  };

  const updateActividad = (
    index: number,
    field: keyof Actividade,
    value: any,
  ) => {
    const newActividades = actividades.map((act, i) =>
      i === index ? { ...act, [field]: value } : act,
    );

    updateActividadesAndNotify(newActividades);
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          {t("title")}
          <Badge variant="secondary" className="ml-2">
            {t("activityCount", { count: actividades.length })}
          </Badge>
        </CardTitle>

        <Button onClick={addActividad} size="sm" type="button">
          <Plus className="h-4 w-4 mr-1" />
          {t("buttons.addActivity")}
        </Button>
      </CardHeader>

      <CardContent className="space-y-6">
        {actividades.map((actividad, index) => (
          <Card
            key={index}
            className="bg-muted/50 border-l-4 border-l-blue-500"
          >
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold text-lg">
                    {t("activityNumber", { number: index + 1 })}
                  </h4>

                  {actividad.tipo && (
                    <Badge variant="outline" className="text-sm">
                      {actividad.tipo}
                    </Badge>
                  )}
                </div>

                {actividades.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeActividad(index)}
                    className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                    type="button"
                    aria-label={t("buttons.removeActivity")}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                  <Label
                    htmlFor={`tipo-${index}`}
                    className="text-sm font-medium"
                  >
                    {t("fields.activityType")} *
                  </Label>

                  <Input
                    id={`tipo-${index}`}
                    placeholder={t("placeholders.activityType")}
                    value={actividad.tipo}
                    onChange={(e) =>
                      updateActividad(index, "tipo", e.target.value)
                    }
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor={`cantidad-${index}`}
                      className="text-sm font-medium"
                    >
                      {t("fields.quantityProduced")} *
                    </Label>

                    <Input
                      id={`cantidad-${index}`}
                      placeholder={t("placeholders.quantityProduced")}
                      value={actividad.cantidad_producida}
                      onChange={(e) =>
                        updateActividad(
                          index,
                          "cantidad_producida",
                          e.target.value,
                        )
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`unidad-${index}`}
                      className="text-sm font-medium"
                    >
                      {t("fields.measurementUnit")}
                    </Label>

                    <Input
                      id={`unidad-${index}`}
                      placeholder={t("placeholders.measurementUnit")}
                      value={actividad.unidad_medida || ""}
                      onChange={(e) =>
                        updateActividad(index, "unidad_medida", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor={`ingresos-${index}`}
                      className="text-sm font-medium flex items-center gap-1"
                    >
                      <DollarSign className="h-3 w-3" />
                      {t("fields.annualIncome")}
                    </Label>

                    <Input
                      id={`ingresos-${index}`}
                      type="number"
                      placeholder={t("placeholders.annualIncome")}
                      value={actividad.ingresos_anuales || ""}
                      onChange={(e) =>
                        updateActividad(
                          index,
                          "ingresos_anuales",
                          Number(e.target.value) || 0,
                        )
                      }
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {actividades.length === 0 && (
          <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
            <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />

            <p className="text-lg font-medium">{t("empty.title")}</p>

            <p className="text-sm mt-2 max-w-md mx-auto">
              {t("empty.description")}
            </p>

            <Button onClick={addActividad} className="mt-4" type="button">
              <Plus className="h-4 w-4 mr-2" />
              {t("buttons.addFirstActivity")}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FormProduccionAlternativa;
