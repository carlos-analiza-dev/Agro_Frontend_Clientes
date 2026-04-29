import { Actividade } from "@/api/actividades/interfaces/response-actividades.interface";
import Modal from "@/components/generics/Modal";
import { Button } from "@/components/ui/button";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import { ChevronLeft, ChevronRight, Image as Image_Icon } from "lucide-react";
import Image from "next/image";
import { Dispatch, SetStateAction } from "react";

interface Props {
  showFotos: boolean;
  setShowFotos: Dispatch<SetStateAction<boolean>>;
  actividad: Actividade;
  currentImageIndex: number;
  prevImage: () => void;
  nextImage: () => void;
  setCurrentImageIndex: Dispatch<SetStateAction<number>>;
}

const ModalViewFotos = ({
  actividad,
  showFotos,
  setShowFotos,
  currentImageIndex,
  nextImage,
  prevImage,
  setCurrentImageIndex,
}: Props) => {
  return (
    <Modal
      open={showFotos}
      onOpenChange={setShowFotos}
      title="Fotos de la actividad"
      size="4xl"
      height="lg"
      showCloseButton={true}
    >
      {actividad.fotos && actividad.fotos.length > 0 && (
        <div className="relative">
          <div className="relative aspect-video w-full rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={actividad.fotos[currentImageIndex]?.url}
              alt={`Foto ${currentImageIndex + 1}`}
              fill
              className="object-contain"
              unoptimized
            />
            <p className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
              {formatDateOnly(actividad.fotos[currentImageIndex]?.createdAt)}
            </p>
          </div>

          {actividad.fotos.length > 1 && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={prevImage}
                disabled={currentImageIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white"
                onClick={nextImage}
                disabled={currentImageIndex === actividad.fotos.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </>
          )}

          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {actividad.fotos.map((foto, index) => (
              <button
                key={foto.id}
                className={`relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                  currentImageIndex === index
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              >
                <Image
                  src={foto.url}
                  alt={`Miniatura ${index + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-4">
            {currentImageIndex + 1} de {actividad.fotos.length}
          </p>
        </div>
      )}

      {(!actividad.fotos || actividad.fotos.length === 0) && (
        <div className="text-center py-12">
          <Image_Icon className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">
            No hay fotos disponibles para esta actividad
          </p>
        </div>
      )}
    </Modal>
  );
};

export default ModalViewFotos;
