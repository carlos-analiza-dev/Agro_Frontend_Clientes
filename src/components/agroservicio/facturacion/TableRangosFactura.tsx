import { Rangos } from "@/api/agroservicio/facturacion/interface/response-agro-rangos-factura.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  calcularUso,
  estaProximoVencer,
  estaVencido,
  getUsoColor,
} from "@/helpers/funciones/agroservicio/facturacion/rangos_factura";
import {
  AlertCircle,
  Calendar,
  Eye,
  Hash,
  MoreVertical,
  Pencil,
  TrendingUp,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  filteredRangos: Rangos[];
  setSelectedRango: Dispatch<SetStateAction<Rangos | null>>;
  setIsViewDialogOpen: Dispatch<SetStateAction<boolean>>;
  handleEditRango: (rango: Rangos) => void;
}

const TableRangosFactura = ({
  filteredRangos,
  setIsViewDialogOpen,
  setSelectedRango,
  handleEditRango,
}: Props) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>CAI</TableHead>
            <TableHead>Prefijo</TableHead>
            <TableHead>Rango</TableHead>
            <TableHead>Correlativo</TableHead>
            <TableHead>Uso</TableHead>
            <TableHead>Fechas</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredRangos.map((rango: Rangos) => {
            const uso = calcularUso(rango);
            const proximoVencer = estaProximoVencer(rango.fecha_limite_emision);
            const vencido = estaVencido(rango.fecha_limite_emision);
            const usoColor = getUsoColor(uso);

            return (
              <TableRow key={rango.id}>
                <TableCell className="font-mono text-sm">{rango.cai}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {rango.prefijo}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Hash className="h-3 w-3 text-gray-400" />
                    <span className="font-mono text-sm">
                      {rango.rango_inicial} - {rango.rango_final}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-3 w-3 text-gray-400" />
                    <span className="font-mono text-sm">
                      {rango.correlativo_actual}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${usoColor}`}
                        style={{ width: `${Math.min(uso, 100)}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium">{uso}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span>Inicio: {rango.fecha_recepcion}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span>Límite: {rango.fecha_limite_emision}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <Badge
                      variant={rango.is_active ? "default" : "secondary"}
                      className={
                        rango.is_active
                          ? "bg-green-100 text-green-700 hover:bg-green-100"
                          : "bg-gray-100 text-gray-700"
                      }
                    >
                      {rango.is_active ? "Activo" : "Inactivo"}
                    </Badge>
                    {vencido && (
                      <Badge
                        variant="destructive"
                        className="w-full justify-center"
                      >
                        Vencido
                      </Badge>
                    )}
                    {proximoVencer && !vencido && (
                      <Badge
                        variant="destructive"
                        className="w-full justify-center bg-yellow-100 text-yellow-700"
                      >
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Próximo a vencer
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        id="acciones-rango"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                      >
                        <span className="sr-only">Abrir menú</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => {
                          setSelectedRango(rango);
                          setIsViewDialogOpen(true);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalles
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEditRango(rango)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableRangosFactura;
