"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

interface ImageItem {
  id?: string;
  url: string;
}

interface ImageGalleryProps {
  visible: boolean;
  images: ImageItem[];
  onClose: () => void;
  onDelete?: (imageId: string) => void;
}

const ImageGallery = ({
  visible,
  images,
  onClose,
  onDelete,
}: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!visible || !images || images.length === 0) return null;

  const prevImage = () => setCurrentIndex(Math.max(0, currentIndex - 1));
  const nextImage = () =>
    setCurrentIndex(Math.min(images.length - 1, currentIndex + 1));

  const getImageUrl = (url: string) => {
    if (!url) return "";

    if (url.includes("localhost")) {
      return url.replace(
        "localhost",
        process.env.NEXT_PUBLIC_HOST || "192.168.0.10"
      );
    }
    return url;
  };

  const currentImageUrl = getImageUrl(images[currentIndex].url);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90">
      <div className="relative w-[95vw] max-w-[800px] h-[85vh] bg-background rounded-xl overflow-hidden flex flex-col">
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center p-3 bg-black/70">
          <span className="text-white font-bold">
            {currentIndex + 1} de {images.length}
          </span>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Cerrar galería"
          >
            <X size={24} className="text-white" />
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center relative">
          <div className="relative w-full h-full">
            <Image
              src={currentImageUrl}
              alt={`Imagen ${currentIndex + 1} de ${images.length}`}
              unoptimized
              fill
              sizes="(max-width: 800px) 95vw, 800px"
              className="object-contain"
              priority
              quality={75}
            />
          </div>

          {onDelete && images[currentIndex].id && (
            <button
              onClick={() => {
                if (images[currentIndex].id) {
                  onDelete(images[currentIndex].id!);
                }
              }}
              className="absolute bottom-4 right-4 p-2 bg-white/80 hover:bg-white rounded-full shadow-lg transition-colors"
              aria-label="Eliminar imagen"
            >
              <Trash2 size={20} className="text-red-600" />
            </button>
          )}
        </div>

        <button
          onClick={prevImage}
          disabled={currentIndex === 0}
          className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Imagen anterior"
        >
          <ChevronLeft size={30} className="text-white" />
        </button>

        <button
          onClick={nextImage}
          disabled={currentIndex === images.length - 1}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 p-2 rounded-full disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Imagen siguiente"
        >
          <ChevronRight size={30} className="text-white" />
        </button>

        {images.length > 1 && (
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 p-4 bg-black/50">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? "bg-white scale-125"
                    : "bg-white/50 hover:bg-white/80"
                }`}
                aria-label={`Ver imagen ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
