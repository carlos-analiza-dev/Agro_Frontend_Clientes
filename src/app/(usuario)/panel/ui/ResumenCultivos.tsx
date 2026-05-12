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
import {
  DollarSign,
  Sprout,
  TrendingUp,
  TrendingDown,
  Ruler,
  Package,
  PiggyBank,
} from "lucide-react";
import SkeletonCard from "@/components/generics/SkeletonCard";
import { ResponseResumenCultivos } from "@/api/dashboard/interfaces/cultivos/resumen-cultivos.interface";

interface Props {
  data: ResponseResumenCultivos | undefined;
  isLoading: boolean;
  moneda?: string;
}

const ResumenCultivos = ({ data, isLoading, moneda = "$" }: Props) => {
  if (isLoading) {
    return <SkeletonCard />;
  }

  if (!data || data.totalCultivos === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Sprout className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-center">
            No hay cultivos registrados actualmente
          </p>
          <p className="text-sm text-gray-400 text-center mt-2">
            Los cultivos que registres aparecerán aquí
          </p>
        </CardContent>
      </Card>
    );
  }

  const costosIngresosData = [
    {
      name: "Costos",
      value: data.costoTotal,
      color: "#ef4444",
      icon: "💰",
    },
    {
      name: "Ingresos",
      value: data.ingresoTotal,
      color: "#10b981",
      icon: "💵",
    },
  ];

  const distribucionData = [
    { name: "Inversión", value: data.costoTotal, color: "#f59e0b" },
    {
      name: "Ganancia",
      value: Math.max(0, data.gananciaTotal),
      color: "#10b981",
    },
  ];

  const indicadores = [
    {
      titulo: "Total Cultivos",
      valor: data.totalCultivos,
      unidad: "",
      icono: Sprout,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      titulo: "Área Total Sembrada",
      valor: data.areaTotalSembrada.toFixed(2),
      unidad: "ha",
      icono: Ruler,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      titulo: "Producción Estimada",
      valor: data.produccionEstimada.toFixed(0),
      unidad: "kg",
      icono: Package,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      titulo: "Ganancia Total",
      valor: `${moneda}${data.gananciaTotal.toLocaleString()}`,
      unidad: "",
      icono: PiggyBank,
      color: data.gananciaTotal >= 0 ? "text-green-600" : "text-red-600",
      bgColor: data.gananciaTotal >= 0 ? "bg-green-100" : "bg-red-100",
    },
  ];

  const margenGanancia =
    data.ingresoTotal > 0 ? (data.gananciaTotal / data.ingresoTotal) * 100 : 0;
  const roi =
    data.costoTotal > 0 ? (data.gananciaTotal / data.costoTotal) * 100 : 0;

  const eficienciaData = [
    {
      name: "Rentabilidad",
      value: Math.max(0, margenGanancia),
      meta: 30,
      color: "#10b981",
    },
    {
      name: "ROI",
      value: Math.max(0, roi),
      meta: 25,
      color: "#3b82f6",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {indicadores.map((indicador, index) => (
          <Card key={index} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {indicador.titulo}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <p className="text-2xl font-bold text-gray-900">
                      {indicador.valor}
                    </p>
                    {indicador.unidad && (
                      <p className="text-sm text-gray-500">
                        {indicador.unidad}
                      </p>
                    )}
                  </div>
                </div>
                <div className={`${indicador.bgColor} p-3 rounded-full`}>
                  <indicador.icono className={`h-6 w-6 ${indicador.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Costos vs Ingresos
            </CardTitle>
            <CardDescription>
              Comparativa entre inversión y retorno económico
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costosIngresosData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip
                    formatter={(value: number) => [
                      `${moneda}${value.toLocaleString()}`,
                      "",
                    ]}
                  />
                  <Legend />
                  <Bar dataKey="value" fill="#8884d8" radius={[8, 8, 0, 0]}>
                    {costosIngresosData.map((entry, index) => (
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
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Distribución de Valor
            </CardTitle>
            <CardDescription>
              Proporción entre inversión y ganancia
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribucionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {distribucionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => [
                      `${moneda}${value.toLocaleString()}`,
                      "",
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Indicadores de Rentabilidad
            </CardTitle>
            <CardDescription>
              Métricas clave del negocio agrícola
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Margen de Ganancia
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      margenGanancia >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {margenGanancia.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{
                      width: `${Math.min(100, Math.max(0, margenGanancia))}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Porcentaje de ganancia sobre los ingresos totales
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">
                    Retorno de Inversión (ROI)
                  </span>
                  <span
                    className={`text-sm font-bold ${
                      roi >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {roi.toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, Math.max(0, roi))}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Ganancia por cada unidad monetaria invertida
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-xs text-gray-500">Productividad por ha</p>
                  <p className="text-lg font-bold text-gray-900">
                    {data.produccionEstimada > 0 && data.areaTotalSembrada > 0
                      ? (
                          data.produccionEstimada / data.areaTotalSembrada
                        ).toFixed(0)
                      : 0}{" "}
                    <span className="text-xs">kg/ha</span>
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-500">Valor por kg</p>
                  <p className="text-lg font-bold text-gray-900">
                    {data.produccionEstimada > 0 && data.ingresoTotal > 0
                      ? `${moneda}${(data.ingresoTotal / data.produccionEstimada).toFixed(2)}`
                      : `${moneda}0`}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Eficiencia vs Meta
            </CardTitle>
            <CardDescription>
              Comparación de métricas actuales con objetivos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={eficienciaData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis
                    label={{
                      value: "Porcentaje (%)",
                      angle: -90,
                      position: "insideLeft",
                    }}
                  />
                  <Tooltip
                    formatter={(value: number) => [
                      `${value.toFixed(1)}%`,
                      "Valor actual",
                    ]}
                  />
                  <Legend />
                  <Bar
                    dataKey="value"
                    fill="#8884d8"
                    name="Valor Actual"
                    radius={[8, 8, 0, 0]}
                  >
                    {eficienciaData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                  <Bar
                    dataKey="meta"
                    fill="#9ca3af"
                    name="Meta"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Costos</p>
              <p className="text-2xl font-bold text-red-600">
                {moneda}
                {data.costoTotal.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Total Ingresos</p>
              <p className="text-2xl font-bold text-green-600">
                {moneda}
                {data.ingresoTotal.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-1">Ganancia Neta</p>
              <p
                className={`text-2xl font-bold ${
                  data.gananciaTotal >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {moneda}
                {data.gananciaTotal.toLocaleString()}
                {data.gananciaTotal >= 0 ? (
                  <TrendingUp className="inline ml-2 h-5 w-5" />
                ) : (
                  <TrendingDown className="inline ml-2 h-5 w-5" />
                )}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumenCultivos;
