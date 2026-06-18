"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { EmblaCarouselType } from "embla-carousel";
import useGetAnunciosClientes from "@/hooks/anuncios/useGetAnunciosClientes";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function PublicidadBanner() {
  const { data: anuncios, isLoading } = useGetAnunciosClientes({
    principal: true,
    mostrar: true,
  });

  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const banners = anuncios || [];

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };

    emblaApi.on("select", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi || banners.length === 0) return;

    let interval: NodeJS.Timeout | null = null;

    const startAutoplay = () => {
      if (interval) clearInterval(interval);
      interval = setInterval(() => {
        emblaApi.scrollNext();
      }, 4000);
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
  }, [emblaApi, banners.length]);

  if (isLoading || banners.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 overflow-hidden rounded-xl border bg-white relative">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
        setApi={setEmblaApi}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="basis-full">
              <Link
                href={banner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="block transition-colors hover:bg-gray-50/50"
              >
                <div className="flex flex-col md:flex-row cursor-pointer">
                  <div className="relative h-48 md:h-auto md:w-1/3">
                    {banner.anucioImages && banner.anucioImages.length > 0 ? (
                      <Image
                        src={banner.anucioImages[0].url}
                        alt={banner.titulo}
                        fill
                        unoptimized
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Sin imagen</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-center gap-3 p-6">
                    {banner.etiqueta && (
                      <span className="text-xs font-semibold uppercase tracking-wider text-orange-500">
                        {banner.etiqueta}
                      </span>
                    )}

                    <h2 className="text-xl font-bold">{banner.titulo}</h2>

                    {banner.descripcion && (
                      <p className="text-muted-foreground line-clamp-3">
                        {banner.descripcion}
                      </p>
                    )}

                    <div className="flex items-center gap-1 text-green-600 font-medium group">
                      <span>Ver más</span>
                      <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {banners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentIndex
                  ? "bg-white w-4"
                  : "bg-white/60 hover:bg-white/80"
              }`}
              aria-label={`Ir al banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
