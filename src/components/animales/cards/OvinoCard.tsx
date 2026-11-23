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
  PawPrint,
  Activity,
  Syringe,
  Scale,
  Scissors,
  Pill,
  Dna,
  Ruler,
  Weight,
  Cloud,
  Calendar,
  User,
  AlertTriangle,
  Skull,
} from "lucide-react";
import { toast } from "react-toastify";
import { ActualizarAnimalMuerte } from "@/api/animales/accions/update-animal-status-muerte";
import { eliminarImagenAnimal } from "@/api/animales_profile/accions/delete-image-animal";
import ImageGallery from "@/components/generics/ImageGallery";
import { Badge } from "@/components/ui/badge";
import InfoAnimal from "../info/InfoAnimal";
import AnimalTipoAlimentacion from "../info/AnimalTipoAlimentacion";
import AnimalComplementos from "../info/AnimalComplementos";
import AnimalMedicamento from "../info/AnimalMedicamento";
import ReproductiveStatus from "../info/ReproductiveStatus";
import AnimalParentInfo from "../info/AnimalParentInfo";
import AnimalFincaByPropietarion from "../info/AnimalFincaByPropietarion";
import { format } from "date-fns";
import { formatDate } from "@/helpers/funciones/formatDate";
import { descartarAnimal } from "@/api/animales/accions/update-animal";
import Modal from "@/components/generics/Modal";
import { useTranslations } from "next-intl";

interface Props {
  animal: Animal;
  onEdit: () => void;
  onUpdateProfileImage: (imageUri: string, animalId: string) => Promise<void>;
}

const OvinoCard = ({ animal, onEdit, onUpdateProfileImage }: Props) => {
  const t = useTranslations("OvinoCard");
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
  const imageUrl = animal.profileImages[0]?.url;
  const isOvino = animal.especie.nombre.toLowerCase() === "ovino";

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
          toast(t("messages.profileImageUpdated"));
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
      toast(t("messages.profileImageDeleted"));
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
      if (
        deathStatus &&
        (!deathReason || deathReason.trim() === "" || deathReason === "N/D")
      ) {
        toast.error(t("validation.deathReasonRequired"));
        return;
      }

      await ActualizarAnimalMuerte(animal.id, {
        cantidad: 1,
        razon_muerte: deathReason,
        fecha_mortalidad: todayDate,
        muerto: true,
      });

      toast(
        deathStatus
          ? t("messages.markedAsDeceased")
          : t("messages.markedAsAlive"),
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
            : t("messages.updateStatusError");

        toast(errorMessage);
      } else {
        toast(t("messages.contactAdmin"));
      }
    }
  };

  const handleDiscardAnimal = async () => {
    try {
      if (!discardReason || discardReason.trim() === "") {
        toast.error(t("validation.discardReasonRequired"));
        return;
      }

      await descartarAnimal(animal.id, {
        descartado: true,
        razon_descarte: discardReason,
        fecha_descarte: todayDate,
        cantidad: 1,
      });

      toast(t("messages.discardedSuccess"));
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
            : t("messages.discardError");

        toast.error(errorMessage);
      } else {
        toast.error(t("messages.contactAdmin"));
      }
    }
  };

  const renderOvinoInfo = () => {
    if (!isOvino) return null;

    return (
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <PawPrint className="h-4 w-4 text-green-600" />
          <h4 className="text-sm font-semibold text-green-700">
            {t("ovinoInfo.title")}
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
          {animal.categoria_edad && (
            <div className="flex items-center gap-2 col-span-2">
              <Calendar className="h-3 w-3 text-green-600" />
              <span className="text-xs">
                <span className="font-medium">{t("ovinoInfo.category")}</span>{" "}
                <Badge variant="outline" className="text-xs">
                  {animal.categoria_edad}
                </Badge>
              </span>
            </div>
          )}

          {animal.condicion_corporal && (
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-green-600" />
              <span className="text-xs">
                <span className="font-medium">
                  {t("ovinoInfo.bodyCondition")}
                </span>{" "}
                <Badge variant="outline" className="text-xs">
                  {animal.condicion_corporal}
                </Badge>
              </span>
            </div>
          )}

          {animal.proposito && (
            <div className="flex items-center gap-2">
              <Dna className="h-3 w-3 text-green-600" />
              <span className="text-xs">
                <span className="font-medium">{t("ovinoInfo.purpose")}</span>{" "}
                <Badge variant="outline" className="text-xs">
                  {animal.proposito}
                </Badge>
              </span>
            </div>
          )}

          {animal.potrero && (
            <div className="flex items-center gap-2 col-span-2">
              <Ruler className="h-3 w-3 text-green-600" />
              <span className="text-xs">
                <span className="font-medium">{t("ovinoInfo.paddock")}</span>{" "}
                {animal.potrero}
              </span>
            </div>
          )}

          {animal.peso_nacimiento && (
            <div className="flex items-center gap-2">
              <Weight className="h-3 w-3 text-blue-600" />
              <span className="text-xs">
                <span className="font-medium">
                  {t("ovinoInfo.birthWeight")}
                </span>{" "}
                {animal.peso_nacimiento} kg
              </span>
            </div>
          )}

          {animal.peso_destete && (
            <div className="flex items-center gap-2">
              <Weight className="h-3 w-3 text-blue-600" />
              <span className="text-xs">
                <span className="font-medium">
                  {t("ovinoInfo.weaningWeight")}
                </span>{" "}
                {animal.peso_destete} kg
              </span>
            </div>
          )}

          {animal.ganancia_peso && (
            <div className="flex items-center gap-2">
              <Scale className="h-3 w-3 text-blue-600" />
              <span className="text-xs">
                <span className="font-medium">{t("ovinoInfo.weightGain")}</span>{" "}
                {animal.ganancia_peso} kg
              </span>
            </div>
          )}

          {animal.lana && (
            <>
              <div className="flex items-center gap-2 col-span-2 mt-1">
                <Cloud className="h-3 w-3 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">
                  {t("ovinoInfo.woolData")}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 col-span-2 pl-4">
                {animal.lana.fecha_esquila && (
                  <span className="text-xs">
                    <span className="font-medium">
                      {t("ovinoInfo.lastShearing")}
                    </span>{" "}
                    {formatDate(animal.lana.fecha_esquila)}
                  </span>
                )}
                {animal.lana.calidad_micras && (
                  <span className="text-xs">
                    <span className="font-medium">
                      {t("ovinoInfo.microns")}
                    </span>{" "}
                    {animal.lana.calidad_micras}
                  </span>
                )}
                {animal.lana.color_lana && (
                  <span className="text-xs">
                    <span className="font-medium">{t("ovinoInfo.color")}</span>{" "}
                    {animal.lana.color_lana}
                  </span>
                )}
                {animal.lana.peso_vellon && (
                  <span className="text-xs">
                    <span className="font-medium">
                      {t("ovinoInfo.fleeceWeight")}
                    </span>{" "}
                    {animal.lana.peso_vellon} kg
                  </span>
                )}
              </div>
            </>
          )}

          {animal.historial_esquila && animal.historial_esquila.length > 0 && (
            <>
              <div className="flex items-center gap-2 col-span-2 mt-1">
                <Scissors className="h-3 w-3 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">
                  {t("ovinoInfo.shearingHistory")}
                </span>
              </div>
              <div className="col-span-2 pl-4 space-y-1">
                {animal.historial_esquila.slice(0, 3).map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-center gap-2 text-xs bg-white/50 dark:bg-black/20 p-1 rounded"
                  >
                    <span className="font-medium">
                      {formatDate(item.fecha_esquila)}:
                    </span>
                    {item.peso_vellon_kg && (
                      <span>{item.peso_vellon_kg} kg</span>
                    )}
                    {item.calidad_clasificacion && (
                      <Badge variant="outline" className="text-xs">
                        {item.calidad_clasificacion}
                      </Badge>
                    )}
                    {item.esquilador_responsable && (
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {item.esquilador_responsable}
                      </span>
                    )}
                  </div>
                ))}
                {animal.historial_esquila.length > 3 && (
                  <span className="text-xs text-muted-foreground">
                    {t("ovinoInfo.moreRecords", {
                      count: animal.historial_esquila.length - 3,
                    })}
                  </span>
                )}
              </div>
            </>
          )}

          {animal.famacha !== undefined && (
            <div className="flex items-center gap-2 col-span-2">
              <AlertTriangle
                className={`h-3 w-3 ${
                  animal.famacha >= 4
                    ? "text-red-600"
                    : animal.famacha >= 3
                      ? "text-yellow-600"
                      : "text-green-600"
                }`}
              />
              <span className="text-xs">
                <span className="font-medium">{t("ovinoInfo.famacha")}</span>{" "}
                <Badge
                  variant={
                    animal.famacha >= 4
                      ? "destructive"
                      : animal.famacha >= 3
                        ? "outline"
                        : "default"
                  }
                  className="text-xs"
                >
                  {animal.famacha} / 5
                </Badge>
                {animal.famacha >= 4 && (
                  <span className="ml-1 text-red-600 text-xs font-medium">
                    {t("ovinoInfo.anemiaWarning")}
                  </span>
                )}
                {animal.famacha >= 1 && animal.famacha <= 5 && (
                  <span className="ml-1 text-muted-foreground text-xs">
                    {animal.famacha === 1 && t("famachaLevels.optimal")}
                    {animal.famacha === 2 && t("famachaLevels.good")}
                    {animal.famacha === 3 && t("famachaLevels.limit")}
                    {animal.famacha === 4 && t("famachaLevels.anemic")}
                    {animal.famacha === 5 && t("famachaLevels.severe")}
                  </span>
                )}
              </span>
            </div>
          )}

          {animal.parasitos && animal.parasitos.length > 0 && (
            <>
              <div className="flex items-center gap-2 col-span-2 mt-1">
                <Pill className="h-3 w-3 text-red-600" />
                <span className="text-xs font-medium text-red-700">
                  {t("ovinoInfo.parasitesRecord")}
                </span>
              </div>
              <div className="col-span-2 pl-4 space-y-1">
                {animal.parasitos.slice(0, 2).map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap items-center gap-2 text-xs bg-white/50 dark:bg-black/20 p-1 rounded"
                  >
                    {item.famacha && (
                      <Badge variant="outline" className="text-xs">
                        FAMACHA: {item.famacha}
                      </Badge>
                    )}
                    {item.tratamiento && (
                      <span className="font-medium">{item.tratamiento}</span>
                    )}
                    {item.fecha_tratamiento && (
                      <span>{formatDate(item.fecha_tratamiento)}</span>
                    )}
                    {item.observaciones && (
                      <span className="text-muted-foreground">
                        {item.observaciones}
                      </span>
                    )}
                  </div>
                ))}
                {animal.parasitos.length > 2 && (
                  <span className="text-xs text-muted-foreground">
                    {t("ovinoInfo.moreRecords", {
                      count: animal.parasitos.length - 2,
                    })}
                  </span>
                )}
              </div>
            </>
          )}

          {(animal.desparasitado !== undefined ||
            (animal.vacunas && animal.vacunas !== "Sin vacunas") ||
            animal.tratamientos ||
            animal.pezunas) && (
            <>
              <div className="flex items-center gap-2 col-span-2 mt-1">
                <Syringe className="h-3 w-3 text-red-600" />
                <span className="text-xs font-medium text-red-700">
                  {t("ovinoInfo.healthAndManagement")}
                </span>
              </div>
              <div className="flex items-center gap-2 col-span-2 pl-4 flex-wrap">
                {animal.desparasitado !== undefined && (
                  <span className="text-xs">
                    <span className="font-medium">
                      {t("ovinoInfo.dewormed")}
                    </span>{" "}
                    <Badge
                      variant={animal.desparasitado ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {animal.desparasitado
                        ? t("ovinoInfo.yes")
                        : t("ovinoInfo.no")}
                    </Badge>
                  </span>
                )}
                {animal.vacunas && animal.vacunas !== "Sin vacunas" && (
                  <span className="text-xs">
                    <span className="font-medium">
                      {t("ovinoInfo.vaccines")}
                    </span>{" "}
                    {animal.vacunas}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 col-span-2 pl-4 flex-wrap">
                {animal.tratamientos && (
                  <span className="text-xs">
                    <span className="font-medium">
                      {t("ovinoInfo.treatments")}
                    </span>{" "}
                    {animal.tratamientos}
                  </span>
                )}
                {animal.pezunas && (
                  <span className="text-xs">
                    <span className="font-medium">{t("ovinoInfo.hooves")}</span>{" "}
                    {animal.pezunas}
                  </span>
                )}
              </div>
            </>
          )}

          {animal.mortalidad !== undefined && (
            <div className="flex items-center gap-2 col-span-2">
              <CircleAlert className="h-3 w-3 text-red-600" />
              <span className="text-xs">
                <span className="font-medium">{t("ovinoInfo.mortality")}</span>{" "}
                <Badge
                  variant={animal.mortalidad ? "destructive" : "default"}
                  className="text-xs"
                >
                  {animal.mortalidad ? t("ovinoInfo.yes") : t("ovinoInfo.no")}
                </Badge>
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <Card className="mb-4 overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-purple-500">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-purple-100">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Avatar
                className="h-12 w-12 cursor-pointer"
                onClick={openGallery}
              >
                <AvatarImage
                  src={localImage || imageUrl}
                  alt={animal.identificador}
                />
                <AvatarFallback>
                  {animal.identificador.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                {animal.identificador.toUpperCase()}
                {animal.sexo === "Macho" ? (
                  <span className="text-blue-500 text-sm">♂</span>
                ) : (
                  <span className="text-pink-500 text-sm">♀</span>
                )}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {animal.especie.nombre} -{" "}
                {animal.razas.length === 1
                  ? animal.razas[0].nombre
                  : animal.razas.length > 1
                    ? t("labels.crossbreed")
                    : t("labels.noBreed")}
              </p>
              {animal.nombre_animal && (
                <p className="text-sm text-muted-foreground">
                  {animal.nombre_animal}
                </p>
              )}
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={() => {
                setDeathStatus(animal.animal_muerte);
                setDeathReason(animal.razon_muerte);
                setDeathDialogVisible(true);
              }}
            >
              {animal.animal_muerte ? (
                <CircleAlert className="h-4 w-4" />
              ) : (
                <Heart className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              title={t("tooltips.discardAnimal")}
              className="h-8 w-8 rounded-full"
              onClick={() => setDiscardDialogVisible(true)}
            >
              <Skull className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              title={t("tooltips.uploadPhoto")}
              className="h-8 w-8 rounded-full"
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

        <CardContent className="p-4 pt-2">
          <InfoAnimal animal={animal} />

          {animal.tipo_alimentacion && animal.tipo_alimentacion.length > 0 && (
            <AnimalTipoAlimentacion animal={animal} />
          )}

          {animal.complementos && animal.complementos.length > 0 && (
            <AnimalComplementos animal={animal} />
          )}

          {animal.medicamento && <AnimalMedicamento animal={animal} />}

          {animal.sexo === "Macho" && (
            <ReproductiveStatus sexo="Macho" valor={animal.castrado} />
          )}

          {animal.sexo === "Hembra" && (
            <ReproductiveStatus sexo="Hembra" valor={animal.esterelizado} />
          )}

          <AnimalParentInfo
            title={t("labels.fatherData")}
            nombre={animal.nombre_padre ?? undefined}
            arete={animal.arete_padre ?? undefined}
            razas={animal.razas_padre}
          />

          <AnimalParentInfo
            title={t("labels.motherData")}
            nombre={animal.nombre_madre ?? undefined}
            arete={animal.arete_madre ?? undefined}
            razas={animal.razas_madre}
            numeroParto={animal.numero_parto_madre}
          />

          {renderOvinoInfo()}

          <Separator className="my-4" />

          <AnimalFincaByPropietarion
            fincaNombre={animal.finca.nombre_finca}
            fincaAbreviatura={animal.finca.abreviatura}
            observaciones={animal.observaciones}
          />

          <div className="flex justify-center w-full space-x-2 mt-4">
            <Button className="w-full" variant="outline" onClick={onEdit}>
              {t("buttons.edit")}
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
        <div className="flex items-center justify-between py-4">
          <Label htmlFor="death-status">{t("deathModal.hasDied")}</Label>
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
            <Label htmlFor="death-reason">{t("deathModal.deathReason")}</Label>
            <Input
              id="death-reason"
              value={deathReason}
              onChange={(e) => setDeathReason(e.target.value)}
              placeholder={t("deathModal.deathReasonPlaceholder")}
            />
          </div>
        )}

        <div className="flex justify-end">
          <div className="flex gap-4">
            <Button
              variant="outline"
              onClick={() => setDeathDialogVisible(false)}
            >
              {t("buttons.cancel")}
            </Button>
            <Button onClick={handleDeathStatusUpdate}>
              {t("buttons.save")}
            </Button>
          </div>
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

          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ {t("discardModal.warningLabel")}</strong>{" "}
              {t("discardModal.warningText")}
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
              {t("buttons.cancel")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDiscardAnimal}
              disabled={!discardReason}
            >
              {t("buttons.discardAnimal")}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default OvinoCard;
