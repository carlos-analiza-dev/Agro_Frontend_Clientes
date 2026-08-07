import { ResponseConsumoInsumoInterface } from "@/api/agroservicio/consumo-insumos/interface/response-consumo-insumo.interface";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  consumo: ResponseConsumoInsumoInterface;
}

const TableConsumoInsumos = ({ consumo }: Props) => {
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Insumo</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Sucursal</TableHead>
            <TableHead>Fecha Consumo</TableHead>
            <TableHead>Lote</TableHead>
            <TableHead>Observación</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {consumo?.data.map((item: any) => (
            <TableRow key={item.id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                {item.insumo?.nombre || "N/A"}
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className="font-normal">
                  {item.cantidad}
                </Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {item.sucursal?.nombre || "N/A"}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm">{item.fecha_consumo}</span>
              </TableCell>
              <TableCell>
                <span className="text-sm">
                  {item.lote?.cantidad || "N/A"} unidades
                </span>
              </TableCell>
              <TableCell className="max-w-xs">
                <span className="text-sm line-clamp-2">
                  {item.observacion || "-"}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableConsumoInsumos;
