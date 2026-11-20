"use client";

import { calidadesMiel } from "@/helpers/data/dataProduccionFinca";
import React from "react";
import { useTranslations } from "next-intl";
import { Control, Controller } from "react-hook-form";
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
import { CreateProduccionFinca } from "@/api/produccion/interface/crear-produccion-finca.interface";

interface ApiculturaSectionProps {
  control: Control<CreateProduccionFinca>;
}

const ApiculturaSection: React.FC<ApiculturaSectionProps> = ({ control }) => {
  const t = useTranslations("apiculturaSection");

  return (
    <Card className="w-full border-0 md:border shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b px-4 py-4 md:px-6 md:py-6">
        <CardTitle className="flex flex-col sm:flex-row sm:items-center gap-3 text-xl md:text-2xl text-amber-900">
          <div className="flex items-center gap-3">
            <div className="p-1.5 md:p-2 bg-amber-100 rounded-lg">
              <Flower2 className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
            </div>
            <span>{t("title")}</span>
          </div>

          <Badge
            variant="secondary"
            className="w-fit sm:ml-2 bg-amber-100 text-amber-800 text-xs md:text-sm"
          >
            <FlaskConical className="h-3 w-3 mr-1" />
            {t("subtitle")}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          <div className="space-y-4 md:space-y-6">
            <div className="space-y-2 md:space-y-3">
              <Label
                htmlFor="numero-colmenas"
                className="text-sm md:text-base font-semibold flex items-center gap-2"
              >
                <div className="p-1 md:p-1.5 bg-blue-100 rounded-md">
                  <Calculator className="h-3.5 w-3.5 md:h-4 md:w-4 text-blue-600" />
                </div>
                {t("fields.hives")}
              </Label>

              <Controller
                control={control}
                name="apicultura.numero_colmenas"
                render={({ field }) => (
                  <Input
                    id="numero-colmenas"
                    type="number"
                    placeholder={t("placeholders.hives")}
                    value={field.value?.toString() || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="h-10 md:h-12 text-base md:text-lg"
                  />
                )}
              />

              <p className="text-xs md:text-sm text-muted-foreground">
                {t("descriptions.hives")}
              </p>
            </div>

            <div className="space-y-2 md:space-y-3">
              <Label
                htmlFor="frecuencia-cosecha"
                className="text-sm md:text-base font-semibold flex items-center gap-2"
              >
                <div className="p-1 md:p-1.5 bg-green-100 rounded-md">
                  <Calendar className="h-3.5 w-3.5 md:h-4 md:w-4 text-green-600" />
                </div>
                {t("fields.harvestFrequency")}
              </Label>

              <Controller
                control={control}
                name="apicultura.frecuencia_cosecha"
                render={({ field }) => (
                  <Input
                    id="frecuencia-cosecha"
                    placeholder={t("placeholders.harvestFrequency")}
                    value={field.value || ""}
                    onChange={field.onChange}
                    className="h-10 md:h-12 text-sm md:text-base"
                  />
                )}
              />

              <p className="text-xs md:text-sm text-muted-foreground">
                {t("descriptions.harvestFrequency")}
              </p>
            </div>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="space-y-2 md:space-y-3">
              <Label
                htmlFor="cantidad-cosecha"
                className="text-sm md:text-base font-semibold flex items-center gap-2"
              >
                <div className="p-1 md:p-1.5 bg-orange-100 rounded-md">
                  <Scale className="h-3.5 w-3.5 md:h-4 md:w-4 text-orange-600" />
                </div>
                {t("fields.quantityPerHarvest")}
              </Label>

              <Controller
                control={control}
                name="apicultura.cantidad_por_cosecha"
                render={({ field }) => (
                  <Input
                    id="cantidad-cosecha"
                    type="number"
                    step="0.01"
                    placeholder={t("placeholders.quantityPerHarvest")}
                    value={field.value?.toString() || ""}
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? Number(e.target.value) : undefined,
                      )
                    }
                    className="h-10 md:h-12 text-base md:text-lg"
                  />
                )}
              />

              <p className="text-xs md:text-sm text-muted-foreground">
                {t("descriptions.quantityPerHarvest")}
              </p>
            </div>

            <div className="space-y-2 md:space-y-3">
              <Label
                htmlFor="calidad-miel"
                className="text-sm md:text-base font-semibold flex items-center gap-2"
              >
                <div className="p-1 md:p-1.5 bg-purple-100 rounded-md">
                  <Flower className="h-3.5 w-3.5 md:h-4 md:w-4 text-purple-600" />
                </div>
                {t("fields.honeyQuality")}
              </Label>

              <Controller
                control={control}
                name="apicultura.calidad_miel"
                render={({ field }) => (
                  <Select
                    value={field.value || ""}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger
                      id="calidad-miel"
                      className="h-10 md:h-12 text-sm md:text-base"
                    >
                      <SelectValue
                        placeholder={t("placeholders.honeyQuality")}
                      />
                    </SelectTrigger>

                    <SelectContent>
                      {calidadesMiel.map((calidad) => (
                        <SelectItem
                          key={calidad}
                          value={calidad}
                          className="text-sm md:text-base py-2 md:py-3"
                        >
                          <div className="flex items-center gap-2">
                            <Flower className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-500" />
                            <span className="text-sm md:text-base">
                              {calidad}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />

              <p className="text-xs md:text-sm text-muted-foreground">
                {t("descriptions.honeyQuality")}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 md:mt-8 p-3 md:p-4 bg-amber-50 rounded-lg border border-amber-200">
          <div className="flex flex-col sm:flex-row items-start gap-3">
            <div className="flex-shrink-0">
              <Droplets className="h-5 w-5 md:h-6 md:w-6 text-amber-600" />
            </div>

            <div>
              <h4 className="font-semibold text-amber-800 text-sm md:text-base">
                {t("information.title")}
              </h4>

              <p className="text-xs md:text-sm text-amber-700 mt-1 leading-relaxed">
                {t("information.description")}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiculturaSection;
