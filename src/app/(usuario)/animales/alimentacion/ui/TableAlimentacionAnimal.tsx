import { Alimento } from "@/api/alimentacion_animal/interface/response-alimentacion.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Props {
  alimentos: Alimento[];
  totalCosto: number;
  moneda: string | undefined;
}

const TableAlimentacionAnimal = ({ alimentos, totalCosto, moneda }: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-center">Alimento</TableHead>
          <TableHead className="text-center">Origen</TableHead>
          <TableHead className="text-center">Cantidad</TableHead>
          <TableHead className="text-center">Unidad</TableHead>
          <TableHead className="text-center">Costo Diario</TableHead>
          <TableHead className="text-center">Fecha</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {alimentos.map((alimento) => (
          <TableRow key={alimento.id}>
            <TableCell className="text-center">
              {alimento.tipoAlimento}
            </TableCell>
            <TableCell className="text-center">{alimento.origen}</TableCell>
            <TableCell className="text-center">{alimento.cantidad}</TableCell>
            <TableCell className="text-center">{alimento.unidad}</TableCell>
            <TableCell className="text-center">
              {moneda} {alimento.costo_diario}
            </TableCell>
            <TableCell className="text-center">{alimento.fecha}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={4}>Costo Total Diario por Animal</TableCell>
          <TableCell className="text-center">
            {moneda} {totalCosto}
          </TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  );
};

export default TableAlimentacionAnimal;
