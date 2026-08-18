import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateLocal } from "@/helpers/funciones/formatDateOnly";
import { Package } from "lucide-react";
import getTipoMovimientoBadge from "./getTipoMovimientoBadge";
import {
  MovimientoLote,
  TipoMovimiento,
} from "@/api/agroservicio/movimientos-lotes/interface/response-movimientos-lotes.interface";
import { cn } from "@/lib/utils";

interface Props {
  movimientosFiltrados: MovimientoLote[];
}

const TableMovimientosLotes = ({ movimientosFiltrados }: Props) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">Fecha</TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead>Factura</TableHead>
            <TableHead>Sucursal</TableHead>
            <TableHead>Stock Anterior</TableHead>
            <TableHead>Stock Nuevo</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {movimientosFiltrados.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="text-center py-8 text-muted-foreground"
              >
                <div className="flex flex-col items-center gap-2">
                  <Package className="h-8 w-8 opacity-50" />
                  <p>No se encontraron movimientos</p>
                  <p className="text-sm">
                    Prueba ajustando los filtros o la búsqueda
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            movimientosFiltrados.map((mov: MovimientoLote) => (
              <TableRow key={mov.id}>
                <TableCell className="font-mono text-sm">
                  {formatDateLocal(mov.fecha)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {mov.producto?.nombre || "N/A"}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Código: {mov.producto?.codigo || "N/D"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getTipoMovimientoBadge(mov.tipo)}</TableCell>
                <TableCell className="text-right">
                  <span
                    className={cn(
                      "font-mono font-medium",
                      mov.tipo === TipoMovimiento.SALIDA
                        ? "text-red-600"
                        : mov.tipo === TipoMovimiento.DEVOLUCION
                          ? "text-green-600"
                          : "text-blue-600",
                    )}
                  >
                    {mov.tipo === TipoMovimiento.SALIDA ? "-" : "+"}
                    {mov.cantidad}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="font-mono text-sm">
                    {mov.factura?.numero_factura || "N/A"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {mov.lote.sucursal.nombre || "N/A"}
                  </span>
                </TableCell>
                <TableCell className="font-mono text-sm">
                  {mov.cantidad_anterior}
                </TableCell>
                <TableCell className="font-mono text-sm font-medium">
                  {mov.cantidad_nueva}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableMovimientosLotes;
