import { ResponsePermisosInterface } from "@/api/permisos/interface/response-permisos.interface";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";

interface Props {
  permisos_cliente: ResponsePermisosInterface[];
  handlePermisoChange: (
    permisoId: string,
    campo: string,
    valor: boolean,
  ) => Promise<void>;
  handleEliminarPermiso: (permisoId: string) => Promise<void>;
}

const TablePermisosAsignados = ({
  permisos_cliente,
  handlePermisoChange,
  handleEliminarPermiso,
}: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Módulo</TableHead>
          <TableHead className="text-center">Ver</TableHead>
          <TableHead className="text-center">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {permisos_cliente.map((permisoCliente) => (
          <TableRow key={permisoCliente.id}>
            <TableCell>
              <div>
                <p className="font-medium">{permisoCliente.permiso.modulo}</p>
                <p className="text-sm text-gray-500">
                  {permisoCliente.permiso.descripcion}
                </p>
              </div>
            </TableCell>
            <TableCell className="text-center">
              <Checkbox
                checked={permisoCliente.ver}
                onCheckedChange={(checked) =>
                  handlePermisoChange(
                    permisoCliente.id,
                    "ver",
                    checked as boolean,
                  )
                }
              />
            </TableCell>

            <TableCell className="text-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleEliminarPermiso(permisoCliente.id)}
                className="h-8 w-8 text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablePermisosAsignados;
