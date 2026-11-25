"use client";

import { ResponseExistenciaProductosInterface } from "@/api/agroservicio/existencia_productos/interfaces/response-existencia-productos.interface";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";

interface Props {
  filteredData: ResponseExistenciaProductosInterface[];
}

const TableExistencia = ({ filteredData }: Props) => {
  const t = useTranslations("tableExistenciaProductos");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">{t("columns.product")}</TableHead>
          <TableHead className="text-center">{t("columns.barcode")}</TableHead>
          <TableHead className="text-center">{t("columns.branch")}</TableHead>
          <TableHead className="text-center">
            {t("columns.inventory")}
          </TableHead>
          <TableHead className="text-center">{t("columns.status")}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {filteredData.map((item) => (
          <TableRow key={`${item.productoId}-${item.sucursalId}`}>
            <TableCell className="text-center">
              <div>
                <div className="font-medium">{item.productoNombre}</div>
                <div className="text-sm text-muted-foreground">
                  {item.codigo}
                </div>
              </div>
            </TableCell>

            <TableCell className="text-center">{item.codigo_barra}</TableCell>

            <TableCell className="text-center">{item.sucursalNombre}</TableCell>

            <TableCell className="text-center">
              {parseFloat(item.existenciaTotal).toFixed(2)}
            </TableCell>

            <TableCell className="text-center">
              <Badge
                variant={
                  parseFloat(item.existenciaTotal) > 10
                    ? "default"
                    : parseFloat(item.existenciaTotal) > 0
                      ? "secondary"
                      : "destructive"
                }
              >
                {parseFloat(item.existenciaTotal) > 10
                  ? t("status.available")
                  : parseFloat(item.existenciaTotal) > 0
                    ? t("status.lowStock")
                    : t("status.outOfStock")}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableExistencia;
