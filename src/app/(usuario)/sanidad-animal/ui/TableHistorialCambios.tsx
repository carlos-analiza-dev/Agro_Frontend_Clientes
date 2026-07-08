import { Historial } from "@/api/sanidad-animal/interface/response-historial-cambios-sanidad";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDate } from "@/helpers/funciones/formatDate";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import { Calendar, Clock, User, History } from "lucide-react";

interface Props {
  historial: Historial[] | undefined;
  isMobile: boolean;
  total?: number;
}

const TableHistorialCambios = ({ historial, isMobile, total }: Props) => {
  if (!historial || historial.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground border rounded-lg">
        <History className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
        <p>No hay cambios registrados en el historial</p>
      </div>
    );
  }

  const getTipoCambioLabel = (tipo: string) => {
    return tipo === "fecha_evento" ? "Fecha del Evento" : "Próxima Fecha";
  };

  const getTipoCambioColor = (tipo: string) => {
    return tipo === "fecha_evento"
      ? "bg-blue-100 text-blue-800 border-blue-200"
      : "bg-purple-100 text-purple-800 border-purple-200";
  };

  const getDiasDiferenciaColor = (dias: number) => {
    if (dias > 0) return "bg-green-100 text-green-800 border-green-200";
    if (dias < 0) return "bg-red-100 text-red-800 border-red-200";
    return "bg-gray-100 text-gray-800 border-gray-200";
  };

  const getDiasDiferenciaLabel = (dias: number) => {
    if (dias === 0) return "Mismo día";
    if (dias > 0) return `+${dias} día${dias > 1 ? "s" : ""}`;
    return `${dias} día${dias < -1 ? "s" : ""}`;
  };

  return (
    <>
      {isMobile ? (
        <div className="space-y-4">
          {historial.map((item) => (
            <div
              key={item.id}
              className="rounded-xl border bg-background p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Badge className={getTipoCambioColor(item.tipo_cambio)}>
                    {getTipoCambioLabel(item.tipo_cambio)}
                  </Badge>
                  <Badge
                    className={getDiasDiferenciaColor(item.dias_diferencia)}
                  >
                    {getDiasDiferenciaLabel(item.dias_diferencia)}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground">
                  {formatDate(item.fecha_cambio)}
                </span>
              </div>

              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">Servicio / Animal</p>
                  <p className="font-medium">
                    {item.sanidad?.tipo_servicio || "N/A"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.sanidad?.animal?.nombre_animal ||
                      item.sanidad?.animal?.identificador ||
                      item.sanidad?.animal?.galpon ||
                      item.sanidad?.animal?.lote ||
                      "Sin identificar"}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-muted-foreground">Fecha anterior</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="line-through text-muted-foreground">
                        {formatDate(item.fecha_anterior)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <p className="text-muted-foreground">Fecha nueva</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-blue-500" />
                      <span className="font-medium text-blue-600">
                        {formatDate(item.fecha_nueva)}
                      </span>
                    </div>
                  </div>
                </div>

                {item.motivo_cambio && (
                  <div className="bg-gray-50 p-2 rounded-lg">
                    <p className="text-xs text-muted-foreground">Motivo</p>
                    <p className="text-sm">{item.motivo_cambio}</p>
                  </div>
                )}

                <div className="flex items-center gap-2 text-xs text-muted-foreground border-t pt-2">
                  <User className="h-3 w-3" />
                  <span>{item.usuario || "Usuario desconocido"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border">
          <Table className="min-w-[1000px]">
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead>Animal / Galpón / Lote</TableHead>
                <TableHead>Tipo de Cambio</TableHead>
                <TableHead>Fecha Anterior</TableHead>
                <TableHead>Fecha Nueva</TableHead>
                <TableHead>Diferencia</TableHead>
                <TableHead>Motivo</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Fecha Cambio</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {historial.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {item.sanidad?.tipo_servicio || "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.sanidad?.responsable && (
                          <span>Resp: {item.sanidad.responsable}</span>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div>
                      <div className="font-medium">
                        {item.sanidad?.animal?.nombre_animal ||
                          item.sanidad?.animal?.galpon ||
                          item.sanidad?.animal?.lote ||
                          "N/A"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {item.sanidad?.animal?.identificador
                          ? `ID: ${item.sanidad.animal.identificador}`
                          : item.sanidad?.animal?.galpon
                            ? `Galpón: ${item.sanidad.animal.galpon}`
                            : item.sanidad?.animal?.lote
                              ? `Lote: ${item.sanidad.animal.lote}`
                              : "Sin identificación"}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge className={getTipoCambioColor(item.tipo_cambio)}>
                      {getTipoCambioLabel(item.tipo_cambio)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground line-through">
                        {formatDate(item.fecha_anterior)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-blue-500" />
                      <span className="font-medium text-blue-600">
                        {formatDate(item.fecha_nueva)}
                      </span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <Badge
                      className={getDiasDiferenciaColor(item.dias_diferencia)}
                    >
                      {getDiasDiferenciaLabel(item.dias_diferencia)}
                    </Badge>
                  </TableCell>

                  <TableCell>
                    <div className="max-w-[150px]">
                      <p
                        className="text-sm truncate"
                        title={item.motivo_cambio || "Sin motivo"}
                      >
                        {item.motivo_cambio || "-"}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{item.usuario || "N/A"}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {formatDateOnly(item.fecha_cambio)}
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {total && total > 0 && (
        <div className="mt-4 text-sm text-muted-foreground">
          Total de cambios: <span className="font-medium">{total}</span>
        </div>
      )}
    </>
  );
};

export default TableHistorialCambios;
