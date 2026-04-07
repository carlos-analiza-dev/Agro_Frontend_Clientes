"use client";
import { Ingreso } from "@/api/finanzas/ingresos/interface/response-ingresos.interface";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FiltrosGastos as FiltrosGastosType } from "@/interfaces/filtros/filtros-gastos";
import useGetObtenerIngresos from "@/hooks/finanzas/ingresos/useGetObtenerIngresos";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Filter, Plus } from "lucide-react";
import { FiltrosGastosIngresos } from "@/components/generics/FiltrosGastosIngresos";
import Paginacion from "@/components/generics/Paginacion";
import Modal from "@/components/generics/Modal";
import { CardIngresoMobile } from "./ui/CardIngresoMobile";
import { TableIngresos } from "./ui/TableIngresos";
import FormIngresos from "./ui/FormIngresos";

const IngresosPage = () => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedIngreso, setSelectedIngreso] = useState<Ingreso | undefined>(
    undefined,
  );
  const [filtros, setFiltros] = useState<FiltrosGastosType>({
    offset: 0,
    limit: 10,
    categoria: "",
    metodo_pago: "",
  });

  const { data: ingresosData, isLoading } = useGetObtenerIngresos(filtros);
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
  const totalPages = ingresosData?.totalPages || 1;

  const handleNewIngreso = () => {
    if (isMobile) {
      router.push("/ingresos/nuevo-ingreso");
    } else {
      setSelectedIngreso(undefined);
      setOpenModal(true);
    }
  };

  const handleEditIngreso = (ingreso: Ingreso) => {
    setSelectedIngreso(ingreso);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedIngreso(undefined);
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
            Control de Ingresos{" "}
            {fincaSelected ? fincaSelected?.nombre_finca : ""}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Registra y monitorea todos los ingresos de tus fincas
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
                  <FiltrosGastosIngresos
                    filtros={filtros}
                    setFiltros={setFiltros}
                    fincas={fincas?.data?.fincas || []}
                    especies={especies?.data || []}
                    onClose={() => setIsFilterOpen(false)}
                    isGasto={false}
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
          <Button onClick={handleNewIngreso} className="flex-1 sm:flex-none">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Ingreso
          </Button>
        </div>
      </div>

      {isFilterOpen && !isMobile && (
        <div className="bg-white rounded-xl border p-6 shadow-sm">
          <FiltrosGastosIngresos
            filtros={filtros}
            setFiltros={setFiltros}
            fincas={fincas?.data?.fincas || []}
            especies={especies?.data || []}
            isGasto={false}
          />
        </div>
      )}

      {isMobile ? (
        <CardIngresoMobile
          ingresos={ingresosData?.data || []}
          isLoading={isLoading}
          moneda={moneda}
        />
      ) : (
        <TableIngresos
          ingresos={ingresosData?.data || []}
          isLoading={isLoading}
          moneda={moneda}
          handleEditIngreso={handleEditIngreso}
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

      {ingresosData?.data && ingresosData.data.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-4 flex flex-wrap justify-between items-center gap-4">
          <div>
            <span className="text-sm text-gray-600">Total de ingresos:</span>
            <span className="ml-2 text-xl font-bold text-green-600">
              {moneda}{" "}
              {ingresosData.data
                .reduce((sum, g) => sum + g.monto, 0)
                .toLocaleString("es-HN", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div>
            <span className="text-sm text-gray-600">Mostrando:</span>
            <span className="ml-2 text-sm">
              {ingresosData.data.length} de {ingresosData.total} registros
            </span>
          </div>
        </div>
      )}

      <Modal
        title={selectedIngreso ? "Editar Ingreso" : "Ingresar Nuevo Ingreso"}
        description={
          selectedIngreso
            ? "Aquí podrás editar los ingresos que tienes por cada finca"
            : "Aquí podrás ingresar los ingresos que tienes por cada finca"
        }
        open={openModal}
        onOpenChange={handleCloseModal}
        size="xl"
        height="xl"
      >
        <FormIngresos
          setOpenModal={handleCloseModal}
          onSuccess={() => {
            setSelectedIngreso(undefined);
          }}
          ingreso={selectedIngreso}
        />
      </Modal>
    </div>
  );
};

export default IngresosPage;
