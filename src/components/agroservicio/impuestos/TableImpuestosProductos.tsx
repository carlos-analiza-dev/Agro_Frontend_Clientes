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
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nombre</TableHead>
            <TableHead>Porcentaje</TableHead>
            <TableHead className="text-center">Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="h-28 text-center">
                Cargando impuestos...
              </TableCell>
            </TableRow>
          ) : impuestos.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={4}
                className="h-28 text-center text-muted-foreground"
              >
                No hay impuestos registrados.
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
                    Activo
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => handleEditImpuesto(impuesto)}
                      size="icon"
                      variant="outline"
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
