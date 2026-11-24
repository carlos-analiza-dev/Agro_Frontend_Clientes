"use client";

import { useState, useEffect } from "react";
import { Filter, Plus, AlertCircle, Dna } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
import { useRouter } from "next/navigation";
import CardTabEstado from "./ui/CardTabEstado";
import CardTabResultado from "./ui/CardTabResultado";
import { Servicio } from "@/api/reproduccion/interfaces/response-servicio-repoductivo.interface";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateServiciosReproductivo } from "@/api/reproduccion/interfaces/crear-servicio-reproductivo.interface";
import { EditarServicioReproductivoEstados } from "@/api/reproduccion/accions/servicios/editar-servicio-reproductivo";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { EstadoServicio } from "@/interfaces/enums/servicios-reproductivos.enum";
import { SexoAnimal } from "@/interfaces/enums/animales/sexo-animal.enum";
import ButtonAdd from "@/components/generics/ButtonAdd";
import TitlePage from "@/components/generics/TitlePage";

const ServiciosReproductivosPage = () => {
  const t = useTranslations("serviciosReproductivosPage");

  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const router = useRouter();

  const [openModal, setOpenModal] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");
  const isDesktop = useMediaQuery("(min-width: 1025px)");

  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(
    null,
  );
  const [openModalStatus, setOpenModalStatus] = useState(false);
  const queryClient = useQueryClient();

  const [selectedEstado, setSelectedEstado] = useState<string>("");

  const mutation = useMutation({
    mutationFn: (data: Partial<CreateServiciosReproductivo>) =>
      EditarServicioReproductivoEstados(selectedServicio?.id || "", data),
    onSuccess: () => {
      toast.success(t("messages.statusUpdated"));
      queryClient.invalidateQueries({ queryKey: ["servicios-reproductivos"] });
      setOpenModalStatus(false);
      setSelectedServicio(null);
      setSelectedEstado("");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("errors.updateStatus");

        toast.error(errorMessage);
      } else {
        toast.error(t("errors.unexpected"));
      }
    },
  });

  const handleOpenModal = (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setSelectedEstado(servicio.estado);
    setOpenModalStatus(true);
  };

  const handleEstadoChange = (estadoValue: string, checked: boolean) => {
    if (checked) {
      setSelectedEstado(estadoValue);
    }
  };

  const handleActualizarEstado = () => {
    if (!selectedServicio || !selectedEstado) return;

    if (selectedServicio.exitoso) {
      toast.warn(t("messages.alreadySuccessful"));
      return;
    }

    mutation.mutate({
      estado: selectedEstado as any,
    });
  };

  const handleExitosoChange = (checked: boolean) => {
    if (!selectedServicio) return;

    if (checked && selectedServicio.estado === EstadoServicio.FALLIDO) {
      toast.warning(t("messages.cannotMarkFailed"));
      return;
    }

    if (checked && selectedServicio.estado === EstadoServicio.CANCELADO) {
      toast.warning(t("messages.cannotMarkCancelled"));
      return;
    }

    if (
      checked &&
      selectedServicio.estado !== EstadoServicio.REALIZADO &&
      selectedServicio.estado === EstadoServicio.PROGRAMADO
    ) {
      toast.info(t("messages.mustBeCompletedFirst"));
      return;
    }

    mutation.mutate({
      exitoso: checked,
    });
  };

  const handleClickAdd = () => {
    if (isMobile) {
      router.push("/servicios-reproductivos/crear-servicio-reproductivo");
    } else {
      setOpenModal(true);
    }
  };

  const { data: fincasData, isLoading: fincasLoading } =
    useFincasPropietarios(clienteId);
  const { data: animalesData, isLoading: animalesLoading } =
    useGetAnimalesPropietario();

  const fincas = fincasData?.data?.fincas || [];
  const hembras =
    animalesData?.filter((animal) => animal.sexo === SexoAnimal.Hembra) || [];
  const machos =
    animalesData?.filter((animal) => animal.sexo === SexoAnimal.Macho) || [];

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
      return (
        <VistaTarjetas
          servicios={servicios}
          handleOpenModal={handleOpenModal}
        />
      );
    }

    if (isTablet) {
      if (vista === "tabla") {
        return (
          <VistaTabla
            servicios={servicios}
            hembras={hembras}
            machos={machos}
            setSelectedServicio={setSelectedServicio}
            selectedServicio={selectedServicio}
            handleOpenModal={handleOpenModal}
            moneda={moneda}
          />
        );
      }
      return (
        <VistaTarjetas
          servicios={servicios}
          handleOpenModal={handleOpenModal}
        />
      );
    }

    if (isDesktop) {
      if (vista === "tabla") {
        return (
          <VistaTabla
            servicios={servicios}
            hembras={hembras}
            machos={machos}
            setSelectedServicio={setSelectedServicio}
            selectedServicio={selectedServicio}
            handleOpenModal={handleOpenModal}
            moneda={moneda}
          />
        );
      }
      return (
        <VistaTarjetas
          servicios={servicios}
          handleOpenModal={handleOpenModal}
        />
      );
    }

    return (
      <VistaTarjetas servicios={servicios} handleOpenModal={handleOpenModal} />
    );
  };

  return (
    <TooltipProvider>
      <div
        id="servicios-reproductivos-header"
        className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <TitlePage
            title={
              fincaSeleccionada
                ? t("titleWithFarm", {
                    farm: fincaSeleccionada.nombre_finca.toLowerCase(),
                  })
                : t("title")
            }
            description={t("description")}
            Icon={Dna}
          />

          <div className="flex w-full sm:w-auto gap-2">
            {isMobile && (
              <Button
                id="servicios-reproductivos-filtros-btn"
                variant="outline"
                onClick={() => setFiltrosVisibles(true)}
                className="flex-1 sm:flex-none"
              >
                <Filter className="h-4 w-4 mr-2" />
                {t("buttons.filters")}
              </Button>
            )}

            {(isTablet || isDesktop) && (
              <div id="servicios-reproductivos-vista">
                <Tabs
                  value={vista}
                  onValueChange={(v) => setVista(v as "tabla")}
                  className="mr-2"
                >
                  <TabsList>
                    <TabsTrigger value="tabla">{t("views.table")}</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            )}

            <ButtonAdd
              id="servicios-reproductivos-nuevo"
              Icon={Plus}
              title={t("buttons.newService")}
              action={() => handleClickAdd()}
              className="bg-green-600 hover:bg-green-700"
            />
          </div>
        </div>

        <div id="servicios-reproductivos-filtros">
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
        </div>

        <Card id="servicios-reproductivos-lista">
          <CardContent className="p-0">
            {error ? (
              <div className="text-center py-12">
                <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  {t("errors.loadTitle")}
                </h3>
                <p className="text-muted-foreground mb-4">
                  {t("errors.loadDescription")}
                </p>
                <Button onClick={() => refetch()}>{t("buttons.retry")}</Button>
              </div>
            ) : servicios.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">
                  {t("emptyState.noServices")}
                </p>
                {filtros.finca_id && (
                  <p className="text-sm text-muted-foreground mt-2">
                    {t("emptyState.inFarm", {
                      farm: fincaSeleccionada?.nombre_finca ?? "",
                    })}
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
          <div
            id="servicios-reproductivos-resumen"
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            <SummaryCard
              title={t("summary.totalServices")}
              numero={data?.total?.toString() ?? "0"}
            />

            <SummaryCard
              title={t("summary.successful")}
              numero={servicios.filter((s) => s.exitoso).length.toString()}
            />

            <SummaryCard
              title={t("summary.successRate")}
              numero={`${Math.round(
                (servicios.filter((s) => s.exitoso).length / servicios.length) *
                  100,
              )}%`}
            />

            <SummaryCard
              title={t("summary.scheduled")}
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
        title={t("modals.addService.title")}
        description={t("modals.addService.description")}
        size="xl"
        height="lg"
      >
        <FormServicioReproductivo
          setOpenModal={setOpenModal}
          onSuccess={() => setOpenModal(true)}
          hembras={hembras}
          machos={machos}
          moneda={moneda}
        />
      </Modal>

      <Modal
        title={t("modals.serviceActions.title")}
        description={t("modals.serviceActions.description")}
        open={openModalStatus}
        onOpenChange={setOpenModalStatus}
        size="2xl"
      >
        <Tabs defaultValue="estado">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="estado">{t("tabs.serviceStatus")}</TabsTrigger>
            <TabsTrigger value="resultado">{t("tabs.result")}</TabsTrigger>
          </TabsList>

          <TabsContent value="estado">
            <CardTabEstado
              selectedEstado={selectedEstado}
              handleEstadoChange={handleEstadoChange}
              setOpenModal={setOpenModalStatus}
              handleActualizarEstado={handleActualizarEstado}
              isPending={mutation.isPending}
            />
          </TabsContent>

          <TabsContent value="resultado">
            <CardTabResultado
              setOpenModal={setOpenModalStatus}
              selectedServicio={selectedServicio}
              isPending={mutation.isPending}
              handleExitosoChange={handleExitosoChange}
            />
          </TabsContent>
        </Tabs>
      </Modal>
    </TooltipProvider>
  );
};

export default ServiciosReproductivosPage;
