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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EstadoMaquinaria } from "@/interfaces/enums/maquinaria/maquinaria.enums";
import { Edit, Clock, DollarSign, MapPin } from "lucide-react";

interface Props {
  equipos: Equipo[];
  handleEditEquipo: (equipo: Equipo) => void;
  moneda: string;
  isMobile: boolean;
}

const TableEquipos = ({
  equipos,
  handleEditEquipo,
  moneda,
  isMobile,
}: Props) => {
  if (isMobile) {
    return (
      <div className="space-y-4">
        {equipos.map((eq) => (
          <Card key={eq.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{eq.nombre}</CardTitle>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    {eq.codigoInterno || "N/A"}
                  </p>
                </div>
                <Button
                  onClick={() => handleEditEquipo(eq)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tipo</span>
                <Badge variant="outline" className="capitalize text-xs">
                  {eq.tipo}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  Marca/Modelo
                </span>
                <span className="text-sm">
                  {eq.marca || "N/A"} {eq.modelo ? `/${eq.modelo}` : ""}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> Costo
                </span>
                <span className="text-sm font-medium">
                  {moneda} {eq.costoCompra}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Finca
                </span>
                <span className="text-sm">
                  {eq.finca?.nombre_finca || "Sin asignar"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Horas Uso
                </span>
                <div className="text-right">
                  <span className="text-sm">
                    {Number(eq.horasUso).toFixed(1)} hrs
                  </span>
                  {eq.vidaUtilHoras && (
                    <p className="text-xs text-muted-foreground">
                      Vida útil: {Number(eq.vidaUtilHoras)} hrs
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-sm text-muted-foreground">Estado</span>
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
    </div>
  );
};

export default TableEquipos;
