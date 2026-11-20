"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import { useTranslations } from "next-intl";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

interface Props {
  origenData: { name: string; value: number; color: string }[];
  ORIGEN_COLORS: string[];
  totalComprados: number;
  porcentajeComprados: number;
  totalNacidos: number;
  porcentajeNacidos: number;
}

const CardOrigenAnimal = ({
  ORIGEN_COLORS,
  origenData,
  porcentajeComprados,
  porcentajeNacidos,
  totalComprados,
  totalNacidos,
}: Props) => {
  const t = useTranslations("cardOrigenAnimal");

  const traducirOrigen = (name: string) => {
    const origen = name.toLowerCase();

    if (origen === "comprados") return t("purchased");
    if (origen === "nacidos") return t("born");

    return name;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={origenData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${traducirOrigen(name)} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {origenData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={ORIGEN_COLORS[index % ORIGEN_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  `${value} ${t("animals")}`,
                  t("quantity"),
                ]}
              />

              <Legend formatter={(value) => traducirOrigen(String(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
              <span className="font-semibold text-purple-800">
                {t("purchased")}
              </span>
            </div>

            <div className="text-2xl font-bold text-purple-600">
              {totalComprados}
            </div>

            <div className="text-sm text-purple-600">
              {porcentajeComprados.toFixed(1)}%
            </div>
          </div>

          <div className="text-center p-3 bg-amber-50 rounded-lg border border-amber-200">
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full mr-2"></div>
              <span className="font-semibold text-amber-800">{t("born")}</span>
            </div>

            <div className="text-2xl font-bold text-amber-600">
              {totalNacidos}
            </div>

            <div className="text-sm text-amber-600">
              {porcentajeNacidos.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardOrigenAnimal;
