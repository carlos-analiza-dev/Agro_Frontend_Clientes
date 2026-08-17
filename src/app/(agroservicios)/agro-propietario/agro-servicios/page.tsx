"use client";

import { useState, useEffect } from "react";
import useGetMetricasFacturas from "@/hooks/agroservicios/dashboards/useGetMetricasFacturas";
import useGetAllSucursales from "@/hooks/agroservicios/sucursales/useGetAllSucursales";
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
  LineChart,
  Line,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  DollarSign,
  FileCheck,
  FileText,
  Filter,
  Receipt,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import useGetTopProductos from "@/hooks/agroservicios/dashboards/useGetTopProductos";
import TopProductosComponent from "@/components/agroservicio/dashboard/TopProductosComponent";
import useGetTopClientes from "@/hooks/agroservicios/dashboards/useGetTopClientes";
import TopClientesComponent from "@/components/agroservicio/dashboard/TopClientesComponent";
import { useAuthStore } from "@/providers/store/useAuthStore";
import useGetTopSucursales from "@/hooks/agroservicios/dashboards/useGetTopSucursales";
import TopSucursalesComponent from "@/components/agroservicio/dashboard/TopSucursalesComponent";
import useGetEstadosFacturas from "@/hooks/agroservicios/dashboards/useGetEstadosFacturas";
import EstadosFacturasComponent from "@/components/agroservicio/dashboard/EstadosFacturasComponent";
import { StatCard } from "@/components/generics/StatCard";

const AgroservicioDashboard = () => {
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const [fechaInicio, setFechaInicio] = useState<Date | undefined>(undefined);
  const [fechaFin, setFechaFin] = useState<Date | undefined>(undefined);
  const [sucursal, setSucursal] = useState<string>("todas");
  const [mostrarFiltros, setMostrarFiltros] = useState(true);

  const { data: sucursales, isLoading: cargandoSucursales } =
    useGetAllSucursales();
  const getQueryParams = () => {
    const params: {
      fechaInicio?: string;
      fechaFin?: string;
      sucursal?: string;
    } = {};

    if (fechaInicio) {
      params.fechaInicio = format(fechaInicio, "yyyy-MM-dd");
    }

    if (fechaFin) {
      params.fechaFin = format(fechaFin, "yyyy-MM-dd");
    }

    if (sucursal !== "todas") {
      params.sucursal = sucursal;
    }

    return params;
  };

  const {
    data: metricas_facturas,
    isLoading,
    refetch,
  } = useGetMetricasFacturas(getQueryParams());

  const { data: metricas_productos, isLoading: cargando_products } =
    useGetTopProductos(getQueryParams());

  const { data: top_clientes, isLoading: cargando_clientes } =
    useGetTopClientes(getQueryParams());

  const { data: top_sucursales, isLoading: cargando_sucursales } =
    useGetTopSucursales(getQueryParams());

  const { data: estados_facturas, isLoading: cargando_estados } =
    useGetEstadosFacturas(getQueryParams());

  useEffect(() => {
    refetch();
  }, [fechaInicio, fechaFin, sucursal, refetch]);

  const hayFiltrosActivos = fechaInicio || fechaFin || sucursal !== "todas";

  const resetFiltros = () => {
    setFechaInicio(undefined);
    setFechaFin(undefined);
    setSucursal("todas");
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

  const datosVentas = [
    {
      name: "Ventas Totales",
      value: metricas_facturas?.ventasTotales || 0,
    },
    { name: "Subtotal", value: metricas_facturas?.subtotal || 0 },
  ];

  const datosImpuestos = [
    { name: "ISV 15%", value: metricas_facturas?.isv15 || 0 },
    { name: "ISV 18%", value: metricas_facturas?.isv18 || 0 },
  ];

  const datosFinancieros = [
    {
      name: "Descuentos",
      value: metricas_facturas?.descuentos || 0,
    },
    {
      name: "Cargos Extra",
      value: metricas_facturas?.cargosExtra || 0,
    },
  ];

  const datosResumen = [
    {
      name: "Facturas",
      cantidad: metricas_facturas?.cantidadFacturas || 0,
    },
    {
      name: "Ticket Promedio",
      cantidad: metricas_facturas?.ticketPromedio || 0,
    },
  ];

  if (isLoading || cargandoSucursales) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando métricas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold">Dashboard Agroservicio</h1>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setMostrarFiltros(!mostrarFiltros)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            {mostrarFiltros ? "Ocultar Filtros" : "Mostrar Filtros"}
            {hayFiltrosActivos && (
              <span className="ml-1 h-2 w-2 rounded-full bg-blue-500"></span>
            )}
          </Button>
          {hayFiltrosActivos && (
            <Button
              variant="ghost"
              onClick={resetFiltros}
              className="flex items-center gap-2 text-red-600 hover:text-red-700"
            >
              <X className="h-4 w-4" />
              Limpiar Filtros
            </Button>
          )}
        </div>
      </div>

      {mostrarFiltros && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filtros</CardTitle>
            <CardDescription>
              Selecciona el rango de fechas y sucursal para filtrar los datos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha Inicio</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fechaInicio && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaInicio ? (
                        format(fechaInicio, "dd/MM/yyyy", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaInicio}
                      onSelect={setFechaInicio}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha Fin</label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !fechaFin && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {fechaFin ? (
                        format(fechaFin, "dd/MM/yyyy", { locale: es })
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={fechaFin}
                      onSelect={setFechaFin}
                      initialFocus
                      locale={es}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sucursal</label>
                <Select value={sucursal} onValueChange={setSucursal}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas las sucursales" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todas">Todas las sucursales</SelectItem>
                    {sucursales?.map((suc: any) => (
                      <SelectItem key={suc.id} value={suc.id}>
                        {suc.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {hayFiltrosActivos && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-semibold">Filtros aplicados:</span>
                  {fechaInicio && (
                    <span className="ml-2">
                      Desde: {format(fechaInicio, "dd/MM/yyyy", { locale: es })}
                    </span>
                  )}
                  {fechaFin && (
                    <span className="ml-2">
                      Hasta: {format(fechaFin, "dd/MM/yyyy", { locale: es })}
                    </span>
                  )}
                  {sucursal !== "todas" && (
                    <span className="ml-2">
                      Sucursal:{" "}
                      {sucursales?.find((s: any) => s.id === sucursal)
                        ?.nombre || sucursal}
                    </span>
                  )}
                </p>
              </div>
            )}

            {!hayFiltrosActivos && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold">Mostrando:</span> Todos los
                  datos disponibles
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Facturas"
          value={metricas_facturas?.cantidadFacturas || 0}
          icon={FileText}
          gradientFrom="from-blue-500"
          gradientTo="to-blue-600"
          iconColor="text-white"
          textColor="text-white"
        />

        <StatCard
          title="Ventas Totales"
          value={`${moneda} ${metricas_facturas?.ventasTotales?.toFixed(2) || "0.00"}`}
          icon={DollarSign}
          gradientFrom="from-green-500"
          gradientTo="to-green-600"
          iconColor="text-white"
          textColor="text-white"
        />

        <StatCard
          title="Ticket Promedio"
          value={`${moneda} ${metricas_facturas?.ticketPromedio?.toFixed(2) || "0.00"}`}
          icon={Receipt}
          gradientFrom="from-purple-500"
          gradientTo="to-purple-600"
          iconColor="text-white"
          textColor="text-white"
        />

        <StatCard
          title="Impuestos"
          value={`${moneda} ${metricas_facturas?.impuestos?.toFixed(2) || "0.00"}`}
          icon={FileCheck}
          gradientFrom="from-orange-500"
          gradientTo="to-orange-600"
          iconColor="text-white"
          textColor="text-white"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Análisis de Ventas</CardTitle>
            <CardDescription>
              Comparativa entre ventas totales y subtotal
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosVentas}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `${moneda} ${Number(value).toFixed(2)}`}
                />
                <Legend />
                <Bar dataKey="value" fill="#0088FE" name="Monto" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Impuestos</CardTitle>
            <CardDescription>Desglose de impuestos aplicados</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={datosImpuestos}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {datosImpuestos.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => `${moneda} ${Number(value).toFixed(2)}`}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Descuentos y Cargos Extra</CardTitle>
            <CardDescription>
              Análisis de ajustes en las facturas
            </CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={datosFinancieros}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `${moneda} ${Number(value).toFixed(2)}`}
                />
                <Legend />
                <Bar dataKey="value" fill="#FF8042" name="Monto" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resumen de Indicadores</CardTitle>
            <CardDescription>Facturas y ticket promedio</CardDescription>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={datosResumen}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip
                  formatter={(value) =>
                    typeof value === "number" ? value.toFixed(2) : value
                  }
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="cantidad"
                  stroke="#8884d8"
                  name="Valor"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles Financieros</CardTitle>
          <CardDescription>Desglose completo de las métricas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Subtotal</p>
              <p className="text-lg font-semibold">
                {moneda} {metricas_facturas?.subtotal?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">ISV 15%</p>
              <p className="text-lg font-semibold">
                {moneda} {metricas_facturas?.isv15?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">ISV 18%</p>
              <p className="text-lg font-semibold">
                {moneda} {metricas_facturas?.isv18?.toFixed(2) || "0.00"}
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500">Descuentos</p>
              <p className="text-lg font-semibold text-red-600">
                {moneda} {metricas_facturas?.descuentos?.toFixed(2) || "0.00"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <TopSucursalesComponent
        data={top_sucursales || []}
        isLoading={cargando_sucursales}
        title="Top Sucursales"
        description="Ranking de sucursales con mayores ventas"
        moneda={moneda}
      />

      <TopClientesComponent
        data={top_clientes || []}
        isLoading={cargando_clientes}
        moneda={moneda}
      />

      <TopProductosComponent
        data={metricas_productos || []}
        isLoading={cargando_products}
        title="Productos Más Vendidos"
        description="Top productos con mayor cantidad de ventas en el período seleccionado"
      />

      <EstadosFacturasComponent
        data={estados_facturas || []}
        isLoading={cargando_estados}
      />
    </div>
  );
};

export default AgroservicioDashboard;
