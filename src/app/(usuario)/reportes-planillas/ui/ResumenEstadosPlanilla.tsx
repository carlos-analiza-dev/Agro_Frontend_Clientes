"use client";

import { ResponseEstadosPlanilla } from "@/api/dashboard/interfaces/planilla-dashboard/resumen-estados.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { useLocale, useTranslations } from "next-intl";

interface Props {
  resumen: ResponseEstadosPlanilla[] | undefined;
  cargando_resumen: boolean;
  moneda: string;
}

const ResumenEstadosPlanilla = ({
  resumen,
  cargando_resumen,
  moneda,
}: Props) => {
  const t = useTranslations("resumenEstadosPlanilla");
  const locale = useLocale();

  const getEstadoLabel = (estado: string) => {
    const key = `statuses.${estado.toUpperCase()}`;
    return t.has(key) ? t(key) : estado;
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat(locale === "en" ? "en-US" : "es-HN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  if (cargando_resumen) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("title")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const getBarColor = (estado: string) => {
    const colors: Record<string, string> = {
      PAGADA: "#10b981",
      BORRADOR: "#f59e0b",
      ANULADA: "#ef4444",
      PENDIENTE: "#3b82f6",
    };

    return colors[estado] || "#8884d8";
  };

  const dataWithColors =
    resumen?.map((item) => ({
      estado: getEstadoLabel(item.estado),
      total: Number(item.totalNeto),
      color: getBarColor(item.estado.toUpperCase()),
    })) || [];

  return (
    <Card className="w-full rounded-2xl shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">📊 {t("title")}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {resumen?.map((item) => (
            <div
              key={item.estado}
              className="p-4 rounded-xl border bg-muted/40 flex flex-col gap-1"
            >
              <span className="text-sm text-muted-foreground capitalize">
                {getEstadoLabel(item.estado)}
              </span>

              <span className="text-xl font-bold">
                {moneda} {formatNumber(Number(item.totalNeto))}
              </span>

              <span className="text-xs text-muted-foreground">
                {t("payrollCount", { count: item.cantidad })}
              </span>
            </div>
          ))}
        </div>

        <div className="h-60">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataWithColors}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="estado"
                stroke="#6b7280"
                tick={{ fill: "#6b7280" }}
              />
              <YAxis
                stroke="#6b7280"
                tick={{ fill: "#6b7280" }}
                tickFormatter={(value) => `${moneda}${value}`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${moneda} ${formatNumber(value)}`,
                  t("chart.netTotal"),
                ]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="total" radius={[8, 8, 0, 0]}>
                {dataWithColors.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">{t("totals.salaries")}</p>
            <p className="font-semibold">
              {moneda}{" "}
              {formatNumber(
                resumen?.reduce(
                  (acc, cur) => acc + Number(cur.totalSalarios),
                  0,
                ) ?? 0,
              )}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">{t("totals.overtime")}</p>
            <p className="font-semibold">
              {moneda}{" "}
              {formatNumber(
                resumen?.reduce(
                  (acc, cur) => acc + Number(cur.totalHorasExtras),
                  0,
                ) ?? 0,
              )}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">{t("totals.bonuses")}</p>
            <p className="font-semibold">
              {moneda}{" "}
              {formatNumber(
                resumen?.reduce(
                  (acc, cur) => acc + Number(cur.totalBonificaciones),
                  0,
                ) ?? 0,
              )}
            </p>
          </div>

          <div>
            <p className="text-muted-foreground">{t("totals.deductions")}</p>
            <p className="font-semibold text-red-500">
              {moneda}{" "}
              {formatNumber(
                resumen?.reduce(
                  (acc, cur) => acc + Number(cur.totalDeducciones),
                  0,
                ) ?? 0,
              )}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumenEstadosPlanilla;
