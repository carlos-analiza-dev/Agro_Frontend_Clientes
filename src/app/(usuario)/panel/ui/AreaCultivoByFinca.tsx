"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { MapPin, Ruler, TrendingUp, Award } from "lucide-react";
import SkeletonCard from "@/components/generics/SkeletonCard";
import { COLORS } from "@/helpers/data/colorDashboard";
import { ResponseAreaCultivoFinca } from "@/api/dashboard/interfaces/cultivos/response-area-finca.interface";
import {
  UNIDADES_CONFIG,
  UnidadMedida,
} from "@/helpers/funciones/cultivos/unidades-config";

interface Props {
  data: ResponseAreaCultivoFinca[] | undefined;
  isLoading: boolean;
}

const getUnidadNombre = (unidad: UnidadMedida): string => {
  return UNIDADES_CONFIG[unidad]?.nombre || unidad;
};

const getUnidadSimbolo = (unidad: UnidadMedida): string => {
  return UNIDADES_CONFIG[unidad]?.simbolo || unidad;
};

const convertirAHeclares = (area: number, unidad: UnidadMedida): number => {
  return area * (UNIDADES_CONFIG[unidad]?.factor || 1);
};

const formatearArea = (area: number, unidad: UnidadMedida): string => {
  const simbolo = getUnidadSimbolo(unidad);
  return `${area.toFixed(2)} ${simbolo}`;
};

const AreaCultivoByFinca = ({ data, isLoading }: Props) => {
  if (isLoading) {
    return <SkeletonCard />;
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <MapPin className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-center">
            No hay fincas con cultivos registrados
          </p>
          <p className="text-sm text-gray-400 text-center mt-2">
            Los cultivos registrados aparecerán aquí
          </p>
        </CardContent>
      </Card>
    );
  }

  const unidadesUnicas = Array.from(
    new Set(data.map((item) => item.unidad_medida)),
  );
  const tieneMultiplesUnidades = unidadesUnicas.length > 1;

  const chartData = data.map((item) => ({
    name: item.finca,
    area: parseFloat(item.area_total),
    areaHa: convertirAHeclares(parseFloat(item.area_total), item.unidad_medida),
    unidad: item.unidad_medida,
    unidadNombre: getUnidadNombre(item.unidad_medida),
    unidadSimbolo: getUnidadSimbolo(item.unidad_medida),
    areaFormateada: formatearArea(
      parseFloat(item.area_total),
      item.unidad_medida,
    ),
  }));

  const areaTotalHa = chartData.reduce((sum, item) => sum + item.areaHa, 0);
  const fincaPrincipal = chartData.sort((a, b) => b.areaHa - a.areaHa)[0];

  const unidadPrincipal = unidadesUnicas[0] as UnidadMedida;
  const unidadPrincipalNombre = getUnidadNombre(unidadPrincipal);

  const mostrarUnidad = tieneMultiplesUnidades ? "ha" : unidadPrincipal;
  const mostrarUnidadNombre = tieneMultiplesUnidades
    ? "hectáreas"
    : unidadPrincipalNombre;
  const mostrarSimbolo = tieneMultiplesUnidades
    ? "ha"
    : getUnidadSimbolo(unidadPrincipal);

  return (
    <Card className="w-full h-full">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Ruler className="h-5 w-5 text-blue-600" />
          Área Cultivada por Finca - En Progreso
        </CardTitle>
        <CardDescription>
          Distribución de {areaTotalHa.toFixed(2)} {mostrarUnidadNombre}{" "}
          cultivadas en {chartData.length} finca
          {chartData.length !== 1 ? "s" : ""}
          {tieneMultiplesUnidades && (
            <span className="block text-xs text-amber-600 mt-1">
              ⚠️ Se detectaron diferentes unidades de medida
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {tieneMultiplesUnidades && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-700">
              <p className="font-medium mb-1">
                📐 Múltiples unidades detectadas:
              </p>
              <div className="flex flex-wrap gap-2">
                {unidadesUnicas.map((unidad) => (
                  <span
                    key={unidad}
                    className="bg-white px-2 py-1 rounded border border-amber-200"
                  >
                    {getUnidadNombre(unidad as UnidadMedida)} ({unidad})
                  </span>
                ))}
              </div>
              <p className="mt-2">
                Los valores se muestran en hectáreas para comparación
              </p>
            </div>
          )}

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={(entry) => {
                    const areaMostrar = tieneMultiplesUnidades
                      ? `${entry.areaHa.toFixed(1)} ha`
                      : `${entry.area.toFixed(1)} ${entry.unidadSimbolo}`;
                    return `${entry.name}: ${areaMostrar}`;
                  }}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey={tieneMultiplesUnidades ? "areaHa" : "area"}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number, name: string, props: any) => {
                    const item = props.payload;
                    if (tieneMultiplesUnidades) {
                      return [
                        `${item.areaHa.toFixed(2)} ha (${item.areaFormateada})`,
                        "Área",
                      ];
                    }
                    return [
                      `${item.area.toFixed(2)} ${item.unidadSimbolo}`,
                      "Área",
                    ];
                  }}
                />
                <Legend
                  formatter={(value, entry, index) => {
                    const item = chartData[index];
                    const areaMostrar = tieneMultiplesUnidades
                      ? `${item.areaHa.toFixed(1)} ha`
                      : `${item.area.toFixed(1)} ${item.unidadSimbolo}`;
                    return `${value} (${areaMostrar})`;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="h-5 w-5 text-blue-600" />
                <h4 className="font-semibold text-sm text-gray-700">
                  Finca con Mayor Área
                </h4>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {fincaPrincipal?.name}
              </p>
              <p className="text-sm text-gray-600">
                {fincaPrincipal?.areaFormateada}
                {tieneMultiplesUnidades &&
                  fincaPrincipal?.areaHa !== fincaPrincipal?.area && (
                    <span className="text-xs text-gray-500 ml-1">
                      ({fincaPrincipal.areaHa.toFixed(2)} ha)
                    </span>
                  )}
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <h4 className="font-semibold text-sm text-gray-700">
                  Promedio por Finca
                </h4>
              </div>
              <p className="text-lg font-bold text-gray-900">
                {(areaTotalHa / chartData.length).toFixed(2)}
              </p>
              <p className="text-sm text-gray-600">
                {mostrarUnidadNombre} por finca
              </p>
            </div>
          </div>

          <div className="md:hidden">
            <h4 className="font-semibold text-sm text-gray-700 mb-3">
              Detalle por Finca
            </h4>
            <div className="space-y-2">
              {chartData.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col p-3 bg-gray-50 rounded-lg space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <span className="text-sm font-bold text-gray-900">
                      {item.areaFormateada}
                    </span>
                  </div>
                  {tieneMultiplesUnidades && item.areaHa !== item.area && (
                    <div className="text-xs text-gray-500 pl-5">
                      Equivalente: {item.areaHa.toFixed(2)} ha
                      <span className="ml-2">
                        ({((item.areaHa / areaTotalHa) * 100).toFixed(1)}% del
                        total)
                      </span>
                    </div>
                  )}
                  {!tieneMultiplesUnidades && (
                    <div className="text-xs text-gray-500 pl-5">
                      {(
                        (item.area /
                          chartData.reduce((s, i) => s + i.area, 0)) *
                        100
                      ).toFixed(1)}
                      % del total
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">
              Distribución del Área (en {mostrarUnidadNombre})
            </p>
            <div className="flex h-4 rounded-full overflow-hidden">
              {chartData.map((item, index) => {
                const porcentaje = (item.areaHa / areaTotalHa) * 100;
                return (
                  <div
                    key={index}
                    className="h-full"
                    style={{
                      width: `${porcentaje}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                      minWidth: porcentaje > 0 ? "4px" : "0",
                    }}
                  />
                );
              })}
            </div>
            <div className="flex flex-wrap gap-3 text-xs">
              {chartData.map((item, index) => {
                const porcentaje = (item.areaHa / areaTotalHa) * 100;
                return (
                  <div key={index} className="flex items-center gap-1">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: COLORS[index % COLORS.length] }}
                    />
                    <span className="truncate max-w-[80px]">{item.name}</span>
                    <span className="font-medium whitespace-nowrap">
                      ({porcentaje.toFixed(1)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {tieneMultiplesUnidades && (
            <div className="text-xs text-gray-400 text-center pt-2 border-t">
              <p>Conversión de unidades: 1 ha = </p>
              <div className="flex flex-wrap justify-center gap-2 mt-1">
                <span className="bg-gray-100 px-2 py-1 rounded">1.4286 mz</span>
                <span className="bg-gray-100 px-2 py-1 rounded">10,000 m²</span>
                <span className="bg-gray-100 px-2 py-1 rounded">0.01 km²</span>
                <span className="bg-gray-100 px-2 py-1 rounded">2.4711 ac</span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  107,639 ft²
                </span>
                <span className="bg-gray-100 px-2 py-1 rounded">
                  11,959.9 yd²
                </span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default AreaCultivoByFinca;
