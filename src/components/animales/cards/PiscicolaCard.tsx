"use client";

import { useState, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  FlaskConical,
  Waves,
  Skull,
} from "lucide-react";
import { toast } from "react-toastify";
import { ActualizarAnimalMuertePez } from "@/api/animales/accions/update-animal-status-muerte";
import { eliminarImagenAnimal } from "@/api/animales_profile/accions/delete-image-animal";
import ImageGallery from "@/components/generics/ImageGallery";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { descartarPeces } from "@/api/animales/accions/update-animal";
import Modal from "@/components/generics/Modal";
import { formatDate } from "@/helpers/funciones/formatDate";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import { useTranslations } from "next-intl";

interface Props {
  animal: Animal;
  onEdit: () => void;
  onUpdateProfileImage: (imageUri: string, animalId: string) => Promise<void>;
}

const PiscicolaCard = ({ animal, onEdit, onUpdateProfileImage }: Props) => {
  const t = useTranslations("PiscicolaCard");
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
  const [deathQuantity, setDeathQuantity] = useState<number>(0);
  const [discardQuantity, setDiscardQuantity] = useState<number>(0);

  const [remainingQuantity, setRemainingQuantity] = useState<number>(
    animal.cantidad_actual || 0,
  );

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
  const muestreos = getMuestreos();
  const etapaColors: Record<string, string> = {
    Alevín: "bg-blue-500",
    Juvenil: "bg-green-500",
    Engorde: "bg-amber-500",
  };

  const getEtapaLabel = (etapa: string) => {
    const etapaKeyMap: Record<string, string> = {
      Alevín: "alevin",
      Juvenil: "juvenil",
      Engorde: "engorde",
    };
    const key = etapaKeyMap[etapa];
    return key ? t(`etapas.${key}`) : etapa;
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
          toast.success(t("messages.profileImageUpdated"));
          queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error(t("messages.profileImageUpdateError"));
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
      toast.success(t("messages.imageDeleted"));
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      setGalleryVisible(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            t("messages.profileImageDeleteError"),
        );
      }
    }
  };

  const handleDeathStatusUpdate = async () => {
    try {
      if (deathQuantity <= 0) {
        toast.error(t("validation.validDeathQuantity"));
        return;
      }

      if (!deathReason || deathReason.trim() === "" || deathReason === "N/D") {
        toast.error(t("validation.validDeathReason"));
        return;
      }

      if (deathQuantity > remainingQuantity) {
        toast.error(
          t("validation.deathQuantityExceeds", {
            quantity: deathQuantity,
            available: remainingQuantity,
          }),
        );
        return;
      }

      const isCompleteDeath = remainingQuantity - deathQuantity === 0;

      await ActualizarAnimalMuertePez(animal.id, {
        cantidad: deathQuantity,
        razon_muerte: deathReason,
        fecha_mortalidad: todayDate,
        muerto: isCompleteDeath,
      });

      if (isCompleteDeath) {
        toast.success(
          t("messages.batchCompletedDeath", { quantity: deathQuantity }),
        );
      } else {
        toast.success(
          t("messages.deathRegistered", {
            quantity: deathQuantity,
            remaining: remainingQuantity - deathQuantity,
          }),
        );
      }

      setRemainingQuantity((prev) => prev - deathQuantity);

      queryClient.invalidateQueries({
        queryKey: ["animales-propietario", animal.propietario?.id],
      });

      setDeathDialogVisible(false);
      setDeathQuantity(0);
      setDeathReason("");
      setDeathStatus(false);
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("messages.mortalityRegisterError");

        toast.error(errorMessage);
      } else {
        toast.error(t("messages.contactAdmin"));
      }
    }
  };

  const handleDiscardAnimal = async () => {
    try {
      if (discardQuantity <= 0) {
        toast.error(t("validation.validDiscardQuantity"));
        return;
      }

      if (!discardReason || discardReason.trim() === "") {
        toast.error(t("validation.validDiscardReason"));
        return;
      }

      const currentQuantity = animal?.cantidad_actual ?? 0;
      const newQuantity = currentQuantity - discardQuantity;

      const isCompleteDiscard = newQuantity === 0;

      await descartarPeces(animal.id, {
        cantidad: discardQuantity,
        razon_descarte: discardReason,
        fecha_descarte: todayDate,
        descartado: isCompleteDiscard,
      });

      if (isCompleteDiscard) {
        toast(t("messages.batchDiscarded"));
      } else {
        toast(t("messages.fishDiscarded", { quantity: discardQuantity }));
      }
      queryClient.invalidateQueries({
        queryKey: ["animales-propietario", animal.propietario.id],
      });
      setDiscardDialogVisible(false);
      setDiscardQuantity(0);
      setDiscardReason("");
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t("messages.discardError");

        toast.error(errorMessage);
      } else {
        toast.error(t("messages.contactAdmin"));
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
                  {t("labels.batch")}
                </Badge>
                {animal.etapa && (
                  <Badge
                    className={`${etapaColors[animal.etapa] || "bg-gray-500"} text-xs`}
                  >
                    {getEtapaLabel(animal.etapa)}
                  </Badge>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {animal.especie?.nombre || t("labels.fish")} -{" "}
                {animal.razas?.length === 1
                  ? animal.razas[0].nombre
                  : animal.razas?.length > 1
                    ? t("labels.crossbreed")
                    : t("labels.noBreed")}
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
              title={t("tooltips.discardAnimal")}
              className="h-8 w-8 rounded-full border-cyan-300 dark:border-cyan-700 hover:bg-cyan-100 dark:hover:bg-cyan-900"
              onClick={() => setDiscardDialogVisible(true)}
            >
              <Skull className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              title={t("tooltips.uploadPhoto")}
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
          <div className="grid grid-cols-2 gap-2 mb-3">
            {animal.estanque_tanque_jaula && (
              <div className="flex items-center gap-2 col-span-2">
                <Waves className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs">
                  <span className="font-medium">
                    {t("labels.pondTankCage")}
                  </span>{" "}
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
                    <span className="font-semibold">
                      {t("labels.stocking")}
                    </span>{" "}
                    <Badge className="bg-cyan-500 hover:bg-cyan-600">
                      {t("labels.fishCount", {
                        count: animal.cantidad_inicial,
                      })}
                    </Badge>
                    {animal.fecha_siembra && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {formatDateOnly(animal.fecha_siembra)}
                      </span>
                    )}
                  </span>
                </div>
              )}

            {animal.proveedor_alevines && (
              <div className="flex items-center gap-2 col-span-2">
                <Store className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                <span className="text-xs">
                  <span className="font-medium">{t("labels.supplier")}</span>{" "}
                  {animal.proveedor_alevines}
                </span>
              </div>
            )}

            {animal.densidad_por_m3_m2 !== undefined &&
              animal.densidad_por_m3_m2 !== null && (
                <div className="flex items-center gap-2 col-span-2">
                  <Users className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs">
                    <span className="font-medium">{t("labels.density")}</span>{" "}
                    {t("labels.densityValue", {
                      value: animal.densidad_por_m3_m2,
                    })}
                  </span>
                </div>
              )}
          </div>

          <Separator className="my-3" />

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Users className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
              <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                {t("labels.population")}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
              {animal.cantidad_actual !== undefined &&
                animal.cantidad_actual !== null && (
                  <div className="flex items-center gap-2">
                    <Fish className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                    <span className="text-xs">
                      <span className="font-medium">{t("labels.current")}</span>{" "}
                      {animal.cantidad_actual}
                    </span>
                  </div>
                )}

              {animal.mortalidad_diaria_acum && (
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-3 w-3 text-red-500" />
                  <span className="text-xs">
                    <span className="font-medium">{t("labels.mortality")}</span>{" "}
                    {animal.mortalidad_diaria_acum}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator className="my-3" />

          {(animal.peso_promedio_pez !== undefined ||
            animal.biomasa_estimada !== undefined ||
            animal.talla_pez !== undefined) && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Weight className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                    {t("labels.growth")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                  {animal.peso_promedio_pez !== undefined &&
                    animal.peso_promedio_pez !== null && (
                      <div className="flex items-center gap-2">
                        <Scale className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-xs">
                          <span className="font-medium">
                            {t("labels.weight")}
                          </span>{" "}
                          {animal.peso_promedio_pez} g
                        </span>
                      </div>
                    )}

                  {animal.biomasa_estimada !== undefined &&
                    animal.biomasa_estimada !== null && (
                      <div className="flex items-center gap-2">
                        <Weight className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-xs">
                          <span className="font-medium">
                            {t("labels.biomass")}
                          </span>{" "}
                          {animal.biomasa_estimada} kg
                        </span>
                      </div>
                    )}

                  {animal.talla_pez !== undefined &&
                    animal.talla_pez !== null && (
                      <div className="flex items-center gap-2">
                        <Ruler className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-xs">
                          <span className="font-medium">
                            {t("labels.size")}
                          </span>{" "}
                          {animal.talla_pez} cm
                        </span>
                      </div>
                    )}

                  {animal.fecha_muestreo_pez && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        <span className="font-medium">
                          {t("labels.sampling")}
                        </span>{" "}
                        {formatDateOnly(animal.fecha_muestreo_pez)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-3" />
            </>
          )}

          {muestreos && muestreos.length > 0 && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FlaskConical className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                    {t("labels.samplingHistory")}
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

          {calidadAgua && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Droplets className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                    {t("labels.waterQuality")}
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
                        {t("labels.turbidity")} {calidadAgua.turbidez}
                      </span>
                    </div>
                  )}
                </div>

                {calidadAgua.historial_recambios &&
                  calidadAgua.historial_recambios.length > 0 && (
                    <div className="space-y-1">
                      <p className="text-xs text-muted-foreground">
                        {t("labels.lastExchanges")}
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
                    {t("labels.feeding")}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                  {animal.tipo_concentrado_pez && (
                    <div className="flex items-center gap-2 col-span-2">
                      <Package className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        <span className="font-medium">
                          {t("labels.concentrate")}
                        </span>{" "}
                        {animal.tipo_concentrado_pez}
                      </span>
                    </div>
                  )}

                  {animal.proteina_porcentaje !== undefined &&
                    animal.proteina_porcentaje !== null && (
                      <div className="flex items-center gap-2">
                        <Percent className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                        <span className="text-xs">
                          {t("labels.protein")} {animal.proteina_porcentaje}%
                        </span>
                      </div>
                    )}

                  {animal.racion_diaria && (
                    <div className="flex items-center gap-2">
                      <Package className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        {t("labels.ration")} {animal.racion_diaria}
                      </span>
                    </div>
                  )}

                  {animal.consumo_pez && (
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        {t("labels.consumption")} {animal.consumo_pez}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-3" />
            </>
          )}

          {sanidad && (
            <>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Syringe className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />
                  <span className="text-xs font-medium text-cyan-700 dark:text-cyan-400">
                    {t("labels.health")}
                  </span>
                </div>

                <div className="space-y-1 bg-gray-50 dark:bg-gray-900/50 p-2 rounded-lg">
                  {sanidad.signos_clinicos && (
                    <div className="flex items-center gap-2">
                      <AlertCircle className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        <span className="font-medium">
                          {t("labels.clinicalSigns")}
                        </span>{" "}
                        {sanidad.signos_clinicos}
                      </span>
                    </div>
                  )}

                  {sanidad.tratamientos && (
                    <div className="flex items-center gap-2">
                      <Pill className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        <span className="font-medium">
                          {t("labels.treatments")}
                        </span>{" "}
                        {sanidad.tratamientos}
                      </span>
                    </div>
                  )}

                  {sanidad.banos_salinidad && (
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        <span className="font-medium">
                          {t("labels.bathsSalinity")}
                        </span>{" "}
                        {sanidad.banos_salinidad}
                      </span>
                    </div>
                  )}

                  {sanidad.laboratorio && (
                    <div className="flex items-center gap-2">
                      <Beaker className="h-3 w-3 text-cyan-600 dark:text-cyan-400" />
                      <span className="text-xs">
                        <span className="font-medium">
                          {t("labels.laboratory")}
                        </span>{" "}
                        {sanidad.laboratorio}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <Separator className="my-3" />
            </>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs text-muted-foreground truncate">
                {animal.finca?.nombre_finca || t("labels.noFarm")}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-gray-500" />
              <span className="text-xs text-muted-foreground">
                {animal.lote_activo ? (
                  <Badge className="bg-green-500 hover:bg-green-600 text-xs">
                    {t("labels.active")}
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    {t("labels.inactive")}
                  </Badge>
                )}
              </span>
            </div>

            {animal.fecha_siembra && (
              <div className="flex items-center gap-2 col-span-2">
                <Calendar className="h-3.5 w-3.5 text-gray-500" />
                <span className="text-xs text-muted-foreground">
                  {t("labels.stockingDate")}{" "}
                  {formatDateOnly(animal.fecha_siembra)}
                </span>
              </div>
            )}
          </div>
          <div className="flex justify-center w-full space-x-2 mt-4">
            <Button
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
              onClick={onEdit}
            >
              <Fish className="h-4 w-4 mr-2" />
              {t("buttons.editBatch")}
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
        title={t("deathModal.title")}
        description={t("deathModal.description")}
        showCloseButton={false}
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="death-quantity">
              {t("deathModal.deathQuantity")}
            </Label>
            <Input
              id="death-quantity"
              type="number"
              min={1}
              max={remainingQuantity}
              value={deathQuantity}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setDeathQuantity(Math.min(value, remainingQuantity));
              }}
              placeholder={t("deathModal.deathQuantityPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">
              {t("deathModal.availableQuantity", {
                quantity: remainingQuantity,
              })}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="death-reason">{t("deathModal.deathReason")}</Label>
            <Input
              id="death-reason"
              value={deathReason}
              onChange={(e) => setDeathReason(e.target.value)}
              placeholder={t("deathModal.deathReasonPlaceholder")}
            />
          </div>

          {remainingQuantity - deathQuantity === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800 font-medium">
                ⚠️ {t("deathModal.warningComplete")}
              </p>
            </div>
          )}

          {deathQuantity > 0 && remainingQuantity - deathQuantity > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                💡{" "}
                {t("deathModal.warningRemaining", {
                  quantity: remainingQuantity - deathQuantity,
                })}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setDeathDialogVisible(false);
              setDeathQuantity(0);
              setDeathReason("");
              setDeathStatus(false);
            }}
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            onClick={handleDeathStatusUpdate}
            disabled={deathQuantity <= 0 || !deathReason}
          >
            {t("buttons.registerMortality")}
          </Button>
        </div>
      </Modal>

      <Modal
        title={t("discardModal.title")}
        description={t("discardModal.description")}
        open={discardDialogVisible}
        onOpenChange={setDiscardDialogVisible}
        showCloseButton={false}
      >
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="discard-quantity">
              {t("discardModal.discardQuantity")}
            </Label>
            <Input
              id="discard-quantity"
              type="number"
              min={1}
              max={remainingQuantity}
              value={discardQuantity}
              onChange={(e) => {
                const value = parseInt(e.target.value) || 0;
                setDiscardQuantity(Math.min(value, remainingQuantity));
              }}
              placeholder={t("discardModal.discardQuantityPlaceholder")}
            />
            <p className="text-xs text-muted-foreground">
              {t("deathModal.availableQuantity", {
                quantity: remainingQuantity,
              })}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="discard-reason">
              {t("discardModal.discardReason")}
            </Label>
            <Input
              id="discard-reason"
              value={discardReason}
              onChange={(e) => setDiscardReason(e.target.value)}
              placeholder={t("discardModal.discardReasonPlaceholder")}
            />
          </div>

          {remainingQuantity - discardQuantity === 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-800 font-medium">
                ⚠️ {t("discardModal.warningComplete")}
              </p>
            </div>
          )}

          {discardQuantity > 0 && remainingQuantity - discardQuantity > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
              <p className="text-sm text-yellow-800">
                💡{" "}
                {t("discardModal.warningRemaining", {
                  quantity: remainingQuantity - discardQuantity,
                })}
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4">
          <Button
            variant="outline"
            onClick={() => {
              setDiscardDialogVisible(false);
              setDiscardQuantity(0);
              setDiscardReason("");
            }}
          >
            {t("buttons.cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={handleDiscardAnimal}
            disabled={discardQuantity <= 0 || !discardReason}
          >
            {t("buttons.discardCount", { quantity: discardQuantity })}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default PiscicolaCard;
