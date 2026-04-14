"use client";
import useGetAllImagesProfile from "@/hooks/perfil/useGetAllImagesProfile";
import useGetImagePerfil from "@/hooks/perfil/useGetImagePerfil";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useState, useRef } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, MapPin, Phone, Calendar, CheckCircle2 } from "lucide-react";
import { toast } from "react-toastify";
import { Cliente } from "@/interfaces/auth/cliente";
import { eliminarImagen } from "@/api/profile-images/core/delete-image";
import ImageGallery from "@/components/generics/ImageGallery";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";

interface Props {
  user: Cliente | undefined;
  primary: string;
  height: number;
  onUpdateProfileImage?: (uri: string) => Promise<void>;
}

const Profile = ({ user, height, onUpdateProfileImage }: Props) => {
  const queryClient = useQueryClient();

  const [galleryVisible, setGalleryVisible] = useState(false);
  const [localImage, setLocalImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const { data: imagenes_user } = useGetAllImagesProfile();
  const { data: perfil } = useGetImagePerfil();

  const imageUrl = perfil?.data?.url;

  const handleImagePick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Por favor selecciona un archivo de imagen válido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no debe exceder los 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const selectedImage = e.target?.result as string;
      setLocalImage(selectedImage);

      if (onUpdateProfileImage) {
        try {
          await onUpdateProfileImage(selectedImage);
          toast("Perfil actualizado exitosamente");
          queryClient.invalidateQueries({ queryKey: ["perfil-users"] });
          queryClient.invalidateQueries({ queryKey: ["all-images-perfil"] });
        } catch (error) {
          toast.error("No se pudo actualizar la imagen de perfil");
          setLocalImage(null);
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const openGallery = () => {
    if (imagenes_user && imagenes_user.data.length > 0) {
      setGalleryVisible(true);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    try {
      await eliminarImagen(imageId);
      toast("Foto de perfil eliminada");
      queryClient.invalidateQueries({ queryKey: ["perfil-users"] });
      queryClient.invalidateQueries({ queryKey: ["all-images-perfil"] });
      setGalleryVisible(false);
    } catch (error) {
      if (isAxiosError(error)) {
        toast.error(
          error.response?.data?.message ||
            "Error al eliminar la foto de perfil",
        );
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-background">
      <div
        className="w-full bg-black relative"
        style={{ height: `${height * 0.2}px` }}
      >
        <div className="absolute left-5 -bottom-12">
          <div className="relative group">
            <Avatar
              className="w-24 h-24 border-4 border-white bg-white shadow-lg cursor-pointer"
              onClick={openGallery}
            >
              <AvatarImage
                src={imageUrl}
                alt={user?.nombre}
                className="object-cover"
              />
              <AvatarFallback className="bg-muted text-2xl font-bold">
                {user?.nombre ? getInitials(user.nombre) : "U"}
              </AvatarFallback>
            </Avatar>

            <Button
              size="icon"
              className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80"
              onClick={handleImagePick}
            >
              <Camera className="w-4 h-4 text-white" />
            </Button>
          </div>
        </div>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />

      <div className="px-4 mt-16">
        <Card>
          <CardContent className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-2xl font-black">{user?.nombre}</h1>
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {user?.municipio.nombre}, {user?.departamento.nombre},{" "}
                  {user?.pais.nombre}.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  {user?.telefono}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <span className="text-sm text-muted-foreground">
                  Se unió en{" "}
                  {new Date(user?.createdAt || "").toLocaleDateString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <AlertDialog open={galleryVisible} onOpenChange={setGalleryVisible}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>Galería de Imágenes</AlertDialogTitle>
            <AlertDialogDescription></AlertDialogDescription>
          </AlertDialogHeader>
          <div>
            <ImageGallery
              images={imagenes_user?.data || []}
              onClose={() => setGalleryVisible(false)}
              onDelete={handleDeleteImage}
              visible={galleryVisible}
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Profile;
