"use client";
import ButtonAdd from "@/components/generics/ButtonAdd";
import TitlePage from "@/components/generics/TitlePage";
import useGetConsumoInsumos from "@/hooks/agroservicios/consumo-insumos/useGetConsumoInsumos";
import { FlaskConical } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Paginacion from "@/components/generics/Paginacion";
import SkeletonPage from "@/components/generics/SkeletonPage";
import TableConsumoInsumos from "@/components/agroservicio/consumos-insumos/TableConsumoInsumos";
import Modal from "@/components/generics/Modal";
import FormAddConsumoInsumo from "@/components/agroservicio/consumos-insumos/FormAddConsumoInsumo";
import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";
import useGetSucursalByEmpleado from "@/hooks/agroservicios/sucursales/useGetSucursalByEmpleado";

const AgroConsumoInsumos = () => {
  const { empleado } = useAuthEmpleadoStore();
  const propietarioId = empleado?.agroservicio.propietario.id ?? "";
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [openModalForm, setOpenModalForm] = useState(false);
  const { data: sucursalEmp } = useGetSucursalByEmpleado();
  const sucursalId = sucursalEmp?.id ?? "";

  useEffect(() => {
    setOffset((currentPage - 1) * limit);
  }, [currentPage, limit]);

  const { data: consumo, isLoading } = useGetConsumoInsumos(propietarioId, {
    sucursal: sucursalId,
    limit,
    offset,
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const totalPages = Math.ceil((consumo?.total || 0) / limit);

  return (
    <div
      id="consumo-insumos-page"
      className="container mx-auto p-4 md:p-6 space-y-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <TitlePage
          Icon={FlaskConical}
          title="Consumo de Insumos"
          description="Gestiona el consumo de insumos en tu agroservicio"
        />

        <ButtonAdd
          id="add-consumo-insumo"
          title="Agregar Consumo"
          Icon={FlaskConical}
          action={() => setOpenModalForm(true)}
          className="w-full md:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300"
        />
      </div>

      <Card id="tabla-consumo-insumos" className="border shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg">Registros de Consumo</CardTitle>
              <CardDescription>
                {consumo?.total
                  ? `Mostrando ${consumo.data.length} de ${consumo.total} registros`
                  : "No hay registros disponibles"}
              </CardDescription>
            </div>
            {consumo?.total && (
              <Badge variant="outline" className="w-fit">
                Total: {consumo.total}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonPage />
          ) : consumo && consumo?.data?.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <TableConsumoInsumos consumo={consumo} />
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Paginacion
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <FlaskConical className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No hay registros</p>
              <p className="text-sm">
                No se encontraron consumos de insumos con los filtros aplicados
              </p>
            </div>
          )}
        </CardContent>
      </Card>
      <Modal
        open={openModalForm}
        onOpenChange={setOpenModalForm}
        title="Agregar Consumo de Insumo"
        size="2xl"
        height="auto"
        showCloseButton={false}
      >
        <FormAddConsumoInsumo
          isPropietario={false}
          sucursalId={sucursalId}
          propietarioId={propietarioId}
          onSuccess={() => setOpenModalForm(false)}
          onCancel={() => setOpenModalForm(false)}
        />
      </Modal>
    </div>
  );
};

export default AgroConsumoInsumos;
