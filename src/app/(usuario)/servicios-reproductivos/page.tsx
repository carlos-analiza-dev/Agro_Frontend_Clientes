"use client";
import { useState, useEffect } from "react";
import { Filter, Plus, AlertCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import useGetServicioReproductivo from "@/hooks/reproduccion/useGetServicioReproductivo";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { FiltrosServicios } from "@/interfaces/filtros/servicios-resproductivos.filtros.interface";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import Paginacion from "@/components/generics/Paginacion";
import MobileFilters from "./ui/MobileFilters";
import CardFilters from "./ui/CardFilters";
import VistaTarjetas from "./ui/VistaTarjetas";
import SummaryCard from "./ui/SummaryCard";
import VistaTabla from "./ui/VistaTabla";
import SkeletonTable from "@/components/generics/SkeletonTable";
import Modal from "@/components/generics/Modal";
import FormServicioReproductivo from "./ui/FormServicioReproductivo";

const ServiciosReproductivosPage = () => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const [openModal, setOpenModal] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  const { data: fincasData, isLoading: fincasLoading } =
    useFincasPropietarios(clienteId);
  const { data: animalesData, isLoading: animalesLoading } =
    useGetAnimalesPropietario(clienteId);

  const fincas = fincasData?.data?.fincas || [];
  const hembras =
    animalesData?.data?.filter((animal) => animal.sexo === "Hembra") || [];
  const machos =
    animalesData?.data?.filter((animal) => animal.sexo === "Macho") || [];

  const [filtros, setFiltros] = useState<FiltrosServicios>({
    page: 1,
    limit: 10,
  });

  useEffect(() => {
    if (fincas.length > 0 && !filtros.finca_id) {
      setFiltros((prev) => ({
        ...prev,
        finca_id: fincas[0].id,
      }));
    }
  }, [fincas]);

  const [filtrosVisibles, setFiltrosVisibles] = useState(false);
  const [vista, setVista] = useState<"tabla" | "tarjetas">(
    isMobile ? "tarjetas" : "tabla",
  );

  const { data, isLoading, error, refetch, isFetching } =
    useGetServicioReproductivo(filtros);

  const servicios = data?.data || [];
  const totalPages = data?.totalPages || 0;
  const currentPage = data?.page || 1;

  const handleFilterChange = (key: keyof FiltrosServicios, value: any) => {
    setFiltros((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const limpiarFiltros = () => {
    setFiltros({
      page: 1,
      limit: 10,
      finca_id: fincas[0]?.id,
    });
    setFiltrosVisibles(false);
  };

  const cambiarPagina = (nuevaPagina: number) => {
    setFiltros((prev) => ({ ...prev, page: nuevaPagina }));
    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return <SkeletonTable />;
  }

  const fincaSeleccionada = fincas.find((f) => f.id === filtros.finca_id);

  const renderVista = () => {
    if (servicios.length === 0) return null;

    if (isMobile) {
      return <VistaTarjetas servicios={servicios} />;
    }

    if (isTablet) {
      if (vista === "tabla") {
        return (
          <VistaTabla servicios={servicios} hembras={hembras} machos={machos} />
        );
      }
      return <VistaTarjetas servicios={servicios} />;
    }

    if (isDesktop) {
      if (vista === "tabla") {
        return (
          <VistaTabla servicios={servicios} hembras={hembras} machos={machos} />
        );
      }
      return <VistaTarjetas servicios={servicios} />;
    }

    return <VistaTarjetas servicios={servicios} />;
  };

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Servicios Reproductivos
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              {fincaSeleccionada ? (
                <>
                  Gestiona los servicios en{" "}
                  <span className="font-medium">
                    {fincaSeleccionada.nombre_finca}
                  </span>
                </>
              ) : (
                "Gestiona los servicios de monta e inseminación"
              )}
            </p>
          </div>

          <div className="flex w-full sm:w-auto gap-2">
            {isMobile && (
              <Button
                variant="outline"
                onClick={() => setFiltrosVisibles(true)}
                className="flex-1 sm:flex-none"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            )}

            {(isTablet || isDesktop) && (
              <Tabs
                value={vista}
                onValueChange={(v) => setVista(v as "tabla")}
                className="mr-2"
              >
                <TabsList>
                  <TabsTrigger value="tabla">Tabla</TabsTrigger>
                </TabsList>
              </Tabs>
            )}

            <Button
              onClick={() => setOpenModal(true)}
              className="flex-1 sm:flex-none"
            >
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Servicio
            </Button>
          </div>
        </div>

        {!isMobile && (
          <CardFilters
            fincaSeleccionada={fincaSeleccionada}
            filtros={filtros}
            fincas={fincas}
            hembras={hembras}
            handleFilterChange={handleFilterChange}
            fincasLoading={fincasLoading}
            animalesLoading={animalesLoading}
            limpiarFiltros={limpiarFiltros}
            refetch={refetch}
            isFetching={isFetching}
          />
        )}

        {isMobile && (
          <MobileFilters
            filtrosVisibles={filtrosVisibles}
            setFiltrosVisibles={setFiltrosVisibles}
            filtros={filtros}
            fincas={fincas}
            hembras={hembras}
            handleFilterChange={handleFilterChange}
            fincasLoading={fincasLoading}
            animalesLoading={animalesLoading}
            limpiarFiltros={limpiarFiltros}
            refetch={refetch}
          />
        )}

        <Card>
          <CardContent className="p-0">
            {error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Error al cargar</h3>
                <p className="text-muted-foreground mb-4">
                  No se pudieron cargar los servicios
                </p>
                <Button onClick={() => refetch()}>Reintentar</Button>
              </div>
            ) : servicios.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  No hay servicios registrados
                </p>
                {filtros.finca_id && (
                  <p className="text-sm text-muted-foreground mt-2">
                    en {fincaSeleccionada?.nombre_finca}
                  </p>
                )}
              </div>
            ) : (
              <>
                {renderVista()}

                {totalPages > 0 && (
                  <div className="p-4 border-t">
                    <Paginacion
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={cambiarPagina}
                    />
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {servicios.length > 0 && !isMobile && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Servicios"
              numero={data?.total?.toString() ?? "0"}
            />

            <SummaryCard
              title="Exitosos"
              numero={servicios.filter((s) => s.exitoso).length.toString()}
            />

            <SummaryCard
              title="Tasa Éxito"
              numero={`${Math.round(
                (servicios.filter((s) => s.exitoso).length / servicios.length) *
                  100,
              )}%`}
            />

            <SummaryCard
              title="Programados"
              numero={servicios
                .filter((s) => s.estado === "PROGRAMADO")
                .length.toString()}
            />
          </div>
        )}
      </div>
      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title="Agregar Nuevo Servicio Reproductivo"
        description="Aqui podras agregar servicios reproductivos para tus animales"
        size="xl"
      >
        <FormServicioReproductivo
          setOpenModal={setOpenModal}
          onSuccess={() => setOpenModal(true)}
          hembras={hembras}
          machos={machos}
        />
      </Modal>
    </TooltipProvider>
  );
};

export default ServiciosReproductivosPage;
