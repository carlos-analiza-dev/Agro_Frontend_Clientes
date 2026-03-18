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
import { Eye } from "lucide-react";
import { format } from "date-fns";
import React, { Dispatch, SetStateAction } from "react";
import RenderIntensidadBadge from "./RenderIntensidadBadge";
import {
  Celo,
  ResponseCelosAnimalInterface,
} from "@/api/reproduccion/interfaces/response-celos-animal,interface";
import Modal from "@/components/generics/Modal";
import DetailsCelo from "./DetailsCelo";

interface Props {
  data: ResponseCelosAnimalInterface | undefined;
  setSelectedCelo: Dispatch<SetStateAction<Celo | null>>;
  setDetalleOpen: Dispatch<SetStateAction<boolean>>;
  detalleOpen: boolean;
  selectedCelo: Celo | null;
}

const TableCelos = ({
  data,
  setSelectedCelo,
  setDetalleOpen,
  detalleOpen,
  selectedCelo,
}: Props) => {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Animal</TableHead>
            <TableHead>Especie</TableHead>
            <TableHead>Finca</TableHead>
            <TableHead>Inicio</TableHead>
            <TableHead>Fin</TableHead>
            <TableHead>N° Celo</TableHead>
            <TableHead>Intensidad</TableHead>
            <TableHead>Método</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.celos?.map((celo) => (
            <TableRow key={celo.id}>
              <TableCell className="font-medium">
                {celo.animal.identificador}
              </TableCell>
              <TableCell>{celo.animal.especie.nombre}</TableCell>
              <TableCell>{celo.animal.finca.nombre_finca}</TableCell>
              <TableCell>
                {format(new Date(celo.fechaInicio), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>
                {celo.fechaFin ? (
                  format(new Date(celo.fechaFin), "dd/MM/yyyy HH:mm")
                ) : (
                  <Badge variant="secondary">Activo</Badge>
                )}
              </TableCell>
              <TableCell>{celo.numeroCelo}</TableCell>
              <TableCell>
                <RenderIntensidadBadge intensidad={celo.intensidad} />
              </TableCell>
              <TableCell>{celo.metodo_deteccion}</TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCelo(celo);
                    setDetalleOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Modal
        open={detalleOpen}
        onOpenChange={setDetalleOpen}
        title="Detalles del Celo"
        description="Información completa del registro de celo"
        size="lg"
      >
        {selectedCelo && <DetailsCelo selectedCelo={selectedCelo} />}
      </Modal>
    </>
  );
};

export default TableCelos;
