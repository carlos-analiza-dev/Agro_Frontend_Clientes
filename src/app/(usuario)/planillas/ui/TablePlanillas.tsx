import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { formatDate } from "@/helpers/funciones/formatDate";
import { AlertCircle, Calendar, Download, Edit, Eye } from "lucide-react";
import getEstadoBadgePlanilla from "./getEstadoBadgePlanilla";
import { Planilla } from "@/api/planillas-trabajadores/interfaces/response-planillas.interface";
import { GenerarPlanilla } from "@/api/planillas-trabajadores/accions/generar-planilla";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  planillas: Planilla[];
  moneda: string;
}

const TablePlanillas = ({ planillas, moneda }: Props) => {
  const queryClient = useQueryClient();
  const generatePlanilla = async (id: string) => {
    try {
      await GenerarPlanilla(id);
      toast.success("Planilla Generada Exitosamente");
      queryClient.invalidateQueries({ queryKey: ["planillas"] });
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al generar la planilla";

        toast.error(errorMessage, {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          style: { backgroundColor: "#fef2f2", color: "#991b1b" },
        });
      } else {
        const errorMsg = "Ocurrió un error al generar la planilla";

        toast.error(errorMsg);
      }
    }
  };
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Período</TableHead>
            <TableHead>Fecha Pago</TableHead>
            <TableHead>Total Neto</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Generar Planilla</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {planillas.map((planilla: Planilla) => (
            <TableRow key={planilla.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{planilla.nombre}</p>
                  <p className="text-sm text-muted-foreground">
                    {planilla.descripcion || "Sin descripción"}
                  </p>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">
                    {formatDate(planilla.fechaInicio)} -{" "}
                    {formatDate(planilla.fechaFin)}
                  </span>
                  <span className="text-xs text-muted-foreground capitalize">
                    {planilla.tipoPeriodo} ({planilla.diasPeriodo} días)
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {formatDate(planilla.fechaPago)}
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <p className="font-semibold text-green-600 dark:text-green-400">
                  {formatCurrency(planilla.totalNeto, moneda)}
                </p>
              </TableCell>

              <TableCell>{getEstadoBadgePlanilla(planilla.estado)}</TableCell>
              <TableCell>
                <Button
                  onClick={() => generatePlanilla(planilla.id)}
                  variant={"ghost"}
                >
                  Generar
                </Button>
              </TableCell>

              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-green-100 dark:hover:bg-green-900/30"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TablePlanillas;
