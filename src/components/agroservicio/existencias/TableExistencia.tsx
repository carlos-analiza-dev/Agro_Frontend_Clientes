import { ResponseExistenciaProductosInterface } from "@/api/agroservicio/existencia_productos/interfaces/response-existencia-productos.interface";
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
  filteredData: ResponseExistenciaProductosInterface[];
}

const TableExistencia = ({ filteredData }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Producto</TableHead>
          <TableHead className="text-center">Codigo de Barra</TableHead>
          <TableHead className="text-center">Sucursal</TableHead>
          <TableHead className="text-center">Inventario</TableHead>
          <TableHead className="text-center">Estado</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredData.map((item) => (
          <TableRow key={`${item.productoId}-${item.sucursalId}`}>
            <TableCell className="text-center">
              <div>
                <div className="font-medium">{item.productoNombre}</div>
                <div className="text-sm text-muted-foreground">
                  {item.codigo}
                </div>
              </div>
            </TableCell>
            <TableCell className="text-center">{item.codigo_barra}</TableCell>
            <TableCell className="text-center">{item.sucursalNombre}</TableCell>

            <TableCell className="text-center">
              {parseFloat(item.existenciaTotal).toFixed(2)}
            </TableCell>
            <TableCell className="text-center">
              <Badge
                variant={
                  parseFloat(item.existenciaTotal) > 10
                    ? "default"
                    : parseFloat(item.existenciaTotal) > 0
                      ? "secondary"
                      : "destructive"
                }
              >
                {parseFloat(item.existenciaTotal) > 10
                  ? "Disponible"
                  : parseFloat(item.existenciaTotal) > 0
                    ? "Bajo stock"
                    : "Agotado"}
              </Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default TableExistencia;
