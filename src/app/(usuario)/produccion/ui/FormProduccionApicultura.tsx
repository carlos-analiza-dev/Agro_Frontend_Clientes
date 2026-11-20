"use client";

import { Apicultura } from "@/api/produccion/interface/obter-producciones-userId.interface";
import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Flower2,
  Droplets,
  FlaskConical,
  Calculator,
  Calendar,
  Scale,
  Flower,
} from "lucide-react";
import { calidadesMiel } from "@/helpers/data/dataProduccionFinca";

interface Props {
  produccionApicultura: Apicultura | null;
  onDataChange?: (data: Apicultura) => void;
}

const FormProduccionApicultura = ({
  produccionApicultura,
  onDataChange,
}: Props) => {
  const t = useTranslations("formProduccionApicultura");

  const [formData, setFormData] = useState({
    numero_colmenas: produccionApicultura?.numero_colmenas || 0,
    frecuencia_cosecha: produccionApicultura?.frecuencia_cosecha || "",
    cantidad_por_cosecha: produccionApicultura?.cantidad_por_cosecha || 0,
    calidad_miel: produccionApicultura?.calidad_miel || "",
  });

  useEffect(() => {
    if (produccionApicultura) {
      setFormData({
        numero_colmenas: produccionApicultura.numero_colmenas || 0,
        frecuencia_cosecha: produccionApicultura.frecuencia_cosecha || "",
        cantidad_por_cosecha: produccionApicultura.cantidad_por_cosecha || 0,
        calidad_miel: produccionApicultura.calidad_miel || "",
      });
    }
  }, [produccionApicultura]);

  const handleChange = (field: keyof typeof formData, value: any) => {
    const updatedData = {
      ...formData,
      [field]: value,
    };

    setFormData(updatedData);

    if (onDataChange && produccionApicultura) {
      onDataChange({
        ...produccionApicultura,
        ...updatedData,
      });
    }
  };

  const handleNumberChange = (field: keyof typeof formData, value: string) => {
    const numericValue = value === "" ? 0 : Number(value);
    handleChange(field, numericValue);
  };

  return (
    <Card className="w-full">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b">
        <CardTitle className="flex items-center gap-3 text-2xl text-amber-900">
          <div className="p-2 bg-amber-100 rounded-lg">
            <Flower2 className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            <div>{t("title")}</div>
            <Badge
              variant="secondary"
              className="mt-1 bg-amber-100 text-amber-800"
            >
              <FlaskConical className="h-3 w-3 mr-1" />
              {t("subtitle")}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="numero-colmenas"
                className="text-base font-semibold flex items-center gap-2"
              >
                <div className="p-1.5 bg-blue-100 rounded-md">
                  <Calculator className="h-4 w-4 text-blue-600" />
                </div>
                {t("fields.hives")}
              </Label>

              <Input
                id="numero-colmenas"
                type="number"
                placeholder={t("placeholders.hives")}
                value={formData.numero_colmenas || ""}
                onChange={(e) =>
                  handleNumberChange("numero_colmenas", e.target.value)
                }
                className="text-lg py-6"
                min="0"
              />

              <p className="text-sm text-muted-foreground">
                {t("descriptions.hives")}
              </p>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="frecuencia-cosecha"
                className="text-base font-semibold flex items-center gap-2"
              >
                <div className="p-1.5 bg-green-100 rounded-md">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                {t("fields.harvestFrequency")}
              </Label>

              <Input
                id="frecuencia-cosecha"
                placeholder={t("placeholders.harvestFrequency")}
                value={formData.frecuencia_cosecha}
                onChange={(e) =>
                  handleChange("frecuencia_cosecha", e.target.value)
                }
                className="py-6"
              />

              <p className="text-sm text-muted-foreground">
                {t("descriptions.harvestFrequency")}
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <Label
                htmlFor="cantidad-cosecha"
                className="text-base font-semibold flex items-center gap-2"
              >
                <div className="p-1.5 bg-orange-100 rounded-md">
                  <Scale className="h-4 w-4 text-orange-600" />
                </div>
                {t("fields.quantityPerHarvest")}
              </Label>

              <Input
                id="cantidad-cosecha"
                type="number"
                step="0.01"
                placeholder={t("placeholders.quantityPerHarvest")}
                value={formData.cantidad_por_cosecha || ""}
                onChange={(e) =>
                  handleNumberChange("cantidad_por_cosecha", e.target.value)
                }
                className="text-lg py-6"
                min="0"
              />

              <p className="text-sm text-muted-foreground">
                {t("descriptions.quantityPerHarvest")}
              </p>
            </div>

            <div className="space-y-3">
              <Label
                htmlFor="calidad-miel"
                className="text-base font-semibold flex items-center gap-2"
              >
                <div className="p-1.5 bg-purple-100 rounded-md">
                  <Flower className="h-4 w-4 text-purple-600" />
                </div>
                {t("fields.honeyQuality")}
              </Label>

              <Select
                value={formData.calidad_miel}
                onValueChange={(value) => handleChange("calidad_miel", value)}
              >
                <SelectTrigger id="calidad-miel" className="py-6">
                  <SelectValue placeholder={t("placeholders.honeyQuality")} />
                </SelectTrigger>

                <SelectContent>
                  {calidadesMiel.map((calidad) => (
                    <SelectItem key={calidad} value={calidad} className="py-3">
                      <div className="flex items-center gap-2">
                        <Flower className="h-4 w-4 text-amber-500" />
                        {calidad}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <p className="text-sm text-muted-foreground">
                {t("descriptions.honeyQuality")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex items-start gap-3">
            <Droplets className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-amber-800">
                {t("information.title")}
              </h4>
              <p className="text-sm text-amber-700 mt-1">
                {t("information.description")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FormProduccionApicultura;
