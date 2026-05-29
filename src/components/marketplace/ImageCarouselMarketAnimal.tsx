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

        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-3 bg-white/80 hover:bg-white" />
            <CarouselNext className="right-3 bg-white/80 hover:bg-white" />
          </>
        )}
      </Carousel>

      {images.length > 1 && (
        <div className="flex justify-center gap-2 overflow-x-auto px-1 scrollbar-thin pb-2">
          {images.map((img, index) => (
            <button
              key={img.id}
              onClick={() => handleThumbClick(index)}
              className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all duration-200 ${
                current === index
                  ? "border-blue-500 ring-2 ring-blue-200 scale-105"
                  : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
              }`}
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
    </div>
  );
};

export default ImageCarouselMarketAnimal;
