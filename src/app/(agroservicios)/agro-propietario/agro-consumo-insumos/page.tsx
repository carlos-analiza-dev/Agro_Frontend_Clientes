"use client";
import ButtonAdd from "@/components/generics/ButtonAdd";
import TitlePage from "@/components/generics/TitlePage";
import useGetConsumoInsumos from "@/hooks/agroservicios/consumo-insumos/useGetConsumoInsumos";
import useGetAllSucursales from "@/hooks/agroservicios/sucursales/useGetAllSucursales";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { FlaskConical, Filter } from "lucide-react";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
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

const AgroConsumoInsumos = () => {
  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
  const { data: sucursales } = useGetAllSucursales();
  const [selectSucursal, setSelectSucursal] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [openModalForm, setOpenModalForm] = useState(false);

  const sucursal = selectSucursal === "todas" ? "" : selectSucursal;

  useEffect(() => {
    setOffset((currentPage - 1) * limit);
  }, [currentPage, limit]);

  const { data: consumo, isLoading } = useGetConsumoInsumos(propietarioId, {
    sucursal: sucursal,
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

      <Card id="filtros-consumo-insumos" className="border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5 text-muted-foreground" />
            Filtros
          </CardTitle>
          <CardDescription>
            Filtra el consumo de insumos por sucursal y rango de fechas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sucursal" className="text-sm font-medium">
                Sucursal
              </Label>
              <Select value={selectSucursal} onValueChange={setSelectSucursal}>
                <SelectTrigger id="sucursal" className="w-full">
                  <SelectValue placeholder="Todas las sucursales" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las sucursales</SelectItem>
                  {sucursales?.map((sucursal: any) => (
                    <SelectItem key={sucursal.id} value={sucursal.id}>
                      {sucursal.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

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
          isPropietario={true}
          propietarioId={propietarioId}
          onSuccess={() => setOpenModalForm(false)}
          onCancel={() => setOpenModalForm(false)}
        />
      </Modal>
    </div>
  );
};

export default AgroConsumoInsumos;
