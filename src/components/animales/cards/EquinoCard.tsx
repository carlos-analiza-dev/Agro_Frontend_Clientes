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
  Skull,
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
import { descartarAnimal } from "@/api/animales/accions/update-animal";
import Modal from "@/components/generics/Modal";
import { useTranslations } from "next-intl";

interface Props {
  animal: Animal;
  onEdit: () => void;
  onUpdateProfileImage: (imageUri: string, animalId: string) => Promise<void>;
}

const EquinoCard = ({ animal, onEdit, onUpdateProfileImage }: Props) => {
  const t = useTranslations("EquinoCard");
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
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
    if (!animal.alzada) return t("labels.notAvailable");
    const unidad =
      animal.unidad_alzada === "manos" ? t("labels.hands") : t("labels.cm");
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
                    {t("labels.deceased")}
                  </Badge>
                )}
                {animal.asegurado && (
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 border-blue-200 text-[8px] sm:text-[10px]"
                  >
                    <Shield className="h-2.5 w-2.5 mr-0.5" />
                    {t("labels.insured")}
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                <p className="text-xs sm:text-sm text-slate-600 truncate">
                  {animal.razas.length === 1
                    ? animal.razas[0].nombre
                    : animal.razas.length > 1
                      ? t("labels.crossbreed")
                      : t("labels.noBreed")}{" "}
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
                    {t("labels.yearsOld", { count: animal.edad_promedio })}
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
            <InfoBadge
              icon={Hash}
              label={t("labels.id")}
              value={animal.identificador}
            />
            <InfoBadge
              icon={Calendar}
              label={t("labels.birthDate")}
              value={
                animal.fecha_nacimiento
                  ? format(new Date(animal.fecha_nacimiento), "dd/MM/yyyy", {
                      locale: es,
                    })
                  : t("labels.notAvailable")
              }
            />
            <InfoBadge
              icon={Ruler}
              label={t("labels.height")}
              value={formatAlzada()}
            />
            <InfoBadge
              icon={Scale}
              label={t("labels.weight")}
              value={
                animal.peso_actual
                  ? `${animal.peso_actual} kg`
                  : t("labels.notAvailable")
              }
            />
          </div>

          <Separator className="my-3" />

          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-600" />
              <h4 className="text-sm font-semibold text-slate-700">
                {t("labels.equineInfo")}
              </h4>
              <Badge
                variant="outline"
                className="bg-slate-100 text-slate-600 border-slate-200 text-[8px] sm:text-[10px]"
              >
                {t("labels.details")}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="space-y-2">
                <EquinoInfoItem
                  icon={Syringe}
                  label={t("labels.dewormed")}
                  value={
                    <Badge
                      variant={animal.desparasitado ? "default" : "secondary"}
                      className="text-[10px] sm:text-xs"
                    >
                      {animal.desparasitado ? t("labels.yes") : t("labels.no")}
                    </Badge>
                  }
                  show={animal.desparasitado !== undefined}
                />
                <EquinoInfoItem
                  icon={Syringe}
                  label={t("labels.vaccines")}
                  value={animal.vacunas}
                  show={!!animal.vacunas && animal.vacunas !== "Sin vacunas"}
                />
                <EquinoInfoItem
                  icon={Stethoscope}
                  label={t("labels.veterinarian")}
                  value={animal.veterinario}
                  show={!!animal.veterinario}
                />
                <EquinoInfoItem
                  icon={Activity}
                  label={t("labels.bodyCondition")}
                  value={
                    <Badge
                      className={cn(
                        "text-[10px] sm:text-xs",
                        getStatusColor(animal.condicion_corporal || ""),
                      )}
                    >
                      {animal.condicion_corporal
                        ?.replace(/_/g, " ")
                        .toUpperCase() || t("labels.notAvailable")}
                    </Badge>
                  }
                  show={!!animal.condicion_corporal}
                />
                <EquinoInfoItem
                  icon={Dumbbell}
                  label={t("labels.trainingLevel")}
                  value={animal.nivel_entrenamiento}
                  show={!!animal.nivel_entrenamiento}
                />
                <EquinoInfoItem
                  icon={Dna}
                  label={t("labels.use")}
                  value={animal.uso_equino}
                  show={!!animal.uso_equino}
                />
              </div>

              <div className="space-y-2">
                <EquinoInfoItem
                  icon={BookOpen}
                  label={t("labels.genealogicalRecord")}
                  value={animal.registro_genealogico}
                  show={!!animal.registro_genealogico}
                />
                <EquinoInfoItem
                  icon={Microscope}
                  label={t("labels.microchip")}
                  value={animal.microchip}
                  show={!!animal.microchip}
                />
                <EquinoInfoItem
                  icon={Scissors}
                  label={t("labels.dentistry")}
                  value={animal.odontologia}
                  show={!!animal.odontologia}
                />
                <EquinoInfoItem
                  icon={AlertTriangle}
                  label={t("labels.allergies")}
                  value={animal.alergias}
                  show={!!animal.alergias}
                />
                <EquinoInfoItem
                  icon={Activity}
                  label={t("labels.injuries")}
                  value={animal.lesiones}
                  show={!!animal.lesiones}
                />
                <EquinoInfoItem
                  icon={Award}
                  label={t("labels.competitionResults")}
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
                    {t("labels.reproductiveHistory")}
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
                    label={t("labels.estimatedValue")}
                    value={`${moneda} ${animal.valor_estimado?.toLocaleString() || t("labels.notAvailable")}`}
                    show={!!animal.valor_estimado}
                  />
                  <EquinoInfoItem
                    icon={TrendingUp}
                    label={t("labels.purchasePrice")}
                    value={`${moneda} ${animal.precio_compra?.toLocaleString() || t("labels.notAvailable")}`}
                    show={!!animal.precio_compra}
                  />
                </div>
              </>
            )}

            <Separator className="my-2" />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <EquinoInfoItem
                icon={User}
                label={t("labels.owner")}
                value={animal.propietario?.name}
                show={!!animal.propietario?.name}
              />
              <EquinoInfoItem
                icon={MapPin}
                label={t("labels.location")}
                value={animal.finca?.nombre_finca}
                show={!!animal.finca?.nombre_finca}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <EquinoInfoItem
                icon={Tag}
                label={t("labels.purity")}
                value={animal.pureza}
                show={!!animal.pureza}
              />
              <EquinoInfoItem
                icon={Droplet}
                label={t("labels.reproductionType")}
                value={animal.tipo_reproduccion}
                show={!!animal.tipo_reproduccion}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="p-2 bg-blue-50 rounded-lg border border-blue-100">
                <p className="text-[10px] font-medium text-blue-700">
                  {t("labels.father")}
                </p>
                <p className="text-xs text-gray-700">
                  {animal.nombre_padre || t("labels.notAvailable")}
                </p>
                {animal.arete_padre && (
                  <p className="text-[10px] text-gray-500">
                    {t("labels.id")}: {animal.arete_padre}
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
                <p className="text-[10px] font-medium text-pink-700">
                  {t("labels.mother")}
                </p>
                <p className="text-xs text-gray-700">
                  {animal.nombre_madre || t("labels.notAvailable")}
                </p>
                {animal.arete_madre && (
                  <p className="text-[10px] text-gray-500">
                    {t("labels.id")}: {animal.arete_madre}
                  </p>
                )}
                {animal.numero_parto_madre && (
                  <p className="text-[10px] text-gray-500">
                    {t("labels.calvings")}: {animal.numero_parto_madre}
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
                    <span className="font-medium">
                      {t("labels.observations")}
                    </span>{" "}
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
              {t("buttons.editEquine")}
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
