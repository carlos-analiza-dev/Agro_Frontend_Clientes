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
import { Camera, CircleAlert, Heart, Skull } from "lucide-react";
import { toast } from "react-toastify";
import { ActualizarAnimalMuerte } from "@/api/animales/accions/update-animal-status-muerte";
import InfoAnimal from "../info/InfoAnimal";
import AnimalTipoAlimentacion from "../info/AnimalTipoAlimentacion";
import AnimalComplementos from "../info/AnimalComplementos";
import AnimalMedicamento from "../info/AnimalMedicamento";
import ReproductiveStatus from "../info/ReproductiveStatus";
import AnimalParentInfo from "../info/AnimalParentInfo";
import AnimalFincaByPropietarion from "../info/AnimalFincaByPropietarion";
import { eliminarImagenAnimal } from "@/api/animales_profile/accions/delete-image-animal";
import ImageGallery from "@/components/generics/ImageGallery";
import { descartarAnimal } from "@/api/animales/accions/update-animal";
import Modal from "@/components/generics/Modal";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface Props {
  animal: Animal;
  onEdit: () => void;
  onUpdateProfileImage: (imageUri: string, animalId: string) => Promise<void>;
}

const AnimalCard = ({ animal, onEdit, onUpdateProfileImage }: Props) => {
  const t = useTranslations("AnimalCard");
  const [deathDialogVisible, setDeathDialogVisible] = useState(false);
  const [deathStatus, setDeathStatus] = useState(animal.animal_muerte);
  const [deathReason, setDeathReason] = useState(animal.razon_muerte);
  const [discardDialogVisible, setDiscardDialogVisible] = useState(false);
  const [discardReason, setDiscardReason] = useState("");
  const [galleryVisible, setGalleryVisible] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const todayDate = format(new Date(), "yyyy-MM-dd");
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

  return (
    <>
      <Card className="mb-4 overflow-hidden transition-all duration-200 hover:shadow-md">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between bg-green-600/25">
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
              <CardTitle className="text-lg">
                {animal.identificador.toUpperCase()}
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                {animal.especie.nombre} -{" "}
                {animal.razas.length === 1
                  ? animal.razas[0].nombre
                  : animal.razas.length > 1
                    ? t("labels.crossbreed")
                    : t("labels.noBreed")}{" "}
                - {animal.sexo}
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

          <Separator className="my-4" />

          {animal.finca && (
            <AnimalFincaByPropietarion
              fincaNombre={
                animal.finca
                  ? animal.finca.nombre_finca
                  : t("labels.notAvailable")
              }
              fincaAbreviatura={animal.finca.abreviatura}
              observaciones={animal.observaciones}
            />
          )}

          <div className="flex justify-center w-full space-x-2 mt-4">
            <Button className="w-full bg-green-600" onClick={onEdit}>
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

export default AnimalCard;
