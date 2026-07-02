import { editarCultivo } from "@/api/cultivos/accions/editar-cultivo";
import { Cultivo } from "@/api/cultivos/interface/response-cultivos.interface";
import Modal from "@/components/generics/Modal";
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
  CheckCircle2,
  XCircle,
  Eye,
  Flag,
  Leaf,
} from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import DetallesCultivoModal from "./DetallesCultivoModal";
import { cn } from "@/lib/utils";

interface Props {
  cultivo: Cultivo;
  estado: { label: string; variant: string };
  handleEditCultivo: (cultivo: Cultivo) => void;
  moneda: string;
}

const CloudBadge = ({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: "default" | "outline" | "success" | "warning" | "destructive";
  className?: string;
}) => {
  const variants = {
    default: "bg-green-50/80 text-green-700 border-green-200/50",
    outline:
      "bg-white/50 text-gray-600 border-gray-200/50 hover:border-green-200/50",
    success: "bg-green-50/80 text-green-700 border-green-200/50",
    warning: "bg-amber-50/80 text-amber-700 border-amber-200/50",
    destructive: "bg-red-50/80 text-red-700 border-red-200/50",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium backdrop-blur-sm border transition-all duration-200",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  );
};

const InfoItem = ({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: React.ElementType;
  label?: string;
  value: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "flex items-center gap-2 text-sm transition-all duration-200",
      "p-2 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-100/50",
      "hover:bg-green-50/40 hover:border-green-200/50",
      className,
    )}
  >
    <div className="flex h-7 w-7 items-center justify-center rounded-full bg-green-50/80 text-green-600 shrink-0">
      <Icon className="h-3.5 w-3.5" />
    </div>
    <div className="flex flex-col min-w-0">
      {label && (
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
          {label}
        </span>
      )}
      <span className="text-sm font-medium text-gray-700 truncate">
        {value}
      </span>
    </div>
  </div>
);

const CloudButton = ({
  children,
  onClick,
  variant = "outline",
  icon: Icon,
  className,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "outline" | "ghost" | "default";
  icon?: React.ElementType;
  className?: string;
}) => {
  const variants = {
    outline:
      "bg-white/50 hover:bg-green-50/80 border-gray-200/50 hover:border-green-200/50 text-gray-600 hover:text-green-600",
    ghost: "hover:bg-green-50/80 text-gray-500 hover:text-green-600",
    default:
      "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-[0_4px_16px_rgba(34,197,94,0.25)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.35)]",
  };

  return (
    <Button
      onClick={onClick}
      variant="ghost"
      className={cn(
        "rounded-full px-4 py-1.5 h-auto text-xs font-medium backdrop-blur-sm border transition-all duration-300",
        "hover:scale-105 active:scale-95",
        variants[variant],
        className,
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 mr-1.5" />}
      {children}
    </Button>
  );
};

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
        "Ocurrió un error al momento de cambiar el estado del cultivo",
      );
    }
  };

  const handleViewDetails = (cultivo: Cultivo) => {
    setModalViewDetails(true);
    setSelectedCultivo(cultivo);
  };

  return (
    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-4 sm:p-6 bg-white/80 backdrop-blur-sm rounded-2xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300 hover:shadow-[0_8px_32px_rgba(0,0,0,0.06)] hover:-translate-y-0.5">
      <div className="flex-1 space-y-3 w-full">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <Leaf className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
              {cultivo.tipo_cultivo}
            </h3>
          </div>

          {cultivo.variedad && (
            <CloudBadge variant="outline" className="text-xs">
              {cultivo.variedad}
            </CloudBadge>
          )}

          <CloudBadge variant={estado.variant as any}>
            {estado.label}
          </CloudBadge>

          <CloudBadge variant={cultivo.isActive ? "success" : "destructive"}>
            {cultivo.isActive ? (
              <>
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Activo
              </>
            ) : (
              <>
                <XCircle className="h-3 w-3 mr-1" />
                Finalizado
              </>
            )}
          </CloudBadge>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          <InfoItem
            icon={MapPin}
            label="Finca"
            value={cultivo.finca?.nombre_finca}
          />

          <InfoItem
            icon={Ruler}
            label="Área"
            value={`${cultivo.area_sembrada} ${cultivo.unidad_medida}`}
          />

          <InfoItem
            icon={Calendar}
            label="Siembra"
            value={formatDate(cultivo.fecha_siembra)}
          />

          {cultivo.fecha_cosecha_estimada && (
            <InfoItem
              icon={CalendarDays}
              label="Cosecha estimada"
              value={formatDate(cultivo.fecha_cosecha_estimada)}
            />
          )}

          {cultivo.temporada && (
            <InfoItem
              icon={Sprout}
              label="Temporada"
              value={cultivo.temporada}
            />
          )}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto lg:flex-nowrap">
        <CloudButton
          onClick={() => handleEditCultivo(cultivo)}
          variant="outline"
          icon={Edit}
        >
          Editar
        </CloudButton>

        <CloudButton
          onClick={() => handleViewDetails(cultivo)}
          variant="outline"
          icon={Eye}
        >
          Detalles
        </CloudButton>

        {cultivo.isActive && (
          <CloudButton
            onClick={() => setOpenModalStatus(true)}
            variant="default"
            icon={Flag}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-[0_4px_16px_rgba(245,158,11,0.25)]"
          >
            Finalizar
          </CloudButton>
        )}
      </div>

      <Modal
        open={openModalStatus}
        onOpenChange={setOpenModalStatus}
        title="¿Deseas marcar el cultivo como finalizado?"
        description="Una vez marques el cultivo como finalizado no se podrá cambiar dicha acción"
        size="xl"
      >
        <div className="flex flex-col sm:flex-row gap-3 justify-end">
          <Button
            onClick={() => setOpenModalStatus(false)}
            variant="outline"
            className="rounded-full px-6"
          >
            Cancelar
          </Button>
          <Button
            onClick={() => handleUpdateStatus(!cultivo.isActive)}
            className="rounded-full px-6 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-[0_4px_16px_rgba(245,158,11,0.25)]"
          >
            <Flag className="h-4 w-4 mr-2" />
            Confirmar Finalización
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
