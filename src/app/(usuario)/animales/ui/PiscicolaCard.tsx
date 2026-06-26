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
  Fish,
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
  Thermometer,
  Beaker,
  Scale,
  Ruler,
  Users,
  Clock,
  DollarSign,
  User,
  FlaskConical,
  Waves,
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

const PiscicolaCard = ({ animal, onEdit, onUpdateProfileImage }: Props) => {
  const [deathDialogVisible, setDeathDialogVisible] = useState(false);
  const [deathStatus, setDeathStatus] = useState(animal.animal_muerte);
  const [deathReason, setDeathReason] = useState(animal.razon_muerte);
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const imageUrl = animal.profileImages?.[0]?.url;

  // Helper para formatear fechas
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  // Helper para obtener datos de calidad de agua
  const getCalidadAgua = () => {
    if (!animal.calidad_agua) return null;
    if (typeof animal.calidad_agua === "string") {
      try {
        return JSON.parse(animal.calidad_agua);
      } catch {
        return null;
      }
    }
    return animal.calidad_agua;
  };

  // Helper para obtener datos de sanidad
  const getSanidad = () => {
    if (!animal.sanidad) return null;
    if (typeof animal.sanidad === "string") {
      try {
        return JSON.parse(animal.sanidad);
      } catch {
        return null;
      }
    }
    return animal.sanidad;
  };

  // Helper para obtener datos de cosecha
  const getCosecha = () => {
    if (!animal.cosecha) return null;
    if (typeof animal.cosecha === "string") {
      try {
        return JSON.parse(animal.cosecha);
      } catch {
        return null;
      }
    }
    return animal.cosecha;
  };

  // Helper para obtener muestreos
  const getMuestreos = () => {
    if (!animal.muestreos) return [];
    if (typeof animal.muestreos === "string") {
      try {
        return JSON.parse(animal.muestreos);
      } catch {
        return [];
      }
    }
    return animal.muestreos;
  };

  const calidadAgua = getCalidadAgua();
  const sanidad = getSanidad();
  const cosecha = getCosecha();
  const muestreos = getMuestreos();
  const etapaColors: Record<string, string> = {
    Alevín: "bg-blue-500",
    Juvenil: "bg-green-500",
    Engorde: "bg-amber-500",
  };

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
          "Debe ingresar una razón de finalización válida (no puede estar vacía o ser 'N/D')",
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

  return (
    <>
      <Card className="mb-4 overflow-hidden transition-all duration-200 hover:shadow-md border-cyan-200 dark:border-cyan-800">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-gradient-to-r from-cyan-50 to-cyan-100/50 dark:from-cyan-950/30 dark:to-cyan-900/20">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar
                className="h-12 w-12 cursor-pointer border-2 border-cyan-300 dark:border-cyan-700"
                onClick={openGallery}
              >
                <AvatarImage
                  src={localImage || imageUrl}
                  alt={animal.identificador}
                />
                <AvatarFallback className="bg-cyan-200 dark:bg-cyan-800 text-cyan-700 dark:text-cyan-300">
                  {animal.identificador.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {animal.identificador.toUpperCase()}
                <Badge className="bg-cyan-500 hover:bg-cyan-600 text-xs">
                  <Fish className="h-3 w-3 mr-1" />
                  Lote
                </Badge>
                {animal.etapa && (
                  <Badge
                    className={`${etapaColors[animal.etapa] || "bg-gray-500"} text-xs`}
                  >
                    {animal.etapa}
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {animal.especie?.nombre || "Peces"} -{" "}
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
              className="h-8 w-8 rounded-full border-cyan-300 dark:border-cyan-700 hover:bg-cyan-100 dark:hover:bg-cyan-900"
              onClick={() => {
                setDeathStatus(animal.animal_muerte);
                setDeathReason(animal.razon_muerte);
                setDeathDialogVisible(true);
              }}
            >
              {animal.animal_muerte ? (
                <CircleAlert className="h-4 w-4 text-red-500" />
              ) : (
                <Fish className="h-4 w-4 text-cyan-500" />
              )}
            </Button>

            <Button
              variant="outline"
              size="icon"
              title="Subir Foto"
              className="h-8 w-8 rounded-full border-cyan-300 dark:border-cyan-700 hover:bg-cyan-100 dark:hover:bg-cyan-900"
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
          {/* IDENTIFICACIÓN Y SIEMBRA */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            {animal.estanque_tanque_jaula && (
              <div className="flex items-center gap-2 col-span-2">
                <Waves className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs">
                  <span className="font-medium">Estanque/Tanque/Jaula:</span>{" "}
                  <Badge variant="outline" className="text-xs">
                    {animal.estanque_tanque_jaula}
                  </Badge>
                </span>
              </div>
            )}

            {animal.cantidad_inicial !== undefined &&
              animal.cantidad_inicial !== null && (
                <div className="flex items-center gap-2 col-span-2 bg-cyan-50 dark:bg-cyan-950/30 p-2 rounded-lg">
                  <Fish className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-sm">
                    <span className="font-semibold">Siembra:</span>{" "}
                    <Badge className="bg-cyan-500 hover:bg-cyan-600">
                      {animal.cantidad_inicial} peces
                    </Badge>
                    {animal.fecha_siembra && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {formatDate(animal.fecha_siembra)}
                      </span>
                    )}
                  </span>
                </div>
              )}

            {animal.proveedor_alevines && (
              <div className="flex items-center gap-2 col-span-2">
                <Store className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs">
                  <span className="font-medium">Proveedor:</span>{" "}
                  {animal.proveedor_alevines}
                </span>
              </div>
            )}

            {animal.densidad_por_m3_m2 !== undefined &&
              animal.densidad_por_m3_m2 !== null && (
                <div className="flex items-center gap-2 col-span-2">
                  <Users className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs">
                    <span className="font-medium">Densidad:</span>{" "}
                    {animal.densidad_por_m3_m2} por m³/m²
                  </span>
                </div>
              )}
          </div>

          <Separator className="my-3" />

          {/* POBLACIÓN ACTUAL */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                Población
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
              {animal.cantidad_actual !== undefined &&
                animal.cantidad_actual !== null && (
                  <div className="flex items-center gap-2">
                    <Fish className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                    <span className="text-xs">
                      <span className="font-medium">Actual:</span>{" "}
                      {animal.cantidad_actual}
                    </span>
                  </div>
                )}

              {animal.mortalidad_diaria_acum && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-3 w-3 text-red-500" />
                  <span className="text-xs">
                    <span className="font-medium">Mortalidad:</span>{" "}
                    {animal.mortalidad_diaria_acum}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-3" />

          {/* CRECIMIENTO */}
          {(animal.peso_promedio_pez !== undefined ||
            animal.biomasa_estimada !== undefined ||
            animal.talla_pez !== undefined) && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Weight className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                    Crecimiento
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                  {animal.peso_promedio_pez !== undefined &&
                    animal.peso_promedio_pez !== null && (
                      <div className="flex items-center gap-2">
                        <Scale className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-xs">
                          <span className="font-medium">Peso:</span>{" "}
                          {animal.peso_promedio_pez} g
                        </span>
                      </div>
                    )}

                  {animal.biomasa_estimada !== undefined &&
                    animal.biomasa_estimada !== null && (
                      <div className="flex items-center gap-2">
                        <Weight className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-xs">
                          <span className="font-medium">Biomasa:</span>{" "}
                          {animal.biomasa_estimada} kg
                        </span>
                      </div>
                    )}

                  {animal.talla_pez !== undefined &&
                    animal.talla_pez !== null && (
                      <div className="flex items-center gap-2">
                        <Ruler className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-xs">
                          <span className="font-medium">Talla:</span>{" "}
                          {animal.talla_pez} cm
                        </span>
                      </div>
                    )}

                  {animal.fecha_muestreo_pez && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        <span className="font-medium">Muestreo:</span>{" "}
                        {formatDate(animal.fecha_muestreo_pez)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-3" />
            </>
          )}

          {/* MUESTREOS */}
          {muestreos && muestreos.length > 0 && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                    Historial de Muestreos
                  </span>
                </div>

                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {muestreos.map((muestreo: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-lg text-xs"
                    >
                      <Calendar className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span>{formatDate(muestreo.fecha_muestreo)}</span>
                      {muestreo.peso && (
                        <>
                          <span className="text-muted-foreground">|</span>
                          <Scale className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                          <span>{muestreo.peso}g</span>
                        </>
                      )}
                      {muestreo.talla && (
                        <>
                          <span className="text-muted-foreground">|</span>
                          <Ruler className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                          <span>{muestreo.talla}cm</span>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator className="my-3" />
            </>
          )}

          {/* CALIDAD DE AGUA */}
          {calidadAgua && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Droplets className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                    Calidad de Agua
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                  {calidadAgua.temperatura !== undefined && (
                    <div className="flex items-center gap-2">
                      <Thermometer className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        {calidadAgua.temperatura}°C
                      </span>
                    </div>
                  )}

                  {calidadAgua.oxigeno_disuelto !== undefined && (
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        {calidadAgua.oxigeno_disuelto} mg/L
                      </span>
                    </div>
                  )}

                  {calidadAgua.ph !== undefined && (
                    <div className="flex items-center gap-2">
                      <Beaker className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">pH: {calidadAgua.ph}</span>
                    </div>
                  )}

                  {calidadAgua.amonio !== undefined && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">NH₃: {calidadAgua.amonio}</span>
                    </div>
                  )}

                  {calidadAgua.nitrito !== undefined && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        NO₂: {calidadAgua.nitrito}
                      </span>
                    </div>
                  )}

                  {calidadAgua.turbidez && (
                    <div className="flex items-center gap-2 col-span-2">
                      <Droplets className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        Turbidez: {calidadAgua.turbidez}
                      </span>
                    </div>
                  )}
                </div>

                {calidadAgua.historial_recambios &&
                  calidadAgua.historial_recambios.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        Últimos recambios:
                      </p>
                      {calidadAgua.historial_recambios
                        .slice(0, 2)
                        .map((recambio: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-gray-50 dark:bg-gray-900/50 p-1.5 rounded-lg text-xs"
                          >
                            <Waves className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                            <span>{formatDate(recambio.fecha_recambio)}</span>
                            {recambio.porcentaje_recambio && (
                              <>
                                <span className="text-muted-foreground">|</span>
                                <span>{recambio.porcentaje_recambio}%</span>
                              </>
                            )}
                            {recambio.volumen_m3 && (
                              <>
                                <span className="text-muted-foreground">|</span>
                                <span>{recambio.volumen_m3}m³</span>
                              </>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
              </div>

              <Separator className="my-3" />
            </>
          )}

          {/* ALIMENTACIÓN */}
          {(animal.tipo_concentrado_pez ||
            animal.proteina_porcentaje !== undefined ||
            animal.racion_diaria ||
            animal.consumo_pez ||
            animal.conversion_alimenticia !== undefined) && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                    Alimentación
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                  {animal.tipo_concentrado_pez && (
                    <div className="flex items-center gap-2 col-span-2">
                      <Package className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        <span className="font-medium">Concentrado:</span>{" "}
                        {animal.tipo_concentrado_pez}
                      </span>
                    </div>
                  )}

                  {animal.proteina_porcentaje !== undefined &&
                    animal.proteina_porcentaje !== null && (
                      <div className="flex items-center gap-2">
                        <Percent className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-xs">
                          Proteína: {animal.proteina_porcentaje}%
                        </span>
                      </div>
                    )}

                  {animal.racion_diaria && (
                    <div className="flex items-center gap-2">
                      <Package className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        Ración: {animal.racion_diaria}
                      </span>
                    </div>
                  )}

                  {animal.consumo_pez && (
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        Consumo: {animal.consumo_pez}
                      </span>
                    </div>
                  )}

                  {animal.conversion_alimenticia !== undefined &&
                    animal.conversion_alimenticia !== null && (
                      <div className="flex items-center gap-2 col-span-2">
                        <Scale className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-xs">
                          <span className="font-medium">Conversión:</span>{" "}
                          {animal.conversion_alimenticia}
                        </span>
                      </div>
                    )}
                </div>
              </div>

              <Separator className="my-3" />
            </>
          )}

          {/* SANIDAD */}
          {sanidad && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Syringe className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                    Sanidad
                  </span>
                </div>

                <div className="space-y-1 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                  {sanidad.signos_clinicos && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        <span className="font-medium">Signos:</span>{" "}
                        {sanidad.signos_clinicos}
                      </span>
                    </div>
                  )}

                  {sanidad.tratamientos && (
                    <div className="flex items-center gap-2">
                      <Pill className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        <span className="font-medium">Tratamientos:</span>{" "}
                        {sanidad.tratamientos}
                      </span>
                    </div>
                  )}

                  {sanidad.banos_salinidad && (
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        <span className="font-medium">Baños/Salinidad:</span>{" "}
                        {sanidad.banos_salinidad}
                      </span>
                    </div>
                  )}

                  {sanidad.laboratorio && (
                    <div className="flex items-center gap-2">
                      <Beaker className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        <span className="font-medium">Laboratorio:</span>{" "}
                        {sanidad.laboratorio}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-3" />
            </>
          )}

          {/* COSECHA */}
          {cosecha && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Package className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                    Cosecha
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                  {cosecha.fecha_cosecha && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        {formatDate(cosecha.fecha_cosecha)}
                      </span>
                    </div>
                  )}

                  {cosecha.kilos_cosechados !== undefined &&
                    cosecha.kilos_cosechados !== null && (
                      <div className="flex items-center gap-2">
                        <Weight className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-xs">
                          {cosecha.kilos_cosechados} kg
                        </span>
                      </div>
                    )}

                  {cosecha.sobrevivencia_porcentaje !== undefined &&
                    cosecha.sobrevivencia_porcentaje !== null && (
                      <div className="flex items-center gap-2">
                        <Percent className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-xs">
                          Sobrevivencia: {cosecha.sobrevivencia_porcentaje}%
                        </span>
                      </div>
                    )}

                  {cosecha.comprador && (
                    <div className="flex items-center gap-2">
                      <User className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        Comprador: {cosecha.comprador}
                      </span>
                    </div>
                  )}

                  {cosecha.precio !== undefined && cosecha.precio !== null && (
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">${cosecha.precio}</span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-3" />
            </>
          )}

          {/* INFORMACIÓN ADICIONAL */}
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs text-muted-foreground truncate">
                {animal.finca?.nombre_finca || "Sin finca"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs text-muted-foreground">
                {animal.lote_activo ? (
                  <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                    Activo
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Inactivo
                  </Badge>
                )}
              </span>
            </div>

            {animal.fecha_siembra && (
              <div className="flex items-center gap-2 col-span-2">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-xs text-muted-foreground">
                  Siembra: {formatDate(animal.fecha_siembra)}
                </span>
              </div>
            )}
          </div>

          {/* BOTÓN DE EDICIÓN */}
          <div className="flex justify-center w-full space-x-2 mt-4">
            <Button
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={onEdit}
            >
              <Fish className="h-4 w-4 mr-2" />
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

      <Dialog open={deathDialogVisible} onOpenChange={setDeathDialogVisible}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {deathStatus ? "Finalizar Lote" : "Activar Lote"}
            </DialogTitle>
            <DialogDescription>
              {deathStatus
                ? "Marca este lote como finalizado o descartado"
                : "Marca este lote como activo nuevamente"}
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-between py-4">
            <Label htmlFor="death-status">¿El lote ha sido finalizado?</Label>
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
                placeholder="Ej: Cosecha completada, Mortandad, Venta, etc."
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
              className="bg-cyan-600 hover:bg-cyan-700"
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

export default PiscicolaCard;
