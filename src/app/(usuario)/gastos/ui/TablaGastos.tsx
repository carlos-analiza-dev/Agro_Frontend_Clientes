"use client";

import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Pencil } from "lucide-react";
import { Gastos } from "@/api/finanzas/gastos/interface/gastos-response.interface";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getCategoriaColor } from "@/helpers/funciones/getCategoriaColor";
import { getMetodoPagoLabel } from "@/helpers/funciones/getMetodoPago";

interface TablaGastosProps {
  gastos: Gastos[];
  isLoading: boolean;
  moneda?: string;
  handleEditGasto: (gasto: Gastos) => void;
}

export function TablaGastos({
  gastos,
  isLoading,
  moneda = "L",
  handleEditGasto,
}: TablaGastosProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!gastos || gastos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <DollarSign className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay gastos registrados
        </h3>
        <p className="text-gray-600">
          Comienza registrando tu primer gasto usando el botón "Nuevo Gasto"
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Concepto</TableHead>
            <TableHead>Finca</TableHead>
            <TableHead>Especie</TableHead>
            <TableHead>Monto</TableHead>
            <TableHead>Método Pago</TableHead>

            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {gastos.map((gasto) => (
            <TableRow key={gasto.id} className="hover:bg-gray-50">
              <TableCell className="whitespace-nowrap">
                {gasto.fecha_gasto}
              </TableCell>
              <TableCell>
                <Badge className={getCategoriaColor(gasto.categoria)}>
                  {gasto.categoria.replace(/_/g, " ")}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[200px]">
                <div>
                  <p className="font-medium truncate">{gasto.concepto}</p>
                  {gasto.descripcion && (
                    <p className="text-xs text-gray-500 truncate">
                      {gasto.descripcion}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>{gasto.fincaNombre || "—"}</TableCell>
              <TableCell>{gasto.especieNombre || "—"}</TableCell>
              <TableCell className="font-semibold text-red-600 whitespace-nowrap">
                {moneda}{" "}
                {gasto.monto.toLocaleString("es-HN", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getMetodoPagoLabel(gasto.metodo_pago)}
                </Badge>
              </TableCell>

              <TableCell className="text-sm text-gray-600">
                <Button
                  onClick={() => handleEditGasto(gasto)}
                  variant={"ghost"}
                >
                  <Pencil /> Editar
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
