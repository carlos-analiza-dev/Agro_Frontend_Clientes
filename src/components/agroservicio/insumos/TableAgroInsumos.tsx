import {
  AgroInsumo,
  ResponseAgroInsumos,
} from "@/api/agroservicio/insumos/interfaces/response-agro-insumos.interface";
import Modal from "@/components/generics/Modal";
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
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import { Cog, Edit, Package, Truck } from "lucide-react";
import { useState } from "react";
import OptionsInsumos from "../escalas-insumos/OptionsInsumos";

interface Props {
  insumosData: ResponseAgroInsumos | undefined;
  handleEditInsumo: (insumo: AgroInsumo) => void;
  moneda: string;
  propietarioId: string;
}

const TableAgroInsumos = ({
  insumosData,
  handleEditInsumo,
  moneda,
  propietarioId,
}: Props) => {
  const [openModalEscala, setOpenModalEscala] = useState(false);
  const [selectedInsumo, setSelectedInsumo] = useState<AgroInsumo | null>(null);
  const handleOpenModal = (insumo: AgroInsumo) => {
    setOpenModalEscala(true);
    setSelectedInsumo(insumo);
  };
  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800">
            <TableHead className="font-semibold">Código</TableHead>
            <TableHead className="font-semibold">Nombre</TableHead>
            <TableHead className="font-semibold">Marca</TableHead>
            <TableHead className="font-semibold">Proveedor</TableHead>
            <TableHead className="font-semibold text-right">Costo</TableHead>
            <TableHead className="font-semibold">Unidad</TableHead>
            <TableHead className="font-semibold">Fecha</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {!insumosData?.insumos || insumosData.insumos.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Package className="h-12 w-12 text-gray-300" />
                  <p className="text-sm font-medium">
                    No hay insumos registrados
                  </p>
                  <p className="text-xs text-gray-400">
                    Comienza agregando tu primer insumo
                  </p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            insumosData.insumos.map((insumo) => (
              <TableRow
                key={insumo.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
              >
                <TableCell className="font-mono text-xs">
                  <Badge variant="outline" className="font-mono">
                    {insumo.codigo}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium">{insumo.nombre}</TableCell>
                <TableCell>{insumo.marca?.nombre || "N/A"}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Truck className="h-3 w-3 text-gray-400" />
                    <span className="text-sm truncate max-w-[120px]">
                      {insumo.proveedor?.nombre_legal || "N/A"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(insumo.costo, moneda)}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className="capitalize">
                    {insumo.unidad_venta}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm">
                  {formatDateOnly(insumo.createdAt)}
                </TableCell>
                <TableCell>
                  <Badge
                    variant={insumo.disponible ? "default" : "destructive"}
                    className="capitalize"
                  >
                    {insumo.disponible ? "Disponible" : "No disponible"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    onClick={() => handleOpenModal(insumo)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    title="Configuracion"
                  >
                    <Cog className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleEditInsumo(insumo)}
                    type="button"
                    variant={"ghost"}
                  >
                    <Edit className="mr-2 h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <Modal
        open={openModalEscala}
        onOpenChange={setOpenModalEscala}
        title={`Gestionar Datos del Insumo - ${selectedInsumo?.nombre}`}
        description=" En esta seccion podras gestionar diferentes datos de los insumos"
        size="6xl"
        height="auto"
      >
        <div className="flex-1">
          <OptionsInsumos
            selectedInsumo={selectedInsumo}
            moneda={moneda}
            propietarioId={propietarioId}
          />
        </div>
      </Modal>
    </div>
  );
};

export default TableAgroInsumos;
