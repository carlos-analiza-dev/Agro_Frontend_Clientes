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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTimeLocal } from "@/helpers/funciones/formatDateOnly";
import { formatHorasTrabajadas } from "@/helpers/funciones/uso-equipos/formatHoras";
import { Edit2Icon, Calendar, User, Wrench, Clock } from "lucide-react";

interface Props {
  usosEquipo: UsosEquipo[];
  handleEdit: (uso: UsosEquipo) => void;
  isMobile: boolean;
}

const TableUsoEquipos = ({ usosEquipo, handleEdit, isMobile }: Props) => {
  if (isMobile) {
    return (
      <div className="space-y-4">
        {usosEquipo.map((uso) => (
          <Card key={uso.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start pr-8">
                <div className="flex-1">
                  <CardTitle className="text-base">
                    {uso.equipo.nombre}
                  </CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {uso.equipo.marca} {uso.equipo.modelo}
                  </p>
                </div>
              </div>
              <Button
                onClick={() => handleEdit(uso)}
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 h-8 w-8 p-0"
              >
                <Edit2Icon className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <User className="h-3.5 w-3.5" /> Operador
                </span>
                <div className="text-right flex-1 ml-4">
                  {uso.operador ? (
                    <div>
                      <div className="text-sm font-medium">
                        {uso.operador.nombre}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {uso.operador.email}
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No asignado
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-start">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Wrench className="h-3.5 w-3.5" /> Actividad
                </span>
                <div className="text-right flex-1 ml-4">
                  {uso.actividad ? (
                    <p className="text-sm break-words">
                      {uso.actividad.descripcion}
                    </p>
                  ) : (
                    <span className="text-sm text-muted-foreground">
                      No asignada
                    </span>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Inicio
                </span>
                <span className="text-sm">
                  {formatDateTimeLocal(uso.fechaInicio)}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" /> Fin
                </span>
                <span className="text-sm">
                  {formatDateTimeLocal(uso.fechaFin)}
                </span>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> Horas
                </span>
                <Badge variant="outline" className="text-sm">
                  {formatHorasTrabajadas(uso.horasTrabajadas)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
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
    </div>
  );
};

export default TableUsoEquipos;
