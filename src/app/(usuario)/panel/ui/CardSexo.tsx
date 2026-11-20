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
  sexoData: { name: string; value: number; color: string }[];
  COLORS: string[];
}

const CardSexo = ({ COLORS, sexoData }: Props) => {
  const t = useTranslations("cardSexo");

  const traducirSexo = (name: string) => {
    const sexo = name.toLowerCase();

    if (sexo === "macho") return t("male");
    if (sexo === "hembra") return t("female");

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
                data={sexoData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${traducirSexo(name)} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {sexoData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                formatter={(value) => [
                  `${value} ${t("animals")}`,
                  t("quantity"),
                ]}
              />

              <Legend formatter={(value) => traducirSexo(String(value))} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardSexo;
