"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useTranslations } from "next-intl";

interface Props {
  mortalidadData: {
    name: string;
    value: number;
    color: string;
  }[];
  MORTALIDAD_COLORS: string[];
  totalVivos: number;
  porcentajeVivos: number;
  totalMuertos: number;
  porcentajeMuertos: number;
}

const CardPastelEstados = ({
  mortalidadData,
  MORTALIDAD_COLORS,
  totalVivos,
  totalMuertos,
  porcentajeVivos,
  porcentajeMuertos,
}: Props) => {
  const t = useTranslations("cardPastelEstados");

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
                data={mortalidadData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${t(
                    name.toLowerCase() === "vivos" ? "alive" : "dead",
                  )} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {mortalidadData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={MORTALIDAD_COLORS[index % MORTALIDAD_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  `${value} ${t("animals")}`,
                  t("quantity"),
                ]}
              />

              <Legend
                formatter={(value) =>
                  value.toLowerCase() === "vivos"
                    ? t("alive")
                    : value.toLowerCase() === "muertos"
                      ? t("dead")
                      : value
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="font-semibold text-green-800">{t("alive")}</span>
            </div>

            <div className="text-2xl font-bold text-green-600">
              {totalVivos}
            </div>

            <div className="text-sm text-green-600">
              {porcentajeVivos.toFixed(1)}%
            </div>
          </div>

          <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-center mb-2">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              <span className="font-semibold text-red-800">{t("dead")}</span>
            </div>

            <div className="text-2xl font-bold text-red-600">
              {totalMuertos}
            </div>

            <div className="text-sm text-red-600">
              {porcentajeMuertos.toFixed(1)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardPastelEstados;
