import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Permiso } from "@/api/permisos/interface/response-permisos.interface";
import { useTranslations } from "next-intl";

interface TablePermisosClienteProps {
  permisosDisponibles: Permiso[];
  permisosSeleccionados: string[];
  handleSeleccionarPermiso: (permisoId: string) => void;
}

const TablePermisosCliente = ({
  permisosDisponibles,
  permisosSeleccionados,
  handleSeleccionarPermiso,
}: TablePermisosClienteProps) => {
  const t = useTranslations("tablePermisosCliente");

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("columns.select")}</TableHead>
          <TableHead>{t("columns.module")}</TableHead>
          <TableHead>{t("columns.description")}</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {permisosDisponibles.map((permiso) => (
          <TableRow key={permiso.id}>
            <TableCell>
              <Checkbox
                checked={permisosSeleccionados.includes(permiso.id)}
                onCheckedChange={() => handleSeleccionarPermiso(permiso.id)}
                aria-label={t("selectPermission", {
                  module: permiso.modulo,
                })}
              />
            </TableCell>

            <TableCell>
              <p className="font-medium">{permiso.modulo}</p>
            </TableCell>

            <TableCell>
              <p className="text-sm text-gray-600">{permiso.descripcion}</p>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TablePermisosCliente;
