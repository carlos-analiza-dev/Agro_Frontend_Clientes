"use client";

import { ResponseResumenMetodosPagos } from "@/api/dashboard/interfaces/planilla-dashboard/response-metodos-pagos.interface";
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
import { CreditCard, DollarSign } from "lucide-react";

interface Props {
  metodos: ResponseResumenMetodosPagos[] | undefined;
  cargando: boolean;
  moneda: string;
}

const ResumenMetodosPago = ({ metodos, cargando, moneda }: Props) => {
  const getMetodoColor = (metodo: string) => {
    const colors: Record<string, string> = {
      efectivo: "#10b981",
      transferencia: "#3b82f6",
      cheque: "#f59e0b",
    };
    return colors[metodo] || "#8884d8";
  };

  const getMetodoLabel = (metodo: string) => {
    const labels: Record<string, string> = {
      efectivo: "Efectivo",
      transferencia: "Transferencia",
      cheque: "Cheque",
    };
    return labels[metodo] || metodo;
  };

  const formatearMoneda = (monto: number) => {
    return new Intl.NumberFormat("es-HN", {
      style: "currency",
      currency: "HNL",
    }).format(monto);
  };

  const datosGraficos =
    metodos?.map((item) => ({
      name: getMetodoLabel(item.metodoPago),
      value: item.totalPagado,
      color: getMetodoColor(item.metodoPago),
      cantidad: item.cantidadPagos,
      porcentaje: item.porcentajeDelTotal,
    })) || [];

  if (cargando) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Métodos de Pago
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {datosGraficos.map((item) => (
            <div key={item.name} className="p-4 rounded-xl border bg-muted/40">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">{item.name}</span>
              </div>
              <p className="text-xl font-bold">{formatearMoneda(item.value)}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {item.cantidad} pagos ({item.porcentaje})
              </p>
            </div>
          ))}
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={datosGraficos}
                cx="50%"
                cy="50%"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                dataKey="value"
              >
                {datosGraficos.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatearMoneda(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumenMetodosPago;
