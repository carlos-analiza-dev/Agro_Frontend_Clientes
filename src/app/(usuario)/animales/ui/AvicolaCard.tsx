"use client";

import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Camera,
  CircleAlert,
  Heart,
  Egg,
  Droplets,
  Weight,
  Store,
  Building2,
  Pill,
  Calendar,
  Percent,
  Syringe,
  AlertCircle,
  Package,
  TrendingUp,
  Clock,
  Trash2,
} from "lucide-react";
import { toast } from "react-toastify";
import { ActualizarAnimalMuerte } from "@/api/animales/accions/update-animal-status-muerte";
import { eliminarImagenAnimal } from "@/api/animales_profile/accions/delete-image-animal";
import ImageGallery from "@/components/generics/ImageGallery";
import { Badge } from "@/components/ui/badge";
import { EtapaAvicola } from "@/api/animales/interfaces/crear-avicola.interface";
import { descartarAnimal } from "@/api/animales/accions/update-animal";
import { format } from "date-fns";
import Modal from "@/components/generics/Modal";

interface Props {
  animal: Animal;
  onEdit: () => void;
  onUpdateProfileImage: (imageUri: string, animalId: string) => Promise<void>;
}

const etapaColors: Record<EtapaAvicola, string> = {
  [EtapaAvicola.RECEPCION]: "bg-blue-500 hover:bg-blue-600",
  [EtapaAvicola.CRIA]: "bg-green-500 hover:bg-green-600",
  [EtapaAvicola.CRECIMIENTO]: "bg-yellow-500 hover:bg-yellow-600",
  [EtapaAvicola.ENGORDE]: "bg-orange-500 hover:bg-orange-600",
  [EtapaAvicola.AYUNO]: "bg-purple-500 hover:bg-purple-600",
};

const etapaIcons: Record<EtapaAvicola, React.ReactNode> = {
  [EtapaAvicola.RECEPCION]: <Clock className="h-3 w-3 mr-1" />,
  [EtapaAvicola.CRIA]: <TrendingUp className="h-3 w-3 mr-1" />,
  [EtapaAvicola.CRECIMIENTO]: <TrendingUp className="h-3 w-3 mr-1" />,
  [EtapaAvicola.ENGORDE]: <Package className="h-3 w-3 mr-1" />,
  [EtapaAvicola.AYUNO]: <Clock className="h-3 w-3 mr-1" />,
};

const etapaDescriptions: Record<EtapaAvicola, string> = {
  [EtapaAvicola.RECEPCION]: "Recepción de aves",
  [EtapaAvicola.CRIA]: "Etapa de cría",
  [EtapaAvicola.CRECIMIENTO]: "Etapa de crecimiento",
  [EtapaAvicola.ENGORDE]: "Etapa de engorde",
  [EtapaAvicola.AYUNO]: "Período de ayuno",
};

const AvicolaCard = ({ animal, onEdit, onUpdateProfileImage }: Props) => {
  const [deathDialogVisible, setDeathDialogVisible] = useState(false);
  const [deathStatus, setDeathStatus] = useState(animal.animal_muerte);
  const [deathReason, setDeathReason] = useState(animal.razon_muerte);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();
  const [discardDialogVisible, setDiscardDialogVisible] = useState(false);
  const [discardReason, setDiscardReason] = useState("");
  const todayDate = format(new Date(), "yyyy-MM-dd");
  const imageUrl = animal.profileImages?.[0]?.url;
  const etapaActual = animal.etapa_avicola as EtapaAvicola;

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
          toast.success("Foto de perfil actualizada exitosamente");
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
      toast.success("Foto eliminada correctamente");
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

      toast.success(
        deathStatus
          ? "Lote marcado como finalizado"
          : "Lote marcado como activo",
      );

      queryClient.invalidateQueries({
        queryKey: ["animales-propietario", animal.propietario?.id],
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

        toast.error(errorMessage);
      } else {
        toast.error("Contacte al administrador");
      }
    }
  };

  const handleDiscardAnimal = async () => {
    try {
      if (!discardReason || discardReason.trim() === "") {
        toast.error("Debe ingresar una razón de descarte válida");
        return;
      }

      await descartarAnimal(animal.id, {
        descartado: true,
        razon_descarte: discardReason,
        fecha_descarte: todayDate,
      });

      toast("Animal descartado exitosamente");
      queryClient.invalidateQueries({
        queryKey: ["animales-propietario", animal.propietario.id],
      });
      setDiscardDialogVisible(false);
      setDiscardReason("");
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al descartar el animal";

        toast.error(errorMessage);
      } else {
        toast.error("Contacte al administrador");
      }
    }
  };

  return (
    <>
      <Card className="mb-4 overflow-hidden transition-all duration-200 hover:shadow-md border-amber-200 dark:border-amber-800">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-amber-50 to-amber-100/50 dark:from-amber-950/30 dark:to-amber-900/20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar
                className="h-12 w-12 cursor-pointer border-2 border-amber-300 dark:border-amber-700"
                onClick={openGallery}
              >
                <AvatarImage
                  src={localImage || imageUrl}
                  alt={animal.identificador}
                />
                <AvatarFallback className="bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-300">
                  {animal.identificador.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {animal.identificador.toUpperCase()}
                <Badge className="bg-amber-500 hover:bg-amber-600 text-xs">
                  <Egg className="h-3 w-3 mr-1" />
                  Lote
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {animal.especie?.nombre || "Aves"} -{" "}
                {animal.razas?.length === 1
                  ? animal.razas[0].nombre
                  : animal.razas?.length > 1
                    ? "Encaste"
                    : "Sin raza"}
              </p>
              {animal.tipo_ave && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  {animal.tipo_ave}
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900"
              onClick={() => {
                setDeathStatus(animal.animal_muerte);
                setDeathReason(animal.razon_muerte);
                setDeathDialogVisible(true);
              }}
            >
              {animal.animal_muerte ? (
                <CircleAlert className="h-4 w-4 text-red-500" />
              ) : (
                <Heart className="h-4 w-4 text-amber-500" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              title="Descartar Animal"
              className="h-8 w-8 rounded-full"
              onClick={() => setDiscardDialogVisible(true)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              title="Subir Foto"
              className="h-8 w-8 rounded-full border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="h-4 w-4" />
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

        <CardContent className="p-4 pt-3">
          {etapaActual && (
            <div className="mb-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/20 p-2 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-center gap-2 flex-1">
                  <TrendingUp className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                    Etapa Actual:
                  </span>
                  <Badge
                    className={`${etapaColors[etapaActual] || "bg-amber-500"} text-white text-xs px-3 py-1`}
                  >
                    {etapaIcons[etapaActual]}
                    {etapaDescriptions[etapaActual] || etapaActual}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                  <span className="text-[10px] text-muted-foreground">
                    Activo
                  </span>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 mb-3">
            {animal.cantidad_lote !== undefined &&
              animal.cantidad_lote !== null && (
                <div className="flex items-center gap-2 col-span-2 bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg">
                  <Package className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                  <span className="text-sm">
                    <span className="font-semibold">Cantidad:</span>{" "}
                    <Badge className="bg-amber-500 hover:bg-amber-600">
                      {animal.cantidad_lote} aves
                    </Badge>
                  </span>
                </div>
              )}

            {animal.galpon && (
              <div className="flex items-center gap-2 col-span-2">
                <Building2 className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs">
                  <span className="font-medium">Galpón:</span> {animal.galpon}
                </span>
              </div>
            )}

            {animal.proveedor_aves && (
              <div className="flex items-center gap-2 col-span-2">
                <Store className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs">
                  <span className="font-medium">Proveedor:</span>{" "}
                  {animal.proveedor_aves}
                </span>
              </div>
            )}
          </div>

          <Separator className="my-3" />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Droplets className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
              <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                Alimentación
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
              {animal.consumo_alimento && (
                <div className="flex items-center gap-2">
                  <Droplets className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs">
                    <span className="font-medium">Consumo:</span>{" "}
                    {animal.consumo_alimento}
                  </span>
                </div>
              )}

              {animal.tipo_concentrado && (
                <div className="flex items-center gap-2">
                  <Pill className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                  <span className="text-xs">
                    <span className="font-medium">Concentrado:</span>{" "}
                    {animal.tipo_concentrado}
                  </span>
                </div>
              )}

              {animal.consumo_agua && (
                <div className="flex items-center gap-2 col-span-2">
                  <Droplets className="h-3 w-3 text-blue-500" />
                  <span className="text-xs">
                    <span className="font-medium">Agua:</span>{" "}
                    {animal.consumo_agua}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-3" />

          {(animal.huevos_diarios !== undefined &&
            animal.huevos_diarios !== null) ||
          (animal.huevos_rotos !== undefined && animal.huevos_rotos !== null) ||
          animal.calificacion_huevos ||
          animal.porcentaje_postura ||
          animal.fecha_postura ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Egg className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                  Producción
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                {animal.huevos_diarios !== undefined &&
                  animal.huevos_diarios !== null && (
                    <div className="flex items-center gap-2">
                      <Egg className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs">
                        <span className="font-medium">Huevos/día:</span>{" "}
                        {animal.huevos_diarios}
                      </span>
                    </div>
                  )}

                {animal.huevos_rotos !== undefined &&
                  animal.huevos_rotos !== null && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 text-red-500" />
                      <span className="text-xs">
                        <span className="font-medium">Rotos:</span>{" "}
                        <Badge variant="destructive" className="text-xs">
                          {animal.huevos_rotos}
                        </Badge>
                      </span>
                    </div>
                  )}

                {animal.calificacion_huevos && (
                  <div className="flex items-center gap-2">
                    <Egg className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs">
                      <span className="font-medium">Calificación:</span>{" "}
                      {animal.calificacion_huevos}
                    </span>
                  </div>
                )}

                {animal.porcentaje_postura && (
                  <div className="flex items-center gap-2">
                    <Percent className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs">
                      <span className="font-medium">% Postura:</span>{" "}
                      {animal.porcentaje_postura}%
                    </span>
                  </div>
                )}

                {animal.fecha_postura && (
                  <div className="flex items-center gap-2 col-span-2">
                    <Calendar className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs">
                      <span className="font-medium">Fecha Postura:</span>{" "}
                      {new Date(animal.fecha_postura).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          <Separator className="my-3" />

          {(animal.vacunas_lote && animal.vacunas_lote !== "Sin vacunas") ||
          animal.tratamientos ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Syringe className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs font-medium text-amber-700 dark:text-amber-400">
                  Sanidad
                </span>
              </div>

              <div className="space-y-1 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                {animal.vacunas_lote &&
                  animal.vacunas_lote !== "Sin vacunas" && (
                    <div className="flex items-center gap-2">
                      <Syringe className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs">
                        <span className="font-medium">Vacunas:</span>{" "}
                        {animal.vacunas_lote}
                      </span>
                    </div>
                  )}

                {animal.tratamientos && (
                  <div className="flex items-center gap-2">
                    <Pill className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                    <span className="text-xs">
                      <span className="font-medium">Tratamientos:</span>{" "}
                      {animal.tratamientos}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : null}

          {animal.mortalidad_diaria !== undefined &&
            animal.mortalidad_diaria !== null &&
            animal.mortalidad_diaria > 0 && (
              <>
                <Separator className="my-3" />
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-red-700 dark:text-red-400">
                    <span className="font-medium">Mortalidad Diaria:</span>{" "}
                    <Badge variant="destructive" className="text-xs">
                      {animal.mortalidad_diaria} aves
                    </Badge>
                  </span>
                </div>
              </>
            )}

          {animal.peso_promedio && (
            <>
              <Separator className="my-3" />
              <div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/30 p-2 rounded-lg">
                <Weight className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-xs">
                  <span className="font-medium">Peso Promedio:</span>{" "}
                  {animal.peso_promedio} kg
                </span>
              </div>
            </>
          )}

          <Separator className="my-3" />

          <div className="grid grid-cols-2 gap-2">
            {animal.tipo_produccion && (
              <div className="flex items-center gap-2">
                <Package className="h-3.5 w-3.5 text-amber-600 dark:text-amber-400" />
                <span className="text-xs">
                  <span className="font-medium">Producción:</span>{" "}
                  {animal.tipo_produccion}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 col-span-2">
              <Building2 className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs text-muted-foreground">
                {animal.finca?.nombre_finca || "Sin finca"}
              </span>
            </div>
          </div>

          <div className="flex justify-center w-full space-x-2 mt-4">
            <Button
              className="w-full bg-amber-600 hover:bg-amber-700 text-white"
              onClick={onEdit}
            >
              <Egg className="h-4 w-4 mr-2" />
              Editar Lote
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

      <Modal
        open={deathDialogVisible}
        onOpenChange={setDeathDialogVisible}
        title={deathStatus ? "Marcar como fallecido" : "Marcar como vivo"}
        description="Actualiza el estado de vida del animal"
        showCloseButton={false}
      >
        <div className="flex items-center justify-between py-4">
          <Label htmlFor="death-status">¿El animal ha fallecido?</Label>
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

        <div className="flex justify-end">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setDeathDialogVisible(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleDeathStatusUpdate}>Guardar</Button>
          </div>
        </div>
      </Modal>

      <Modal
        title="Descartar Lote"
        description="Esta acción marcará el lote como descartado. Asegúrese de
              ingresar toda la información requerida."
        open={discardDialogVisible}
        onOpenChange={setDiscardDialogVisible}
        showCloseButton={false}
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="discard-reason">Razón de descarte *</Label>
            <Input
              id="discard-reason"
              value={discardReason}
              onChange={(e) => setDiscardReason(e.target.value)}
              placeholder="Ej: Venta, Muerte, Traslado, etc."
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer.
              El animal será marcado como descartado en el sistema.
            </p>
          </div>
        </div>

        <div className="flex justify-end">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => {
                setDiscardDialogVisible(false);
                setDiscardReason("");
              }}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDiscardAnimal}
              disabled={!discardReason}
            >
              Descartar Animal
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default AvicolaCard;
