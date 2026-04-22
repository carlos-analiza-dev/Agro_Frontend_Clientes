"use client";
import useGetJornadasTranajadores from "@/hooks/jornadas-trabajadores/useGetJornadasTranajadores";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Calendar,
  Clock,
  Filter,
  CheckCircle2,
  X,
  RefreshCw,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Paginacion from "@/components/generics/Paginacion";
import { Jornada } from "@/api/jornadas-trabajador/interface/response-jornadas.interface";
import { StatCard } from "@/components/generics/StatCard";
import TableJornadaTrabajadores from "./ui/TableJornadaTrabajadores";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import SkeletonJornadas from "@/components/generics/SkeletonJornadas";
import Modal from "@/components/generics/Modal";
import FormJornadaTrabajador from "./ui/FormJornadaTrabajador";
import { generarOpcionesMeses } from "@/helpers/funciones/generarOpcionesMeses";
import { useRouter } from "next/navigation";

const JornadasTrabajadoresPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchName, setSearchName] = useState("");
  const [openModalJornada, setOpenModalJornada] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filterTrabajo, setFilterTrabajo] = useState<string>("todos");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [selectedJornada, setSelectedJornada] = useState<Jornada | null>(null);
  const [fechaInicioDebounced, setFechaInicioDebounced] = useState<string>("");
  const [fechaFinDebounced, setFechaFinDebounced] = useState<string>("");
  const [mesSeleccionado, setMesSeleccionado] = useState<string>("");
  const [tipoFiltroFecha, setTipoFiltroFecha] = useState<"rango" | "mes">(
    "rango",
  );
  const limit = 10;
  const isMobile = useMediaQuery("(max-width: 768px)");

  const mesesOpciones = generarOpcionesMeses();

  const handleEditJornada = (jornada: Jornada) => {
    if (isMobile) {
      router.push(`/jornadas/${jornada.id}`);
    } else {
      setOpenModalJornada(true);
      setSelectedJornada(jornada);
    }
  };

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchName);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchName]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (tipoFiltroFecha === "rango") {
        setFechaInicioDebounced(fechaInicio);
        setFechaFinDebounced(fechaFin);
        setMesSeleccionado("");
      }
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [fechaInicio, fechaFin, tipoFiltroFecha]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (tipoFiltroFecha === "mes" && mesSeleccionado) {
        setFechaInicioDebounced("");
        setFechaFinDebounced("");
      }
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [mesSeleccionado, tipoFiltroFecha]);

  const { data: jornadasData, isLoading } = useGetJornadasTranajadores({
    offset: (currentPage - 1) * limit,
    limit,
    name: debouncedSearch || undefined,
    fechaInicio:
      tipoFiltroFecha === "rango"
        ? fechaInicioDebounced || undefined
        : undefined,
    fechaFin:
      tipoFiltroFecha === "rango" ? fechaFinDebounced || undefined : undefined,
    mes:
      tipoFiltroFecha === "mes" && mesSeleccionado
        ? mesSeleccionado
        : undefined,
  });

  const jornadas = jornadasData?.jornadas || [];
  const total = jornadasData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const jornadasFiltradas = jornadas.filter((jornada: Jornada) => {
    if (filterTrabajo === "todos") return true;
    if (filterTrabajo === "trabajo") return jornada.trabajo === true;
    if (filterTrabajo === "no-trabajo") return jornada.trabajo === false;
    return true;
  });

  const getHorasExtrasTotales = (jornada: Jornada) => {
    return (
      Number(jornada.horasExtrasDiurnas || 0) +
      Number(jornada.horasExtrasNocturnas || 0) +
      Number(jornada.horasExtrasFestivas || 0)
    );
  };

  const limpiarFiltros = () => {
    setSearchName("");
    setFechaInicio("");
    setFechaFin("");
    setMesSeleccionado("");
    setFilterTrabajo("todos");
    setTipoFiltroFecha("rango");
    setCurrentPage(1);
  };

  const tieneFiltrosActivos =
    searchName !== "" ||
    fechaInicio !== "" ||
    fechaFin !== "" ||
    mesSeleccionado !== "" ||
    filterTrabajo !== "todos";

  if (isLoading) {
    return <SkeletonJornadas isMobile={isMobile} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Jornadas de Trabajadores
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Registro diario de asistencia y horas extras
            </p>
          </div>
          <Button
            onClick={() => setOpenModalJornada(true)}
            className="shadow-lg"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Registrar Jornada
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Registros"
            value={total}
            icon={Calendar}
            gradientFrom="from-blue-50"
            gradientTo="to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
            textColor="text-blue-900 dark:text-blue-100"
          />

          <StatCard
            title="Días Trabajados"
            value={jornadas.filter((j: any) => j.trabajo).length}
            icon={CheckCircle2}
            gradientFrom="from-green-50"
            gradientTo="to-green-100 dark:from-green-950/30 dark:to-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
            textColor="text-green-900 dark:text-green-100"
          />

          <StatCard
            title="Total Horas Extras"
            value={jornadas
              .reduce(
                (sum: number, j: any) => sum + getHorasExtrasTotales(j),
                0,
              )
              .toFixed(2)}
            icon={Clock}
            gradientFrom="from-orange-50"
            gradientTo="to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30"
            iconColor="text-orange-600 dark:text-orange-400"
            textColor="text-orange-900 dark:text-orange-100"
          />
        </div>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={tipoFiltroFecha === "rango" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setTipoFiltroFecha("rango");
                    setMesSeleccionado("");
                  }}
                >
                  Rango de fechas
                </Button>
                <Button
                  type="button"
                  variant={tipoFiltroFecha === "mes" ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setTipoFiltroFecha("mes");
                    setFechaInicio("");
                    setFechaFin("");
                  }}
                >
                  Por mes
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                <div className="relative md:col-span-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar por nombre del trabajador..."
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {tipoFiltroFecha === "rango" && (
                  <div className="md:col-span-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          value={fechaInicio}
                          onChange={(e) => setFechaInicio(e.target.value)}
                          className="pl-10"
                          placeholder="Fecha inicio"
                        />
                      </div>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          value={fechaFin}
                          onChange={(e) => setFechaFin(e.target.value)}
                          className="pl-10"
                          placeholder="Fecha fin"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {tipoFiltroFecha === "mes" && (
                  <div className="md:col-span-5">
                    <Select
                      value={mesSeleccionado}
                      onValueChange={setMesSeleccionado}
                    >
                      <SelectTrigger>
                        <Calendar className="h-4 w-4 mr-2" />
                        <SelectValue placeholder="Seleccionar mes" />
                      </SelectTrigger>
                      <SelectContent>
                        {mesesOpciones.map((mes) => (
                          <SelectItem key={mes.value} value={mes.value}>
                            {mes.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="md:col-span-2">
                  <Select
                    value={filterTrabajo}
                    onValueChange={setFilterTrabajo}
                  >
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="trabajo">Trabajó</SelectItem>
                      <SelectItem value="no-trabajo">No trabajó</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-1">
                  <Button
                    variant="outline"
                    onClick={limpiarFiltros}
                    disabled={!tieneFiltrosActivos}
                    className="w-full"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Limpiar
                  </Button>
                </div>
              </div>

              {tieneFiltrosActivos && (
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  <span className="text-sm text-gray-500">
                    Filtros activos:
                  </span>
                  {searchName && (
                    <Badge variant="secondary" className="gap-1">
                      Nombre: {searchName}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setSearchName("")}
                      />
                    </Badge>
                  )}
                  {tipoFiltroFecha === "rango" && fechaInicio && (
                    <Badge variant="secondary" className="gap-1">
                      Desde: {fechaInicio}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setFechaInicio("")}
                      />
                    </Badge>
                  )}
                  {tipoFiltroFecha === "rango" && fechaFin && (
                    <Badge variant="secondary" className="gap-1">
                      Hasta: {fechaFin}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setFechaFin("")}
                      />
                    </Badge>
                  )}
                  {tipoFiltroFecha === "mes" && mesSeleccionado && (
                    <Badge variant="secondary" className="gap-1">
                      Mes:{" "}
                      {
                        mesesOpciones.find((m) => m.value === mesSeleccionado)
                          ?.label
                      }
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setMesSeleccionado("")}
                      />
                    </Badge>
                  )}
                  {filterTrabajo !== "todos" && (
                    <Badge variant="secondary" className="gap-1">
                      {filterTrabajo === "trabajo" ? "Trabajó" : "No trabajó"}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setFilterTrabajo("todos")}
                      />
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <TableJornadaTrabajadores
                jornadasFiltradas={jornadasFiltradas}
                handleEditJornada={handleEditJornada}
              />
            </div>

            {jornadasFiltradas.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No se encontraron jornadas</p>
                <p className="text-sm text-gray-400 mt-1">
                  Prueba con otros filtros o registra una nueva jornada
                </p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="border-t p-4">
                <Paginacion
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="justify-end"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <Modal
        title={selectedJornada ? "Editar Jornada" : "Agregar Jornada"}
        description="Aqui agregaras la jornada del trabajador diaria"
        open={openModalJornada}
        onOpenChange={(open) => {
          setOpenModalJornada(open);
          if (!open) setSelectedJornada(null);
        }}
        size="3xl"
        height="auto"
        showCloseButton={false}
      >
        <FormJornadaTrabajador
          onSuccess={() => {
            setOpenModalJornada(false);
            setSelectedJornada(null);
          }}
          jornada={selectedJornada}
          setSelectedJornada={setSelectedJornada}
        />
      </Modal>
    </div>
  );
};

export default JornadasTrabajadoresPage;
