"use client";

import { ResponseResumenHoras } from "@/api/dashboard/interfaces/planilla-dashboard/response-resumen-horas.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Clock, TrendingUp, Users } from "lucide-react";

interface Props {
  resumen_horas: ResponseResumenHoras | undefined;
  cargando_horas: boolean;
  moneda: string;
}

const ResumenHorasExtra = ({
  resumen_horas,
  cargando_horas,
  moneda,
}: Props) => {
  const formatearNumero = (value: string | number | null | undefined) => {
    if (value === null || value === undefined) return 0;
    return typeof value === "string" ? parseFloat(value) : value;
  };

  const datosHoras = [
    {
      name: "Horas Diurnas",
      value: formatearNumero(resumen_horas?.totalHorasDiurnas),
      color: "#f59e0b",
    },
    {
      name: "Horas Nocturnas",
      value: formatearNumero(resumen_horas?.totalHorasNocturnas),
      color: "#3b82f6",
    },
    {
      name: "Horas Festivas",
      value: formatearNumero(resumen_horas?.totalHorasFestivas),
      color: "#ef4444",
    },
  ].filter((item) => item.value > 0);

  if (cargando_horas) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-20 w-full" />
        </CardContent>
      </Card>
    );
  }

  const totalHoras = formatearNumero(resumen_horas?.totalHorasExtras);
  const montoTotal = resumen_horas?.montoTotalHorasExtras;
  const trabajadores = formatearNumero(
    resumen_horas?.trabajadoresConHorasExtras,
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          ⏰ Resumen de Horas Extras
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl border bg-muted/40">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Total Horas</span>
            </div>
            <p className="text-2xl font-bold">{totalHoras} h</p>
          </div>

          <div className="p-4 rounded-xl border bg-muted/40">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Monto Total</span>
            </div>
            <p className="text-2xl font-bold">
              {moneda}
              {montoTotal}
            </p>
          </div>

          <div className="p-4 rounded-xl border bg-muted/40">
            <div className="flex items-center gap-2 text-muted-foreground mb-1">
              <Users className="h-4 w-4" />
              <span className="text-sm">Trabajadores</span>
            </div>
            <p className="text-2xl font-bold">{trabajadores}</p>
          </div>
        </div>

        {datosHoras.length > 0 && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosHoras}
                  cx="50%"
                  cy="50%"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  dataKey="value"
                >
                  {datosHoras.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} horas`, "Cantidad"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResumenHorasExtra;
