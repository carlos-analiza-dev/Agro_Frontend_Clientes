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
  Medal,
  Baby,
  Shield,
  Wallet,
  Dna,
} from "lucide-react";
import { toast } from "react-toastify";
import { ActualizarAnimalMuerte } from "@/api/animales/accions/update-animal-status-muerte";
import InfoAnimal from "./InfoAnimal";
import AnimalTipoAlimentacion from "./AnimalTipoAlimentacion";
import AnimalComplementos from "./AnimalComplementos";
import AnimalMedicamento from "./AnimalMedicamento";
import ReproductiveStatus from "./ReproductiveStatus";
import AnimalParentInfo from "./AnimalParentInfo";
import AnimalFincaByPropietarion from "./AnimalFincaByPropietarion";
import { eliminarImagenAnimal } from "@/api/animales_profile/accions/delete-image-animal";
import ImageGallery from "@/components/generics/ImageGallery";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/providers/store/useAuthStore";

interface Props {
  animal: Animal;
  onEdit: () => void;
  onUpdateProfileImage: (imageUri: string, animalId: string) => Promise<void>;
}

const AnimalCard = ({ animal, onEdit, onUpdateProfileImage }: Props) => {
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
  const isEquino = animal.especie.nombre.toLowerCase() === "equino";

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

  const renderEquinoInfo = () => {
    if (!isEquino) return null;

    return (
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <PawPrint className="h-4 w-4 text-purple-600" />
          <h4 className="text-sm font-semibold text-purple-700">
            Información Equina
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-purple-50 p-3 rounded-lg">
          {animal.desparasitado !== undefined && (
            <div className="flex items-center gap-2">
              <Syringe className="h-3 w-3 text-purple-600" />
              <span className="text-xs">
                <span className="font-medium">Desparasitado:</span>{" "}
                <Badge
                  variant={animal.desparasitado ? "default" : "secondary"}
                  className="text-xs"
                >
                  {animal.desparasitado ? "Sí" : "No"}
                </Badge>
              </span>
            </div>
          )}

          {animal.vacunas && animal.vacunas !== "Sin vacunas" && (
            <div className="flex items-center gap-2">
              <Syringe className="h-3 w-3 text-purple-600" />
              <span className="text-xs">
                <span className="font-medium">Vacunas:</span> {animal.vacunas}
              </span>
            </div>
          )}

          {animal.peso_actual && (
            <div className="flex items-center gap-2">
              <Scale className="h-3 w-3 text-purple-600" />
              <span className="text-xs">
                <span className="font-medium">Peso:</span> {animal.peso_actual}{" "}
                kg
              </span>
            </div>
          )}

          {animal.condicion_corporal && (
            <div className="flex items-center gap-2">
              <Activity className="h-3 w-3 text-purple-600" />
              <span className="text-xs">
                <span className="font-medium">Condición:</span>{" "}
                {animal.condicion_corporal}
              </span>
            </div>
          )}

          {animal.nivel_entrenamiento && (
            <div className="flex items-center gap-2">
              <Dumbbell className="h-3 w-3 text-purple-600" />
              <span className="text-xs">
                <span className="font-medium">Entrenamiento:</span>{" "}
                {animal.nivel_entrenamiento}
              </span>
            </div>
          )}

          {animal.resultados_competencias && (
            <div className="flex items-center gap-2 col-span-2">
              <Award className="h-3 w-3 text-purple-600" />
              <span className="text-xs">
                <span className="font-medium">Resultados:</span>{" "}
                {animal.resultados_competencias}
              </span>
            </div>
          )}

          {animal.historial_reproductivo && (
            <div className="flex items-center gap-2 col-span-2">
              <Baby className="h-3 w-3 text-purple-600" />
              <span className="text-xs">
                <span className="font-medium">Historial Reproductivo:</span>{" "}
                {animal.historial_reproductivo}
              </span>
            </div>
          )}

          {animal.uso_equino && (
            <div className="flex items-center gap-2 col-span-2">
              <Dna className="h-3 w-3 text-purple-600" />
              <span className="text-xs">
                <span className="font-medium">Uso:</span> {animal.uso_equino}
              </span>
            </div>
          )}

          {animal.valor_estimado && (
            <div className="flex items-center gap-2">
              <Wallet className="h-3 w-3 text-purple-600" />
              <span className="text-xs">
                <span className="font-medium">Valor:</span> {moneda}{" "}
                {animal.valor_estimado.toLocaleString()}
              </span>
            </div>
          )}

          {animal.precio_compra && (
            <div className="flex items-center gap-2">
              <Wallet className="h-3 w-3 text-purple-600" />
              <span className="text-xs">
                <span className="font-medium">Valor Compra:</span> {moneda}{" "}
                {animal.precio_compra.toLocaleString()}
              </span>
            </div>
          )}

          {animal.asegurado !== undefined && (
            <div className="flex items-center gap-2">
              <Shield className="h-3 w-3 text-purple-600" />
              <span className="text-xs">
                <span className="font-medium">Asegurado:</span>{" "}
                <Badge
                  variant={animal.asegurado ? "default" : "secondary"}
                  className="text-xs"
                >
                  {animal.asegurado ? "Sí" : "No"}
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
      <Card className="mb-4 overflow-hidden transition-all duration-200 hover:shadow-md">
        <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
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
                    ? "Encaste"
                    : "Sin raza"}{" "}
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
              title="Subir Foto"
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
            title="Datos del Padre"
            nombre={animal.nombre_padre ?? undefined}
            arete={animal.arete_padre ?? undefined}
            razas={animal.razas_padre}
          />

          <AnimalParentInfo
            title="Datos de la Madre"
            nombre={animal.nombre_madre ?? undefined}
            arete={animal.arete_madre ?? undefined}
            razas={animal.razas_madre}
            numeroParto={animal.numero_parto_madre}
          />

          {renderEquinoInfo()}

          <Separator className="my-4" />

          <AnimalFincaByPropietarion
            fincaNombre={animal.finca.nombre_finca}
            fincaAbreviatura={animal.finca.abreviatura}
            observaciones={animal.observaciones}
          />

          <div className="flex justify-center w-full space-x-2 mt-4">
            <Button className="w-full" variant="outline" onClick={onEdit}>
              Editar
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
              {deathStatus ? "Marcar como fallecido" : "Marcar como vivo"}
            </DialogTitle>
            <DialogDescription>
              Actualiza el estado de vida del animal
            </DialogDescription>
          </DialogHeader>

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

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeathDialogVisible(false)}
            >
              Cancelar
            </Button>
            <Button onClick={handleDeathStatusUpdate}>Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AnimalCard;
