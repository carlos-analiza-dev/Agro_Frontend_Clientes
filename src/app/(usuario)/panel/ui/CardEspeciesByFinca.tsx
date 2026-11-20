"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
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
import { useTranslations } from "next-intl";

interface Props {
  barChartData: { total: number; finca: string }[];
  especiesUnicas: string[];
  ESPECIES_COLORS: string[];
}

const CardEspeciesByFinca = ({
  barChartData,
  especiesUnicas,
  ESPECIES_COLORS,
}: Props) => {
  const t = useTranslations("cardEspeciesByFinca");

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="finca"
                angle={-45}
                textAnchor="end"
                height={60}
                fontSize={12}
                label={{
                  value: t("xAxis"),
                  position: "insideBottom",
                  offset: -65,
                }}
              />

              <YAxis
                label={{
                  value: t("yAxis"),
                  angle: -90,
                  position: "insideLeft",
                }}
              />

              <Tooltip />
              <Legend />

              {especiesUnicas.map((especie, index) => (
                <Bar
                  key={especie}
                  dataKey={especie}
                  name={especie}
                  fill={ESPECIES_COLORS[index % ESPECIES_COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardEspeciesByFinca;
