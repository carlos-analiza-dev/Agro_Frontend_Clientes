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
  Activity,
  Syringe,
  Scale,
  Scissors,
  Pill,
  Shield,
  Dna,
  Ruler,
  Weight,
  Cloud,
  Calendar,
  User,
  AlertTriangle,
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

const OvinoCard = ({ animal, onEdit, onUpdateProfileImage }: Props) => {
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

  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "N/A";
    const d = new Date(date);
    return d.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const renderOvinoInfo = () => {
    if (!isOvino) return null;

    return (
      <div className="mt-3 space-y-2">
        <div className="flex items-center gap-2">
          <PawPrint className="h-4 w-4 text-green-600" />
          <h4 className="text-sm font-semibold text-green-700">
            Información Ovina
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 bg-green-50 dark:bg-green-950/20 p-3 rounded-lg">
          {animal.categoria_edad && (
            <div className="flex items-center gap-2 col-span-2">
              <Calendar className="h-3 w-3 text-green-600" />
              <span className="text-xs">
                <span className="font-medium">Categoría:</span>{" "}
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
                <span className="font-medium">Condición Corporal:</span>{" "}
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
                <span className="font-medium">Propósito:</span>{" "}
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
                <span className="font-medium">Potrero:</span> {animal.potrero}
              </span>
            </div>
          )}

          {animal.peso_nacimiento && (
            <div className="flex items-center gap-2">
              <Weight className="h-3 w-3 text-blue-600" />
              <span className="text-xs">
                <span className="font-medium">Peso Nacimiento:</span>{" "}
                {animal.peso_nacimiento} kg
              </span>
            </div>
          )}

          {animal.peso_destete && (
            <div className="flex items-center gap-2">
              <Weight className="h-3 w-3 text-blue-600" />
              <span className="text-xs">
                <span className="font-medium">Peso Destete:</span>{" "}
                {animal.peso_destete} kg
              </span>
            </div>
          )}

          {animal.ganancia_peso && (
            <div className="flex items-center gap-2">
              <Scale className="h-3 w-3 text-blue-600" />
              <span className="text-xs">
                <span className="font-medium">Ganancia Peso:</span>{" "}
                {animal.ganancia_peso} kg
              </span>
            </div>
          )}

          {animal.lana && (
            <>
              <div className="flex items-center gap-2 col-span-2 mt-1">
                <Cloud className="h-3 w-3 text-purple-600" />
                <span className="text-xs font-medium text-purple-700">
                  Datos de Lana
                </span>
              </div>
              <div className="flex flex-wrap gap-2 col-span-2 pl-4">
                {animal.lana.fecha_esquila && (
                  <span className="text-xs">
                    <span className="font-medium">Última esquila:</span>{" "}
                    {formatDate(animal.lana.fecha_esquila)}
                  </span>
                )}
                {animal.lana.calidad_micras && (
                  <span className="text-xs">
                    <span className="font-medium">Micras:</span>{" "}
                    {animal.lana.calidad_micras}
                  </span>
                )}
                {animal.lana.color_lana && (
                  <span className="text-xs">
                    <span className="font-medium">Color:</span>{" "}
                    {animal.lana.color_lana}
                  </span>
                )}
                {animal.lana.peso_vellon && (
                  <span className="text-xs">
                    <span className="font-medium">Peso vellón:</span>{" "}
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
                  Historial de Esquila
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
                    +{animal.historial_esquila.length - 3} registros más
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
                <span className="font-medium">FAMACHA:</span>{" "}
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
                    (¡Anemia!)
                  </span>
                )}
                {animal.famacha >= 1 && animal.famacha <= 5 && (
                  <span className="ml-1 text-muted-foreground text-xs">
                    {animal.famacha === 1 && "Óptimo"}
                    {animal.famacha === 2 && "Bueno"}
                    {animal.famacha === 3 && "Límite"}
                    {animal.famacha === 4 && "Anémico"}
                    {animal.famacha === 5 && "Severo"}
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
                  Registro de Parásitos
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
                    +{animal.parasitos.length - 2} registros más
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
                  Salud y Manejo
                </span>
              </div>
              <div className="flex items-center gap-2 col-span-2 pl-4 flex-wrap">
                {animal.desparasitado !== undefined && (
                  <span className="text-xs">
                    <span className="font-medium">Desparasitado:</span>{" "}
                    <Badge
                      variant={animal.desparasitado ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {animal.desparasitado ? "Sí" : "No"}
                    </Badge>
                  </span>
                )}
                {animal.vacunas && animal.vacunas !== "Sin vacunas" && (
                  <span className="text-xs">
                    <span className="font-medium">Vacunas:</span>{" "}
                    {animal.vacunas}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 col-span-2 pl-4 flex-wrap">
                {animal.tratamientos && (
                  <span className="text-xs">
                    <span className="font-medium">Tratamientos:</span>{" "}
                    {animal.tratamientos}
                  </span>
                )}
                {animal.pezunas && (
                  <span className="text-xs">
                    <span className="font-medium">Pezuñas:</span>{" "}
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
                <span className="font-medium">Mortalidad:</span>{" "}
                <Badge
                  variant={animal.mortalidad ? "destructive" : "default"}
                  className="text-xs"
                >
                  {animal.mortalidad ? "Sí" : "No"}
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
      <Card className="mb-4 overflow-hidden transition-all duration-200 hover:shadow-md border-l-4 border-l-green-500">
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
                    ? "Encaste"
                    : "Sin raza"}
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

          {renderOvinoInfo()}

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

export default OvinoCard;
