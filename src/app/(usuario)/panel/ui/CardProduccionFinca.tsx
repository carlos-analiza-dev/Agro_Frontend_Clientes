"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useTranslations } from "next-intl";
import CardDetalles from "./CardDetalles";

interface FincaProduccion {
  id: string;
  nombre_finca: string;
  vacas_ordeño: number;
  vacas_secas: number;
  terneros: number;
  total_bovinos: number;
  tiene_produccion_leche: boolean;
}

interface ProduccionData {
  total_vacas_ordeño: number;
  total_vacas_secas: number;
  total_terneros: number;
  total_bovinos: number;
  fincas_con_produccion_leche: number;
  fincas: FincaProduccion[];
}

interface CardProduccionFincaProps {
  produccionData: ProduccionData | null;
}

const PRODUCCION_COLORS = {
  ordeño: "#0088FE",
  secas: "#00C49F",
  terneros: "#FFBB28",
  total: "#8884D8",
};

const CardProduccionFinca = ({ produccionData }: CardProduccionFincaProps) => {
  const t = useTranslations("cardProduccionFinca");

  if (!produccionData) return null;

  const fincasChartData = produccionData.fincas.map((finca) => ({
    finca: finca.nombre_finca,
    [t("categories.milkingCows")]: finca.vacas_ordeño,
    [t("categories.dryCows")]: finca.vacas_secas,
    [t("categories.calves")]: finca.terneros,
    [t("categories.totalCattle")]: finca.total_bovinos,
  }));

  const totalesData = [
    {
      name: t("categories.milkingCows"),
      value: produccionData.total_vacas_ordeño,
      color: PRODUCCION_COLORS.ordeño,
    },
    {
      name: t("categories.dryCows"),
      value: produccionData.total_vacas_secas,
      color: PRODUCCION_COLORS.secas,
    },
    {
      name: t("categories.calves"),
      value: produccionData.total_terneros,
      color: PRODUCCION_COLORS.terneros,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CardDetalles
          titulo={t("details.milkingCows")}
          bgColor="bg-blue-50"
          colorText="text-blue-800"
          colorNumbers="text-blue-600"
          total={produccionData.total_vacas_ordeño}
          porcentaje={
            produccionData.total_bovinos > 0
              ? (produccionData.total_vacas_ordeño /
                  produccionData.total_bovinos) *
                100
              : 0
          }
        />

        <CardDetalles
          titulo={t("details.dryCows")}
          bgColor="bg-green-50"
          colorText="text-green-800"
          colorNumbers="text-green-600"
          total={produccionData.total_vacas_secas}
          porcentaje={
            produccionData.total_bovinos > 0
              ? (produccionData.total_vacas_secas /
                  produccionData.total_bovinos) *
                100
              : 0
          }
        />

        <CardDetalles
          titulo={t("details.calves")}
          bgColor="bg-amber-50"
          colorText="text-amber-800"
          colorNumbers="text-amber-600"
          total={produccionData.total_terneros}
          porcentaje={
            produccionData.total_bovinos > 0
              ? (produccionData.total_terneros / produccionData.total_bovinos) *
                100
              : 0
          }
        />

        <CardDetalles
          titulo={t("details.totalCattle")}
          bgColor="bg-purple-50"
          colorText="text-purple-800"
          colorNumbers="text-purple-600"
          total={produccionData.total_bovinos}
          porcentaje={produccionData.fincas_con_produccion_leche}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t("charts.cattleDistribution")}</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={totalesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />

                  <Tooltip
                    formatter={(value) => [
                      `${value} ${t("animals")}`,
                      t("quantity"),
                    ]}
                  />

                  <Legend />

                  <Bar dataKey="value" name={t("quantity")}>
                    {totalesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("charts.productionByFarm")}</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={fincasChartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="finca" />
                  <YAxis />

                  <Tooltip
                    formatter={(value) => [
                      `${value} ${t("animals")}`,
                      t("quantity"),
                    ]}
                  />

                  <Legend />

                  <Bar
                    dataKey={t("categories.milkingCows")}
                    fill={PRODUCCION_COLORS.ordeño}
                  />

                  <Bar
                    dataKey={t("categories.dryCows")}
                    fill={PRODUCCION_COLORS.secas}
                  />

                  <Bar
                    dataKey={t("categories.calves")}
                    fill={PRODUCCION_COLORS.terneros}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CardProduccionFinca;
