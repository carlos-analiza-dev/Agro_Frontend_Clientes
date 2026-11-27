"use client";

import { ResponseCostosMensuales } from "@/api/sanidad-animal/interface/response-costos-mensuales.interface";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import React from "react";
import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  datosEvolucionFiltrados: {
    mes: string;
    nombreMes: string;
    total: number;
    items: ResponseCostosMensuales[];
  }[];
  selectedServicioGrafico: string;
  moneda: string;
}

const EvolucionMensual = ({
  datosEvolucionFiltrados,
  moneda,
  selectedServicioGrafico,
}: Props) => {
  const t = useTranslations("evolucionMensual");

  return (
    <div className="h-[300px]">
      <h4 className="text-sm font-medium mb-2">
        {t("title")}
        {selectedServicioGrafico !== "todos" && (
          <Badge className="ml-2" variant="outline">
            {selectedServicioGrafico}
          </Badge>
        )}
      </h4>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={datosEvolucionFiltrados}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="nombreMes" />
          <YAxis tickFormatter={(value) => `${moneda}${value.toFixed(0)}`} />
          <Tooltip
            formatter={(value: number) => formatCurrency(value, moneda)}
            labelFormatter={(label) => t("monthLabel", { month: label })}
          />
          <Legend />
          <Bar
            dataKey="total"
            name={t("totalCost")}
            fill="#8884D8"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EvolucionMensual;
