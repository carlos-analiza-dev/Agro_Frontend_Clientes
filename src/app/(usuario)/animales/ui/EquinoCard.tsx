"use client";

import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  CircleAlert,
  Heart,
  PawPrint,
  Award,
  Activity,
  Syringe,
  Scale,
  Dumbbell,
  Baby,
  Shield,
  Wallet,
  Dna,
  Dog,
  User,
  Calendar,
  Trophy,
  Ruler,
  Hash,
  MapPin,
  FileText,
  TrendingUp,
  Microscope,
  AlertTriangle,
  Stethoscope,
  Droplet,
  Scissors,
  BookOpen,
  Tag,
} from "lucide-react";
import { toast } from "react-toastify";
import { ActualizarAnimalMuerte } from "@/api/animales/accions/update-animal-status-muerte";
import { eliminarImagenAnimal } from "@/api/animales_profile/accions/delete-image-animal";
import ImageGallery from "@/components/generics/ImageGallery";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  animal: Animal;
  onEdit: () => void;
  onUpdateProfileImage: (imageUri: string, animalId: string) => Promise<void>;
}

const EquinoCard = ({ animal, onEdit, onUpdateProfileImage }: Props) => {
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const [deathDialogVisible, setDeathDialogVisible] = useState(false);
  const [deathStatus, setDeathStatus] = useState(animal.animal_muerte);
  const [deathReason, setDeathReason] = useState(animal.razon_muerte);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const imageUrl = animal.profileImages[0]?.url;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !animal.id) return;

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const imageDataUrl = event.target?.result as string;
        setLocalImage(imageDataUrl);

        if (onUpdateProfileImage) {
          await onUpdateProfileImage(imageDataUrl, animal.id);
          toast("Perfil de animal actualizado exitosamente");
          queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error("No se pudo actualizar la imagen de perfil");
      setLocalImage(null);
    }
  };

  const openGallery = () => {
    if (animal.profileImages && animal.profileImages.length > 0) {
      setGalleryVisible(true);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await eliminarImagenAnimal(imageId);
      toast("Foto de perfil del animal eliminada");
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      setGalleryVisible(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Error al eliminar la foto de perfil del animal",
        );
      }
    }
  };

  const handleDeathStatusUpdate = async () => {
    try {
      if (
        deathStatus &&
        (!deathReason || deathReason.trim() === "" || deathReason === "N/D")
      ) {
        toast.error(
          "Debe ingresar una razón de muerte válida (no puede estar vacía o ser 'N/D')",
        );
        return;
      }

      await ActualizarAnimalMuerte(animal.id, {
        animal_muerte: deathStatus,
        razon_muerte: deathReason,
      });

      toast(
        deathStatus
          ? "Animal marcado como fallecido"
          : "Animal marcado como vivo",
      );

      queryClient.invalidateQueries({
        queryKey: ["animales-propietario", animal.propietario.id],
      });
      setDeathDialogVisible(false);
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al actualizar el estado";

        toast(errorMessage);
      } else {
        toast("Contacte al administrador");
      }
    }
  };

  const getStatusColor = (status: string) => {
    const statusMap: Record<string, string> = {
      excelente: "bg-green-100 text-green-800 border-green-300",
      muy_buena: "bg-emerald-100 text-emerald-800 border-emerald-300",
      buena: "bg-blue-100 text-blue-800 border-blue-300",
      regular: "bg-yellow-100 text-yellow-800 border-yellow-300",
      mala: "bg-orange-100 text-orange-800 border-orange-300",
      muy_mala: "bg-red-100 text-red-800 border-red-300",
      caquexica: "bg-gray-100 text-gray-800 border-gray-300",
      obesa: "bg-purple-100 text-purple-800 border-purple-300",
    };
    return (
      statusMap[status?.toLowerCase()] ||
      "bg-gray-100 text-gray-800 border-gray-300"
    );
  };

  const formatAlzada = () => {
    if (!animal.alzada) return "N/A";
    const unidad = animal.unidad_alzada === "manos" ? "manos" : "cm";
    return `${animal.alzada} ${unidad}`;
  };

  return (
    <>
      <Card className="mb-4 overflow-hidden transition-all duration-200 hover:shadow-lg border-slate-200">
        <CardHeader className="p-3 sm:p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-slate-50 via-slate-100 to-gray-100">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <div className="relative flex-shrink-0">
              <Avatar
                className="h-12 w-12 sm:h-16 sm:w-16 cursor-pointer border-2 border-slate-300"
                onClick={openGallery}
              >
                <AvatarImage
                  src={localImage || imageUrl}
                  alt={animal.identificador}
                />
                <AvatarFallback className="bg-slate-200 text-slate-700 text-lg sm:text-xl">
                  {animal.identificador.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 bg-slate-600 rounded-full p-1 border-2 border-white shadow-sm">
                <Dog className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 sm:gap-2 flex-wrap">
                <CardTitle className="text-base sm:text-xl font-bold truncate text-slate-800">
                  {animal.identificador.toUpperCase()}
                </CardTitle>
                <Badge className="bg-slate-600 text-white text-[8px] sm:text-[10px]">
                  {animal.especie.nombre}
                </Badge>
                {animal.animal_muerte && (
                  <Badge
                    variant="destructive"
                    className="text-[8px] sm:text-[10px]"
                  >
                    Fallecido
                  </Badge>
                )}
                {animal.asegurado && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 text-[8px] sm:text-[10px]"
                  >
                    <Shield className="h-2.5 w-2.5 mr-0.5" />
                    Asegurado
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <p className="text-xs sm:text-sm text-slate-600 truncate">
                  {animal.razas.length === 1
                    ? animal.razas[0].nombre
                    : animal.razas.length > 1
                      ? "Encaste"
                      : "Sin raza"}{" "}
                  • {animal.sexo}
                </p>
                {animal.color && (
                  <Badge
                    variant="outline"
                    className="text-[8px] sm:text-[10px]"
                  >
                    {animal.color}
                  </Badge>
                )}
                {animal.edad_promedio && (
                  <Badge
                    variant="secondary"
                    className="text-[8px] sm:text-[10px]"
                  >
                    {animal.edad_promedio} años
                  </Badge>
                )}
              </div>
              {animal.nombre_animal && (
                <p className="text-xs sm:text-sm text-slate-500 truncate font-medium">
                  {animal.nombre_animal}
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-1 sm:space-x-2 flex-shrink-0">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/80 hover:bg-white"
              onClick={() => {
                setDeathStatus(animal.animal_muerte);
                setDeathReason(animal.razon_muerte);
                setDeathDialogVisible(true);
              }}
            >
              {animal.animal_muerte ? (
                <CircleAlert className="h-4 w-4 text-red-500" />
              ) : (
                <Heart className="h-4 w-4 text-red-500" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              title="Subir Foto"
              className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-white/80 hover:bg-white"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4 text-slate-600" />
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
        </CardHeader>

        <CardContent className="p-3 sm:p-4 pt-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-3">
            <InfoBadge icon={Hash} label="ID" value={animal.identificador} />
            <InfoBadge
              icon={Calendar}
              label="Nacimiento"
              value={
                animal.fecha_nacimiento
                  ? format(new Date(animal.fecha_nacimiento), "dd/MM/yyyy", {
                      locale: es,
                    })
                  : "N/A"
              }
            />
            <InfoBadge icon={Ruler} label="Alzada" value={formatAlzada()} />
            <InfoBadge
              icon={Scale}
              label="Peso"
              value={animal.peso_actual ? `${animal.peso_actual} kg` : "N/A"}
            />
          </div>

          <Separator className="my-3" />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-600" />
              <h4 className="text-sm font-semibold text-slate-700">
                Información Equina
              </h4>
              <Badge
                variant="outline"
                className="bg-slate-100 text-slate-600 border-slate-200 text-[8px] sm:text-[10px]"
              >
                Detalles
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-2">
                <EquinoInfoItem
                  icon={Syringe}
                  label="Desparasitado"
                  value={
                    <Badge
                      variant={animal.desparasitado ? "default" : "secondary"}
                      className="text-[10px] sm:text-xs"
                    >
                      {animal.desparasitado ? "Sí" : "No"}
                    </Badge>
                  }
                  show={animal.desparasitado !== undefined}
                />
                <EquinoInfoItem
                  icon={Syringe}
                  label="Vacunas"
                  value={animal.vacunas}
                  show={!!animal.vacunas && animal.vacunas !== "Sin vacunas"}
                />
                <EquinoInfoItem
                  icon={Stethoscope}
                  label="Veterinario"
                  value={animal.veterinario}
                  show={!!animal.veterinario}
                />
                <EquinoInfoItem
                  icon={Activity}
                  label="Condición Corporal"
                  value={
                    <Badge
                      className={cn(
                        "text-[10px] sm:text-xs",
                        getStatusColor(animal.condicion_corporal || ""),
                      )}
                    >
                      {animal.condicion_corporal
                        ?.replace(/_/g, " ")
                        .toUpperCase() || "N/A"}
                    </Badge>
                  }
                  show={!!animal.condicion_corporal}
                />
                <EquinoInfoItem
                  icon={Dumbbell}
                  label="Nivel Entrenamiento"
                  value={animal.nivel_entrenamiento}
                  show={!!animal.nivel_entrenamiento}
                />
                <EquinoInfoItem
                  icon={Dna}
                  label="Uso"
                  value={animal.uso_equino}
                  show={!!animal.uso_equino}
                />
              </div>

              <div className="space-y-2">
                <EquinoInfoItem
                  icon={BookOpen}
                  label="Registro Genealógico"
                  value={animal.registro_genealogico}
                  show={!!animal.registro_genealogico}
                />
                <EquinoInfoItem
                  icon={Microscope}
                  label="Microchip"
                  value={animal.microchip}
                  show={!!animal.microchip}
                />
                <EquinoInfoItem
                  icon={Scissors}
                  label="Odontología"
                  value={animal.odontologia}
                  show={!!animal.odontologia}
                />
                <EquinoInfoItem
                  icon={AlertTriangle}
                  label="Alergias"
                  value={animal.alergias}
                  show={!!animal.alergias}
                />
                <EquinoInfoItem
                  icon={Activity}
                  label="Lesiones"
                  value={animal.lesiones}
                  show={!!animal.lesiones}
                />
                <EquinoInfoItem
                  icon={Award}
                  label="Resultados Competencias"
                  value={
                    Array.isArray(animal.resultados_competencias)
                      ? animal.resultados_competencias.join(", ")
                      : animal.resultados_competencias
                  }
                  show={!!animal.resultados_competencias}
                />
              </div>
            </div>

            {animal.historial_reproductivo && (
              <div className="mt-2 p-2 bg-rose-50 rounded-lg border border-rose-200">
                <div className="flex items-center gap-2 mb-1">
                  <Baby className="h-3.5 w-3.5 text-rose-600" />
                  <span className="text-xs font-medium text-rose-700">
                    Historial Reproductivo
                  </span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {Array.isArray(animal.historial_reproductivo) ? (
                    animal.historial_reproductivo.map((item, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-[8px] sm:text-[10px] bg-white"
                      >
                        {item}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs text-gray-600">
                      {animal.historial_reproductivo}
                    </span>
                  )}
                </div>
              </div>
            )}

            {(animal.valor_estimado || animal.precio_compra) && (
              <>
                <Separator className="my-2" />
                <div className="grid grid-cols-2 gap-2">
                  <EquinoInfoItem
                    icon={Wallet}
                    label="Valor Estimado"
                    value={`${moneda} ${animal.valor_estimado?.toLocaleString() || "N/A"}`}
                    show={!!animal.valor_estimado}
                  />
                  <EquinoInfoItem
                    icon={TrendingUp}
                    label="Precio Compra"
                    value={`${moneda} ${animal.precio_compra?.toLocaleString() || "N/A"}`}
                    show={!!animal.precio_compra}
                  />
                </div>
              </>
            )}

            <Separator className="my-2" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <EquinoInfoItem
                icon={User}
                label="Propietario"
                value={animal.propietario?.name}
                show={!!animal.propietario?.name}
              />
              <EquinoInfoItem
                icon={MapPin}
                label="Ubicación"
                value={animal.finca?.nombre_finca}
                show={!!animal.finca?.nombre_finca}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <EquinoInfoItem
                icon={Tag}
                label="Pureza"
                value={animal.pureza}
                show={!!animal.pureza}
              />
              <EquinoInfoItem
                icon={Droplet}
                label="Tipo Reproducción"
                value={animal.tipo_reproduccion}
                show={!!animal.tipo_reproduccion}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-[10px] font-medium text-blue-700">Padre</p>
                <p className="text-xs text-gray-700">
                  {animal.nombre_padre || "N/A"}
                </p>
                {animal.arete_padre && (
                  <p className="text-[10px] text-gray-500">
                    ID: {animal.arete_padre}
                  </p>
                )}
                {animal.razas_padre.length > 0 && (
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {animal.razas_padre.map((raza, idx) => (
                      <Badge key={idx} variant="outline" className="text-[8px]">
                        {raza.nombre}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-2 bg-pink-50 rounded-lg border border-pink-100">
                <p className="text-[10px] font-medium text-pink-700">Madre</p>
                <p className="text-xs text-gray-700">
                  {animal.nombre_madre || "N/A"}
                </p>
                {animal.arete_madre && (
                  <p className="text-[10px] text-gray-500">
                    ID: {animal.arete_madre}
                  </p>
                )}
                {animal.numero_parto_madre && (
                  <p className="text-[10px] text-gray-500">
                    Partos: {animal.numero_parto_madre}
                  </p>
                )}
                {animal.razas_madre.length > 0 && (
                  <div className="flex flex-wrap gap-0.5 mt-0.5">
                    {animal.razas_madre.map((raza, idx) => (
                      <Badge key={idx} variant="outline" className="text-[8px]">
                        {raza.nombre}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {animal.observaciones && (
              <div className="mt-2 p-2 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <FileText className="h-3.5 w-3.5 text-gray-500 mt-0.5" />
                  <p className="text-xs text-gray-600">
                    <span className="font-medium">Observaciones:</span>{" "}
                    {animal.observaciones}
                  </p>
                </div>
              </div>
            )}
          </div>

          <Separator className="my-3" />

          <div className="flex justify-center w-full">
            <Button
              className="w-full bg-slate-700 hover:bg-slate-800 text-white text-sm sm:text-base transition-all duration-200"
              onClick={onEdit}
            >
              <PawPrint className="h-4 w-4 mr-2" />
              Editar Equino
            </Button>
          </div>
        </CardContent>
      </Card>

      <ImageGallery
        visible={galleryVisible}
        images={animal.profileImages || []}
        onClose={() => setGalleryVisible(false)}
        onDelete={handleDeleteImage}
      />

      <Dialog open={deathDialogVisible} onOpenChange={setDeathDialogVisible}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {deathStatus ? "Marcar como fallecido" : "Marcar como vivo"}
            </DialogTitle>
            <DialogDescription>
              Actualiza el estado de vida del equino
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between py-4">
            <Label htmlFor="death-status">¿El equino ha fallecido?</Label>
            <Switch
              id="death-status"
              checked={deathStatus}
              onCheckedChange={(value) => {
                setDeathStatus(value);
                if (!value) setDeathReason("N/D");
              }}
            />
          </div>

          {deathStatus && (
            <div className="space-y-2">
              <Label htmlFor="death-reason">Razón de la muerte</Label>
              <Input
                id="death-reason"
                value={deathReason}
                onChange={(e) => setDeathReason(e.target.value)}
                placeholder="Ingrese la razón de la muerte"
              />
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              onClick={() => setDeathDialogVisible(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleDeathStatusUpdate}
              className="w-full sm:w-auto bg-slate-700 hover:bg-slate-800"
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface InfoBadgeProps {
  icon: React.ElementType;
  label: string;
  value: string;
}

const InfoBadge = ({ icon: Icon, label, value }: InfoBadgeProps) => (
  <div className="flex items-center gap-1.5 p-1.5 sm:p-2 bg-gray-50 rounded-lg">
    <Icon className="h-3 w-3 sm:h-4 sm:w-4 text-slate-500" />
    <div className="min-w-0 flex-1">
      <p className="text-[8px] sm:text-[10px] text-gray-500">{label}</p>
      <p className="text-[10px] sm:text-xs font-medium text-gray-700 truncate">
        {value}
      </p>
    </div>
  </div>
);

interface EquinoInfoItemProps {
  icon: React.ElementType;
  label: string;
  value: React.ReactNode;
  show: boolean;
}

const EquinoInfoItem = ({
  icon: Icon,
  label,
  value,
  show,
}: EquinoInfoItemProps) => {
  if (!show) return null;
  return (
    <div className="flex items-start gap-2 p-1.5 sm:p-2 bg-white rounded-lg border border-slate-200">
      <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-slate-500 mt-0.5 flex-shrink-0" />
      <div className="min-w-0 flex-1">
        <span className="text-[9px] sm:text-[10px] font-medium text-gray-500">
          {label}
        </span>
        <div className="text-[10px] sm:text-xs text-gray-700 break-words">
          {value}
        </div>
      </div>
    </div>
  );
};

export default EquinoCard;
