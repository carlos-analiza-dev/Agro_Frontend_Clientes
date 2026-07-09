"use client";
import React, { Dispatch, SetStateAction } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Calendar, Package, TrendingDown, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ResponseDescartesEspecie } from "@/api/dashboard/interfaces/produccion/response-descartes.interface";
import {
  DEFAULT_COLOR,
  DISCARD_COLORS,
  MORTALITY_COLORS,
} from "@/helpers/data/colors/mortalidad_descartes";

interface DescartesData {
  especieId: string;
  especie: string;
  cantidad: string;
}

interface Props {
  descartes_mortalidad: ResponseDescartesEspecie[] | undefined;
  setSelectedMonth: Dispatch<SetStateAction<string>>;
  selectedMonth: string;
  cargando: boolean;
  title: string;
  sub_title: string;
  isDescarte: boolean;
}

const DescartesMortalidadDashboard = ({
  descartes_mortalidad,
  cargando,
  selectedMonth,
  setSelectedMonth,
  title,
  sub_title,
  isDescarte,
}: Props) => {
  const monthOptions = React.useMemo(() => {
    const options = [];
    const today = new Date();
    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      options.push({
        value: format(date, "yyyy-MM"),
        label: format(date, "MMMM yyyy", { locale: es }),
      });
    }
    return options;
  }, []);

  const chartData = React.useMemo(() => {
    if (!descartes_mortalidad || !Array.isArray(descartes_mortalidad))
      return [];

    return descartes_mortalidad.map((item: DescartesData) => ({
      name: item.especie,
      value: parseInt(item.cantidad) || 0,
      especieId: item.especieId,
    }));
  }, [descartes_mortalidad]);

  const totalDescartes = React.useMemo(() => {
    return chartData.reduce((sum, item) => sum + item.value, 0);
  }, [chartData]);

  const getColor = (especie: string) => {
    if (isDescarte) {
      return (
        DISCARD_COLORS[especie as keyof typeof DISCARD_COLORS] || DEFAULT_COLOR
      );
    } else {
      return (
        MORTALITY_COLORS[especie as keyof typeof MORTALITY_COLORS] ||
        DEFAULT_COLOR
      );
    }
  };

  const getIconColor = () => {
    return isDescarte ? "text-amber-500" : "text-red-500";
  };

  const getBadgeColor = () => {
    return isDescarte
      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400"
      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
          <p className="font-medium text-sm">{label}</p>
          <p className="text-sm text-muted-foreground">
            {title}:{" "}
            <span
              className={`font-bold ${isDescarte ? "text-amber-500" : "text-red-500"}`}
            >
              {payload[0].value}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  const EstadisticasCard = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card
        className={`border-l-4 ${isDescarte ? "border-l-amber-500" : "border-l-red-500"}`}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Total {title}</CardTitle>
          <TrendingDown
            className={`h-4 w-4 ${isDescarte ? "text-amber-500" : "text-red-500"}`}
          />
        </CardHeader>
        <CardContent>
          {cargando ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div
              className={`text-2xl font-bold ${isDescarte ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}
            >
              {totalDescartes}
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            En {format(new Date(selectedMonth), "MMMM yyyy", { locale: es })}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Especies Afectadas
          </CardTitle>
          <Package className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          {cargando ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="text-2xl font-bold">{chartData.length}</div>
          )}
          <p className="text-xs capitalize text-muted-foreground">
            Especies con {sub_title} registrados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">
            Especie Principal
          </CardTitle>
          <AlertCircle
            className={`h-4 w-4 ${isDescarte ? "text-amber-500" : "text-red-500"}`}
          />
        </CardHeader>
        <CardContent>
          {cargando ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div
              className={`text-2xl font-bold ${isDescarte ? "text-amber-600 dark:text-amber-400" : "text-red-600 dark:text-red-400"}`}
            >
              {chartData.length > 0
                ? chartData.reduce((a, b) => (a.value > b.value ? a : b)).name
                : "N/A"}
            </div>
          )}
          <p className="text-xs capitalize text-muted-foreground">
            Mayor cantidad de {sub_title}
          </p>
        </CardContent>
      </Card>
    </div>
  );

  const BarChartComponent = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg capitalize flex items-center gap-2">
              {sub_title} por Especie
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor()}`}
              >
                {isDescarte ? "Descarte" : "Mortalidad"}
              </span>
            </CardTitle>
            <CardDescription className="capitalize">
              Distribución de animales {title} por especie
            </CardDescription>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${isDescarte ? "bg-amber-500" : "bg-red-500"}`}
          />
        </div>
      </CardHeader>
      <CardContent>
        {cargando ? (
          <Skeleton className="h-[300px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <Package className="h-12 w-12 mb-2 opacity-50" />
            <p className="capitalize">No hay datos de {sub_title}</p>
            <p className="text-sm">Para este período</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="value"
                radius={[8, 8, 0, 0]}
                fill={isDescarte ? "#f59e0b" : "#ef4444"}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );

  const PieChartComponent = () => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              Distribución Porcentual
              <span
                className={`text-xs px-2 py-0.5 rounded-full ${getBadgeColor()}`}
              >
                {isDescarte ? "Descarte" : "Mortalidad"}
              </span>
            </CardTitle>
            <CardDescription className="capitalize">
              Porcentaje de {sub_title} por especie
            </CardDescription>
          </div>
          <div
            className={`w-3 h-3 rounded-full ${isDescarte ? "bg-amber-500" : "bg-red-500"}`}
          />
        </div>
      </CardHeader>
      <CardContent>
        {cargando ? (
          <Skeleton className="h-[300px] w-full" />
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
            <Package className="h-12 w-12 mb-2 opacity-50" />
            <p>No hay datos disponibles</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.name)} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1
            className={`text-base md:text-2xl capitalize font-bold flex items-center gap-2`}
          >
            <TrendingDown className={`h-6 w-6 ${getIconColor()}`} />
            Dashboard de {sub_title}
            <span
              className={`text-xs px-3 py-1 rounded-full ${getBadgeColor()} font-normal`}
            >
              {isDescarte ? "Descartes" : "Mortalidad"}
            </span>
          </h1>
          <p className="text-muted-foreground capitalize">
            Análisis de animales {title} por especie
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Seleccionar mes" />
            </SelectTrigger>
            <SelectContent>
              {monthOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <EstadisticasCard />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BarChartComponent />
        <PieChartComponent />
      </div>

      <div className="text-xs text-muted-foreground text-center border-t pt-4">
        <p>
          Datos actualizados al{" "}
          {format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es })}
        </p>
        {isDescarte && (
          <p className="mt-1">
            Los {sub_title} incluyen: ventas, traslados, bajas por calidad,
            entre otros
          </p>
        )}
        {!isDescarte && (
          <p className="mt-1">
            Los {sub_title} incluyen: enfermedades, accidentes, causas
            naturales, entre otros
          </p>
        )}
      </div>
    </div>
  );
};

export default DescartesMortalidadDashboard;
