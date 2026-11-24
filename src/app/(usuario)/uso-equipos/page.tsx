"use client";

import { useState } from "react";
import { AlertCircleIcon, Forklift, WrenchIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";

import { UsosEquipo } from "@/api/uso-equipos/interfaces/response-uso-equipos.interface";
import Paginacion from "@/components/generics/Paginacion";
import Modal from "@/components/generics/Modal";
import ButtonAdd from "@/components/generics/ButtonAdd";
import TitlePage from "@/components/generics/TitlePage";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import useGetUsoEquipos from "@/hooks/uso-equipos/useGetUsoEquipos";
import useGetEquiposMaquinariaActivos from "@/hooks/equipos-maquinaria/useGetEquiposMaquinariaActivos";
import useGetAllTrabajadores from "@/hooks/trabajadores/useGetAllTrabajadores";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";

import TableUsoEquipos from "./ui/TableUsoEquipos";
import FiltersUsoEquipos from "./ui/FiltersUsoEquipos";
import FormUsoEquipo from "./ui/FormUsoEquipo";

const UsoDeEquiposPage = () => {
  const t = useTranslations("usoDeEquiposPage");

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
              {t("errors.loadTitle")}
            </p>

            <p className="text-sm text-red-500 mt-2">
              {error instanceof Error ? error.message : t("errors.unknown")}
            </p>

            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              {t("buttons.retry")}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="md:flex justify-between items-center">
        <TitlePage
          title={t("title")}
          description={t("description")}
          Icon={Forklift}
        />

        <div id="id-add-uso-equipos">
          <ButtonAdd
            Icon={WrenchIcon}
            title={t("buttons.registerUsage")}
            action={() => handleAddUso()}
            className="bg-green-600 hover:bg-green-700"
          />
        </div>
      </div>

      <div id="id-filters-uso-equipos">
        <FiltersUsoEquipos
          filters={filters}
          handleFilterChange={handleFilterChange}
          equiposActivos={equiposActivos}
          trabajadores={trabajadores}
          clearFilters={clearFilters}
          hasActiveFilters={hasActiveFilters}
        />
      </div>

      <Card id="id-container-uso-equipos">
        <CardHeader>
          <CardTitle>{t("records.title")}</CardTitle>

          <CardDescription id="id-resumen-uso-equipos">
            {!isLoading && (
              <>
                {t("records.showing", {
                  showing: usosEquipo.length,
                  total: data_uso?.total ?? 0,
                })}
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
            <div id="id-empty-uso-equipos" className="text-center py-12">
              <WrenchIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />

              <p className="text-lg font-medium text-muted-foreground">
                {t("emptyState.title")}
              </p>

              <p className="text-sm text-muted-foreground mt-1">
                {hasActiveFilters
                  ? t("emptyState.withFilters")
                  : t("emptyState.withoutFilters")}
              </p>
            </div>
          ) : (
            <div id="id-table-uso-equipos" className="overflow-x-auto">
              <TableUsoEquipos
                usosEquipo={usosEquipo}
                handleEdit={handleEdit}
                isMobile={isMobile}
              />
            </div>
          )}

          {totalPages > 1 && usosEquipo.length > 0 && (
            <div
              id="id-paginacion-uso-equipos"
              className="flex justify-center pt-4"
            >
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
        title={selectedUso ? t("modal.editTitle") : t("modal.createTitle")}
        description={
          selectedUso
            ? t("modal.editDescription")
            : t("modal.createDescription")
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
