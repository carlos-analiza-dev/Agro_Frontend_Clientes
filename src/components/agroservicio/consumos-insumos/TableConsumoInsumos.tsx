"use client";

import { ResponseConsumoInsumoInterface } from "@/api/agroservicio/consumo-insumos/interface/response-consumo-insumo.interface";
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
  consumo: ResponseConsumoInsumoInterface;
}

const TableConsumoInsumos = ({ consumo }: Props) => {
  const t = useTranslations("tableConsumoInsumos");

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("columns.supply")}</TableHead>
            <TableHead>{t("columns.quantity")}</TableHead>
            <TableHead>{t("columns.branch")}</TableHead>
            <TableHead>{t("columns.consumptionDate")}</TableHead>
            <TableHead>{t("columns.batch")}</TableHead>
            <TableHead>{t("columns.observation")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consumo?.data.map((item: any) => (
            <TableRow key={item.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {item.insumo?.nombre || t("values.notAvailable")}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal">
                  {item.cantidad}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {item.sucursal?.nombre || t("values.notAvailable")}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{item.fecha_consumo}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {item.lote?.cantidad || t("values.notAvailable")}
                  {item.lote?.cantidad ? ` ${t("values.units")}` : ""}
                </span>
              </TableCell>
              <TableCell className="max-w-xs">
                <span className="text-sm line-clamp-2">
                  {item.observacion || t("values.emptyObservation")}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableConsumoInsumos;
