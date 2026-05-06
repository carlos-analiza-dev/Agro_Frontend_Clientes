"use client";

import { useState, useMemo } from "react";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetMantenimientos from "@/hooks/mantenimientos/useGetMantenimientos";
import { useAuthStore } from "@/providers/store/useAuthStore";
import Paginacion from "@/components/generics/Paginacion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { WrenchIcon, AlertCircleIcon } from "lucide-react";
import { Mantenimiento } from "@/api/mantenimientos/interface/response-mantenimientos.interface";
import SkeletonCard from "@/components/generics/SkeletonCard";
import CardMantenimientos from "./ui/CardMantenimientos";
import CardFilters from "./ui/CardFilters";
import Modal from "@/components/generics/Modal";
import FormMantenimiento from "./ui/FormMantenimiento";

const MantenimientosPage = () => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const [openModal, setOpenModal] = useState(false);
  const { data: fincas, isLoading: isLoadingFincas } =
    useFincasPropietarios(clienteId);

  const [filters, setFilters] = useState({
    offset: 0,
    limit: 10,
    tipoMantenimiento: "",
    fechaInicio: "",
    fechaFin: "",
    fincaId: "",
  });

  const cleanFilters = useMemo(() => {
    const cleaned: any = {
      offset: filters.offset,
      limit: filters.limit,
    };

    if (filters.tipoMantenimiento && filters.tipoMantenimiento.trim() !== "") {
      cleaned.tipoMantenimiento = filters.tipoMantenimiento;
    }
    if (filters.fechaInicio && filters.fechaInicio.trim() !== "") {
      cleaned.fechaInicio = filters.fechaInicio;
    }
    if (filters.fechaFin && filters.fechaFin.trim() !== "") {
      cleaned.fechaFin = filters.fechaFin;
    }
    if (filters.fincaId && filters.fincaId.trim() !== "") {
      cleaned.fincaId = filters.fincaId;
    }

    return cleaned;
  }, [filters]);

  const { data, isLoading, error } = useGetMantenimientos(cleanFilters);

  const mantenimientos = data?.mantenimientos ?? [];
  const totalPages = Math.ceil((data?.total ?? 0) / filters.limit);
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
      tipoMantenimiento: "",
      fechaInicio: "",
      fechaFin: "",
      fincaId: "",
    });
  };

  const hasActiveFilters =
    filters.tipoMantenimiento ||
    filters.fechaInicio ||
    filters.fechaFin ||
    filters.fincaId;

  if (error) {
    return (
      <div className="container mx-auto p-4 md:p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircleIcon className="h-12 w-12 text-red-500 mb-4" />
            <p className="text-lg font-medium text-red-600">
              Error al cargar los mantenimientos
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mantenimientos</h1>
          <p className="text-muted-foreground mt-1">
            Gestiona y visualiza los mantenimientos de tus equipos
          </p>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setOpenModal(true)}>
            + Ingresar Mantenimiento
          </Button>
        </div>
      </div>

      <CardFilters
        filters={filters}
        handleFilterChange={handleFilterChange}
        isLoadingFincas={isLoadingFincas}
        clearFilters={clearFilters}
        hasActiveFilters={hasActiveFilters}
        fincas={fincas?.data.fincas}
      />

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {!isLoading && (
            <>
              Mostrando {mantenimientos.length} de {data?.total || 0}{" "}
              mantenimientos
            </>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : mantenimientos.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <WrenchIcon className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium text-muted-foreground">
                  No hay mantenimientos
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {hasActiveFilters
                    ? "No se encontraron mantenimientos con los filtros seleccionados"
                    : "No hay mantenimientos registrados en el sistema"}
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          mantenimientos.map((m: Mantenimiento) => (
            <CardMantenimientos mantenimiento={m} moneda={moneda} key={m.id} />
          ))
        )}
      </div>

      {totalPages > 1 && mantenimientos.length > 0 && (
        <div className="flex justify-center pt-4">
          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}
      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title="Ingresar Nuevo Mantenimiento"
        description="Aqui podras ingresar los equipos y maquinas que se encuentran en mantenimiento"
        size="2xl"
        height="auto"
        showCloseButton={false}
      >
        <FormMantenimiento
          moneda={moneda}
          onSuccess={() => setOpenModal(false)}
        />
      </Modal>
    </div>
  );
};

export default MantenimientosPage;
