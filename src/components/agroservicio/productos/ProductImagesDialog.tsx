import { AgroProducto } from "@/api/agroservicio/productos/interface/response-productos-agro.interface";
import { eliminarImagen } from "@/api/agroservicio/productos/accions/eliminar-imagen";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { X, Trash2, ZoomIn } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface ProductImagesDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  producto: AgroProducto | null;
  onSuccess?: () => void;
}

export const ProductImagesDialog = ({
  open,
  onOpenChange,
  producto,
  onSuccess,
}: ProductImagesDialogProps) => {
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const queryClient = useQueryClient();
  if (!producto) return null;

  const hasImages = producto.images && producto.images.length > 0;

  const handleDeleteImage = async (imageId: string) => {
    setDeletingId(imageId);
    try {
      await eliminarImagen(imageId);
      toast.success("Imagen eliminada exitosamente");
      queryClient.invalidateQueries({ queryKey: ["agro-productos"] });
      onSuccess?.();
    } catch (error) {
      toast.error("Error al eliminar la imagen");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>Imágenes de {producto.nombre}</span>
              <span className="text-sm font-normal text-muted-foreground">
                ({producto.images?.length || 0} imágenes)
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="overflow-y-auto max-h-[60vh] pr-2">
            {!hasImages ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <div className="p-4 bg-muted rounded-full mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src="/images/Image-not-found.png" />
                    <AvatarFallback>N/A</AvatarFallback>
                  </Avatar>
                </div>
                <p className="text-lg font-medium">Sin imágenes</p>
                <p className="text-sm">
                  Este producto no tiene imágenes asociadas
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {producto.images?.map((image) => (
                  <div
                    key={image.id}
                    className="relative group border rounded-lg overflow-hidden aspect-square bg-muted"
                  >
                    <img
                      src={image.url}
                      alt={`Imagen de ${producto.nombre}`}
                      className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(image.url)}
                    />

                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="secondary"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setSelectedImage(image.url)}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => handleDeleteImage(image.id)}
                        disabled={deletingId === image.id}
                      >
                        {deletingId === image.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {deletingId === image.id && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {selectedImage && (
        <Dialog
          open={!!selectedImage}
          onOpenChange={() => setSelectedImage(null)}
        >
          <DialogContent className="sm:max-w-[90vw] max-h-[90vh] p-0 bg-black/95 border-none">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white hover:bg-white/20 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <div className="flex items-center justify-center h-[80vh] w-full">
              <img
                src={selectedImage}
                alt="Imagen ampliada"
                className="max-h-full max-w-full object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
