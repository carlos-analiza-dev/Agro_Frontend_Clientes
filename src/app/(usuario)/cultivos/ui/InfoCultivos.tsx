import { editarCultivo } from "@/api/cultivos/accions/editar-cultivo";
import { Cultivo } from "@/api/cultivos/interface/response-cultivos.interface";
import Modal from "@/components/generics/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDate } from "@/helpers/funciones/formatDate";
import { useQueryClient } from "@tanstack/react-query";
import {
  Calendar,
  CalendarDays,
  Edit,
  MapPin,
  Ruler,
  Sprout,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import DetallesCultivoModal from "./DetallesCultivoModal";

interface Props {
  cultivo: Cultivo;
  estado: { label: string; variant: string };
  handleEditCultivo: (cultivo: Cultivo) => void;
  moneda: string;
}

const InfoCultivos = ({
  cultivo,
  estado,
  handleEditCultivo,
  moneda,
}: Props) => {
  const queryClient = useQueryClient();
  const [openModalStatus, setOpenModalStatus] = useState(false);
  const [selectedCultivo, setSelectedCultivo] = useState<Cultivo | null>(null);
  const [ModalViewDetails, setModalViewDetails] = useState(false);
  const handleUpdateStatus = async (estado: boolean) => {
    try {
      await editarCultivo(cultivo.id, { isActive: estado });
      toast.success("El cultivo se ha marcado como finalizado");
      queryClient.invalidateQueries({ queryKey: ["cultivos"] });
      setOpenModalStatus(false);
    } catch (error) {
      toast.error(
        "Ocurrio un error al momento de cambiar el estado del cultivo",
      );
    }
  };

  const handleViewDetails = (cultivo: Cultivo) => {
    setModalViewDetails(true);
    setSelectedCultivo(cultivo);
  };

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h3 className="text-lg font-semibold">{cultivo.tipo_cultivo}</h3>
          {cultivo.variedad && (
            <Badge variant="outline">{cultivo.variedad}</Badge>
          )}
          <Badge variant={estado.variant as any}>{estado.label}</Badge>
          <Badge variant={cultivo.isActive ? "default" : "destructive"}>
            {cultivo.isActive ? "Activo" : "Finalizado"}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{cultivo.finca?.nombre_finca}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Ruler className="h-4 w-4" />
            <span>
              {cultivo.area_sembrada} {cultivo.unidad_medida}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>
              Siembra:{" "}
              {formatDate(cultivo.fecha_siembra) &&
                formatDate(cultivo.fecha_siembra)}
            </span>
          </div>
          {cultivo.fecha_cosecha_estimada && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <CalendarDays className="h-4 w-4" />
              <span>
                Cosecha estimada: {formatDate(cultivo.fecha_cosecha_estimada)}
              </span>
            </div>
          )}
          {cultivo.temporada && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Sprout className="h-4 w-4" />
              <span>Temporada: {cultivo.temporada}</span>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          onClick={() => handleEditCultivo(cultivo)}
          variant="outline"
          size="sm"
        >
          <Edit />
        </Button>
        <Button
          onClick={() => handleViewDetails(cultivo)}
          variant="outline"
          size="sm"
        >
          Mas Detalles
        </Button>
        {cultivo.isActive && (
          <Button
            onClick={() => setOpenModalStatus(true)}
            variant="outline"
            size="sm"
          >
            Marcar Finalizado
          </Button>
        )}
      </div>

      <Modal
        open={openModalStatus}
        onOpenChange={setOpenModalStatus}
        title="¿Deseas marcar el cultivo como finalizado?"
        description="Una vez marques el cultivo como finalizado no se podrá cambiar dicha acción"
        size="xl"
      >
        <div className="flex justify-end">
          <Button onClick={() => handleUpdateStatus(!cultivo.isActive)}>
            Confirmar
          </Button>
        </div>
      </Modal>

      <Modal
        open={ModalViewDetails}
        onOpenChange={setModalViewDetails}
        title="Detalles de tu cultivo"
        description="Aquí podrás observar detalladamente toda la información de tu cultivo"
        size="4xl"
      >
        {selectedCultivo && (
          <DetallesCultivoModal cultivo={selectedCultivo} moneda={moneda} />
        )}
      </Modal>
    </div>
  );
};

export default InfoCultivos;
