"use client";
import { useState, useEffect } from "react";
import { Filter, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import useGetCelosAnimal from "@/hooks/reproduccion/useGetCelosAnimal";
import { FiltrosCelos } from "@/interfaces/filtros/celos.filtros.interface";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { MessageError } from "@/components/generics/MessageError";
import TableCelos from "./ui/TableCelos";
import { Celo } from "@/api/reproduccion/interfaces/response-celos-animal,interface";
import Paginacion from "@/components/generics/Paginacion";
import Modal from "@/components/generics/Modal";
import FormCelosAnimal from "./ui/FormCelosAnimal";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { useRouter } from "next/navigation";
import MobileFilters from "./ui/MobileFilters";
import DesktopFilters from "./ui/DesktopFilters";

const CelosAnimalPage = () => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

  const [filtros, setFiltros] = useState<FiltrosCelos>({
    offset: 1,
    limit: 10,
  });

  const [tempFiltros, setTempFiltros] = useState<FiltrosCelos>(filtros);

  const [fincaSeleccionada, setFincaSeleccionada] = useState<string>("");
  const [openModal, setOpenModal] = useState(false);
  const [selectedCelo, setSelectedCelo] = useState<Celo | null>(null);
  const [detalleOpen, setDetalleOpen] = useState(false);
  const [filtrosVisibles, setFiltrosVisibles] = useState(false);
  const [filtrosAbiertos, setFiltrosAbiertos] = useState(false);

  const { data: fincas, isLoading: fincasLoading } =
    useFincasPropietarios(clienteId);
  const { data: animales, isLoading: animalesLoading } =
    useGetAnimalesPropietario(clienteId);
  const hembras = animales?.data.filter((animal) => animal.sexo === "Hembra");

  const { data: especies, isLoading: especiesLoading } = useGetEspecies();

  const { data, isLoading, error, refetch } = useGetCelosAnimal(filtros);

  useEffect(() => {
    if (tempFiltros.fincaId) {
      setFincaSeleccionada(tempFiltros.fincaId);
    }
  }, [tempFiltros.fincaId]);

  const handleFilterChange = (key: keyof FiltrosCelos, value: any) => {
    if (key === "fincaId") {
      setTempFiltros((prev) => ({
        ...prev,
        fincaId: value === "todas" ? "" : value,
        animalId: "",
      }));
      setFincaSeleccionada(value === "todas" ? "" : value);
    } else if (key === "especie") {
      setTempFiltros((prev) => ({
        ...prev,
        [key]: value === "todas" ? "" : value,
      }));
    } else if (key === "intensidad") {
      setTempFiltros((prev) => ({
        ...prev,
        [key]: value === "todas" ? "" : value,
      }));
    } else {
      setTempFiltros((prev) => ({ ...prev, [key]: value }));
    }
  };

  const aplicarFiltros = () => {
    setFiltros({ ...tempFiltros, offset: 1 });
    refetch();
    if (isMobile) {
      setFiltrosVisibles(false);
    }
  };

  const limpiarFiltros = () => {
    const filtrosLimpios = { offset: 1, limit: 10 };
    setTempFiltros(filtrosLimpios);
    setFiltros(filtrosLimpios);
    setFincaSeleccionada("");
    refetch();
  };

  const cambiarPagina = (nuevaPagina: number) => {
    setFiltros((prev) => ({ ...prev, offset: nuevaPagina }));

    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleCreateRegistro = () => {
    if (isMobile) {
      router.push("/celos/crear-periodo-celo");
    } else {
      setOpenModal(true);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Control de Celos
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Registra y monitorea los celos de tus animales. Cada registro será
            evaluado automáticamente para validar que el animal cumpla con la
            edad mínima reproductiva de su especie antes de continuar con
            procesos como monta o inseminación.
          </p>
        </div>
        <div className="flex w-full sm:w-auto gap-2">
          <Button
            variant="outline"
            onClick={() => setFiltrosVisibles(true)}
            className="flex-1 sm:flex-none md:hidden"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button
            onClick={handleCreateRegistro}
            className="flex-1 sm:flex-none"
          >
            Nuevo Registro
          </Button>
        </div>
      </div>

      {isMobile ? (
        <MobileFilters
          filtrosVisibles={filtrosVisibles}
          setFiltrosVisibles={setFiltrosVisibles}
          tempFiltros={tempFiltros}
          fincasLoading={fincasLoading}
          handleFilterChange={handleFilterChange}
          fincas={fincas?.data}
          hembras={hembras}
          especies={especies?.data}
          animalesLoading={animalesLoading}
          especiesLoading={especiesLoading}
          aplicarFiltros={aplicarFiltros}
          limpiarFiltros={limpiarFiltros}
        />
      ) : (
        <DesktopFilters
          setFiltrosAbiertos={setFiltrosAbiertos}
          filtrosAbiertos={filtrosAbiertos}
          tempFiltros={tempFiltros}
          fincasLoading={fincasLoading}
          handleFilterChange={handleFilterChange}
          fincas={fincas?.data}
          hembras={hembras}
          especies={especies?.data}
          animalesLoading={animalesLoading}
          especiesLoading={especiesLoading}
          aplicarFiltros={aplicarFiltros}
          limpiarFiltros={limpiarFiltros}
          isTablet={isTablet}
        />
      )}

      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center py-12 md:py-20">
              <Loader2 className="h-6 w-6 md:h-8 md:w-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <MessageError
              titulo="No se encontraron registros de celo"
              descripcion="Error al cargar los datos. Por favor intenta de nuevo."
            />
          ) : (
            <>
              <TableCelos
                data={data}
                setSelectedCelo={setSelectedCelo}
                setDetalleOpen={setDetalleOpen}
                detalleOpen={detalleOpen}
                selectedCelo={selectedCelo}
              />

              {(!data?.celos || data.celos.length === 0) && (
                <div className="p-8 text-center">
                  <MessageError
                    titulo="No se encontraron registros de celo"
                    descripcion="No hay datos disponibles para mostrar."
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {data && data.totalPages > 0 && (
        <div className="flex justify-center sm:justify-end">
          <Paginacion
            currentPage={data.offset}
            totalPages={data.totalPages}
            onPageChange={cambiarPagina}
          />
        </div>
      )}

      {!isMobile && (
        <Modal
          open={openModal}
          onOpenChange={setOpenModal}
          title="Agregar Nuevo Celo"
          description="Aquí podrás agregar el período de celo de tus vacas"
          size="xl"
        >
          <FormCelosAnimal
            setOpenModal={setOpenModal}
            onSuccess={() => setOpenModal(false)}
            hembras={hembras}
          />
        </Modal>
      )}
    </div>
  );
};

export default CelosAnimalPage;
