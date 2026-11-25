import { Lote } from "@/api/agroservicio/lotes/interfaces/response-lotes-sucursal.interface";
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
import { ArrowLeftRight } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  filteredLotes: Lote[];
  moneda: string;
  handleTransferir: (lote: Lote) => void;
}

const TableLotes = ({ filteredLotes, moneda, handleTransferir }: Props) => {
  const t = useTranslations("tableLotes");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">{t("columns.product")}</TableHead>
          <TableHead className="text-center">{t("columns.code")}</TableHead>
          <TableHead className="text-center">{t("columns.branch")}</TableHead>
          <TableHead className="text-center">{t("columns.quantity")}</TableHead>
          <TableHead className="text-center">{t("columns.unitCost")}</TableHead>
          <TableHead className="text-center">
            {t("columns.originCost")}
          </TableHead>
          <TableHead className="text-center">{t("columns.status")}</TableHead>
          <TableHead className="text-center">{t("columns.actions")}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredLotes.map((lote) => (
          <TableRow key={lote.id}>
            <TableCell className="font-medium text-center">
              {lote.nombre_producto}
            </TableCell>

            <TableCell className="text-center">
              <Badge variant="outline" className="font-mono">
                {lote.codigo_producto}
              </Badge>
            </TableCell>

            <TableCell className="text-center">
              {lote.nombre_sucursal}
            </TableCell>

            <TableCell className="text-center font-semibold">
              {lote.cantidad}
            </TableCell>

            <TableCell className="text-center">
              {moneda}
              {lote.costo_por_unidad?.toFixed(2) || "0.00"}
            </TableCell>

            <TableCell className="text-center">
              {moneda}
              {lote.costo?.toFixed(2) || "0.00"}
            </TableCell>

            <TableCell className="text-center">
              <Badge
                variant={lote.cantidad <= 5 ? "destructive" : "default"}
                className={
                  lote.cantidad <= 10 && lote.cantidad > 5
                    ? "bg-yellow-500 hover:bg-yellow-600"
                    : ""
                }
              >
                {lote.cantidad <= 5
                  ? t("status.low")
                  : lote.cantidad <= 10
                    ? t("status.limited")
                    : t("status.sufficient")}
              </Badge>
            </TableCell>

            <TableCell className="text-center">
              <Button
                id="acciones-lotes"
                onClick={() => handleTransferir(lote)}
                variant="outline"
              >
                <ArrowLeftRight /> {t("actions.transfers")}
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableLotes;
