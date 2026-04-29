import Modal from "@/components/generics/Modal";
import { Button } from "@/components/ui/button";
import { Loader, Upload, X } from "lucide-react";
import Image from "next/image";
import { ChangeEvent, RefObject } from "react";

interface Props {
  showUploadModal: boolean;
  closeUploadModal: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
  handleSelectImages: (e: ChangeEvent<HTMLInputElement>) => void;
  previewUrls: string[];
  removeImage: (index: number) => void;
  handleUploadImages: () => Promise<void>;
  files: File[];
  isUploading: boolean;
}

const ModalUploadImages = ({
  closeUploadModal,
  fileInputRef,
  handleSelectImages,
  showUploadModal,
  previewUrls,
  removeImage,
  handleUploadImages,
  files,
  isUploading,
}: Props) => {
  return (
    <Modal
      open={showUploadModal}
      onOpenChange={closeUploadModal}
      title="Subir imágenes de la actividad"
      size="2xl"
      height="auto"
      showCloseButton={true}
    >
      <div className="space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleSelectImages}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="cursor-pointer flex flex-col items-center gap-2"
          >
            <Upload className="w-10 h-10 text-gray-400" />
            <span className="text-sm text-gray-600">Haz clic aquí</span>
            <span className="text-xs text-gray-400">
              Formatos: JPG, PNG, GIF (Máx 5MB por imagen)
            </span>
          </label>
        </div>

        {previewUrls.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">
              Imágenes seleccionadas ({previewUrls.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-96 overflow-y-auto p-2">
              {previewUrls.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="relative aspect-square rounded-lg overflow-hidden border">
                    <Image
                      src={url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 
                  opacity-100 sm:opacity-0 sm:group-hover:opacity-100 
                  transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>

                  <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded sm:hidden">
                    Tap para eliminar
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
          <Button
            variant="outline"
            onClick={closeUploadModal}
            className="order-2 sm:order-1"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleUploadImages}
            disabled={files.length === 0 || isUploading}
            className="gap-2 order-1 sm:order-2"
          >
            {isUploading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Subiendo...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4" />
                Subir {files.length} imagen(es)
              </>
            )}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalUploadImages;
