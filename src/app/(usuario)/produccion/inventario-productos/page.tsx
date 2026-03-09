"use client";
import useGetInventarioProductos from "@/hooks/inventario-productos/useGetInventarioProductos";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import TableProductsInventario from "./ui/TableProductsInventario";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkeletonTable from "@/components/generics/SkeletonTable";
import Paginacion from "@/components/generics/Paginacion";
import Modal from "@/components/generics/Modal";
import FormProductosGanaderia from "./ui/FormProductosGanaderia";
import ButtonBack from "@/components/generics/ButtonBack";

const InventarioProductos = () => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [fincaSelected, setFincaSelected] = useState("todas");
  const [onOpenModal, setOnOpenModal] = useState(false);

  const fincaId = fincaSelected === "todas" ? "" : fincaSelected;

  const { data: inventarioData, isLoading } = useGetInventarioProductos(
    limit,
    offset,
    fincaId,
  );

  const { data: fincas } = useFincasPropietarios(clienteId);

  const inventario = inventarioData?.data || [];
  const total = inventarioData?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const handlePageChange = (page: number) => {
    setOffset((page - 1) * limit);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <ButtonBack />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-8 w-8 text-green-600" />
            Mi Inventario
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Gestiona el inventario de tus productos ganaderos
          </p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="w-full sm:w-72">
              <Select
                value={fincaSelected}
                onValueChange={(value) => {
                  setFincaSelected(value);
                  setOffset(0);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecciona una finca" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Fincas</SelectLabel>
                    <SelectItem value="todas">Todas las fincas</SelectItem>
                    {fincas?.data.fincas.map((finca) => (
                      <SelectItem value={finca.id} key={finca.id}>
                        {finca.nombre_finca}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Button className="w-full" onClick={() => setOnOpenModal(true)}>
                Agregar +
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Productos en inventario</CardTitle>
          <CardDescription>
            Total de {inventario.length} productos (mostrando{" "}
            {Math.min(limit, inventario.length)} de {total})
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonTable />
          ) : inventario.length > 0 ? (
            <div className="overflow-x-auto">
              <TableProductsInventario inventario={inventario} />
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay productos en inventario
              </h3>
              <p className="text-gray-500 mb-4">
                Comienza agregando productos a tu inventario
              </p>
              <Button onClick={() => setOnOpenModal(true)}>
                Agregar producto
              </Button>
            </div>
          )}
        </CardContent>

        {totalPages > 1 && (
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
            <div className="text-sm text-gray-500">
              Mostrando {offset + 1} - {Math.min(offset + limit, total)} de{" "}
              {total} productos
            </div>

            <Paginacion
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </CardFooter>
        )}
      </Card>
      <Modal
        open={onOpenModal}
        onOpenChange={setOnOpenModal}
        title="Agregar Producto al Inventario"
        description="Aqui podras agregar productos a tu inventario"
        size="lg"
      >
        <FormProductosGanaderia onSuccess={() => setOnOpenModal(false)} />
      </Modal>
    </div>
  );
};

export default InventarioProductos;
