import {
  Compra,
  ResponseComprasInterface,
} from "@/api/agroservicio/compras_productos/interface/response-compras.interface";
import { MessageError } from "@/components/generics/MessageError";
import TableUsersSkeleton from "@/components/generics/SkeletonTable";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
import { Eye } from "lucide-react";
import { useState } from "react";
import InfoCompra from "./InfoCompra";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { formatDateLocal } from "@/helpers/funciones/formatDateOnly";

interface Props {
  comprasData: ResponseComprasInterface | undefined;
  isLoading: boolean;
  moneda: string;
}

const TableComprasProductos = ({ comprasData, isLoading, moneda }: Props) => {
  const [isOpenDetails, setIsOpenDetails] = useState(false);
  const [selectedCompra, setSelectedCompra] = useState<Compra | null>(null);

  const handleOpenDetails = (compra: Compra) => {
    setSelectedCompra(compra);
    setIsOpenDetails(true);
  };

  if (isLoading) {
    return <TableUsersSkeleton />;
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Proveedor</TableHead>
            <TableHead># Factura</TableHead>
            <TableHead>Sucursal</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo de Pago</TableHead>
            <TableHead>Impuestos</TableHead>
            <TableHead>Descuentos</TableHead>
            <TableHead>Sub total</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {comprasData?.compras && comprasData.compras.length > 0 ? (
            comprasData.compras.map((compra) => (
              <TableRow key={compra.id}>
                <TableCell>{compra.proveedor.nombre_legal}</TableCell>
                <TableCell>{compra.numero_factura}</TableCell>
                <TableCell>{compra.sucursal.nombre}</TableCell>
                <TableCell>{formatDateLocal(compra.fecha)}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="capitalize">
                    {compra.tipo_pago}
                  </Badge>
                </TableCell>
                <TableCell>
                  {formatCurrency(compra.impuestos, moneda)}
                </TableCell>
                <TableCell>
                  {formatCurrency(compra.descuentos, moneda)}
                </TableCell>
                <TableCell>{formatCurrency(compra.subtotal, moneda)}</TableCell>
                <TableCell>{formatCurrency(compra.total, moneda)}</TableCell>
                <TableCell>
                  <div className="flex justify-center ">
                    <Button
                      onClick={() => handleOpenDetails(compra)}
                      variant="outline"
                      size="icon"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={10} className="text-center">
                <div className="flex justify-center py-4">
                  <MessageError
                    titulo="Error al cargar compras"
                    descripcion="En este momento no se encontraron compras disponibles"
                  />
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <AlertDialog open={isOpenDetails} onOpenChange={setIsOpenDetails}>
        <AlertDialogContent className="w-full md:max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Detalles de la compra</AlertDialogTitle>
            <AlertDialogDescription>
              En esta sección podrás observar más detalles de la compra
            </AlertDialogDescription>
          </AlertDialogHeader>

          {selectedCompra && (
            <div className="space-y-6">
              <InfoCompra selectedCompra={selectedCompra} moneda={moneda} />
            </div>
          )}
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TableComprasProductos;
