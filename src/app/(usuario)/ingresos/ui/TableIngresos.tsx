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
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getCategoriaIngresoColor } from "@/helpers/funciones/getCategoriaColor";
import { getMetodoPagoLabel } from "@/helpers/funciones/getMetodoPago";
import { Ingreso } from "@/api/finanzas/ingresos/interface/response-ingresos.interface";

interface TablaImgresosProps {
  ingresos: Ingreso[];
  isLoading: boolean;
  moneda?: string;
  handleEditIngreso: (ingreso: Ingreso) => void;
}

export function TableIngresos({
  ingresos,
  isLoading,
  moneda = "L",
  handleEditIngreso,
}: TablaImgresosProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full" />
        ))}
      </div>
    );
  }

  if (!ingresos || ingresos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="bg-gray-50 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4">
          <DollarSign className="h-10 w-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          No hay ingresos registrados
        </h3>
        <p className="text-gray-600">
          Comienza registrando tu primer ingreso usando el botón "Nuevo Ingreso"
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
          {ingresos.map((ingreso) => (
            <TableRow key={ingreso.id} className="hover:bg-gray-50">
              <TableCell className="whitespace-nowrap">
                {ingreso.fecha_ingreso}
              </TableCell>
              <TableCell>
                <Badge className={getCategoriaIngresoColor(ingreso.categoria)}>
                  {ingreso.categoria.replace(/_/g, " ")}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[200px]">
                <div>
                  <p className="font-medium truncate">{ingreso.concepto}</p>
                  {ingreso.descripcion && (
                    <p className="text-xs text-gray-500 truncate">
                      {ingreso.descripcion}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>{ingreso.fincaNombre || "—"}</TableCell>
              <TableCell>{ingreso.especieNombre || "—"}</TableCell>
              <TableCell className="font-semibold text-red-600 whitespace-nowrap">
                {moneda}{" "}
                {ingreso.monto.toLocaleString("es-HN", {
                  minimumFractionDigits: 2,
                })}
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {getMetodoPagoLabel(ingreso.metodo_pago)}
                </Badge>
              </TableCell>

              <TableCell className="text-sm text-gray-600">
                <Button
                  onClick={() => handleEditIngreso(ingreso)}
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
