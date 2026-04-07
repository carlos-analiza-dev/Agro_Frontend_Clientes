"use client";

import { useState } from "react";
import useGetRentabilidadGeneral from "@/hooks/finanzas/rentabilidad/useGetRentabilidadGeneral";
import useGetRentabilidadPorPeriodo from "@/hooks/finanzas/rentabilidad/useGetRentabilidadPorPeriodo";
import useGetRentabilidadPorCategoria from "@/hooks/finanzas/rentabilidad/useGetRentabilidadPorCategoria";
import useGetRentabilidadPorFinca from "@/hooks/finanzas/rentabilidad/useGetRentabilidadPorFinca";
import { FiltrosRentabilidad } from "@/api/finanzas/rentabilidad/interface/rentabilidad.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Percent,
  Building2,
  BarChart3,
} from "lucide-react";
import { MetricCard } from "./ui/MetricCard";
import { RentabilidadSkeleton } from "./ui/RentabilidadSkeleton";
import { useAuthStore } from "@/providers/store/useAuthStore";
import CardEvolucion from "./ui/CardEvolucion";
import CardMejorPeorMes from "./ui/CardMejorPeorMes";
import PieChartCategorias from "./ui/PieChartCategorias";
import CardDetallesRentCategorias from "./ui/CardDetallesRentCategorias";
import CardFincas from "./ui/CardFincas";
import CardDetailsRentFincas from "./ui/CardDetailsRentFincas";
import { FiltrosRentabilidadComponent } from "./ui/FiltrosRentabilidadComponent";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetEspecies from "@/hooks/especies/useGetEspecies";

const RentabilidadPage = () => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const [filtros, setFiltros] = useState<FiltrosRentabilidad>({});
  const [periodo, setPeriodo] = useState<"day" | "week" | "month" | "year">(
    "month",
  );

  const { data: rentabilidadGeneral, isLoading: isLoadingGeneral } =
    useGetRentabilidadGeneral(filtros);
  const { data: rentabilidadPeriodo, isLoading: isLoadingPeriodo } =
    useGetRentabilidadPorPeriodo(periodo, filtros);
  const { data: rentabilidadCategorias, isLoading: isLoadingCategorias } =
    useGetRentabilidadPorCategoria(filtros);
  const { data: rentabilidadFincas, isLoading: isLoadingFincas } =
    useGetRentabilidadPorFinca(filtros);

  const { data: finca } = useFincasPropietarios(clienteId);
  const { data: especies } = useGetEspecies();

  const ratio = rentabilidadGeneral
    ? rentabilidadGeneral.totalGastos > 0
      ? rentabilidadGeneral.totalIngresos / rentabilidadGeneral.totalGastos
      : 0
    : 0;

  if (
    isLoadingGeneral ||
    isLoadingPeriodo ||
    isLoadingCategorias ||
    isLoadingFincas
  ) {
    return <RentabilidadSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="space-y-4">
          <div>
            <h1 className="text-xl md:text-3xl font-bold text-gray-900">
              Dashboard de Rentabilidad
            </h1>
            <p className="text-gray-600 mt-1">
              Análisis financiero de tu negocio ganadero
            </p>
          </div>
          <FiltrosRentabilidadComponent
            filtros={filtros}
            setFiltros={setFiltros}
            fincas={finca?.data?.fincas}
            especies={especies?.data}
          />
        </div>

        {rentabilidadGeneral && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Ingresos"
              value={rentabilidadGeneral.totalIngresos}
              icon={DollarSign}
              color="text-green-600"
              bgColor="bg-green-50"
              prefix={moneda}
            />
            <MetricCard
              title="Total Gastos"
              value={rentabilidadGeneral.totalGastos}
              icon={Wallet}
              color="text-red-600"
              bgColor="bg-red-50"
              prefix={moneda}
            />
            <MetricCard
              title="Rentabilidad Neta"
              value={rentabilidadGeneral.rentabilidadNeta}
              icon={
                rentabilidadGeneral.rentabilidadNeta >= 0
                  ? TrendingUp
                  : TrendingDown
              }
              color={
                rentabilidadGeneral.rentabilidadNeta >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }
              bgColor={
                rentabilidadGeneral.rentabilidadNeta >= 0
                  ? "bg-green-50"
                  : "bg-red-50"
              }
              prefix={moneda}
            />
            <MetricCard
              title="Margen de Rentabilidad"
              value={rentabilidadGeneral.margenRentabilidad}
              icon={Percent}
              color={
                rentabilidadGeneral.margenRentabilidad >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }
              bgColor={
                rentabilidadGeneral.margenRentabilidad >= 0
                  ? "bg-green-50"
                  : "bg-red-50"
              }
              suffix="%"
              decimal={2}
            />
          </div>
        )}

        {rentabilidadGeneral && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  ROI (Retorno de Inversión)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={`text-2xl font-bold ${rentabilidadGeneral.roi >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {rentabilidadGeneral.roi.toFixed(2)}%
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Rentabilidad vs inversión total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  Ratio Beneficio/Costo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">{ratio}</div>
                <p className="text-xs text-gray-500 mt-1">
                  Ingresos por cada $1 de gasto
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="evolucion" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="evolucion" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Evolución
            </TabsTrigger>
            <TabsTrigger value="categorias" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Categorías
            </TabsTrigger>
            <TabsTrigger value="fincas" className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Fincas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="evolucion" className="space-y-4">
            <CardEvolucion
              rentabilidadPeriodo={rentabilidadPeriodo}
              periodo={periodo}
              setPeriodo={setPeriodo}
              moneda={moneda}
            />

            {rentabilidadGeneral && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <CardMejorPeorMes
                  title="Mejor Mes"
                  periodo={rentabilidadGeneral.mejorMes?.periodo || ""}
                  moneda={moneda}
                  rentabilidad={
                    rentabilidadGeneral.mejorMes?.rentabilidad?.toLocaleString() ||
                    "0"
                  }
                  margen={
                    rentabilidadGeneral.mejorMes?.margen?.toFixed(2) || "0"
                  }
                  icon={TrendingUp}
                  variant="success"
                />

                <CardMejorPeorMes
                  title="Peor Mes"
                  periodo={rentabilidadGeneral.peorMes?.periodo || ""}
                  moneda={moneda}
                  rentabilidad={
                    rentabilidadGeneral.peorMes?.rentabilidad?.toLocaleString() ||
                    "0"
                  }
                  margen={
                    rentabilidadGeneral.peorMes?.margen?.toFixed(2) || "0"
                  }
                  icon={TrendingDown}
                  variant="danger"
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value="categorias" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <PieChartCategorias
                title="Distribución de Ingresos por Categoría"
                data={rentabilidadCategorias || []}
                tipo="ingreso"
                moneda={moneda}
              />

              <PieChartCategorias
                title="Distribución de Gastos por Categoría"
                data={rentabilidadCategorias || []}
                tipo="gasto"
                moneda={moneda}
              />
            </div>

            <CardDetallesRentCategorias
              rentabilidadCategorias={rentabilidadCategorias}
              moneda={moneda}
            />
          </TabsContent>

          <TabsContent value="fincas" className="space-y-4">
            <CardFincas
              rentabilidadFincas={rentabilidadFincas}
              moneda={moneda}
            />

            <CardDetailsRentFincas
              rentabilidadFincas={rentabilidadFincas}
              moneda={moneda}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default RentabilidadPage;
