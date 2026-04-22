"use client";
import useGetPlanillas from "@/hooks/planillas/useGetPlanillas";
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Calendar,
  DollarSign,
  FileText,
  CheckCircle2,
  X,
  Plus,
  Filter,
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
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import SkeletonJornadas from "@/components/generics/SkeletonJornadas";
import { StatCard } from "@/components/generics/StatCard";
import { EstadoPlanilla } from "@/interfaces/enums/planillas.enums";
import { useAuthStore } from "@/providers/store/useAuthStore";
import TablePlanillas from "./ui/TablePlanillas";
import { estadosPlanilla } from "@/helpers/data/estadosPlanilla";
import { generarOpcionesMeses } from "@/helpers/funciones/generarOpcionesMeses";
import { Planilla } from "@/api/planillas-trabajadores/interfaces/response-planillas.interface";
import Modal from "@/components/generics/Modal";
import FormPlanilla from "./ui/FormPlanilla";
import { useRouter } from "next/navigation";

const PlanillaTrabajadoresPage = () => {
  const { cliente } = useAuthStore();
  const router = useRouter();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPlanilla, setSelectedPlanilla] = useState<Planilla | null>(
    null,
  );
  const [openAddModal, setOpenAddModal] = useState(false);
  const [estadoSeleccionado, setEstadoSeleccionado] = useState<string>("todos");
  const [fechaInicio, setFechaInicio] = useState<string>("");
  const [fechaFin, setFechaFin] = useState<string>("");
  const [mesSeleccionado, setMesSeleccionado] = useState<string>("");
  const [tipoFiltroFecha, setTipoFiltroFecha] = useState<"rango" | "mes">(
    "rango",
  );
  const limit = 10;
  const isMobile = useMediaQuery("(max-width: 768px)");

  const mesesOpciones = generarOpcionesMeses();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (tipoFiltroFecha === "rango") {
        setMesSeleccionado("");
      }
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [fechaInicio, fechaFin, tipoFiltroFecha]);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (tipoFiltroFecha === "mes" && mesSeleccionado) {
        setFechaInicio("");
        setFechaFin("");
      }
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [mesSeleccionado, tipoFiltroFecha]);

  const { data: planillasData, isLoading } = useGetPlanillas({
    offset: (currentPage - 1) * limit,
    limit,
    estado: estadoSeleccionado !== "todos" ? estadoSeleccionado : undefined,
    fechaInicio:
      tipoFiltroFecha === "rango" ? fechaInicio || undefined : undefined,
    fechaFin: tipoFiltroFecha === "rango" ? fechaFin || undefined : undefined,
    mes:
      tipoFiltroFecha === "mes" && mesSeleccionado
        ? mesSeleccionado
        : undefined,
  });

  const planillas = planillasData?.planillas || [];
  const planillasPagadas = planillas.filter(
    (p) => p.estado === EstadoPlanilla.PAGADA,
  );

  const totalNetoPagadas = planillasPagadas.reduce(
    (sum, p) => sum + Number(p.totalNeto),
    0,
  );
  const total = planillasData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const limpiarFiltros = () => {
    setFechaInicio("");
    setFechaFin("");
    setMesSeleccionado("");
    setEstadoSeleccionado("todos");
    setTipoFiltroFecha("rango");
    setCurrentPage(1);
  };

  const tieneFiltrosActivos =
    fechaInicio !== "" ||
    fechaFin !== "" ||
    mesSeleccionado !== "" ||
    estadoSeleccionado !== "todos";

  const handleEditPlanilla = (planilla: Planilla) => {
    if (isMobile) {
      router.push(`/planillas/${planilla.id}`);
    } else {
      setOpenAddModal(true);
      setSelectedPlanilla(planilla);
    }
  };

  const handleSucces = () => {
    setOpenAddModal(false);
    setSelectedPlanilla(null);
  };

  if (isLoading) {
    return <SkeletonJornadas isMobile={isMobile} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Planillas de Trabajadores
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Gestión de nóminas y pagos de trabajadores
            </p>
          </div>
          <Button onClick={() => setOpenAddModal(true)} className="shadow-lg">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Planilla
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <StatCard
            title="Total Planillas"
            value={total}
            icon={FileText}
            gradientFrom="from-blue-50"
            gradientTo="to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
            textColor="text-blue-900 dark:text-blue-100"
          />

          <StatCard
            title="Planillas Pagadas"
            value={
              planillas.filter((p: any) => p.estado === EstadoPlanilla.PAGADA)
                .length
            }
            icon={CheckCircle2}
            gradientFrom="from-green-50"
            gradientTo="to-green-100 dark:from-green-950/30 dark:to-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
            textColor="text-green-600 dark:text-green-400"
          />

          <StatCard
            title="Total Neto"
            value={formatCurrency(totalNetoPagadas, moneda)}
            icon={DollarSign}
            gradientFrom="from-purple-50"
            gradientTo="to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
            textColor="text-purple-600 dark:text-purple-400"
          />

          <StatCard
            title="   En Proceso"
            value={
              planillas.filter(
                (p: any) =>
                  p.estado === EstadoPlanilla.BORRADOR ||
                  p.estado === EstadoPlanilla.CONFIRMADA,
              ).length
            }
            icon={Calendar}
            gradientFrom="from-orange-50"
            gradientTo="to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30"
            iconColor="text-orange-600 dark:text-orange-400"
            textColor="text-orange-600 dark:text-orange-400"
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
                    value={estadoSeleccionado}
                    onValueChange={setEstadoSeleccionado}
                  >
                    <SelectTrigger>
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Estado" />
                    </SelectTrigger>
                    <SelectContent>
                      {estadosPlanilla.map((estado) => (
                        <SelectItem key={estado.value} value={estado.value}>
                          {estado.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
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
                  {estadoSeleccionado !== "todos" && (
                    <Badge variant="secondary" className="gap-1">
                      Estado:{" "}
                      {
                        estadosPlanilla.find(
                          (e) => e.value === estadoSeleccionado,
                        )?.label
                      }
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => setEstadoSeleccionado("todos")}
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
              <TablePlanillas
                planillas={planillas}
                handleEditPlanilla={handleEditPlanilla}
                moneda={moneda}
              />
            </div>

            {planillas.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No se encontraron planillas</p>
                <p className="text-sm text-gray-400 mt-1">
                  Prueba con otros filtros o crea una nueva planilla
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
        open={openAddModal}
        onOpenChange={setOpenAddModal}
        title={selectedPlanilla ? "Editar Planilla" : "Agregar Planilla"}
        description={
          selectedPlanilla
            ? "Aqui podras editar las planillas"
            : "Aqui podras agregar una nueva planilla"
        }
        size="3xl"
        showCloseButton={false}
        height="auto"
      >
        <FormPlanilla
          onSuccess={() => handleSucces()}
          planilla={selectedPlanilla}
        />
      </Modal>
    </div>
  );
};

export default PlanillaTrabajadoresPage;
