"use client";
import { useState } from "react";
import { WrenchIcon } from "lucide-react";
import useGetUsoEquipos from "@/hooks/uso-equipos/useGetUsoEquipos";
import useGetEquiposMaquinariaActivos from "@/hooks/equipos-maquinaria/useGetEquiposMaquinariaActivos";
import useGetAllTrabajadores from "@/hooks/trabajadores/useGetAllTrabajadores";
import Paginacion from "@/components/generics/Paginacion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircleIcon } from "lucide-react";
import { UsosEquipo } from "@/api/uso-equipos/interfaces/response-uso-equipos.interface";
import TableUsoEquipos from "./ui/TableUsoEquipos";
import FiltersUsoEquipos from "./ui/FiltersUsoEquipos";
import Modal from "@/components/generics/Modal";
import FormUsoEquipo from "./ui/FormUsoEquipo";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { useRouter } from "next/navigation";

const UsoDeEquiposPage = () => {
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const [selectedUso, setSelectedUso] = useState<UsosEquipo | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    offset: 0,
    limit: 10,
    equipoId: "",
    operadorId: "",
  });

  const { data: data_uso, isLoading, error } = useGetUsoEquipos(filters);
  const { data: equiposActivos } = useGetEquiposMaquinariaActivos();
  const { data: trabajadores } = useGetAllTrabajadores();

  const usosEquipo = data_uso?.usosEquipo ?? [];
  const totalPages = Math.ceil((data_uso?.total ?? 0) / filters.limit);
  const currentPage = Math.floor(filters.offset / filters.limit) + 1;

  const handlePageChange = (page: number) => {
    setFilters((prev) => ({
      ...prev,
      offset: (page - 1) * prev.limit,
    }));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      offset: 0,
    }));
  };

  const clearFilters = () => {
    setFilters({
      offset: 0,
      limit: 10,
      equipoId: "",
      operadorId: "",
    });
  };

  const hasActiveFilters = filters.equipoId || filters.operadorId;

  const handleEdit = (uso: UsosEquipo) => {
    if (isMobile) {
      router.push(`/uso-equipos/${uso.id}`);
    } else {
      setSelectedUso(uso);
      setModalOpen(true);
    }
  };

  const handleAddUso = () => {
    if (isMobile) {
      router.push("/uso-equipos/ingresar-uso");
    } else {
      setModalOpen(true);
    }
  };

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircleIcon className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg font-medium text-red-600">
              Error al cargar los usos de equipo
            </p>
            <p className="text-sm text-red-500 mt-2">
              {error instanceof Error ? error.message : "Error desconocido"}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Reintentar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Uso de Equipos
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Registro de uso de equipos por operadores y actividades
          </p>
        </div>
        <Button onClick={() => handleAddUso()} className="w-full md:w-auto">
          <WrenchIcon className="h-4 w-4" />
          Registrar Uso
        </Button>
      </div>

      <FiltersUsoEquipos
        filters={filters}
        handleFilterChange={handleFilterChange}
        equiposActivos={equiposActivos}
        trabajadores={trabajadores}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
      />

      <Card>
        <CardHeader>
          <CardTitle>Registros de Uso</CardTitle>
          <CardDescription>
            {!isLoading && (
              <>
                Mostrando {usosEquipo.length} de {data_uso?.total || 0}{" "}
                registros
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : usosEquipo.length === 0 ? (
            <div className="text-center py-12">
              <WrenchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium text-muted-foreground">
                No hay registros de uso
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {hasActiveFilters
                  ? "No se encontraron registros con los filtros seleccionados"
                  : "No hay registros de uso de equipos en el sistema"}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <TableUsoEquipos
                usosEquipo={usosEquipo}
                handleEdit={handleEdit}
                isMobile={isMobile}
              />
            </div>
          )}

          {totalPages > 1 && usosEquipo.length > 0 && (
            <div className="flex justify-center pt-4">
              <Paginacion
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={modalOpen}
        onOpenChange={setModalOpen}
        title={selectedUso ? "Editar Uso de Equipo" : "Registrar Uso de Equipo"}
        description={
          selectedUso
            ? "Modifica los datos del registro de uso"
            : "Ingresa los datos del uso del equipo"
        }
        size="2xl"
        height="auto"
        showCloseButton={false}
      >
        <FormUsoEquipo
          onSuccess={() => {
            (setModalOpen(false), setSelectedUso(null));
          }}
          moneda={moneda}
          usoEquipo={selectedUso}
        />
      </Modal>
    </div>
  );
};

export default UsoDeEquiposPage;
