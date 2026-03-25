import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, PencilIcon } from "lucide-react";
import { format } from "date-fns";
import { Servicio } from "@/api/reproduccion/interfaces/response-servicio-repoductivo.interface";
import TipoServicioBadge from "./TipoServicioBadge";
import EstadoBadge from "./EstadoBadge";
import { useState } from "react";
import Modal from "@/components/generics/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EditarServicioReproductivoEstados } from "@/api/reproduccion/accions/servicios/editar-servicio-reproductivo";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import {
  EstadoServicio,
  TipoServicio,
} from "@/interfaces/enums/servicios-reproductivos.enum";
import { CreateServiciosReproductivo } from "@/api/reproduccion/interfaces/crear-servicio-reproductivo.interface";
import FormServicioReproductivo from "./FormServicioReproductivo";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import CardTabEstado from "./CardTabEstado";
import CardTabResultado from "./CardTabResultado";

interface Props {
  servicios: Servicio[];
  hembras: Animal[];
  machos: Animal[];
  onVerDetalle?: (servicio: Servicio) => void;
}

const VistaTabla = ({ servicios, onVerDetalle, hembras, machos }: Props) => {
  const queryClient = useQueryClient();
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(
    null,
  );
  const [openModal, setOpenModal] = useState(false);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState<string>("");

  const mutation = useMutation({
    mutationFn: (data: Partial<CreateServiciosReproductivo>) =>
      EditarServicioReproductivoEstados(selectedServicio?.id || "", data),
    onSuccess: () => {
      toast.success("Estado del servicio actualizado exitosamente");
      queryClient.invalidateQueries({ queryKey: ["servicios-reproductivos"] });
      setOpenModal(false);
      setSelectedServicio(null);
      setSelectedEstado("");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el estado";

        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    },
  });

  const handleOpenModal = (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setSelectedEstado(servicio.estado);
    setOpenModal(true);
  };

  const handleOpenModalEdit = (servicio: Servicio) => {
    setSelectedServicio(servicio);
    setOpenModalEdit(true);
  };

  const handleEstadoChange = (estadoValue: string, checked: boolean) => {
    if (checked) {
      setSelectedEstado(estadoValue);
    }
  };

  const handleActualizarEstado = () => {
    if (!selectedServicio || !selectedEstado) return;

    if (selectedServicio.exitoso) {
      toast.warn(
        "Este servicio ya fue marcado como exitoso y su estado no puede modificarse",
      );
      return;
    }

    mutation.mutate({
      estado: selectedEstado as any,
    });
  };

  const handleExitosoChange = (checked: boolean) => {
    if (!selectedServicio) return;

    if (checked && selectedServicio.estado === EstadoServicio.FALLIDO) {
      toast.warning(
        "No se puede marcar como exitoso un servicio que está en estado FALLIDO",
      );
      return;
    }

    if (checked && selectedServicio.estado === EstadoServicio.CANCELADO) {
      toast.warning(
        "No se puede marcar como exitoso un servicio que está en estado CANCELADO",
      );
      return;
    }

    if (
      checked &&
      selectedServicio.estado !== EstadoServicio.REALIZADO &&
      selectedServicio.estado === EstadoServicio.PROGRAMADO
    ) {
      toast.info(
        "Para marcar como exitoso, primero cambia el estado a REALIZADO",
      );
      return;
    }

    mutation.mutate({
      exitoso: checked,
    });
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
        title="Acciones del Servicio"
        description="Aquí ejecutarás acciones sobre tu servicio reproductivo"
        open={openModal}
        onOpenChange={setOpenModal}
        size="2xl"
      >
        <Tabs defaultValue="estado">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="estado">Estado del Servicio</TabsTrigger>
            <TabsTrigger value="resultado">Resultado</TabsTrigger>
          </TabsList>

          <TabsContent value="estado">
            <CardTabEstado
              selectedEstado={selectedEstado}
              handleEstadoChange={handleEstadoChange}
              setOpenModal={setOpenModal}
              handleActualizarEstado={handleActualizarEstado}
              isPending={mutation.isPending}
            />
          </TabsContent>

          <TabsContent value="resultado">
            <CardTabResultado
              setOpenModal={setOpenModal}
              selectedServicio={selectedServicio}
              isPending={mutation.isPending}
              handleExitosoChange={handleExitosoChange}
            />
          </TabsContent>
        </Tabs>
      </Modal>
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
