"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { useTranslations } from "next-intl";

interface Props {
  porcentajeNacidos: number;
  totalNacidos: number;
  totalOrigen: number;
}

const CardTasaReproduccion = ({
  porcentajeNacidos,
  totalNacidos,
  totalOrigen,
}: Props) => {
  const t = useTranslations("cardTasaReproduccion");

  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardHeader>
        <CardTitle className="text-blue-800">{t("title")}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold text-blue-600">
              {porcentajeNacidos.toFixed(1)}%
            </div>

            <p className="text-sm text-blue-600">
              {t("bornDescription", {
                born: totalNacidos,
                total: totalOrigen,
              })}
            </p>
          </div>

          <div className="text-right">
            <div className="text-lg font-semibold text-blue-800">
              {t("selfSufficiency")}
            </div>

            <p className="text-sm text-blue-600">
              {t(porcentajeNacidos >= 50 ? "highCapacity" : "lowCapacity")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardTasaReproduccion;
