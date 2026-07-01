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
  PiggyBank,
  Scale,
  CalendarDays,
  Stethoscope,
  User,
  DollarSign,
  Hash,
} from "lucide-react";
import { toast } from "react-toastify";
import { ActualizarAnimalMuerte } from "@/api/animales/accions/update-animal-status-muerte";
import { eliminarImagenAnimal } from "@/api/animales_profile/accions/delete-image-animal";
import ImageGallery from "@/components/generics/ImageGallery";
import { Badge } from "@/components/ui/badge";

interface Props {
  animal: Animal;
  onEdit: () => void;
  onUpdateProfileImage: (imageUri: string, animalId: string) => Promise<void>;
}

const PorcinoCard = ({ animal, onEdit, onUpdateProfileImage }: Props) => {
  const [deathDialogVisible, setDeathDialogVisible] = useState(false);
  const [deathStatus, setDeathStatus] = useState(animal.animal_muerte);
  const [deathReason, setDeathReason] = useState(animal.razon_muerte);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const imageUrl = animal.profileImages?.[0]?.url;

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
          ? "Porcino marcado como finalizado"
          : "Porcino marcado como activo",
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

  const getEtapaPorcinoBadge = () => {
    const etapa = animal.etapa_porcino;
    if (!etapa) return null;

    const colors: Record<string, string> = {
      Lactancia: "bg-blue-500 hover:bg-blue-600",
      Destete: "bg-green-500 hover:bg-green-600",
      Recría: "bg-yellow-500 hover:bg-yellow-600",
      Engorde: "bg-orange-500 hover:bg-orange-600",
      Reproducción: "bg-purple-500 hover:bg-purple-600",
    };

    const icons: Record<string, React.ReactNode> = {
      Lactancia: <PiggyBank className="h-3 w-3 mr-1" />,
      Destete: <Scale className="h-3 w-3 mr-1" />,
      Recría: <TrendingUp className="h-3 w-3 mr-1" />,
      Engorde: <Package className="h-3 w-3 mr-1" />,
      Reproducción: <Heart className="h-3 w-3 mr-1" />,
    };

    return {
      color: colors[etapa] || "bg-amber-500",
      icon: icons[etapa] || <PiggyBank className="h-3 w-3 mr-1" />,
      label: etapa,
    };
  };

  const etapaInfo = getEtapaPorcinoBadge();

  return (
    <>
      <Card className="mb-4 overflow-hidden transition-all duration-200 hover:shadow-md border-pink-200 dark:border-pink-800">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-pink-50 to-pink-100/50 dark:from-pink-950/30 dark:to-pink-900/20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar
                className="h-12 w-12 cursor-pointer border-2 border-pink-300 dark:border-pink-700"
                onClick={openGallery}
              >
                <AvatarImage
                  src={localImage || imageUrl}
                  alt={animal.identificador}
                />
                <AvatarFallback className="bg-pink-200 dark:bg-pink-800 text-pink-700 dark:text-pink-300">
                  {animal.identificador.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {animal.identificador.toUpperCase()}
                <Badge className="bg-pink-500 hover:bg-pink-600 text-xs">
                  <PiggyBank className="h-3 w-3 mr-1" />
                  Porcino
                </Badge>
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {animal.especie?.nombre || "Porcino"} -{" "}
                {animal.razas?.length === 1
                  ? animal.razas[0].nombre
                  : animal.razas?.length > 1
                    ? "Encaste"
                    : "Sin raza"}
              </p>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full border-pink-300 dark:border-pink-700 hover:bg-pink-100 dark:hover:bg-pink-900"
              onClick={() => {
                setDeathStatus(animal.animal_muerte);
                setDeathReason(animal.razon_muerte);
                setDeathDialogVisible(true);
              }}
            >
              {animal.animal_muerte ? (
                <CircleAlert className="h-4 w-4 text-red-500" />
              ) : (
                <Heart className="h-4 w-4 text-pink-500" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              title="Subir Foto"
              className="h-8 w-8 rounded-full border-pink-300 dark:border-pink-700 hover:bg-pink-100 dark:hover:bg-pink-900"
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
          {/* Etapa del Porcino */}
          {etapaInfo && (
            <div className="mb-3">
              <div className="flex items-center gap-2 bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/20 p-2 rounded-lg border border-pink-200 dark:border-pink-800">
                <div className="flex items-center gap-2 flex-1">
                  <TrendingUp className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  <span className="text-xs font-medium text-pink-700 dark:text-pink-400">
                    Etapa Actual:
                  </span>
                  <Badge
                    className={`${etapaInfo.color} text-white text-xs px-3 py-1`}
                  >
                    {etapaInfo.icon}
                    {etapaInfo.label}
                  </Badge>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-pink-400 animate-pulse"></div>
                  <span className="text-[10px] text-muted-foreground">
                    {animal.cuarentena_porcino ? "En Cuarentena" : "Activo"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Información Principal */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {animal.cantidad_inicial_porcino !== undefined &&
              animal.cantidad_inicial_porcino !== null && (
                <div className="flex items-center gap-2 col-span-2 bg-pink-50 dark:bg-pink-950/30 p-2 rounded-lg">
                  <Package className="h-4 w-4 text-pink-600 dark:text-pink-400" />
                  <span className="text-sm">
                    <span className="font-semibold">Cantidad:</span>{" "}
                    <Badge className="bg-pink-500 hover:bg-pink-600">
                      {animal.cantidad_inicial_porcino} inicial /{" "}
                      {animal.cantidad_actual_porcino ||
                        animal.cantidad_inicial_porcino}{" "}
                      actual
                    </Badge>
                  </span>
                </div>
              )}

            {animal.corral_galera && (
              <div className="flex items-center gap-2">
                <Building2 className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                <span className="text-xs">
                  <span className="font-medium">Corral/Galera:</span>{" "}
                  {animal.corral_galera}
                </span>
              </div>
            )}

            {animal.lote && (
              <div className="flex items-center gap-2">
                <Hash className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                <span className="text-xs">
                  <span className="font-medium">Lote:</span> {animal.lote}
                </span>
              </div>
            )}

            {animal.proveedor && (
              <div className="flex items-center gap-2 col-span-2">
                <Store className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                <span className="text-xs">
                  <span className="font-medium">Proveedor:</span>{" "}
                  {animal.proveedor}
                </span>
              </div>
            )}

            {animal.tipo_registro_porcino && (
              <div className="flex items-center gap-2 col-span-2">
                <Stethoscope className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                <span className="text-xs">
                  <span className="font-medium">Tipo Registro:</span>{" "}
                  {animal.tipo_registro_porcino}
                </span>
              </div>
            )}

            {animal.fecha_ingreso_porcino && (
              <div className="flex items-center gap-2 col-span-2">
                <CalendarDays className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                <span className="text-xs">
                  <span className="font-medium">Fecha Ingreso:</span>{" "}
                  {new Date(animal.fecha_ingreso_porcino).toLocaleDateString()}
                </span>
              </div>
            )}
          </div>

          <Separator className="my-3" />

          {/* Peso y Crecimiento */}
          {(animal.peso_inicial_porcino !== undefined ||
            animal.peso_promedio ||
            animal.ganancia_peso ||
            animal.fecha_pesaje_porcino) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Scale className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                <span className="text-xs font-medium text-pink-700 dark:text-pink-400">
                  Peso y Crecimiento
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                {animal.peso_inicial_porcino !== undefined &&
                  animal.peso_inicial_porcino !== null && (
                    <div className="flex items-center gap-2">
                      <Weight className="h-3 w-3 text-blue-500" />
                      <span className="text-xs">
                        <span className="font-medium">Peso Inicial:</span>{" "}
                        {animal.peso_inicial_porcino} kg
                      </span>
                    </div>
                  )}

                {animal.peso_promedio && (
                  <div className="flex items-center gap-2">
                    <Weight className="h-3 w-3 text-green-500" />
                    <span className="text-xs">
                      <span className="font-medium">Peso Promedio:</span>{" "}
                      {animal.peso_promedio} kg
                    </span>
                  </div>
                )}

                {animal.ganancia_peso !== undefined &&
                  animal.ganancia_peso !== null && (
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-3 w-3 text-amber-500" />
                      <span className="text-xs">
                        <span className="font-medium">Ganancia:</span>{" "}
                        {animal.ganancia_peso} kg/día
                      </span>
                    </div>
                  )}

                {animal.fecha_pesaje_porcino && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-pink-500" />
                    <span className="text-xs">
                      <span className="font-medium">Último Pesaje:</span>{" "}
                      {new Date(
                        animal.fecha_pesaje_porcino,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          <Separator className="my-3" />

          {/* Alimentación */}
          {(animal.consumo_diario_porcino !== undefined ||
            animal.conversion_alimenticia_porcino !== undefined ||
            animal.tipo_alimentacion) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Droplets className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                <span className="text-xs font-medium text-pink-700 dark:text-pink-400">
                  Alimentación
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                {animal.consumo_diario_porcino !== undefined &&
                  animal.consumo_diario_porcino !== null && (
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3 w-3 text-amber-600 dark:text-amber-400" />
                      <span className="text-xs">
                        <span className="font-medium">Consumo Diario:</span>{" "}
                        {animal.consumo_diario_porcino} kg
                      </span>
                    </div>
                  )}

                {animal.conversion_alimenticia_porcino !== undefined &&
                  animal.conversion_alimenticia_porcino !== null && (
                    <div className="flex items-center gap-2">
                      <Percent className="h-3 w-3 text-blue-500" />
                      <span className="text-xs">
                        <span className="font-medium">Conversión:</span>{" "}
                        {animal.conversion_alimenticia_porcino}
                      </span>
                    </div>
                  )}

                {animal.tipo_alimentacion &&
                  animal.tipo_alimentacion.length > 0 && (
                    <div className="flex items-center gap-2 col-span-2">
                      <Pill className="h-3 w-3 text-pink-500" />
                      <span className="text-xs">
                        <span className="font-medium">Alimentos:</span>{" "}
                        {animal.tipo_alimentacion
                          .map((a: any) => a.alimento)
                          .join(", ")}
                      </span>
                    </div>
                  )}
              </div>
            </div>
          )}

          <Separator className="my-3" />

          {/* Sanidad */}
          {(animal.vacunas ||
            animal.tratamientos ||
            animal.desparasitado !== undefined ||
            animal.condicion_corporal) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Syringe className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                <span className="text-xs font-medium text-pink-700 dark:text-pink-400">
                  Sanidad
                </span>
              </div>

              <div className="space-y-1 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                {animal.desparasitado !== undefined && (
                  <div className="flex items-center gap-2">
                    <AlertCircle
                      className={`h-3 w-3 ${animal.desparasitado ? "text-green-500" : "text-red-500"}`}
                    />
                    <span className="text-xs">
                      <span className="font-medium">Desparasitado:</span>{" "}
                      <Badge
                        variant={
                          animal.desparasitado ? "default" : "destructive"
                        }
                        className="text-xs"
                      >
                        {animal.desparasitado ? "Sí" : "No"}
                      </Badge>
                    </span>
                  </div>
                )}

                {animal.cuarentena_porcino !== undefined && (
                  <div className="flex items-center gap-2">
                    <AlertCircle
                      className={`h-3 w-3 ${!animal.cuarentena_porcino ? "text-green-500" : "text-yellow-500"}`}
                    />
                    <span className="text-xs">
                      <span className="font-medium">Cuarentena:</span>{" "}
                      <Badge
                        variant={
                          animal.cuarentena_porcino ? "outline" : "default"
                        }
                        className="text-xs"
                      >
                        {animal.cuarentena_porcino ? "Activa" : "Inactiva"}
                      </Badge>
                    </span>
                  </div>
                )}

                {animal.vacunas && animal.vacunas !== "Sin vacunas" && (
                  <div className="flex items-center gap-2">
                    <Syringe className="h-3 w-3 text-pink-600 dark:text-pink-400" />
                    <span className="text-xs">
                      <span className="font-medium">Vacunas:</span>{" "}
                      {animal.vacunas}
                    </span>
                  </div>
                )}

                {animal.tratamientos && (
                  <div className="flex items-center gap-2">
                    <Pill className="h-3 w-3 text-pink-600 dark:text-pink-400" />
                    <span className="text-xs">
                      <span className="font-medium">Tratamientos:</span>{" "}
                      {animal.tratamientos}
                    </span>
                  </div>
                )}

                {animal.condicion_corporal && (
                  <div className="flex items-center gap-2">
                    <Stethoscope className="h-3 w-3 text-pink-600 dark:text-pink-400" />
                    <span className="text-xs">
                      <span className="font-medium">Condición Corporal:</span>{" "}
                      {animal.condicion_corporal}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Bajas/Mortalidad */}
          {animal.bajas_mortalidad_porcino !== undefined &&
            animal.bajas_mortalidad_porcino !== null &&
            animal.bajas_mortalidad_porcino > 0 && (
              <>
                <Separator className="my-3" />
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-950/30 p-2 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-500" />
                  <span className="text-xs text-red-700 dark:text-red-400">
                    <span className="font-medium">Bajas/Mortalidad:</span>{" "}
                    <Badge variant="destructive" className="text-xs">
                      {animal.bajas_mortalidad_porcino} animales
                    </Badge>
                  </span>
                </div>
              </>
            )}

          <Separator className="my-3" />

          {(animal.fecha_salida_porcino ||
            animal.peso_salida_porcino ||
            animal.comprador_porcino ||
            animal.precio_porcino ||
            animal.rendimiento_canal_porcino) && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-3.5 w-3.5 text-pink-600 dark:text-pink-400" />
                <span className="text-xs font-medium text-pink-700 dark:text-pink-400">
                  Información de Salida
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                {animal.fecha_salida_porcino && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-pink-500" />
                    <span className="text-xs">
                      <span className="font-medium">Fecha Salida:</span>{" "}
                      {new Date(
                        animal.fecha_salida_porcino,
                      ).toLocaleDateString()}
                    </span>
                  </div>
                )}

                {animal.peso_salida_porcino !== undefined &&
                  animal.peso_salida_porcino !== null && (
                    <div className="flex items-center gap-2">
                      <Weight className="h-3 w-3 text-blue-500" />
                      <span className="text-xs">
                        <span className="font-medium">Peso Salida:</span>{" "}
                        {animal.peso_salida_porcino} kg
                      </span>
                    </div>
                  )}

                {animal.comprador_porcino && (
                  <div className="flex items-center gap-2">
                    <User className="h-3 w-3 text-pink-500" />
                    <span className="text-xs">
                      <span className="font-medium">Comprador:</span>{" "}
                      {animal.comprador_porcino}
                    </span>
                  </div>
                )}

                {animal.precio_porcino !== undefined &&
                  animal.precio_porcino !== null && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3 text-green-500" />
                      <span className="text-xs">
                        <span className="font-medium">Precio:</span> ${" "}
                        {typeof animal.precio_porcino === "number"
                          ? animal.precio_porcino.toFixed(2)
                          : Number(animal.precio_porcino).toFixed(2)}
                      </span>
                    </div>
                  )}

                {animal.rendimiento_canal_porcino !== undefined &&
                  animal.rendimiento_canal_porcino !== null && (
                    <div className="flex items-center gap-2 col-span-2">
                      <Percent className="h-3 w-3 text-amber-500" />
                      <span className="text-xs">
                        <span className="font-medium">Rendimiento Canal:</span>{" "}
                        {animal.rendimiento_canal_porcino}%
                      </span>
                    </div>
                  )}
              </div>
            </div>
          )}
          <Separator className="my-3" />

          {/* Información General */}
          <div className="grid grid-cols-2 gap-2">
            {animal.nombre_criador_origen_animal && (
              <div className="flex items-center gap-2 col-span-2">
                <User className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-xs">
                  <span className="font-medium">Criador/Origen:</span>{" "}
                  {animal.nombre_criador_origen_animal}
                </span>
              </div>
            )}

            <div className="flex items-center gap-2 col-span-2">
              <Building2 className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs text-muted-foreground">
                {animal.finca?.nombre_finca || "Sin finca"}
              </span>
            </div>

            {animal.observaciones && (
              <div className="flex items-center gap-2 col-span-2">
                <Stethoscope className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs text-muted-foreground truncate">
                  {animal.observaciones.length > 100
                    ? `${animal.observaciones.substring(0, 100)}...`
                    : animal.observaciones}
                </span>
              </div>
            )}
          </div>

          <div className="flex justify-center w-full space-x-2 mt-4">
            <Button
              className="w-full bg-pink-600 hover:bg-pink-700 text-white"
              onClick={onEdit}
            >
              <PiggyBank className="h-4 w-4 mr-2" />
              Editar Porcino
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deathStatus ? "Finalizar Porcino" : "Activar Porcino"}
            </DialogTitle>
            <DialogDescription>
              {deathStatus
                ? "Marca este porcino como finalizado o descartado"
                : "Marca este porcino como activo nuevamente"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between py-4">
            <Label htmlFor="death-status">
              ¿El porcino ha sido finalizado?
            </Label>
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
              <Label htmlFor="death-reason">Razón de finalización</Label>
              <Input
                id="death-reason"
                value={deathReason}
                onChange={(e) => setDeathReason(e.target.value)}
                placeholder="Ej: Fin de ciclo productivo, Venta, Mortandad, etc."
              />
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeathDialogVisible(false)}
            >
              Cancelar
            </Button>
            <Button
              className="bg-pink-600 hover:bg-pink-700"
              onClick={handleDeathStatusUpdate}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PorcinoCard;
