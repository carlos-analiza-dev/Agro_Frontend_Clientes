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
import {
  MovimientoLote,
  TipoMovimiento,
} from "@/api/agroservicio/movimientos-lotes/interface/response-movimientos-lotes.interface";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import TipoMovimientoBadge from "./getTipoMovimientoBadge";

interface Props {
  movimientosFiltrados: MovimientoLote[];
}

const TableMovimientosLotes = ({ movimientosFiltrados }: Props) => {
  const t = useTranslations("tableMovimientosLotes");

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[180px]">{t("columns.date")}</TableHead>
            <TableHead>{t("columns.product")}</TableHead>
            <TableHead>{t("columns.type")}</TableHead>
            <TableHead className="text-right">
              {t("columns.quantity")}
            </TableHead>
            <TableHead>{t("columns.invoice")}</TableHead>
            <TableHead>{t("columns.branch")}</TableHead>
            <TableHead>{t("columns.previousStock")}</TableHead>
            <TableHead>{t("columns.newStock")}</TableHead>
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
                  <p>{t("empty.title")}</p>
                  <p className="text-sm">{t("empty.description")}</p>
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
                      {t("labels.code")}: {mov.producto?.codigo || "N/D"}
                    </span>
                  </div>
                </TableCell>

                <TableCell>
                  <TipoMovimientoBadge tipo={mov.tipo} />
                </TableCell>

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
