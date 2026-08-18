import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  Package,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import useGetProductosFrecuentes from "@/hooks/agroservicios/clientes/useGetProductosFrecuentes";
import { ClienteAgro } from "@/api/agroservicio/clientes/interfaces/response-clientes-ago.interface";
import Paginacion from "@/components/generics/Paginacion";
import { formatDateLocal } from "@/helpers/funciones/formatDateOnly";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cliente: ClienteAgro | null;
  simbolo: string;
}

const ModalProductosFrecuentes = ({
  open,
  onOpenChange,
  cliente,
  simbolo,
}: Props) => {
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 5;

  useEffect(() => {
    if (open) {
      setCurrentPage(1);
    }
  }, [open, cliente?.id]);

  const offset = (currentPage - 1) * limit;

  const { data, isLoading, isError, refetch } = useGetProductosFrecuentes(
    cliente?.id || "",
    { limit, offset },
  );

  useEffect(() => {
    if (cliente?.id) {
      refetch();
    }
  }, [currentPage, cliente?.id, refetch]);

  const productos = data?.data || [];
  const total = data?.pagination?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const estadisticas = data?.estadisticas_generales;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const getTendenciaBadge = (frecuencia: number) => {
    if (frecuencia >= 3) {
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-200">
          <TrendingUp className="h-3 w-3 mr-1" />
          Alta
        </Badge>
      );
    } else if (frecuencia >= 1.5) {
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200">
          <Minus className="h-3 w-3 mr-1" />
          Media
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200">
          <TrendingDown className="h-3 w-3 mr-1" />
          Baja
        </Badge>
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-blue-600" />
            Productos más frecuentes
          </DialogTitle>
          <DialogDescription>
            {cliente ? (
              <>
                Cliente:{" "}
                <span className="font-semibold text-gray-900">
                  {cliente.nombre}
                </span>
                {cliente.identificacion && (
                  <span className="text-gray-500">
                    {" "}
                    | ID: {cliente.identificacion}
                  </span>
                )}
              </>
            ) : (
              "Seleccione un cliente para ver sus productos frecuentes"
            )}
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Cargando productos...</span>
          </div>
        ) : isError ? (
          <div className="text-center py-8 text-red-500">
            <p>
              No se encontraron productos frecuentes asociados a este cliente
            </p>
          </div>
        ) : productos.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              Este cliente no tiene productos frecuentes
            </p>
            <p className="text-sm text-gray-400 mt-1">
              No se encontraron facturas procesadas para este cliente
            </p>
          </div>
        ) : (
          <>
            {estadisticas && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-gray-50 p-4 rounded-lg mb-4">
                <div>
                  <p className="text-xs text-gray-500">Total Facturas</p>
                  <p className="text-lg font-bold text-gray-800">
                    {estadisticas.total_facturas}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Total Gastado</p>
                  <p className="text-lg font-bold text-blue-600">
                    {simbolo}
                    {estadisticas.total_gastado.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Promedio por Factura</p>
                  <p className="text-lg font-bold text-gray-800">
                    {simbolo}
                    {estadisticas.promedio_factura.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Productos Únicos</p>
                  <p className="text-lg font-bold text-gray-800">
                    {estadisticas.total_productos_unicos}
                  </p>
                </div>
              </div>
            )}

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 hover:bg-gray-50">
                    <TableHead className="font-semibold text-gray-700">
                      Producto
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 hidden md:table-cell">
                      Código
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right">
                      Precio
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">
                      Cantidad
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center hidden lg:table-cell">
                      Facturas
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-right hidden xl:table-cell">
                      Total
                    </TableHead>
                    <TableHead className="font-semibold text-gray-700 text-center">
                      Frecuencia
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productos.map((producto) => (
                    <TableRow
                      key={producto.id}
                      className="hover:bg-blue-50/50 transition-colors duration-200"
                    >
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">
                            {producto.nombre}
                          </span>
                          <span className="text-xs text-gray-400 md:hidden">
                            Cód: {producto.codigo || "N/A"}
                          </span>
                          <span className="text-xs text-gray-400 lg:hidden">
                            {producto.estadisticas.total_facturas} facturas
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell font-mono text-sm">
                        {producto.codigo || "N/A"}
                      </TableCell>
                      <TableCell className="text-right font-medium">
                        {simbolo}
                        {producto.precio_actual.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge variant="outline" className="font-semibold">
                          {producto.estadisticas.total_comprado}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center hidden lg:table-cell">
                        {producto.estadisticas.total_facturas}
                      </TableCell>
                      <TableCell className="text-right hidden xl:table-cell">
                        <span className="font-medium text-blue-600">
                          {simbolo}
                          {producto.estadisticas.total_monto.toFixed(2)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex flex-col items-center gap-1">
                          {getTendenciaBadge(
                            producto.estadisticas.frecuencia_compra,
                          )}
                          <span className="text-xs text-gray-400">
                            {producto.estadisticas.frecuencia_compra.toFixed(2)}{" "}
                            por factura
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {productos.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                <div>
                  <span className="font-medium">Primera compra:</span>{" "}
                  {formatDateLocal(productos[0]?.estadisticas?.primera_compra)}
                </div>
                <div>
                  <span className="font-medium">Última compra:</span>{" "}
                  {formatDateLocal(productos[0]?.estadisticas?.ultima_compra)}
                </div>
                <div>
                  <span className="font-medium">Total productos:</span> {total}
                </div>
                <div>
                  <span className="font-medium">Mostrando:</span>{" "}
                  {productos.length} de {total}
                </div>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center pt-4 border-t">
                <Paginacion
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ModalProductosFrecuentes;
