import { uploadImagesProducto } from "@/api/agroservicio/productos/accions/subir-imagenes";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Trash2, Upload } from "lucide-react";
import { useState, useRef } from "react";
import { toast } from "react-toastify";

interface ProductImageUploadProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productoId: string;
  productoNombre: string;
  onSuccess?: () => void;
}

export const ProductImageUpload = ({
  open,
  onOpenChange,
  productoId,
  productoNombre,
  onSuccess,
}: ProductImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);

    if (files.length === 0) return;

    const validTypes = ["image/jpeg", "image/png"];
    const invalidFiles = files.filter(
      (file) => !validTypes.includes(file.type),
    );

    if (invalidFiles.length > 0) {
      toast.error("Solo se permiten imágenes JPEG y PNG");
      return;
    }

    const maxSize = 1 * 1024 * 1024;
    const oversizedFiles = files.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      toast.error("Las imágenes no pueden superar los 1MB");
      return;
    }

    const previews = files.map((file) => URL.createObjectURL(file));
    setSelectedFiles(files);
    setPreviewImages(previews);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.warning("Selecciona al menos una imagen");
      return;
    }

    setUploading(true);
    try {
      const imagenesBase64: string[] = [];

      for (const file of selectedFiles) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        imagenesBase64.push(base64);
      }

      await uploadImagesProducto(productoId, imagenesBase64);

      toast.success(`Imágenes subidas exitosamente para ${productoNombre}`);
      queryClient.invalidateQueries({ queryKey: ["agro-productos"] });
      resetState();
      onSuccess?.();
      onOpenChange(false);
    } catch (error) {
      toast.error("Error al subir las imágenes");
    } finally {
      setUploading(false);
    }
  };

  const resetState = () => {
    previewImages.forEach((url) => URL.revokeObjectURL(url));
    setSelectedFiles([]);
    setPreviewImages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    resetState();
    onOpenChange(false);
  };

  const removeImage = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => {
      const newPreviews = prev.filter((_, i) => i !== index);
      URL.revokeObjectURL(prev[index]);
      return newPreviews;
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Subir imágenes para {productoNombre}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <div
            onClick={() => fileInputRef.current?.click()}
            className="
              border-2 border-dashed rounded-lg p-12 text-center cursor-pointer
              transition-colors duration-200 hover:border-primary hover:bg-primary/5
            "
          >
            <div className="flex flex-col items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Haz clic para seleccionar imágenes
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Formatos: JPEG, PNG (máx. 1MB cada una)
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Puedes seleccionar múltiples imágenes
                </p>
              </div>
            </div>
          </div>

          {previewImages.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm font-medium">
                {previewImages.length} imagen(es) seleccionada(s)
              </p>
              <div className="grid grid-cols-3 gap-2">
                {previewImages.map((preview, idx) => (
                  <div key={idx} className="relative group">
                    <img
                      src={preview}
                      alt={`Preview ${idx + 1}`}
                      className="w-full h-24 object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeImage(idx);
                      }}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {uploading && (
            <div className="flex items-center justify-center gap-2 p-4 bg-primary/5 rounded-lg">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary border-t-transparent"></div>
              <span className="text-sm text-gray-600">
                Subiendo imágenes...
              </span>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleUpload}
              disabled={uploading || selectedFiles.length === 0}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                  Subiendo...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Subir{" "}
                  {selectedFiles.length > 0 && `(${selectedFiles.length})`}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
