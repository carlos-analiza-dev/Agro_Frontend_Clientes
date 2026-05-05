import { Equipo } from "@/api/equipos-maquinaria/interface/response-equipos.interface";
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
import { EstadoMaquinaria } from "@/interfaces/enums/maquinaria/maquinaria.enums";
import { Edit, Edit2 } from "lucide-react";

interface Props {
  equipos: Equipo[];
  handleEditEquipo: (equipo: Equipo) => void;
  moneda: string;
}

const TableEquipos = ({ equipos, handleEditEquipo, moneda }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Código</TableHead>
          <TableHead>Nombre</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Marca/Modelo</TableHead>
          <TableHead>Costo</TableHead>
          <TableHead>Finca</TableHead>
          <TableHead>Horas Uso</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {equipos.map((eq) => (
          <TableRow key={eq.id}>
            <TableCell className="font-mono text-xs">
              {eq.codigoInterno || "N/A"}
            </TableCell>
            <TableCell className="font-medium">{eq.nombre}</TableCell>
            <TableCell>
              <Badge variant="outline" className="capitalize">
                {eq.tipo}
              </Badge>
            </TableCell>
            <TableCell>
              <div>
                <p className="text-sm">{eq.marca || "N/A"}</p>
                <p className="text-xs text-muted-foreground">
                  {eq.modelo || "N/A"}
                </p>
              </div>
            </TableCell>
            <TableCell>
              {moneda} {eq.costoCompra}
            </TableCell>
            <TableCell>{eq.finca?.nombre_finca || "Sin asignar"}</TableCell>
            <TableCell>
              <div className="flex flex-col">
                <span className="text-sm">
                  {Number(eq.horasUso).toFixed(1)} hrs
                </span>
                {eq.vidaUtilHoras && (
                  <span className="text-xs text-muted-foreground">
                    Vida útil: {Number(eq.vidaUtilHoras)} hrs
                  </span>
                )}
              </div>
            </TableCell>
            <TableCell>
              <Badge
                variant={
                  eq.estado === EstadoMaquinaria.ACTIVO
                    ? "default"
                    : eq.estado === EstadoMaquinaria.MANTENIMIENTO
                      ? "secondary"
                      : "destructive"
                }
                className={
                  eq.estado === EstadoMaquinaria.ACTIVO
                    ? "bg-green-500 hover:bg-green-600"
                    : eq.estado === EstadoMaquinaria.MANTENIMIENTO
                      ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                      : ""
                }
              >
                {eq.estado === EstadoMaquinaria.ACTIVO && "Activo"}
                {eq.estado === EstadoMaquinaria.MANTENIMIENTO &&
                  "Mantenimiento"}
                {eq.estado === EstadoMaquinaria.INCACTIVO && "Inactivo"}
              </Badge>
            </TableCell>
            <TableCell>
              <Button onClick={() => handleEditEquipo(eq)} variant={"ghost"}>
                <Edit />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableEquipos;
