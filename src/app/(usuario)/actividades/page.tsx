"use client";
import { useState, useEffect } from "react";
import useGetActividadesTrabajadores from "@/hooks/actividades/useGetActividadesTrabajadores";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { FiltrosActividades } from "@/interfaces/filtros/filters-actividades.interface";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import FiltrosActividadesComponent from "./ui/FiltrosActividades";
import useGetAllTrabajadores from "@/hooks/trabajadores/useGetAllTrabajadores";
import TarjetaActividad from "./ui/TarjetaActividad";
import Paginacion from "@/components/generics/Paginacion";
import SkeletonCard from "@/components/generics/SkeletonCard";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { TipoCliente } from "@/interfaces/enums/clientes.enums";
import ModalActividad from "./ui/ModalActividad";
import { Actividade } from "@/api/actividades/interfaces/response-actividades.interface";
import { estadosActividad } from "@/helpers/data/actividades/actividadesdData";
import { useRouter } from "next/navigation";

const ActividadesPage = () => {
  const { cliente } = useAuthStore();
  const router = useRouter();
  const isPropietario = cliente?.rol === TipoCliente.PROPIETARIO;
  const trabajadorId = cliente?.id ?? "";
  const propietarioId = cliente?.id ?? "";
  const [openModal, setOpenModal] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const [selectedActividad, setSelectedActividad] = useState<Actividade | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState(1);
  const [filtros, setFiltros] = useState<FiltrosActividades>({
    offset: 0,
    limit: isMobile ? 6 : 9,
  });
  const [estadoActivo, setEstadoActivo] = useState<string>("todos");
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const { data: actividadesData, isLoading } =
    useGetActividadesTrabajadores(filtros);
  const { data: trabajadores, isLoading: cargandoTrabajadores } =
    useGetAllTrabajadores();
  const { data: fincas, isLoading: cargandoFincas } =
    useFincasPropietarios(propietarioId);

  const trabajadoresFiltrados = isPropietario
    ? trabajadores
    : trabajadores?.filter((t) => t.id === trabajadorId);

  useEffect(() => {
    const newLimit = isMobile ? 6 : isTablet ? 8 : 9;
    setFiltros((prev) => ({
      ...prev,
      limit: newLimit,
      offset: 0,
    }));
  }, [isMobile, isTablet]);

  useEffect(() => {
    if (actividadesData) {
      const page = Math.floor(filtros.offset! / filtros.limit!) + 1;
      setCurrentPage(page);
    }
  }, [actividadesData, filtros.offset, filtros.limit]);

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * (filtros.limit || 10);
    setFiltros({
      ...filtros,
      offset: newOffset,
    });

    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFiltrosChange = (nuevosFiltros: Partial<FiltrosActividades>) => {
    setFiltros({
      ...filtros,
      ...nuevosFiltros,
      offset: 0,
    });
    setCurrentPage(1);
    if (isMobile) {
      setFiltrosAbiertos(false);
    }
  };

  const handleEstadoChange = (estado: string) => {
    setEstadoActivo(estado);
    const nuevosFiltros: Partial<FiltrosActividades> = { offset: 0 };

    if (estado !== "todos") {
      nuevosFiltros.estado = estado;
    } else {
      nuevosFiltros.estado = undefined;
    }

    setFiltros({
      ...filtros,
      ...nuevosFiltros,
    });
  };

  const limpiarFiltros = () => {
    setFiltros({
      offset: 0,
      limit: isMobile ? 6 : 9,
    });
    setEstadoActivo("todos");
    if (isMobile) {
      setFiltrosAbiertos(false);
    }
  };

  const handleEditActividad = (actividad: Actividade) => {
    setOpenModal(true);
    setSelectedActividad(actividad);
  };

  const handleAddActividad = () => {
    if (isMobile) {
      router.push("/actividades/crear-actividad");
    } else {
      setOpenModal(true);
    }
  };

  const totalPages = actividadesData
    ? Math.ceil(actividadesData.total / (filtros.limit || 10))
    : 0;

  const FiltrosContent = () => (
    <FiltrosActividadesComponent
      trabajadores={trabajadoresFiltrados ?? []}
      fincas={fincas?.data.fincas ?? []}
      filtrosActuales={filtros}
      onFiltrosChange={handleFiltrosChange}
      onLimpiarFiltros={limpiarFiltros}
      isLoadingTrabajadores={cargandoTrabajadores}
      isLoadingFincas={cargandoFincas}
      isMobile={isMobile}
      isPropietario={isPropietario}
      trabajadorId={trabajadorId}
      rol={cliente?.rol!}
    />
  );

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold ">
                Actividades Diarias
              </h1>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 mt-1 sm:mt-2">
                Gestiona y da seguimiento a las actividades de tus trabajadores
              </p>
            </div>
            {(cliente?.rol === TipoCliente.PROPIETARIO ||
              cliente?.rol === TipoCliente.SUPERVISOR) && (
              <Button
                onClick={() => handleAddActividad()}
                disabled={isLoading}
                size={isMobile ? "sm" : "default"}
                className="gap-2 w-full sm:w-auto"
              >
                <span>Agregar Actividad</span>
              </Button>
            )}
          </div>
        </div>

        <Card className="mb-6 shadow-lg border-0">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base sm:text-lg font-semibold flex items-center gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                Filtros de búsqueda
              </CardTitle>
              {isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiltrosAbiertos(!filtrosAbiertos)}
                >
                  {filtrosAbiertos ? "Ocultar" : "Mostrar"}
                </Button>
              )}
            </div>
          </CardHeader>
          {(!isMobile || filtrosAbiertos) && (
            <CardContent className="pt-0">
              <FiltrosContent />
            </CardContent>
          )}
        </Card>

        <div className="mb-6 overflow-x-auto pb-2">
          <Tabs
            value={estadoActivo}
            onValueChange={handleEstadoChange}
            className="w-full min-w-max"
          >
            <TabsList className="inline-flex h-auto p-1 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <TabsTrigger
                value="todos"
                className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
              >
                Todos
              </TabsTrigger>
              {estadosActividad.map((act) => (
                <TabsTrigger
                  key={act.value}
                  value={act.value}
                  className="text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                >
                  {act.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {isLoading ? (
          <div>
            <SkeletonCard />
          </div>
        ) : actividadesData?.actividades?.length === 0 ? (
          <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
            <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
            <AlertDescription className="text-sm sm:text-base text-blue-700 dark:text-blue-300">
              No hay actividades registradas. Aplica otros filtros o crea una
              nueva actividad.
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-6">
              {actividadesData?.actividades.map((actividad) => (
                <TarjetaActividad
                  key={actividad.id}
                  actividad={actividad}
                  isPropietario={isPropietario}
                  trabajadorId={trabajadorId}
                  handleEditActividad={handleEditActividad}
                  cliente={cliente}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <Paginacion
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            <div className="mt-4 text-center text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Mostrando {actividadesData?.actividades?.length || 0} de{" "}
              {actividadesData?.total || 0} actividades
            </div>
          </>
        )}
      </div>
      <ModalActividad
        cliente={cliente}
        openModal={openModal}
        setOpenModal={setOpenModal}
        onSuccess={() => {
          setOpenModal(false);
          setSelectedActividad(null);
        }}
        actividad={selectedActividad}
      />
    </div>
  );
};

export default ActividadesPage;
