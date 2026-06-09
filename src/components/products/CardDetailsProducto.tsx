import {
  Imagene,
  Producto,
} from "@/api/productos/interfaces/response-producto-by-id.interface";
import { Card } from "@/components/ui/card";
import {
  Carousel,
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface Props {
  imagenes:
    | Imagene[]
    | {
        id: string;
        url: string;
        key: string;
        mimeType: string;
      }[];
  producto: Producto;
  setCarouselApi: Dispatch<SetStateAction<CarouselApi | undefined>>;
  selectedImageIndex: number;
  setSelectedImageIndex: Dispatch<SetStateAction<number>>;
}

const CardDetailsProducto = ({
  imagenes,
  producto,
  setCarouselApi,
  selectedImageIndex,
  setSelectedImageIndex,
}: Props) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [current, setCurrent] = useState(0);
  const [internalApi, setInternalApi] = useState<CarouselApi>();

  useEffect(() => {
    if (internalApi) {
      setCarouselApi(internalApi);
    }
  }, [internalApi, setCarouselApi]);

  useEffect(() => {
    if (!internalApi) return;

    const onSelect = () => {
      const newIndex = internalApi.selectedScrollSnap();
      setCurrent(newIndex);
      setSelectedImageIndex(newIndex);
    };

    onSelect();
    internalApi.on("select", onSelect);

    return () => {
      internalApi.off("select", onSelect);
    };
  }, [internalApi, setSelectedImageIndex]);

  useEffect(() => {
    if (internalApi && selectedImageIndex !== current) {
      internalApi.scrollTo(selectedImageIndex);
      setCurrent(selectedImageIndex);
    }
  }, [selectedImageIndex, internalApi, current]);

  const handleDotClick = (index: number) => {
    internalApi?.scrollTo(index);
  };

  const handleThumbClick = (index: number) => {
    setSelectedImageIndex(index);
    internalApi?.scrollTo(index);
  };

  if (!imagenes || imagenes.length === 0) {
    return (
      <Card className="overflow-hidden">
        <div className="p-4">
          <div className="w-full aspect-square flex items-center justify-center bg-gray-100 rounded-xl">
            Sin imágenes
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div className="p-4 space-y-3">
        <div className="relative">
          <Carousel
            className="w-full rounded-xl overflow-hidden"
            setApi={setInternalApi}
          >
            <CarouselContent className="cursor-grab">
              {imagenes.map((imagen, index) => (
                <CarouselItem key={imagen.id}>
                  <div className="relative aspect-square w-full bg-black rounded-xl overflow-hidden">
                    <Image
                      src={imagen.url}
                      unoptimized
                      alt={`${producto.nombre} - Imagen ${index + 1}`}
                      fill
                      className="object-contain"
                      priority={index === 0}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>

            {imagenes.length > 1 && !isMobile && (
              <>
                <CarouselPrevious className="left-3 bg-white/80 hover:bg-white" />
                <CarouselNext className="right-3 bg-white/80 hover:bg-white" />
              </>
            )}
          </Carousel>

          {imagenes.length > 1 && isMobile && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium">
              {current + 1} / {imagenes.length}
            </div>
          )}
        </div>

        {imagenes.length > 1 && (
          <>
            {isMobile && (
              <div className="flex justify-center items-center gap-2 mt-2">
                {imagenes.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleDotClick(index)}
                    className={cn(
                      "transition-all duration-300 rounded-full",
                      current === index
                        ? "w-2 h-2 bg-green-600 scale-100"
                        : "w-1.5 h-1.5 bg-gray-400 scale-75 hover:bg-gray-500",
                    )}
                    aria-label={`Ir a imagen ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {!isMobile && (
              <div className="flex justify-center gap-2 overflow-x-auto px-1 scrollbar-thin pb-2">
                {imagenes.map((imagen, index) => (
                  <button
                    key={imagen.id}
                    onClick={() => handleThumbClick(index)}
                    className={cn(
                      "relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200",
                      current === index
                        ? "border-green-500 ring-2 ring-green-200 scale-105"
                        : "border-transparent opacity-60 hover:opacity-100 hover:scale-105",
                    )}
                  >
                    <Image
                      src={imagen.url}
                      alt={`${producto.nombre} - Miniatura ${index + 1}`}
                      unoptimized
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

export default CardDetailsProducto;
