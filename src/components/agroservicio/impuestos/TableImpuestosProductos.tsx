"use client";

import { ImpuestosAgroProductosInterface } from "@/api/agroservicio/impuestos/interface/response-impuestos-agroservicio.interface";
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
import { Pencil } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  isLoading: boolean;
  impuestos: ImpuestosAgroProductosInterface[];
  handleEditImpuesto: (impuesto: ImpuestosAgroProductosInterface) => void;
}

const TableImpuestosProductos = ({
  impuestos,
  isLoading,
  handleEditImpuesto,
}: Props) => {
  const t = useTranslations("tableImpuestosProductos");

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("columns.name")}</TableHead>
            <TableHead>{t("columns.percentage")}</TableHead>
            <TableHead className="text-center">{t("columns.status")}</TableHead>
            <TableHead className="text-right">{t("columns.actions")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-28 text-center">
                {t("loading")}
              </TableCell>
            </TableRow>
          ) : impuestos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-28 text-center text-muted-foreground"
              >
                {t("empty")}
              </TableCell>
            </TableRow>
          ) : (
            impuestos.map((impuesto) => (
              <TableRow key={impuesto.id}>
                <TableCell className="font-medium">{impuesto.nombre}</TableCell>

                <TableCell>
                  <Badge variant="secondary" className="text-sm">
                    {Number(impuesto.porcentaje).toFixed(2)}%
                  </Badge>
                </TableCell>

                <TableCell className="text-center">
                  <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                    {t("status.active")}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      id="edit-impuesto"
                      onClick={() => handleEditImpuesto(impuesto)}
                      size="icon"
                      variant="outline"
                      title={t("actions.edit")}
                      aria-label={t("actions.edit")}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableImpuestosProductos;
