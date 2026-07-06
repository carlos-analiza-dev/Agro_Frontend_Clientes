"use client";
import { tiposServiciosSanidadData } from "@/helpers/data/sanidad/tipos_servicios_sanidad";
import { parseLocalDate } from "@/helpers/funciones/formatDateOnly";
import useGetCostosMensualesSanidad from "@/hooks/sanidad-animal/useGetCostosMensualesSanidad";
import useGetSanidadAnimal from "@/hooks/sanidad-animal/useGetSanidadAnimal";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { differenceInCalendarDays, format } from "date-fns";
import { es } from "date-fns/locale";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  DollarSign,
  Eye,
  FileText,
  Filter,
  Layers,
  Pill,
  Search,
  ShieldPlus,
  Syringe,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import CardSanidad from "./ui/CardSanidad";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import TableResumenSanidad from "./ui/TableResumenSanidad";
import Paginacion from "@/components/generics/Paginacion";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Modal from "@/components/generics/Modal";
import FormSanidad from "./ui/FormSanidad";
import { ResponseEspecies } from "@/api/especies/interfaces/response-especies.interface";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { Sanidad } from "@/api/sanidad-animal/interface/response-sanidad-animal.interface";
import useGetSanidadEliminados from "@/hooks/sanidad-animal/useGetSanidadEliminados";
import { StatCard } from "@/components/generics/StatCard";
import EvolucionMensual from "@/components/reportes/sanidad-animal/EvolucionMensual";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import DistribucionServicio from "@/components/reportes/sanidad-animal/DistribucionServicio";
import ResumenPorServicio from "@/components/reportes/sanidad-animal/ResumenPorServicio";

const SanidadAnimalPage = () => {
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const [openViewsEliminados, setOpenViewsEliminados] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [especieSeleccionada, setEspecieSeleccionada] = useState("");
  const [selectedSanidad, setSelectedSanidad] = useState<Sanidad | null>(null);
  const [selectedServicioGrafico, setSelectedServicioGrafico] =
    useState<string>("todos");
  const especie = especieSeleccionada === "todos" ? "" : especieSeleccionada;
  const { data: especies } = useGetEspecies();
  const tipos_servicio = filterTipo === "todos" ? "" : filterTipo;
  const { data: eliminados } = useGetSanidadEliminados();
  const { data: sanidadResponse, isLoading } = useGetSanidadAnimal({
    especie: especie,
    tipo_servicio: tipos_servicio,
  });
  const { data: costos_mensuales, isLoading: cargando_costos } =
    useGetCostosMensualesSanidad({ especie });

  const sanidadData = sanidadResponse?.sanidad || [];

  const handleEditSanidad = (sanidad: Sanidad) => {
    setSelectedSanidad(sanidad);
    setOpenModal(true);
  };

  const filteredData = useMemo(() => {
    let filtered = sanidadData;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.tipo_servicio?.toLowerCase().includes(term) ||
          item.responsable?.toLowerCase().includes(term) ||
          item.animal?.nombre_animal?.toLowerCase().includes(term) ||
          item.animal?.identificador?.toLowerCase().includes(term) ||
          item.observaciones?.toLowerCase().includes(term),
      );
    }

    return filtered;
  }, [sanidadData, searchTerm]);

  const datosCostosProcesados = useMemo(() => {
    if (!costos_mensuales || costos_mensuales.length === 0) {
      return {
        datosPorMes: [],
        datosPorServicio: [],
        totalGeneral: 0,
        serviciosUnicos: [],
        promedioMensual: 0,
        mesConMayorCosto: null,
        mesConMenorCosto: null,
        servicioConMayorCosto: null,
        datosEvolucion: [],
      };
    }

    const meses = Array.from(
      new Set(costos_mensuales.map((item) => item.mes)),
    ).sort();

    const datosPorMes = meses.map((mes) => {
      const itemsDelMes = costos_mensuales.filter((item) => item.mes === mes);
      const totalMes = itemsDelMes.reduce(
        (acc, item) => acc + (item.total_costo || 0),
        0,
      );
      const cantidadTotal = itemsDelMes.reduce(
        (acc, item) => acc + (item.cantidad || 0),
        0,
      );

      const [year, month] = mes.split("-");
      const fecha = new Date(parseInt(year), parseInt(month) - 1);
      const nombreMes = format(fecha, "MMM yyyy", { locale: es });

      return {
        mes,
        nombreMes,
        total: totalMes,
        cantidad: cantidadTotal,
        servicios: itemsDelMes,
      };
    });

    const serviciosMap = new Map();
    costos_mensuales.forEach((item) => {
      const key = item.tipo_servicio;
      if (!serviciosMap.has(key)) {
        serviciosMap.set(key, {
          nombre: key,
          total: 0,
          cantidad: 0,
          meses: [],
        });
      }
      const servicio = serviciosMap.get(key);
      servicio.total += item.total_costo || 0;
      servicio.cantidad += item.cantidad || 0;
      servicio.meses.push({
        mes: item.mes,
        costo: item.total_costo || 0,
        cantidad: item.cantidad || 0,
      });
    });

    const datosPorServicio = Array.from(serviciosMap.values()).sort(
      (a, b) => b.total - a.total,
    );

    const datosEvolucion = meses.map((mes) => {
      const itemsDelMes = costos_mensuales.filter((item) => item.mes === mes);
      const totalMes = itemsDelMes.reduce(
        (acc, item) => acc + (item.total_costo || 0),
        0,
      );
      const [year, month] = mes.split("-");
      const fecha = new Date(parseInt(year), parseInt(month) - 1);

      return {
        mes,
        nombreMes: format(fecha, "MMM yyyy", { locale: es }),
        total: totalMes,
        items: itemsDelMes,
      };
    });

    const totalGeneral = datosPorMes.reduce((acc, mes) => acc + mes.total, 0);
    const promedioMensual =
      datosPorMes.length > 0 ? totalGeneral / datosPorMes.length : 0;

    const mesConMayorCosto =
      datosPorMes.length > 0
        ? datosPorMes.reduce((max, mes) => (mes.total > max.total ? mes : max))
        : null;

    const mesConMenorCosto =
      datosPorMes.length > 0
        ? datosPorMes.reduce((min, mes) => (mes.total < min.total ? mes : min))
        : null;

    const servicioConMayorCosto =
      datosPorServicio.length > 0 ? datosPorServicio[0] : null;

    return {
      datosPorMes,
      datosPorServicio,
      totalGeneral,
      serviciosUnicos: Array.from(serviciosMap.keys()),
      promedioMensual,
      mesConMayorCosto,
      mesConMenorCosto,
      servicioConMayorCosto,
      datosEvolucion,
    };
  }, [costos_mensuales]);

  const datosEvolucionFiltrados = useMemo(() => {
    if (selectedServicioGrafico === "todos") {
      return datosCostosProcesados.datosEvolucion;
    }

    return datosCostosProcesados.datosEvolucion.map((mes) => {
      const itemsFiltrados = mes.items.filter(
        (item) => item.tipo_servicio === selectedServicioGrafico,
      );
      const totalFiltrado = itemsFiltrados.reduce(
        (acc, item) => acc + (item.total_costo || 0),
        0,
      );

      return {
        ...mes,
        total: totalFiltrado,
        items: itemsFiltrados,
      };
    });
  }, [datosCostosProcesados.datosEvolucion, selectedServicioGrafico]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const estadisticas = useMemo(() => {
    if (!sanidadData || sanidadData.length === 0) {
      return {
        estadoSanitario: "Sin registros",
        descripcionEstado: "No hay registros de sanidad",
        parrafoEstado: "Inicia registrando un evento sanitario",
        ultimoEvento: "N/A",
        descripcionUltimo: "N/A",
        parrafoUltimo: "Sin eventos registrados",
        proximoEvento: "N/A",
        descripcionProximo: "N/A",
        parrafoProximo: "Sin eventos programados",
        costoSanitario: 0,
        costoSanitarioStr: `${moneda}0`,
        descripcionCosto: "Sin costos registrados",
        parrafoCosto: "Promedio por animal/lote",
        tieneEventosPendientes: false,
        eventosPendientes: 0,
        totalEventos: 0,
        promedioPorEvento: 0,
      };
    }

    const sortedData = [...sanidadData].sort(
      (a, b) =>
        new Date(b.fecha_evento).getTime() - new Date(a.fecha_evento).getTime(),
    );

    const ultimo = sortedData[0];
    const ultimoEvento = ultimo?.tipo_servicio || "N/A";
    const fechaEvento = parseLocalDate(ultimo.fecha_evento);

    let diasDesdeUltimo = "N/A";

    if (ultimo?.fecha_evento) {
      const diffDays = differenceInCalendarDays(new Date(), fechaEvento);

      if (diffDays <= 0) {
        diasDesdeUltimo = "Hoy";
      } else if (diffDays === 1) {
        diasDesdeUltimo = "Hace 1 día";
      } else {
        diasDesdeUltimo = `Hace ${diffDays} días`;
      }
    }
    const eventosConProxima = sortedData.filter(
      (item) =>
        item.proxima_fecha_evento &&
        new Date(item.proxima_fecha_evento) >= new Date(),
    );

    let proximoEvento = "Sin programar";
    let fechaProximo = "N/A";
    let diasHastaProximo = "N/A";

    if (eventosConProxima.length > 0) {
      const proximo = eventosConProxima.sort(
        (a, b) =>
          new Date(a.proxima_fecha_evento).getTime() -
          new Date(b.proxima_fecha_evento).getTime(),
      )[0];

      proximoEvento = proximo.tipo_servicio || "Sin programar";
      fechaProximo = proximo.proxima_fecha_evento
        ? format(new Date(proximo.proxima_fecha_evento), "dd/MM/yyyy", {
            locale: es,
          })
        : "N/A";

      if (proximo.proxima_fecha_evento) {
        const diffTime = Math.abs(
          new Date(proximo.proxima_fecha_evento).getTime() -
            new Date().getTime(),
        );
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        diasHastaProximo = diffDays === 0 ? "Hoy" : `${diffDays} días`;
      }
    }

    const costoTotal = sanidadData.reduce((acc, item) => {
      const costo = parseFloat(item.costo_real) || 0;
      return acc + costo;
    }, 0);

    const eventosPendientes = eventosConProxima.filter((item) => {
      if (!item.proxima_fecha_evento) return false;
      const diffTime =
        new Date(item.proxima_fecha_evento).getTime() - new Date().getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays <= 7 && diffDays >= 0;
    });

    const tienePendientes = eventosPendientes.length > 0;

    let estadoSanitario = "Al día";
    let descripcionEstado = "Todo en orden";
    let parrafoEstado = "Sin eventos pendientes";

    if (eventosPendientes.length > 0) {
      const serviciosPendientes = eventosPendientes
        .map((e) => e.tipo_servicio)
        .join(", ");
      estadoSanitario = `${eventosPendientes.length} pendiente${eventosPendientes.length > 1 ? "s" : ""}`;
      descripcionEstado = `Próximo: ${serviciosPendientes}`;
      parrafoEstado = `Requiere atención en los próximos 7 días`;
    }

    const promedioPorEvento =
      sanidadData.length > 0 ? costoTotal / sanidadData.length : 0;

    return {
      estadoSanitario,
      descripcionEstado,
      parrafoEstado,
      ultimoEvento,
      descripcionUltimo: fechaEvento,
      parrafoUltimo: diasDesdeUltimo,
      proximoEvento:
        diasHastaProximo !== "N/A" ? diasHastaProximo : "Sin programar",
      descripcionProximo: fechaProximo,
      parrafoProximo:
        proximoEvento !== "Sin programar"
          ? `Próximo: ${proximoEvento}`
          : "Sin eventos programados",
      costoSanitario: costoTotal,
      costoSanitarioStr: `${moneda}${costoTotal.toFixed(2)}`,
      descripcionCosto: `${sanidadData.length} evento${sanidadData.length > 1 ? "s" : ""}`,
      parrafoCosto: `Promedio por animal/lote`,
      tieneEventosPendientes: tienePendientes,
      eventosPendientes: eventosPendientes.length,
      totalEventos: sanidadData.length,
      promedioPorEvento: promedioPorEvento,
    };
  }, [sanidadData, moneda]);

  const getEstadoIcon = () => {
    if (estadisticas.tieneEventosPendientes) {
      return AlertCircle;
    }
    return CheckCircle;
  };

  const opciones_servicios_especie = tiposServiciosSanidadData.filter(
    (data) => {
      if (data.especies.includes("todas")) {
        return especieSeleccionada !== "peces";
      }
      return data.especies.includes(especieSeleccionada);
    },
  );

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 capitalize">
            <ShieldPlus className="h-7 w-7 text-green-600" />
            Sanidad {especieSeleccionada ? `- ${especieSeleccionada}` : ""}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Registra y monitorea la sanidad de tus animales por especie
          </p>
        </div>
        {eliminados && eliminados.total > 0 && (
          <Button
            onClick={() => setOpenViewsEliminados(true)}
            variant={"outline"}
          >
            Ver Eliminados ({eliminados.total}) <Eye />
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <label className="text-sm font-medium">Filtrar por especie:</label>
        <Select
          value={especieSeleccionada}
          onValueChange={(value) => {
            setEspecieSeleccionada(value);
            setCurrentPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Seleccionar especie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todas las especies</SelectItem>
            {especies?.data.map((especie: ResponseEspecies) => (
              <SelectItem key={especie.id} value={especie.nombre}>
                {especie.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-sm text-muted-foreground">
          Mostrando: <strong>{especieSeleccionada}</strong>
        </span>
      </div>

      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <CardSanidad
            title="Estado sanitario"
            description={estadisticas.estadoSanitario}
            parrafo={estadisticas.parrafoEstado}
            Icon={getEstadoIcon()}
          />
          <CardSanidad
            title="Último evento"
            description={estadisticas.ultimoEvento}
            parrafo={estadisticas.parrafoUltimo}
            Icon={
              estadisticas.ultimoEvento === "Vacunacion"
                ? Syringe
                : estadisticas.ultimoEvento === "Desparasitacion"
                  ? Pill
                  : FileText
            }
          />
          <CardSanidad
            title="Próximo evento"
            description={estadisticas.proximoEvento}
            parrafo={estadisticas.parrafoProximo}
            Icon={Calendar}
          />
          <CardSanidad
            title="Costo sanitario mes"
            description={estadisticas.costoSanitarioStr}
            parrafo={`Promedio: ${moneda}${estadisticas.promedioPorEvento.toFixed(2)} por evento`}
            Icon={DollarSign}
          />
        </div>

        {estadisticas.tieneEventosPendientes && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <p className="text-sm text-yellow-700">
              <strong>
                {estadisticas.eventosPendientes} evento(s) pendiente(s)
              </strong>{" "}
              - Requieren atención en los próximos 7 días
            </p>
          </div>
        )}

        <div className="mt-2 text-sm text-muted-foreground">
          {sanidadData.length > 0 ? (
            <p>Total de registros: {filteredData.length}</p>
          ) : (
            <p className="text-yellow-600">
              No hay registros de sanidad para esta especie
            </p>
          )}
        </div>
      </div>

      <div className="mt-5">
        <Tabs defaultValue="resumen" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="resumen">Resumen</TabsTrigger>
            <TabsTrigger value="costos">Costos Mensuales</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Sanidad</CardTitle>
                <CardDescription>
                  Lista completa de eventos sanitarios registrados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por servicio, responsable, animal..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex gap-2">
                    <Select value={filterTipo} onValueChange={setFilterTipo}>
                      <SelectTrigger className="w-[180px]">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Filtrar por tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos los tipos</SelectItem>
                        {opciones_servicios_especie.map((tipo) => (
                          <SelectItem key={tipo.id} value={tipo.value}>
                            {tipo.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : paginatedData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No se encontraron registros con los filtros aplicados
                  </div>
                ) : (
                  <div className="rounded-md border">
                    <TableResumenSanidad
                      paginatedData={paginatedData}
                      moneda={moneda}
                      handleEditSanidad={handleEditSanidad}
                      acciones={true}
                    />
                  </div>
                )}

                {filteredData.length > 0 && (
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                      Mostrando {(currentPage - 1) * pageSize + 1} -{" "}
                      {Math.min(currentPage * pageSize, filteredData.length)} de{" "}
                      {filteredData.length} registros
                    </p>
                    <Paginacion
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costos" className="mt-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Costos Mensuales por Servicio</CardTitle>
                  <CardDescription>
                    Análisis de costos sanitarios mensuales desglosados por tipo
                    de servicio (últimos 12 meses)
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                {cargando_costos ? (
                  <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : datosCostosProcesados.totalGeneral === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>No hay datos de costos disponibles</p>
                    <p className="text-sm mt-1">
                      Los costos se mostrarán aquí una vez que registres eventos
                      sanitarios
                    </p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <StatCard
                        title="Total gastado"
                        value={formatCurrency(
                          datosCostosProcesados.totalGeneral,
                          moneda,
                        )}
                        icon={DollarSign}
                        gradientFrom="from-green-50"
                        gradientTo="to-green-100"
                        iconColor="text-green-600"
                        textColor="text-green-800"
                      />

                      <StatCard
                        title="Promedio mensual"
                        value={formatCurrency(
                          datosCostosProcesados.promedioMensual,
                          moneda,
                        )}
                        icon={Calendar}
                        gradientFrom="from-blue-50"
                        gradientTo="to-blue-100"
                        iconColor="text-blue-600"
                        textColor="text-blue-800"
                      />

                      <StatCard
                        title="Servicios registrados"
                        value={datosCostosProcesados.serviciosUnicos.length}
                        icon={Layers}
                        gradientFrom="from-purple-50"
                        gradientTo="to-purple-100"
                        iconColor="text-purple-600"
                        textColor="text-purple-800"
                      />

                      <StatCard
                        title="Mayor gasto"
                        value={
                          datosCostosProcesados.servicioConMayorCosto?.nombre ||
                          "N/A"
                        }
                        icon={TrendingUp}
                        gradientFrom="from-orange-50"
                        gradientTo="to-orange-100"
                        iconColor="text-orange-600"
                        textColor="text-orange-800"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <Label className="text-sm font-medium">
                        Filtrar por servicio:
                      </Label>
                      <Select
                        value={selectedServicioGrafico}
                        onValueChange={setSelectedServicioGrafico}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Todos los servicios" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">
                            Todos los servicios
                          </SelectItem>
                          {datosCostosProcesados.serviciosUnicos.map(
                            (servicio) => (
                              <SelectItem key={servicio} value={servicio}>
                                {servicio}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <EvolucionMensual
                      datosEvolucionFiltrados={datosEvolucionFiltrados}
                      selectedServicioGrafico={selectedServicioGrafico}
                      moneda={moneda}
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <DistribucionServicio
                        datosCostosProcesados={
                          datosCostosProcesados.datosPorServicio
                        }
                        moneda={moneda}
                      />

                      <ResumenPorServicio
                        datosPorServicio={
                          datosCostosProcesados.datosPorServicio
                        }
                        moneda={moneda}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {datosCostosProcesados.mesConMayorCosto && (
                        <CardSanidad
                          title="Mes de mayor gasto"
                          description={
                            datosCostosProcesados.mesConMayorCosto.nombreMes
                          }
                          parrafo={`${formatCurrency(
                            datosCostosProcesados.mesConMayorCosto.total,
                            moneda,
                          )} (${datosCostosProcesados.mesConMayorCosto.cantidad} eventos)`}
                          Icon={TrendingUp}
                        />
                      )}

                      {datosCostosProcesados.mesConMenorCosto && (
                        <CardSanidad
                          title="Mes de menor gasto"
                          description={
                            datosCostosProcesados.mesConMenorCosto.nombreMes
                          }
                          parrafo={`${formatCurrency(
                            datosCostosProcesados.mesConMenorCosto.total,
                            moneda,
                          )} (${datosCostosProcesados.mesConMenorCosto.cantidad} eventos)`}
                          Icon={TrendingDown}
                        />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title={selectedSanidad ? "Editar Sanidad" : "Ingresar Sanidad"}
        description={
          selectedSanidad
            ? "Aquí podrás editar datos de sanidad dependiendo de la especie"
            : "Aquí podrás ingresar datos de sanidad dependiendo de la especie"
        }
        height="auto"
        size="2xl"
        showCloseButton={false}
      >
        <FormSanidad
          opciones_especie={opciones_servicios_especie}
          setOpenModal={setOpenModal}
          onSuccess={() => {
            setOpenModal(false);
            setSelectedSanidad(null);
          }}
          especie_animal={especieSeleccionada}
          sanidad={selectedSanidad}
        />
      </Modal>
      <Modal
        open={openViewsEliminados}
        onOpenChange={setOpenViewsEliminados}
        title="Eventos Eliminados"
        description="Aqui podras ver todos los eventos eliminados"
        height="auto"
        size="5xl"
      >
        <TableResumenSanidad
          paginatedData={eliminados?.sanidad ?? []}
          moneda={moneda}
          handleEditSanidad={handleEditSanidad}
          acciones={false}
        />
      </Modal>
    </div>
  );
};

export default SanidadAnimalPage;
