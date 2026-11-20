"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { Sprout, Package } from "lucide-react";
import SkeletonCard from "@/components/generics/SkeletonCard";
import { ResponseCultivosTipos } from "@/api/dashboard/interfaces/cultivos/response-cultivos-tipos.interface";
import { COLORS } from "@/helpers/data/colorDashboard";
import { useTranslations } from "next-intl";

interface Props {
  data: ResponseCultivosTipos[] | undefined;
  isLoading: boolean;
}

const CultivosPorTipo = ({ data, isLoading }: Props) => {
  const t = useTranslations("cultivosPorTipo");

  if (isLoading) {
    return <SkeletonCard />;
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Package className="h-16 w-16 text-gray-300 mb-4" />

          <p className="text-gray-500 text-center">{t("empty.title")}</p>

          <p className="text-sm text-gray-400 text-center mt-2">
            {t("empty.description")}
          </p>
        </CardContent>
      </Card>
    );
  }

  const chartData = data.map((item) => ({
    name: item.tipo_cultivo,
    total: parseInt(item.total),
  }));

  const totalCultivos = chartData.reduce((sum, item) => sum + item.total, 0);

  const cultivoPrincipal =
    [...chartData].sort((a, b) => b.total - a.total)[0]?.name || "N/A";

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Sprout className="h-5 w-5 text-green-600" />
          {t("title")}
        </CardTitle>

        <CardDescription>
          {t("description", {
            total: totalCultivos,
          })}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-6">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />

                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  interval={0}
                  tick={{ fontSize: 12 }}
                />

                <YAxis />

                <Tooltip
                  formatter={(value: number) => [
                    t("tooltip.crops", { count: value }),
                    t("tooltip.total"),
                  ]}
                />

                <Legend />

                <Bar
                  dataKey="total"
                  fill="#10b981"
                  name={t("chart.numberOfCrops")}
                  radius={[8, 8, 0, 0]}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={(entry) => `${entry.name}: ${entry.total}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="total"
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value: number, _name, props) => [
                    t("tooltip.crops", { count: value }),
                    props.payload.name,
                  ]}
                />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="md:hidden">
            <h4 className="font-semibold text-sm text-gray-700 mb-3">
              {t("summary.byType")}
            </h4>

            <div className="space-y-2">
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: COLORS[index % COLORS.length],
                      }}
                    />

                    <span className="text-sm font-medium">{item.name}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-900">
                      {item.total}
                    </span>

                    <span className="text-xs text-gray-500">
                      (
                      {totalCultivos > 0
                        ? ((item.total / totalCultivos) * 100).toFixed(1)
                        : "0.0"}
                      %)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">
                {t("summary.totalTypes")}
              </p>

              <p className="text-xl font-bold text-gray-900">
                {chartData.length}
              </p>
            </div>

            <div className="text-center">
              <p className="text-xs text-gray-500 mb-1">
                {t("summary.mainCrop")}
              </p>

              <p className="text-sm font-semibold text-green-600 truncate">
                {cultivoPrincipal}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CultivosPorTipo;
