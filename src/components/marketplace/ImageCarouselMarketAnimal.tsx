"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "@/components/ui/carousel";
import Image from "next/image";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { cn } from "@/lib/utils";

interface Image {
  id: string;
  url: string;
}

interface Props {
  images: Image[];
}

const ImageCarouselMarketAnimal: React.FC<Props> = ({ images }) => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const isMobile = useMediaQuery("(max-width: 768px)");

  React.useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      setCurrent(api.selectedScrollSnap());
    };

    onSelect();
    api.on("select", onSelect);

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  const handleDotClick = (index: number) => {
    api?.scrollTo(index);
  };

  const handleThumbClick = (index: number) => {
    setCurrent(index);
    api?.scrollTo(index);
  };

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square flex items-center justify-center bg-gray-100 rounded-xl">
        Sin imágenes
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="relative">
        <Carousel className="w-full rounded-xl overflow-hidden" setApi={setApi}>
          <CarouselContent className="cursor-grab">
            {images.map((img) => (
              <CarouselItem key={img.id}>
                <div className="relative aspect-square w-full bg-black">
                  <Image
                    src={img.url}
                    alt="animal"
                    fill
                    className="object-contain rounded-xl"
                    unoptimized
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>

          {images.length > 1 && !isMobile && (
            <>
              <CarouselPrevious className="left-3 bg-white/80 hover:bg-white" />
              <CarouselNext className="right-3 bg-white/80 hover:bg-white" />
            </>
          )}
        </Carousel>

        {images.length > 1 && isMobile && (
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-full px-2 py-1 text-xs text-white font-medium">
            {current + 1} / {images.length}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <>
          {isMobile && (
            <div className="flex justify-center items-center gap-2 mt-2">
              {images.map((_, index) => (
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
              {images.map((img, index) => (
                <button
                  key={img.id}
                  onClick={() => handleThumbClick(index)}
                  className={cn(
                    "relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200",
                    current === index
                      ? "border-green-500 ring-2 ring-green-200 scale-105"
                      : "border-transparent opacity-60 hover:opacity-100 hover:scale-105",
                  )}
                >
                  <Image
                    src={img.url}
                    alt={`thumb-${index}`}
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ImageCarouselMarketAnimal;
