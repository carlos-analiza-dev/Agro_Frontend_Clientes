import { Inventario } from "@/api/inventario-productos/interfaces/response-inventario.interface";
import Modal from "@/components/generics/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/helpers/funciones/formatDate";
import { useState } from "react";
import FormProductosGanaderia from "./FormProductosGanaderia";
import { Edit, AlertTriangle } from "lucide-react";

interface Props {
  inventario: Inventario[];
}

const TableProductsInventario = ({ inventario }: Props) => {
  const [onOpenModal, setOnOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [inventarioEdit, setInventarioEdit] = useState<Inventario | null>(null);

  const handleEdit = (inventario: Inventario) => {
    setOnOpenModal(true);
    setIsEdit(true);
    setInventarioEdit(inventario);
  };

  const MobileView = () => (
    <div className="space-y-3 sm:hidden">
      {inventario.map((item) => {
        const stockMinimo = parseFloat(item.stockMinimo);
        const cantidad = parseFloat(item.cantidad);
        const isLowStock = cantidad <= stockMinimo;

        return (
          <Card key={item.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-base text-gray-900">
                    {item.producto.nombre}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {item.producto.categoria}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {item.unidadMedida}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() => handleEdit(item)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>

              <div className="mb-3 pb-3 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-700">
                  {item.finca.nombre_finca}
                </p>
                <p className="text-xs text-gray-500">
                  {item.finca.abreviatura}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Cantidad</p>
                  <p
                    className={`text-base font-semibold ${isLowStock ? "text-red-600" : "text-gray-900"}`}
                  >
                    {cantidad.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Stock Mínimo</p>
                  <p className="text-base font-semibold text-gray-900">
                    {stockMinimo.toFixed(2)}
                  </p>
                </div>
              </div>

              {isLowStock && (
                <div className="mt-3 flex items-center gap-2 bg-red-50 text-red-700 p-2 rounded-lg">
                  <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                  <span className="text-xs font-medium">
                    Stock por debajo del mínimo
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const DesktopView = () => (
    <div className="hidden sm:block overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center font-bold whitespace-nowrap">
              Producto
            </TableHead>
            <TableHead className="text-center font-bold whitespace-nowrap">
              Categoría
            </TableHead>
            <TableHead className="text-center font-bold whitespace-nowrap">
              Finca
            </TableHead>
            <TableHead className="text-center font-bold whitespace-nowrap">
              Cantidad
            </TableHead>
            <TableHead className="text-center font-bold whitespace-nowrap">
              Stock Mínimo
            </TableHead>
            <TableHead className="text-center font-bold whitespace-nowrap">
              Unidad
            </TableHead>
            <TableHead className="text-center font-bold whitespace-nowrap">
              Última actualización
            </TableHead>
            <TableHead className="text-center font-bold whitespace-nowrap">
              Acciones
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inventario.map((item) => {
            const stockMinimo = parseFloat(item.stockMinimo);
            const cantidad = parseFloat(item.cantidad);
            const isLowStock = cantidad <= stockMinimo;

            return (
              <TableRow key={item.id}>
                <TableCell className="text-center whitespace-nowrap">
                  {item.producto.nombre}
                </TableCell>
                <TableCell className="text-center">
                  <Badge className="whitespace-nowrap">
                    {item.producto.categoria}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col">
                    <span className="whitespace-nowrap">
                      {item.finca.nombre_finca}
                    </span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {item.finca.abreviatura}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center whitespace-nowrap">
                  <span className={isLowStock ? "text-red-600 font-bold" : ""}>
                    {cantidad.toFixed(2)}
                  </span>
                  {isLowStock && (
                    <Badge
                      variant="destructive"
                      className="ml-2 text-xs whitespace-nowrap"
                    >
                      Bajo stock
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap">
                  {stockMinimo.toFixed(2)}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap">
                  {item.unidadMedida}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap">
                  {formatDate(item.updatedAt)}
                </TableCell>
                <TableCell className="text-center">
                  <Button
                    onClick={() => handleEdit(item)}
                    variant="ghost"
                    size="sm"
                    className="whitespace-nowrap"
                  >
                    Editar
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <div>
      <MobileView />

      <DesktopView />

      <Modal
        open={onOpenModal}
        onOpenChange={setOnOpenModal}
        title="Editar Inventario"
        description="Aquí podrás editar productos de tu inventario"
        className="sm:max-w-lg"
      >
        <FormProductosGanaderia
          onSuccess={() => {
            setOnOpenModal(false);
            setIsEdit(false);
            setInventarioEdit(null);
          }}
          isEdit={isEdit}
          inventarioEdit={inventarioEdit}
        />
      </Modal>
    </div>
  );
};

export default TableProductsInventario;
