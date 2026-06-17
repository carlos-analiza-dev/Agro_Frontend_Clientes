"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import type { EmblaCarouselType } from "embla-carousel";

const banners = [
  {
    id: 1,
    imagen: "/images/publicidad/banner-tractor.jpg",
    etiqueta: "PATROCINADO",
    titulo: "Alquila maquinaria agrícola",
    descripcion:
      "Encuentra tractores, rastras y equipos agrícolas cerca de tu ubicación.",
    boton: "Ver oferta",
    link: "#",
  },
  {
    id: 2,
    imagen: "/images/publicidad/banner-semillas.jpg",
    etiqueta: "PATROCINADO",
    titulo: "Semillas certificadas",
    descripcion: "Mayor rendimiento y resistencia para tus cultivos.",
    boton: "Comprar ahora",
    link: "#",
  },
  {
    id: 3,
    imagen: "/images/publicidad/banner-concentrado.jpg",
    etiqueta: "OFERTA ESPECIAL",
    titulo: "Concentrado premium para ganado",
    descripcion:
      "Incrementa la producción de leche y mejora la salud de tu ganado.",
    boton: "Cotizar",
    link: "#",
  },
];

export default function PublicidadBanner() {
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>();
  const [currentIndex, setCurrentIndex] = useState(0);

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
    if (!emblaApi) return;

    const interval = setInterval(() => {
      emblaApi.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

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
  }, [emblaApi]);

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
              <div className="flex flex-col md:flex-row">
                <div className="relative h-48 md:h-auto md:w-1/3">
                  <Image
                    src={banner.imagen}
                    alt={banner.titulo}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-1 flex-col justify-center gap-3 p-6">
                  <span className="text-xs font-semibold text-orange-500">
                    {banner.etiqueta}
                  </span>

                  <h2 className="text-xl font-bold">{banner.titulo}</h2>

                  <p className="text-muted-foreground">{banner.descripcion}</p>

                  <button className="w-fit rounded-lg bg-green-600 px-4 py-2 text-white hover:bg-green-700 transition-colors">
                    {banner.boton}
                  </button>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

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
    </div>
  );
}
