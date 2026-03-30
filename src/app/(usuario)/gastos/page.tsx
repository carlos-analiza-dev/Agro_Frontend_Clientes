"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import useGetObtenerGastos from "@/hooks/finanzas/gastos/useGetObtenerGastos";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Paginacion from "@/components/generics/Paginacion";
import { FiltrosGastos as FiltrosGastosType } from "@/interfaces/filtros/filtros-gastos";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { FiltrosGastos } from "./ui/FiltrosGastos";
import { CardGastosMobile } from "./ui/CardGastosMobile";
import { TablaGastos } from "./ui/TablaGastos";
import { useRouter } from "next/navigation";
import Modal from "@/components/generics/Modal";
import FormGastos from "./ui/FormGastos";
import { Gastos } from "@/api/finanzas/gastos/interface/gastos-response.interface";

const GastosPage = () => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedGasto, setSelectedGasto] = useState<Gastos | undefined>(
    undefined,
  );
  const [filtros, setFiltros] = useState<FiltrosGastosType>({
    offset: 0,
    limit: 10,
    categoria: "",
    metodo_pago: "",
  });

  const { data: gastosData, isLoading } = useGetObtenerGastos(filtros);
  const { data: fincas } = useFincasPropietarios(clienteId);
  const { data: especies } = useGetEspecies();

  const fincaSelected = fincas?.data.fincas.find(
    (finca) => finca.id === filtros.fincaId,
  );

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.fincaId) count++;
    if (filtros.especieId) count++;
    if (filtros.categoria) count++;
    if (filtros.metodo_pago) count++;
    if (filtros.fechaInicio || filtros.fechaFin) count++;
    return count;
  };

  const handlePageChange = (page: number) => {
    setFiltros((prev) => ({
      ...prev,
      offset: (page - 1) * (prev.limit || 10),
    }));
  };

  const currentPage =
    Math.floor((filtros.offset || 0) / (filtros.limit || 10)) + 1;
  const totalPages = gastosData?.totalPages || 1;

  const handleNewGasto = () => {
    if (isMobile) {
      router.push("/gastos/nuevo-gasto");
    } else {
      setSelectedGasto(undefined);
      setOpenModal(true);
    }
  };

  const handleEditGasto = (gasto: Gastos) => {
    setSelectedGasto(gasto);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedGasto(undefined);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Control de Gastos {fincaSelected ? fincaSelected?.nombre_finca : ""}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Registra y monitorea todos los gastos de tus fincas
          </p>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          {isMobile ? (
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtros
                  {contarFiltrosActivos() > 0 && (
                    <span className="ml-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                      {contarFiltrosActivos()}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[85vh] rounded-t-xl">
                <SheetHeader>
                  <SheetTitle>Filtros de búsqueda</SheetTitle>
                </SheetHeader>
                <div className="mt-4 overflow-y-auto h-full pb-20">
                  <FiltrosGastos
                    filtros={filtros}
                    setFiltros={setFiltros}
                    fincas={fincas?.data?.fincas || []}
                    especies={especies?.data || []}
                    onClose={() => setIsFilterOpen(false)}
                  />
                </div>
              </SheetContent>
            </Sheet>
          ) : (
            <Button
              variant="outline"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex-1 sm:flex-none"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros
              {contarFiltrosActivos() > 0 && (
                <span className="ml-1 bg-green-600 text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                  {contarFiltrosActivos()}
                </span>
              )}
            </Button>
          )}
          <Button onClick={handleNewGasto} className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Gasto
          </Button>
        </div>
      </div>

      {isFilterOpen && !isMobile && (
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <FiltrosGastos
            filtros={filtros}
            setFiltros={setFiltros}
            fincas={fincas?.data?.fincas || []}
            especies={especies?.data || []}
          />
        </div>
      )}

      {isMobile ? (
        <CardGastosMobile
          gastos={gastosData?.data || []}
          isLoading={isLoading}
          moneda={moneda}
        />
      ) : (
        <TablaGastos
          gastos={gastosData?.data || []}
          isLoading={isLoading}
          moneda={moneda}
          handleEditGasto={handleEditGasto}
        />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      {gastosData?.data && gastosData.data.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="text-sm text-gray-600">Total de gastos:</span>
            <span className="ml-2 text-xl font-bold text-red-600">
              {moneda}{" "}
              {gastosData.data
                .reduce((sum, g) => sum + g.monto, 0)
                .toLocaleString("es-HN", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Mostrando:</span>
            <span className="ml-2 text-sm">
              {gastosData.data.length} de {gastosData.total} registros
            </span>
          </div>
        </div>
      )}

      <Modal
        title={selectedGasto ? "Editar Gasto" : "Ingresar Nuevo Gasto"}
        description={
          selectedGasto
            ? "Aquí podrás editar los gastos que tienes por cada finca"
            : "Aquí podrás ingresar los gastos que tienes por cada finca"
        }
        open={openModal}
        onOpenChange={handleCloseModal}
        size="xl"
        height="xl"
      >
        <FormGastos
          setOpenModal={handleCloseModal}
          onSuccess={() => {
            setSelectedGasto(undefined);
          }}
          gasto={selectedGasto}
        />
      </Modal>
    </div>
  );
};

export default GastosPage;
