"use client";

import { useEffect, useState } from "react";
import PublicidadCard from "./PublicidadCard";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { EmblaCarouselType } from "embla-carousel";
import useGetAnunciosClientes from "@/hooks/anuncios/useGetAnunciosClientes";

export default function PublicidadPanel() {
  const { data: anuncios, isLoading } = useGetAnunciosClientes({
    principal: false,
    mostrar: true,
  });
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>();

  const banners = anuncios || [];

  useEffect(() => {
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 3000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    let interval: NodeJS.Timeout | null = null;

    const startAutoplay = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        emblaApi.scrollNext();
      }, 3000);
    };

    const stopAutoplay = () => {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };

    emblaApi.on("pointerDown", stopAutoplay);
    emblaApi.on("pointerUp", startAutoplay);

    startAutoplay();

    return () => {
      emblaApi.off("pointerDown", stopAutoplay);
      emblaApi.off("pointerUp", startAutoplay);
      if (interval) clearInterval(interval);
    };
  }, [emblaApi]);

  if (isLoading) {
    return (
      <div className="w-full py-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="overflow-hidden rounded-xl border bg-white shadow-sm"
            >
              <div className="h-40 w-full bg-gray-200 animate-pulse" />
              <div className="space-y-3 p-4">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse" />
                <div className="h-8 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full py-4">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
        setApi={setEmblaApi}
      >
        <CarouselContent>
          {banners.map((anuncio) => (
            <CarouselItem
              key={anuncio.id}
              className="basis-full md:basis-1/3 lg:basis-1/4"
            >
              <PublicidadCard anuncio={anuncio} />
            </CarouselItem>
          ))}
        </CarouselContent>

        {banners.length > 1 && (
          <>
            <CarouselPrevious />
            <CarouselNext />
          </>
        )}
      </Carousel>
    </div>
  );
}
