import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { format } from "date-fns";
import { Servicio } from "@/api/reproduccion/interfaces/response-servicio-repoductivo.interface";
import TipoServicioBadge from "./TipoServicioBadge";
import EstadoBadge from "./EstadoBadge";
import { useState } from "react";
import Modal from "@/components/generics/Modal";
import { estadoReproductivo } from "@/helpers/data/estadoServicioReproductivo";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateServicioReproductivoInterface } from "@/api/reproduccion/interfaces/crear-servicio-reproductivo.interface";
import { EditarServicioReproductivo } from "@/api/reproduccion/accions/servicios/editar-servicio-reproductivo";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { EstadoServicio } from "@/interfaces/enums/servicios-reproductivos.enum";

interface Props {
  servicios: Servicio[];
  onVerDetalle?: (servicio: Servicio) => void;
}

const VistaTabla = ({ servicios, onVerDetalle }: Props) => {
  const queryClient = useQueryClient();
  const [selectedServicio, setSelectedServicio] = useState<Servicio | null>(
    null,
  );
  const [openModal, setOpenModal] = useState(false);
  const [selectedEstado, setSelectedEstado] = useState<string>("");

  const mutation = useMutation({
    mutationFn: (data: Partial<CreateServicioReproductivoInterface>) =>
      EditarServicioReproductivo(selectedServicio?.id || "", data),
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

  const handleEstadoChange = (estadoValue: string, checked: boolean) => {
    if (checked) {
      setSelectedEstado(estadoValue);
    }
  };

  const handleActualizarEstado = () => {
    if (!selectedServicio || !selectedEstado) return;

    mutation.mutate({
      estado: selectedEstado as any,
    });
  };

  const getEstadoExitoso = () => {
    if (!selectedServicio) return false;
    return selectedServicio.exitoso;
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
                {servicio.macho?.identificador || "N/A"}
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
              <TableCell className="text-right">
                <Button
                  variant="ghost"
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
            <Card>
              <CardHeader>
                <CardTitle>Estado del Servicio</CardTitle>
                <CardDescription>
                  Actualiza el estado actual del servicio reproductivo
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {estadoReproductivo.map((estado) => (
                      <div
                        key={estado.id}
                        className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <Switch
                          id={estado.label}
                          checked={selectedEstado === estado.value}
                          onCheckedChange={(checked) =>
                            handleEstadoChange(estado.value, checked)
                          }
                        />
                        <Label
                          htmlFor={estado.label}
                          className="flex-1 cursor-pointer"
                        >
                          <div>
                            <p className="font-medium">{estado.label}</p>
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setOpenModal(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleActualizarEstado}
                      disabled={mutation.isPending || !selectedEstado}
                    >
                      {mutation.isPending
                        ? "Actualizando..."
                        : "Actualizar Estado"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resultado">
            <Card>
              <CardHeader>
                <CardTitle>Resultado del Servicio</CardTitle>
                <CardDescription>
                  Marca si el servicio fue exitoso o no. Esto afectará el estado
                  del celo asociado.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <Label
                        htmlFor="exitoso"
                        className="text-base font-medium"
                      >
                        Servicio Exitoso
                      </Label>
                      <p className="text-sm text-gray-500">
                        Marcar como exitoso si la hembra quedó preñada después
                        de este servicio
                      </p>
                    </div>
                    <Switch
                      id="exitoso"
                      checked={selectedServicio?.exitoso || false}
                      onCheckedChange={handleExitosoChange}
                      disabled={mutation.isPending}
                    />
                  </div>

                  {selectedServicio?.exitoso && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                      <p className="text-sm text-green-800">
                        ✅ Este servicio está marcado como exitoso. El estado
                        del celo asociado se actualizará a PREÑADO.
                      </p>
                    </div>
                  )}

                  {selectedServicio &&
                    !selectedServicio.exitoso &&
                    selectedServicio.estado !== "PROGRAMADO" && (
                      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <p className="text-sm text-yellow-800">
                          ⚠️ Este servicio está marcado como no exitoso. Si se
                          confirma que la hembra no quedó preñada, el estado del
                          celo asociado se actualizará a NO_FECUNDADO.
                        </p>
                      </div>
                    )}

                  <div className="flex justify-end gap-2 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setOpenModal(false)}
                    >
                      Cerrar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </Modal>
    </div>
  );
};

export default VistaTabla;
