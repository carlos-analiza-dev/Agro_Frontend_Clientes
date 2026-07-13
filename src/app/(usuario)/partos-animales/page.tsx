"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Filter, X, Baby, Plus } from "lucide-react";
import { startOfDay, endOfDay } from "date-fns";
import useGetPartosAnimales from "@/hooks/reproduccion/useGetPartosAnimales";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import InfoPartoAnimal from "./ui/InfoPartoAnimal";
import DetailsParto from "./ui/DetailsParto";
import CardMobile from "./ui/CardMobile";
import Paginacion from "@/components/generics/Paginacion";
import Modal from "@/components/generics/Modal";
import FormPartoAnimal from "./ui/FormPartoAnimal";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Parto } from "@/api/reproduccion/interfaces/response-partos.interface";
import FiltersParto from "./ui/FiltersParto";
import { SexoAnimal } from "@/interfaces/enums/animales/sexo-animal.enum";
import ButtonAdd from "@/components/generics/ButtonAdd";

const PartosAnimalesPage = () => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const router = useRouter();
  const [openModal, setOpenModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedParto, setSelectedParto] = useState<Parto | undefined>(
    undefined,
  );
  const handleEdit = (parto: Parto) => {
    setSelectedParto(parto);
    setOpenModal(true);
  };
  const [filtros, setFiltros] = useState({
    finca_id: "",
    hembra_id: "",
    estado: "",
    tipo_parto: "",
    fecha_desde: undefined as Date | undefined,
    fecha_hasta: undefined as Date | undefined,
    limit: 10,
    page: 1,
  });

  const { data: partos, isLoading, refetch } = useGetPartosAnimales();
  const { data: fincas } = useFincasPropietarios(clienteId);
  const { data: animales } = useGetAnimalesPropietario();

  const finca = fincas?.data.fincas.find(
    (item: Finca) => item.id === filtros.finca_id,
  );

  const hembras = animales?.filter((a) => a.sexo === SexoAnimal.Hembra);

  const compararFechas = (
    fechaParto: string,
    fechaDesde?: Date,
    fechaHasta?: Date,
  ) => {
    const fechaPartoObj = new Date(fechaParto);
    const inicioParto = startOfDay(fechaPartoObj);

    if (fechaDesde) {
      const inicioDesde = startOfDay(fechaDesde);
      if (inicioParto < inicioDesde) return false;
    }

    if (fechaHasta) {
      const finHasta = endOfDay(fechaHasta);
      if (inicioParto > finHasta) return false;
    }

    return true;
  };

  useEffect(() => {
    if (
      fincas?.data?.fincas &&
      fincas.data.fincas.length > 0 &&
      !filtros.finca_id
    ) {
      setFiltros((prev) => ({
        ...prev,
        finca_id: fincas.data.fincas[0].id,
        page: 1,
      }));
    }
  }, [fincas]);

  const partosFiltrados = partos?.data?.filter((p) => {
    if (filtros.finca_id && p.hembra.finca.id !== filtros.finca_id)
      return false;
    if (filtros.hembra_id && p.hembra.id !== filtros.hembra_id) return false;
    if (filtros.estado && p.estado !== filtros.estado) return false;
    if (filtros.tipo_parto && p.tipo_parto !== filtros.tipo_parto) return false;

    if (
      !compararFechas(p.fecha_parto, filtros.fecha_desde, filtros.fecha_hasta)
    ) {
      return false;
    }

    return true;
  });

  const totalPartos = partosFiltrados?.length || 0;
  const totalPages = Math.ceil(totalPartos / filtros.limit);
  const startIndex = (filtros.page - 1) * filtros.limit;
  const endIndex = startIndex + filtros.limit;
  const partosPaginaActual = partosFiltrados?.slice(startIndex, endIndex);

  const clearFilters = () => {
    setFiltros({
      estado: "",
      finca_id: fincas?.data?.fincas?.[0]?.id || "",
      hembra_id: "",
      tipo_parto: "",
      fecha_desde: undefined,
      fecha_hasta: undefined,
      limit: 10,
      page: 1,
    });
    if (isMobile) setShowFilters(false);
  };

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.hembra_id) count++;
    if (filtros.estado) count++;
    if (filtros.tipo_parto) count++;
    if (filtros.fecha_desde || filtros.fecha_hasta) count++;
    return count;
  };

  const handleRefresh = async () => {
    await refetch();
    window.location.reload();
  };

  const handlePageChange = (page: number) => {
    setFiltros((prev) => ({ ...prev, page }));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCloseModal = () => {
    setOpenModal(false);

    setTimeout(() => {
      setSelectedParto(undefined);
    }, 300);
  };

  const handleClickNewRegister = () => {
    setSelectedParto(undefined);
    if (isMobile) {
      router.push("/partos-animales/crear-parto");
    } else {
      setOpenModal(true);
    }
  };

  return (
    <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
        <div className="w-full sm:w-auto">
          <h1 className="text-lg sm:text-xl md:text-3xl font-bold tracking-tight break-words">
            Control de Partos - {finca?.nombre_finca}
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-muted-foreground mt-1">
            Monitorea los partos registrados en tus animales.
            {totalPartos > 0 && ` Total: ${totalPartos} partos`}
          </p>
        </div>
        <ButtonAdd
          Icon={Plus}
          title="Nuevo Parto"
          action={handleClickNewRegister}
          className="bg-green-600 hover:bg-green-700"
        />
      </div>
      {!isMobile ? (
        <FiltersParto
          filtros={filtros}
          setFiltros={setFiltros}
          fincas={fincas}
          hembras={hembras}
          clearFilters={clearFilters}
        />
      ) : (
        <>
          <Button
            variant="outline"
            onClick={() => setShowFilters(true)}
            className="w-full justify-between"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </div>
            {contarFiltrosActivos() > 0 && (
              <Badge variant="secondary">
                {contarFiltrosActivos()} activos
              </Badge>
            )}
          </Button>

          <Sheet open={showFilters} onOpenChange={setShowFilters}>
            <SheetContent side="bottom" className="h-[90vh] rounded-t-xl">
              <SheetHeader className="mb-4">
                <SheetTitle className="text-left">Filtros</SheetTitle>
              </SheetHeader>
              <div className="overflow-y-auto h-full pb-20">
                <FiltersParto
                  filtros={filtros}
                  setFiltros={setFiltros}
                  fincas={fincas}
                  hembras={hembras}
                  clearFilters={clearFilters}
                  isMobile={true}
                  onApplyMobile={() => setShowFilters(false)}
                />
              </div>
            </SheetContent>
          </Sheet>
        </>
      )}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3">
          <CardTitle>Historial de Partos</CardTitle>
          {totalPartos > 0 && (
            <span className="text-xs sm:text-sm text-muted-foreground">
              Mostrando {startIndex + 1} - {Math.min(endIndex, totalPartos)} de{" "}
              {totalPartos} partos
            </span>
          )}
        </CardHeader>
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="overflow-x-auto -mx-3 sm:mx-0">
            {isMobile ? (
              <CardMobile
                partosFiltrados={partosPaginaActual}
                isLoading={isLoading}
                handleRefresh={handleRefresh}
                isMobile={isMobile}
              />
            ) : (
              <InfoPartoAnimal
                partosFiltrados={partosPaginaActual}
                isLoading={isLoading}
                handleRefresh={handleRefresh}
                handleEdit={handleEdit}
              />
            )}
          </div>

          {totalPages > 1 && (
            <div className="mt-6">
              <Paginacion
                currentPage={filtros.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                className="justify-center"
              />
            </div>
          )}

          {partosFiltrados && partosFiltrados.length > 0 && (
            <div className="mt-6">
              <DetailsParto partosFiltrados={partosFiltrados} />
            </div>
          )}
        </CardContent>
      </Card>
      <Modal
        open={openModal}
        onOpenChange={(open) => {
          if (!open) {
            handleCloseModal();
          } else {
            setOpenModal(open);
          }
        }}
        title={selectedParto ? "Editar Parto" : "Agregar Nuevo Parto"}
        description={
          selectedParto
            ? "Aquí podrás editar la información del parto"
            : "Aquí podrás ingresar el parto de tu animal"
        }
        size="2xl"
        height="xl"
      >
        <FormPartoAnimal
          hembras={hembras}
          setOpenModal={handleCloseModal}
          parto={selectedParto}
          onSuccess={() => {
            handleRefresh();
          }}
        />
      </Modal>
    </div>
  );
};

export default PartosAnimalesPage;
