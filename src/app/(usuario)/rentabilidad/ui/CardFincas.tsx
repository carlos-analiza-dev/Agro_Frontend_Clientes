"use client";
import { RentabilidadPorFinca } from "@/api/finanzas/rentabilidad/interface/rentabilidad.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { COLORS_RENTABILIDAD } from "@/helpers/data/rentabilidad_colors";
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
import React, { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";

interface Props {
  rentabilidadFincas: RentabilidadPorFinca[] | undefined;
  moneda: string;
}

const CardFincas = ({ rentabilidadFincas = [], moneda }: Props) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-base sm:text-lg md:text-xl">
          Rentabilidad por Finca
        </CardTitle>
      </CardHeader>

      <CardContent>
        <div className="h-[280px] sm:h-[320px] md:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={rentabilidadFincas}
              margin={{
                top: 10,
                right: 10,
                left: isMobile ? -15 : -5,
                bottom: isMobile ? 20 : 50,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />

              <XAxis
                dataKey="fincaNombre"
                interval={0}
                angle={isMobile ? 0 : -30}
                textAnchor={isMobile ? "middle" : "end"}
                height={isMobile ? 30 : 60}
                tick={{ fontSize: isMobile ? 9 : 11 }}
                hide={isMobile && rentabilidadFincas.length > 5}
              />

              <YAxis
                tick={{ fontSize: isMobile ? 9 : 11 }}
                width={isMobile ? 40 : 60}
              />

              <Tooltip
                formatter={(value: number, name: string) => [
                  `${moneda}${value.toLocaleString()}`,
                  name,
                ]}
              />

              <Legend
                layout={isMobile ? "horizontal" : "horizontal"}
                verticalAlign="bottom"
                align="center"
                wrapperStyle={{
                  fontSize: isMobile ? "10px" : "12px",
                }}
              />

              <Bar
                dataKey="ingresos"
                fill={COLORS_RENTABILIDAD.ingresos}
                name="Ingresos"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="gastos"
                fill={COLORS_RENTABILIDAD.gastos}
                name="Gastos"
                radius={[4, 4, 0, 0]}
              />

              <Bar
                dataKey="rentabilidad"
                fill={COLORS_RENTABILIDAD.rentabilidad}
                name="Rentabilidad"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {isMobile && (
          <div className="mt-4 space-y-2">
            {rentabilidadFincas.slice(0, 5).map((finca, index) => (
              <div
                key={index}
                className="flex justify-between items-center text-sm border-b pb-1"
              >
                <span className="truncate max-w-[120px]">
                  {finca.fincaNombre}
                </span>

                <span
                  className={`font-medium ${
                    finca.rentabilidad >= 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {moneda}
                  {finca.rentabilidad.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardFincas;
