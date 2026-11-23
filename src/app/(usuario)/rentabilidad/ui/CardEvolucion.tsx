import { useTranslations, useLocale } from "next-intl";
import { RentabilidadPorPeriodo } from "@/api/finanzas/rentabilidad/interface/rentabilidad.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COLORS_RENTABILIDAD } from "@/helpers/data/rentabilidad_colors";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  rentabilidadPeriodo: RentabilidadPorPeriodo[] | undefined;
  periodo: "day" | "week" | "month" | "year";
  setPeriodo: Dispatch<SetStateAction<"day" | "week" | "month" | "year">>;
  moneda: string;
}

const CardEvolucion = ({
  periodo,
  rentabilidadPeriodo,
  setPeriodo,
  moneda,
}: Props) => {
  const t = useTranslations("cardEvolucion");
  const locale = useLocale();

  const [dimensions, setDimensions] = useState({
    isMobile: false,
    isTablet: false,
    chartHeight: 400,
    tooltipSize: "default",
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const isMobile = width < 640;
      const isTablet = width >= 640 && width < 1024;

      setDimensions({
        isMobile,
        isTablet,
        chartHeight: isMobile ? 280 : isTablet ? 350 : 400,
        tooltipSize: isMobile ? "small" : "default",
      });
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getOptimizedData = () => {
    if (!rentabilidadPeriodo) return [];
    if (!dimensions.isMobile) return rentabilidadPeriodo;

    if (rentabilidadPeriodo.length > 12) {
      const step = Math.ceil(rentabilidadPeriodo.length / 8);
      return rentabilidadPeriodo.filter((_, index) => index % step === 0);
    }
    return rentabilidadPeriodo;
  };

  const optimizedData = getOptimizedData();

  const getMargins = () => {
    if (dimensions.isMobile) {
      return { top: 10, right: 5, left: 0, bottom: 30 };
    }
    if (dimensions.isTablet) {
      return { top: 10, right: 20, left: 0, bottom: 20 };
    }
    return { top: 10, right: 30, left: 0, bottom: 10 };
  };

  const getLegendLabel = (value: string) => {
    const labels: Record<string, string> = {
      ingresos: t("legend.income"),
      gastos: t("legend.expenses"),
      rentabilidad: t("legend.profitability"),
    };

    return labels[value] || value;
  };

  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="px-4 py-4 sm:px-6 sm:py-6">
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:justify-between sm:items-center">
          <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
            {t("title")}
          </CardTitle>

          <div className="flex gap-1 sm:gap-2 bg-gray-50 p-1 rounded-lg w-full sm:w-auto">
            {(["month", "week", "year"] as const).map((p) => {
              const labels = {
                month: `📅 ${t("periods.month")}`,
                week: `📊 ${t("periods.week")}`,
                year: `📈 ${t("periods.year")}`,
              };

              const shortLabels = {
                month: `📅 ${t("shortPeriods.month")}`,
                week: `📊 ${t("shortPeriods.week")}`,
                year: `📈 ${t("shortPeriods.year")}`,
              };

              return (
                <button
                  key={p}
                  onClick={() => setPeriodo(p)}
                  className={`
                    flex-1 sm:flex-none px-2 sm:px-4 py-1.5 sm:py-2
                    text-xs sm:text-sm font-medium rounded-md
                    transition-all duration-200 ease-in-out
                    touch-manipulation active:scale-95
                    ${
                      periodo === p
                        ? "bg-blue-500 text-white shadow-md hover:bg-blue-600"
                        : "bg-transparent text-gray-600 hover:bg-gray-100 active:bg-gray-200"
                    }
                  `}
                >
                  <span className="hidden sm:inline">{labels[p]}</span>
                  <span className="sm:hidden">{shortLabels[p]}</span>
                </button>
              );
            })}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-2 sm:px-4 md:px-6 pb-4 sm:pb-6">
        <div
          className="w-full transition-all duration-300"
          style={{ height: `${dimensions.chartHeight}px` }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={optimizedData}
              margin={getMargins()}
              accessibilityLayer
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f0f0f0"
                vertical={!dimensions.isMobile}
                horizontal={true}
              />

              <XAxis
                dataKey="periodo"
                tick={{
                  fontSize: dimensions.isMobile ? 9 : 12,
                  fill: "#6b7280",
                  fontWeight: "normal",
                }}
                angle={dimensions.isMobile ? -35 : 0}
                textAnchor={dimensions.isMobile ? "end" : "middle"}
                height={dimensions.isMobile ? 50 : 30}
                interval={dimensions.isMobile ? "preserveStartEnd" : 0}
                tickMargin={dimensions.isMobile ? 8 : 10}
                minTickGap={dimensions.isMobile ? 20 : 40}
              />

              <YAxis
                tick={{
                  fontSize: dimensions.isMobile ? 9 : 12,
                  fill: "#6b7280",
                }}
                width={dimensions.isMobile ? 45 : 60}
                tickFormatter={(value) => {
                  if (value >= 1000000)
                    return `${(value / 1000000).toFixed(1)}M`;
                  if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                  return value;
                }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                formatter={(value: number, name: string) => [
                  `${moneda}${value.toLocaleString(
                    locale === "en" ? "en-US" : "es-HN",
                    {
                      minimumFractionDigits: 0,
                      maximumFractionDigits: 0,
                    },
                  )}`,
                  getLegendLabel(name),
                ]}
                labelFormatter={(label) => {
                  const periodLabel = String(label);

                  if (dimensions.isMobile && periodLabel.length > 10) {
                    return `${t("tooltip.period")}: ${periodLabel.substring(0, 8)}...`;
                  }

                  return `${t("tooltip.period")}: ${periodLabel}`;
                }}
                contentStyle={{
                  backgroundColor: "white",
                  borderRadius: "8px",
                  padding: dimensions.isMobile ? "6px 10px" : "10px 14px",
                  border: "1px solid #e5e7eb",
                  fontSize: dimensions.isMobile ? "11px" : "13px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                  maxWidth: dimensions.isMobile ? "200px" : "250px",
                }}
                cursor={{
                  stroke: "#9ca3af",
                  strokeWidth: dimensions.isMobile ? 1 : 1.5,
                  strokeDasharray: "3 3",
                }}
              />

              <Legend
                wrapperStyle={{
                  fontSize: dimensions.isMobile ? "10px" : "13px",
                  paddingTop: dimensions.isMobile ? "8px" : "16px",
                }}
                iconType="circle"
                iconSize={dimensions.isMobile ? 8 : 10}
                verticalAlign="bottom"
                height={dimensions.isMobile ? 32 : 40}
                formatter={(value) => {
                  if (dimensions.isMobile && value === "rentabilidad") {
                    return t("legend.shortProfitability");
                  }
                  return getLegendLabel(value);
                }}
              />

              <Line
                type="monotone"
                dataKey="ingresos"
                stroke={COLORS_RENTABILIDAD.ingresos}
                name="ingresos"
                strokeWidth={dimensions.isMobile ? 2 : 2.5}
                dot={!dimensions.isMobile}
                activeDot={{
                  r: dimensions.isMobile ? 6 : 8,
                  strokeWidth: 2,
                  stroke: "white",
                }}
              />

              <Line
                type="monotone"
                dataKey="gastos"
                stroke={COLORS_RENTABILIDAD.gastos}
                name="gastos"
                strokeWidth={dimensions.isMobile ? 2 : 2.5}
                dot={!dimensions.isMobile}
                activeDot={{
                  r: dimensions.isMobile ? 6 : 8,
                  strokeWidth: 2,
                  stroke: "white",
                }}
              />

              <Line
                type="monotone"
                dataKey="rentabilidad"
                stroke={COLORS_RENTABILIDAD.rentabilidad}
                name="rentabilidad"
                strokeWidth={dimensions.isMobile ? 2 : 2.5}
                dot={!dimensions.isMobile}
                activeDot={{
                  r: dimensions.isMobile ? 6 : 8,
                  strokeWidth: 2,
                  stroke: "white",
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {dimensions.isMobile && (
          <div className="mt-3 pt-2 border-t border-gray-100">
            <div className="flex justify-center gap-4 text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span>{t("legend.income")}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-red-500"></div>
                <span>{t("legend.expenses")}</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                <span>{t("legend.shortProfitability")}</span>
              </div>
            </div>
            <p className="text-xs text-center text-gray-400 mt-2">
              💡 {t("chartHint")}
            </p>
          </div>
        )}

        {(!rentabilidadPeriodo || rentabilidadPeriodo.length === 0) && (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <p className="text-sm">{t("empty.title")}</p>
            <p className="text-xs mt-1">{t("empty.description")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardEvolucion;
