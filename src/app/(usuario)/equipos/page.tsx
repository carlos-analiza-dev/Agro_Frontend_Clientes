"use client";

import { useState } from "react";
import useGetEquiposMaquinaria from "@/hooks/equipos-maquinaria/useGetEquiposMaquinaria";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { EstadoMaquinaria } from "@/interfaces/enums/maquinaria/maquinaria.enums";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Paginacion from "@/components/generics/Paginacion";
import SkeletonTable from "@/components/generics/SkeletonTable";
import TableEquipos from "./ui/TableEquipos";
import CardFilters from "./ui/CardFilters";
import ResumemCard from "./ui/ResumemCard";
import { Button } from "@/components/ui/button";
import Modal from "@/components/generics/Modal";
import FormEquipos from "./ui/FormEquipos";
import { Equipo } from "@/api/equipos-maquinaria/interface/response-equipos.interface";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { useRouter } from "next/navigation";

const EquiposPage = () => {
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const clienteId = cliente?.id ?? "";
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const [openModalEquipos, setOpenModalEquipos] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState<Equipo | null>(null);
  const [filters, setFilters] = useState({
    fincaId: "",
    estado: "",
    offset: 0,
    limit: 10,
  });

  const { data: response, isLoading } = useGetEquiposMaquinaria(filters);
  const { data: fincas } = useFincasPropietarios(clienteId);

  const equipos = response?.equipos ?? [];
  const limit = response?.limit ?? filters.limit;
  const offset = response?.offset ?? filters.offset;

  const currentPage = Math.floor(offset / limit) + 1;
  const totalPages = equipos.length < limit ? currentPage : currentPage + 1;

  const handlePageChange = (page: number) => {
    const newOffset = (page - 1) * filters.limit;
    setFilters({ ...filters, offset: newOffset });
  };

  const handleLimitChange = (newLimit: number) => {
    setFilters({ ...filters, limit: newLimit, offset: 0 });
  };

  const handleClearFilters = () => {
    setFilters({ fincaId: "", estado: "", offset: 0, limit: 10 });
  };

  const handleEditEquipo = (equipo: Equipo) => {
    if (isMobile) {
      router.push(`/equipos/${equipo.id}`);
    } else {
      setOpenModalEquipos(true);
      setSelectedEquipo(equipo);
    }
  };

  const handleAddEquipos = () => {
    if (isMobile) {
      router.push("/equipos/ingresar-equipo");
    } else {
      setOpenModalEquipos(true);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
            Equipos y Maquinaria
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Registra y monitorea tus equipos y maquinaria
          </p>
        </div>
        <Button onClick={() => handleAddEquipos()} className="w-full md:w-auto">
          + Agregar Equipo
        </Button>
      </div>
      {!isLoading && equipos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <ResumemCard title="Equipos en esta página" total={equipos.length} />
          <ResumemCard
            title="Activos"
            total={
              equipos.filter((e) => e.estado === EstadoMaquinaria.ACTIVO).length
            }
          />
          <ResumemCard
            title="En Mantenimiento"
            total={
              equipos.filter((e) => e.estado === EstadoMaquinaria.MANTENIMIENTO)
                .length
            }
          />
          <ResumemCard
            title="Inactivos"
            total={
              equipos.filter((e) => e.estado === EstadoMaquinaria.INCACTIVO)
                .length
            }
          />
        </div>
      )}

      <CardFilters
        filters={filters}
        setFilters={setFilters}
        fincas={fincas?.data.fincas}
        handleLimitChange={handleLimitChange}
        handleClearFilters={handleClearFilters}
      />

      <Card>
        <CardHeader>
          <CardTitle>Equipos y Maquinaria</CardTitle>
          {!isLoading && equipos.length > 0 && (
            <p className="text-sm text-muted-foreground">
              Mostrando {equipos.length} equipos (Página {currentPage} de{" "}
              {totalPages})
            </p>
          )}
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonTable />
          ) : equipos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se encontraron equipos</p>
              <p className="text-sm text-muted-foreground mt-1">
                Prueba ajustando los filtros o agrega un nuevo equipo
              </p>
            </div>
          ) : (
            <>
              <TableEquipos
                equipos={equipos}
                handleEditEquipo={handleEditEquipo}
                moneda={moneda}
                isMobile={isMobile}
              />

              <div className="mt-4 flex justify-center">
                <Paginacion
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Modal
        open={openModalEquipos}
        onOpenChange={setOpenModalEquipos}
        title={selectedEquipo ? "Editar Equipo" : "Ingresar Nuevo Equipo"}
        description={
          selectedEquipo
            ? "Aqui podras editar los equipos asignados en cada finca"
            : "Aqui podras ingresar los equipos asignados en cada finca"
        }
        size="2xl"
        height="auto"
        showCloseButton={false}
      >
        <FormEquipos
          onSuccess={() => {
            (setOpenModalEquipos(false), setSelectedEquipo(null));
          }}
          moneda={moneda}
          equipo={selectedEquipo}
        />
      </Modal>
    </div>
  );
};

export default EquiposPage;
