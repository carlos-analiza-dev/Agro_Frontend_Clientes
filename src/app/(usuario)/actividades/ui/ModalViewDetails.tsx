import { Actividade } from "@/api/actividades/interfaces/response-actividades.interface";
import Modal from "@/components/generics/Modal";
import { Dispatch, SetStateAction, useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { formatDate } from "@/helpers/funciones/formatDate";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";

interface Props {
  showViewDetails: boolean;
  setShowViewDetails: Dispatch<SetStateAction<boolean>>;
  selectedActividad: Actividade | null;
}

const ModalViewDetails = ({
  showViewDetails,
  setShowViewDetails,
  selectedActividad,
}: Props) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showFullImage, setShowFullImage] = useState(false);

  if (!selectedActividad) return null;

  const {
    fecha,
    tipo,
    estado,
    frecuencia,
    descripcion,
    completada,
    propietario,
    finca,
    trabajador,
    fotos,
    createdAt,
  } = selectedActividad;

  const tipoConfig = {
    fumigacion: {
      color: "bg-orange-100 text-orange-800 border-orange-200",
      icon: AlertCircle,
    },
    limpieza: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: CheckCircle,
    },
    riego: {
      color: "bg-cyan-100 text-cyan-800 border-cyan-200",
      icon: Calendar,
    },
    cosecha: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
    },
    mantenimiento: {
      color: "bg-purple-100 text-purple-800 border-purple-200",
      icon: AlertCircle,
    },
  };

  const estadoConfig = {
    pendiente: {
      color: "bg-yellow-100 text-yellow-800 border-yellow-200",
      icon: AlertCircle,
      texto: "Pendiente",
    },
    en_proceso: {
      color: "bg-blue-100 text-blue-800 border-blue-200",
      icon: Clock,
      texto: "En Proceso",
    },
    completada: {
      color: "bg-green-100 text-green-800 border-green-200",
      icon: CheckCircle,
      texto: "Completada",
    },
    cancelada: {
      color: "bg-red-100 text-red-800 border-red-200",
      icon: XCircle,
      texto: "Cancelada",
    },
  };

  const currentConfig =
    tipoConfig[tipo as keyof typeof tipoConfig] || tipoConfig.fumigacion;
  const currentEstadoConfig =
    estadoConfig[estado as keyof typeof estadoConfig] || estadoConfig.pendiente;
  const TipoIcon = currentConfig.icon;
  const EstadoIcon = currentEstadoConfig.icon;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? fotos.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev === fotos.length - 1 ? 0 : prev + 1));
  };

  const getFrecuenciaTexto = (frec: string) => {
    const frecuencias = {
      diaria: "Diaria",
      semanal: "Semanal",
      quincenal: "Quincenal",
      mensual: "Mensual",
      unica: "Única vez",
    };
    return frecuencias[frec as keyof typeof frecuencias] || frec;
  };

  return (
    <Modal
      open={showViewDetails}
      onOpenChange={setShowViewDetails}
      title="Detalles de la Actividad"
      size="4xl"
      height="lg"
      showCloseButton={true}
    >
      <div className="space-y-6 max-h-[calc(100vh-12rem)] overflow-y-auto px-1">
        <div className="flex flex-wrap justify-between items-start gap-4 pb-4 border-b">
          <div className="space-y-2">
            <Badge
              className={`${currentConfig.color} text-sm font-medium px-3 py-1`}
            >
              <TipoIcon className="w-4 h-4 mr-1" />
              {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
            </Badge>
            <div className="flex items-center gap-2 mt-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                Creado: {formatDateOnly(createdAt)}
              </span>
            </div>
          </div>
          <Badge
            className={`${currentEstadoConfig.color} text-sm font-medium px-3 py-1`}
          >
            <EstadoIcon className="w-4 h-4 mr-1" />
            {currentEstadoConfig.texto}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-[#A0714C] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Fecha programada
                </p>
                <p className="text-gray-900 font-semibold">
                  {formatDate(fecha)}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#A0714C] mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-500">Frecuencia</p>
                <p className="text-gray-900">
                  {getFrecuenciaTexto(frecuencia)}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              {completada ? (
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              ) : (
                <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
              )}
              <div>
                <p className="text-sm font-medium text-gray-500">
                  Estado de tarea
                </p>
                <p className="text-gray-900 font-semibold">
                  {completada ? "Completada" : "No completada aún"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {descripcion && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#A0714C]" />
              <h3 className="font-semibold text-gray-900">Descripción</h3>
            </div>
            <p className="text-gray-700 bg-gray-50 p-4 rounded-lg leading-relaxed">
              {descripcion}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <User className="w-5 h-5 text-[#A0714C]" />
              Información del Propietario
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-500">Nombre:</span>{" "}
                <span className="font-medium text-gray-900">
                  {propietario.nombre}
                </span>
              </p>
              <p className="text-sm flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span className="text-gray-500">Teléfono:</span>{" "}
                <span className="font-medium text-gray-900">
                  {propietario.telefono}
                </span>
              </p>
            </div>
          </div>

          <div className="space-y-3 bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-[#A0714C]" />
              Información de la Finca
            </h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="text-gray-500">Nombre:</span>{" "}
                <span className="font-medium text-gray-900">
                  {finca.nombre_finca}
                </span>
              </p>
              <p className="text-sm">
                <span className="text-gray-500">Ubicación:</span>{" "}
                <span className="font-medium text-gray-900">
                  {finca.ubicacion}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-lg">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <User className="w-5 h-5 text-[#A0714C]" />
            Trabajador Asignado
          </h3>
          <p className="text-gray-900 font-medium">{trabajador.nombre}</p>
        </div>

        {fotos && fotos.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#A0714C]" />
                <h3 className="font-semibold text-gray-900">
                  Fotos de la Actividad ({fotos.length})
                </h3>
              </div>
            </div>

            <div className="relative bg-gray-100 rounded-lg overflow-hidden">
              <div className="relative h-96">
                <img
                  src={fotos[currentImageIndex]?.url}
                  alt={`Foto ${currentImageIndex + 1}`}
                  className="w-full h-full object-contain cursor-pointer"
                  onClick={() => setShowFullImage(true)}
                />

                {fotos.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </div>

              {fotos.length > 1 && (
                <div className="flex gap-2 p-4 overflow-x-auto bg-white">
                  {fotos.map((foto, idx) => (
                    <button
                      key={foto.id}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`relative w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                        currentImageIndex === idx
                          ? "border-[#A0714C] ring-2 ring-[#A0714C]/20"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <img
                        src={foto.url}
                        alt={`Miniatura ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {(!fotos || fotos.length === 0) && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              No hay fotos disponibles para esta actividad
            </p>
          </div>
        )}

        {showFullImage && fotos[currentImageIndex] && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setShowFullImage(false)}
          >
            <div className="relative max-w-7xl w-full">
              <img
                src={fotos[currentImageIndex].url}
                alt="Vista completa"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
              <button
                onClick={() => setShowFullImage(false)}
                className="absolute top-4 right-4 text-white bg-black/50 hover:bg-black/70 p-2 rounded-full transition-all"
              >
                <XCircle className="w-6 h-6" />
              </button>
              {fotos.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default ModalViewDetails;
