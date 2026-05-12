"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Sprout, X, MapPin } from "lucide-react";
import useGetCultivos from "@/hooks/cultivos/useGetCultivos";
import Paginacion from "@/components/generics/Paginacion";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";
import SkeletonTable from "@/components/generics/SkeletonTable";
import { getEstadoCultivo } from "@/helpers/data/cultivos/estados-cultivo";
import { Cultivo } from "@/api/cultivos/interface/response-cultivos.interface";
import Modal from "@/components/generics/Modal";
import InfoCultivos from "./ui/InfoCultivos";
import FormCultivo from "./ui/FormCultivo";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { useRouter } from "next/navigation";

const CultivoPage = () => {
  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const [filters, setFilters] = useState({
    offset: 0,
    limit: 10,
    fincaId: "",
  });
  const [selectedCultivo, setSelectedCultivo] = useState<Cultivo | null>(null);
  const [openModal, setOpenModal] = useState(false);
  const { data: cultivosData, isLoading } = useGetCultivos(filters);
  const { data: fincasData } = useFincasPropietarios(propietarioId);

  const currentPage = Math.floor(filters.offset / filters.limit) + 1;
  const totalPages = Math.ceil((cultivosData?.total || 0) / filters.limit);

  const handlePageChange = (page: number) => {
    setFilters({
      ...filters,
      offset: (page - 1) * filters.limit,
    });
  };

  const limpiarFiltros = () => {
    setFilters({
      offset: 0,
      limit: 10,
      fincaId: "",
    });
  };

  const handleAddCultivo = () => {
    if (isMobile) {
      router.push("/cultivos/crear-cultivo");
    } else {
      setOpenModal(true);
    }
  };

  const handleEditCultivo = (cultivo: Cultivo) => {
    if (isMobile) {
      router.push(`/cultivos/${cultivo.id}`);
    } else {
      setOpenModal(true);
      setSelectedCultivo(cultivo);
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2">
            <Sprout className="h-7 w-7 text-green-600" />
            Cultivos
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Registra y monitorea todos los cultivos de tus fincas
          </p>
        </div>
        <Button
          onClick={() => handleAddCultivo()}
          className="w-full mt-4 md:w-auto md:mt-0"
        >
          <Sprout className="h-4 w-4" />
          Agregar Cultivo
        </Button>
      </div>

      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64">
            <Select
              value={filters.fincaId}
              onValueChange={(value) =>
                setFilters({ ...filters, fincaId: value, offset: 0 })
              }
            >
              <SelectTrigger>
                <MapPin className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Todas las fincas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas las fincas</SelectItem>
                {fincasData?.data?.fincas.map((finca: Finca) => (
                  <SelectItem key={finca.id} value={finca.id}>
                    {finca.nombre_finca}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {filters.fincaId && (
            <Button variant="ghost" onClick={limpiarFiltros} className="gap-2">
              <X className="h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>
      </Card>

      <div className="space-y-4">
        {isLoading ? (
          <SkeletonTable />
        ) : cultivosData?.cultivos?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Sprout className="h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No hay cultivos registrados
              </h3>
              <p className="text-muted-foreground text-center">
                Comienza registrando tu primer cultivo
              </p>
              <Button onClick={() => setOpenModal(true)} className="mt-4 gap-2">
                <Sprout className="h-4 w-4" />
                Registrar Cultivo
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {cultivosData?.cultivos.map((cultivo: Cultivo) => {
              const estado = getEstadoCultivo(
                cultivo.fecha_siembra,
                cultivo.tipo_cultivo,
              );
              return (
                <Card
                  key={cultivo.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-6">
                    <InfoCultivos
                      cultivo={cultivo}
                      estado={estado}
                      handleEditCultivo={handleEditCultivo}
                      moneda={moneda}
                    />
                  </CardContent>
                </Card>
              );
            })}

            {totalPages > 1 && (
              <div className="flex justify-center pt-4">
                <Paginacion
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}

            <div className="text-center text-sm text-muted-foreground">
              Mostrando {cultivosData?.cultivos.length} de {cultivosData?.total}{" "}
              cultivos
            </div>
          </>
        )}
      </div>
      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title={selectedCultivo ? "Editar Cultivo" : "Registrar Nuevo Cultivo"}
        description={
          selectedCultivo
            ? "Aqui podras editar el cultivo seleccionado"
            : "Aqui podras ingresar un nuevo cultivo para tu finca"
        }
        size="2xl"
        height="auto"
        showCloseButton={false}
      >
        <FormCultivo
          fincas={fincasData?.data?.fincas}
          onSuccess={() => {
            setOpenModal(false);
            setFilters({ ...filters, offset: 0 });
            setSelectedCultivo(null);
          }}
          cultivo={selectedCultivo}
          moneda={moneda}
        />
      </Modal>
    </div>
  );
};

export default CultivoPage;
