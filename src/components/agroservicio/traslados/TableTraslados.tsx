import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight } from "lucide-react";
import { TipoMovimientoBadge } from "./getTipoBadge";
import { Movimiento } from "@/api/agroservicio/movimientos-inventario/interface/obtener-movimientos-inventario.interface";
import { formatDateLocal } from "@/helpers/funciones/formatDateOnly";

interface Props {
  filteredMovimientos: Movimiento[];
  moneda: string;
}

const TableTraslados = ({ filteredMovimientos, moneda }: Props) => {
  const t = useTranslations("tableTraslados");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">{t("columns.product")}</TableHead>

          <TableHead className="text-center">{t("columns.quantity")}</TableHead>

          <TableHead className="text-center">{t("columns.origin")}</TableHead>

          <TableHead className="text-center" />

          <TableHead className="text-center">
            {t("columns.destination")}
          </TableHead>

          <TableHead className="text-center">{t("columns.unitCost")}</TableHead>

          <TableHead className="text-center">{t("columns.date")}</TableHead>

          <TableHead className="text-center">{t("columns.type")}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredMovimientos.map((mov) => (
          <TableRow key={mov.id}>
            <TableCell className="text-center">
              <div>
                <p>{mov.lote.producto.nombre}</p>
                <Badge variant="outline" className="font-mono">
                  {mov.lote?.producto.codigo || t("values.notAvailable")}
                </Badge>
              </div>
            </TableCell>

            <TableCell className="text-center font-semibold">
              {t("values.units", {
                quantity: Number(mov.cantidad).toFixed(0),
              })}
            </TableCell>

            <TableCell className="text-center">
              <div className="flex flex-col items-center">
                <span className="font-medium text-sm">
                  {mov.sucursalOrigen?.nombre || t("values.notAvailable")}
                </span>
                <span className="text-xs text-gray-500">
                  {mov.sucursalOrigen?.tipo || ""}
                </span>
              </div>
            </TableCell>

            <TableCell className="text-center">
              <ArrowRight className="h-4 w-4 text-gray-400 mx-auto" />
            </TableCell>

            <TableCell className="text-center">
              <div className="flex flex-col items-center">
                <span className="font-medium text-sm">
                  {mov.sucursalDestino?.nombre || t("values.notAvailable")}
                </span>
                <span className="text-xs text-gray-500">
                  {mov.sucursalDestino?.tipo || ""}
                </span>
              </div>
            </TableCell>

            <TableCell className="text-center">
              {moneda} {Number(mov.lote?.costo_por_unidad || 0).toFixed(2)}
            </TableCell>

            <TableCell className="text-center text-sm">
              {formatDateLocal(mov.created_at)}
            </TableCell>

            <TableCell className="text-center">
              <TipoMovimientoBadge tipo={mov.tipo} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableTraslados;
