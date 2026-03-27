import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, PencilIcon } from "lucide-react";
import { format } from "date-fns";
import { Servicio } from "@/api/reproduccion/interfaces/response-servicio-repoductivo.interface";
import TipoServicioBadge from "./TipoServicioBadge";
import EstadoBadge from "./EstadoBadge";
import { Dispatch, SetStateAction, useState } from "react";
import Modal from "@/components/generics/Modal";
import { TipoServicio } from "@/interfaces/enums/servicios-reproductivos.enum";
import FormServicioReproductivo from "./FormServicioReproductivo";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";

interface Props {
  servicios: Servicio[];
  hembras: Animal[];
  machos: Animal[];
  setSelectedServicio: Dispatch<SetStateAction<Servicio | null>>;
  selectedServicio: Servicio | null;
  handleOpenModal: (servicio: Servicio) => void;
}

const VistaTabla = ({
  servicios,
  hembras,
  machos,
  handleOpenModal,
  selectedServicio,
  setSelectedServicio,
}: Props) => {
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const handleOpenModalEdit = (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setOpenModalEdit(true);
  };

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Hembra</TableHead>
            <TableHead>Macho</TableHead>
            <TableHead className="hidden lg:table-cell">Tipo</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead className="hidden md:table-cell">N°</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Resultado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {servicios.map((servicio) => (
            <TableRow key={servicio.id}>
              <TableCell className="font-medium whitespace-nowrap">
                {servicio.hembra.identificador}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {servicio.tipo_servicio !== TipoServicio.MONTA_NATURAL
                  ? servicio.proveedor_semen
                  : servicio.macho?.identificador}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <TipoServicioBadge tipo={servicio.tipo_servicio} />
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {format(new Date(servicio.fecha_servicio), "dd/MM/yy HH:mm")}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                #{servicio.numero_servicio}
              </TableCell>
              <TableCell>
                <EstadoBadge estado={servicio.estado} />
              </TableCell>
              <TableCell>
                {servicio.exitoso ? (
                  <Badge className="bg-green-100 text-green-800 border-0">
                    Exitoso
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-gray-500">
                    No exitoso
                  </Badge>
                )}
              </TableCell>
              <TableCell className="flex justify-end gap-4">
                <Button
                  variant="ghost"
                  title="Editar"
                  size="sm"
                  onClick={() => handleOpenModalEdit(servicio)}
                >
                  <PencilIcon className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  title="Detalles"
                  size="sm"
                  onClick={() => handleOpenModal(servicio)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        open={openModalEdit}
        onOpenChange={setOpenModalEdit}
        title="Editar Datos del Servicio"
        description="Aqui podras editar datos del servicio reproductivo"
        size="xl"
      >
        <FormServicioReproductivo
          hembras={hembras}
          machos={machos}
          setOpenModal={setOpenModalEdit}
          servicio={selectedServicio}
          onSuccess={() => setOpenModalEdit(true)}
        />
      </Modal>
    </div>
  );
};

export default VistaTabla;
