"use client";
import { useState, useRef, use } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  MapPin,
  User,
  CheckCircle2,
  Image as Image_Icon,
  Eye,
  MoreVertical,
  X,
  Trash,
  Loader,
  ImagePlus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import { Actividade } from "@/api/actividades/interfaces/response-actividades.interface";
import {
  getEstadoConfig,
  getTipoIcon,
} from "@/helpers/funciones/actividades/actividades";
import { EstadoActividad } from "@/interfaces/enums/actividaes.enums";
import { eliminarActividad } from "@/api/actividades/accions/eliminar-actividad";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { formatDate } from "@/helpers/funciones/formatDate";
import { editarActividad } from "@/api/actividades/accions/editar-actividad";
import { allowedTransitions } from "@/helpers/funciones/actividades/allowedTransitions";
import { uploadImagesActividad } from "@/api/actividades/accions/upload-image";
import ModalViewFotos from "./ModalViewFotos";
import ModalUploadImages from "./ModalUploadImages";
import ModalViewDetails from "./ModalViewDetails";
import { Cliente } from "@/interfaces/auth/cliente";
import { TipoCliente } from "@/interfaces/enums/clientes.enums";

interface Props {
  actividad: Actividade;
  isPropietario: boolean;
  trabajadorId: string;
  handleEditActividad: (actividad: Actividade) => void;
  cliente: Cliente | undefined;
}

const TarjetaActividad = ({
  actividad,
  isPropietario,
  handleEditActividad,
  cliente,
}: Props) => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [showFotos, setShowFotos] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showViewDetails, setShowViewDetails] = useState(false);
  const [selectedActividad, setSelectedActividad] = useState<Actividade | null>(
    null,
  );

  const estadoConfig = getEstadoConfig(actividad.estado);
  const EstadoIcon = estadoConfig.icon;

  const canChangeEstado = (current: EstadoActividad, next: EstadoActividad) => {
    return allowedTransitions[current]?.includes(next);
  };

  const handleDeleteActividad = async (actividadId: string) => {
    try {
      await eliminarActividad(actividadId);
      queryClient.invalidateQueries({ queryKey: ["actividades"] });
      toast.success("Actividad Eliminada con Exito");
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      } else {
        toast.error("Error al eliminar la actividad");
      }
    }
  };

  const handleStatusActividad = async (
    actividadId: string,
    nuevoEstado: EstadoActividad,
  ) => {
    if (!canChangeEstado(actividad.estado, nuevoEstado)) {
      toast.error("Transición de estado no permitida");
      return;
    }

    try {
      await editarActividad(actividadId, { estado: nuevoEstado });
      queryClient.invalidateQueries({ queryKey: ["actividades"] });
      toast.success("Actividad Actualizada con Exito");
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage = error.response?.data?.message;
        toast.error(errorMessage);
      } else {
        toast.error("Error al actualizar la actividad");
      }
    }
  };

  const handleSelectImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const filesArray = Array.from(selectedFiles);

    const validFiles = filesArray.filter((file) => {
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`La imagen ${file.name} es demasiado grande (máx 5MB)`);
        return false;
      }
      return true;
    });

    setFiles(validFiles);

    const urls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls(urls);
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewUrls[index]);

    const newFiles = files.filter((_, i) => i !== index);
    const newPreviewUrls = previewUrls.filter((_, i) => i !== index);

    setFiles(newFiles);
    setPreviewUrls(newPreviewUrls);

    if (newFiles.length === 0 && fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadImages = async () => {
    if (files.length === 0) {
      toast.error("Selecciona al menos una imagen");
      return;
    }

    setIsUploading(true);

    try {
      const base64Images = await Promise.all(
        files.map(
          (file) =>
            new Promise<string>((resolve, reject) => {
              const reader = new FileReader();
              reader.readAsDataURL(file);
              reader.onload = () => resolve(reader.result as string);
              reader.onerror = (error) => reject(error);
            }),
        ),
      );

      await uploadImagesActividad(base64Images, actividad.id);

      queryClient.invalidateQueries({ queryKey: ["actividades"] });
      toast.success("Imágenes subidas correctamente");

      setFiles([]);
      setPreviewUrls([]);
      setShowUploadModal(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      toast.error("Error al subir imágenes");
    } finally {
      setIsUploading(false);
    }
  };

  const closeUploadModal = () => {
    previewUrls.forEach((url) => URL.revokeObjectURL(url));
    setFiles([]);
    setPreviewUrls([]);
    setShowUploadModal(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setShowFotos(true);
  };

  const nextImage = () => {
    if (currentImageIndex < actividad.fotos.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const handleViewDetails = (actividad: Actividade) => {
    setSelectedActividad(actividad);
    setShowViewDetails(true);
  };

  return (
    <div>
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-l-4 border-l-blue-500">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{getTipoIcon(actividad.tipo)}</span>
              <div>
                <p className="text-sm text-gray-500 capitalize">
                  {actividad.tipo}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className={`${estadoConfig.color} border-0`}>
                <EstadoIcon className="w-3 h-3 mr-1" />
                {estadoConfig.label}
              </Badge>
              {cliente?.rol === TipoCliente.SUPERVISOR && (
                <Button
                  variant="ghost"
                  size="sm"
                  title="Subir Imagenes"
                  onClick={() => setShowUploadModal(true)}
                >
                  <ImagePlus className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {actividad.descripcion && (
            <p className="text-sm text-gray-600 line-clamp-2">
              {actividad.descripcion}
            </p>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(actividad.fecha)}</span>
            {actividad.frecuencia && (
              <Badge variant="outline" className="ml-2">
                {actividad.frecuencia}
              </Badge>
            )}
          </div>

          {actividad.finca && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{actividad.finca.nombre_finca}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>
              {cliente?.id === actividad.trabajador?.id
                ? "Tú"
                : actividad.trabajador?.nombre}
            </span>
          </div>

          {actividad.fotos && actividad.fotos.length > 0 && (
            <div className="flex items-center gap-2">
              <Image_Icon className="w-4 h-4" />
              <span className="text-sm text-gray-600">
                {actividad.fotos.length} foto(s)
              </span>
              <Button
                variant="link"
                size="sm"
                className="h-auto p-0"
                onClick={() => openImageViewer(0)}
              >
                Ver fotos
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="pt-0 flex justify-between">
          <div className="text-xs text-gray-400">
            Creado: {formatDateOnly(actividad.createdAt)}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleViewDetails(actividad)}>
                <Eye className="w-4 h-4 mr-2" />
                Ver detalles
              </DropdownMenuItem>
              {actividad.estado === EstadoActividad.PENDIENTE &&
                !isPropietario && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleStatusActividad(
                        actividad.id,
                        EstadoActividad.EN_PROCESO,
                      )
                    }
                  >
                    <Loader className="w-4 h-4 mr-2" />
                    Iniciar actividad
                  </DropdownMenuItem>
                )}

              {actividad.estado === EstadoActividad.EN_PROCESO && (
                <DropdownMenuItem
                  onClick={() =>
                    handleStatusActividad(
                      actividad.id,
                      EstadoActividad.COMPLETADA,
                    )
                  }
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Marcar como completada
                </DropdownMenuItem>
              )}

              {isPropietario &&
                actividad.estado !== EstadoActividad.COMPLETADA &&
                actividad.estado !== EstadoActividad.CANCELADA && (
                  <DropdownMenuItem
                    onClick={() =>
                      handleStatusActividad(
                        actividad.id,
                        EstadoActividad.CANCELADA,
                      )
                    }
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </DropdownMenuItem>
                )}

              {isPropietario &&
                actividad.estado !== EstadoActividad.COMPLETADA &&
                actividad.estado !== EstadoActividad.CANCELADA && (
                  <DropdownMenuItem
                    onClick={() => handleDeleteActividad(actividad.id)}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    Eliminar
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        </CardFooter>
      </Card>

      <ModalUploadImages
        showUploadModal={showUploadModal}
        closeUploadModal={closeUploadModal}
        fileInputRef={fileInputRef}
        handleSelectImages={handleSelectImages}
        previewUrls={previewUrls}
        removeImage={removeImage}
        handleUploadImages={handleUploadImages}
        files={files}
        isUploading={isUploading}
      />

      <ModalViewFotos
        showFotos={showFotos}
        setShowFotos={setShowFotos}
        actividad={actividad}
        currentImageIndex={currentImageIndex}
        prevImage={prevImage}
        nextImage={nextImage}
        setCurrentImageIndex={setCurrentImageIndex}
      />
      <ModalViewDetails
        showViewDetails={showViewDetails}
        setShowViewDetails={setShowViewDetails}
        selectedActividad={selectedActividad}
      />
    </div>
  );
};

export default TarjetaActividad;
