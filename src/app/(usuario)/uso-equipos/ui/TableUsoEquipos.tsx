import { UsosEquipo } from "@/api/uso-equipos/interfaces/response-uso-equipos.interface";
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
import { formatDateTimeLocal } from "@/helpers/funciones/formatDateOnly";
import { formatHorasTrabajadas } from "@/helpers/funciones/uso-equipos/formatHoras";
import { Edit2Icon } from "lucide-react";

interface Props {
  usosEquipo: UsosEquipo[];
  handleEdit: (uso: UsosEquipo) => void;
}

const TableUsoEquipos = ({ usosEquipo, handleEdit }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Equipo</TableHead>
          <TableHead>Operador</TableHead>
          <TableHead>Actividad</TableHead>
          <TableHead>Fecha Inicio</TableHead>
          <TableHead>Fecha Fin</TableHead>
          <TableHead>Horas</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {usosEquipo.map((uso) => (
          <TableRow key={uso.id}>
            <TableCell className="font-medium">
              <div>
                <div>{uso.equipo.nombre}</div>
                <div className="text-xs text-muted-foreground">
                  {uso.equipo.marca} {uso.equipo.modelo}
                </div>
              </div>
            </TableCell>
            <TableCell>
              {uso.operador ? (
                <div>
                  <div>{uso.operador.nombre}</div>
                  <div className="text-xs text-muted-foreground">
                    {uso.operador.email}
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground">No asignado</span>
              )}
            </TableCell>
            <TableCell>
              {uso.actividad ? (
                <div className="max-w-xs">
                  <p className="truncate">{uso.actividad.descripcion}</p>
                </div>
              ) : (
                <span className="text-muted-foreground">No asignada</span>
              )}
            </TableCell>
            <TableCell>{formatDateTimeLocal(uso.fechaInicio)}</TableCell>
            <TableCell>{formatDateTimeLocal(uso.fechaFin)}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {formatHorasTrabajadas(uso.horasTrabajadas)}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEdit(uso)}
                >
                  <Edit2Icon className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableUsoEquipos;
