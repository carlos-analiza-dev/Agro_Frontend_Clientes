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

const anuncios = [
  {
    titulo: "Concentrado Premium Bovino",
    descripcion:
      "Incrementa la producción de leche y mejora la salud de tu ganado.",
    imagen: "/images/publicidad/concentrado.jpg",
    link: "#",
  },
  {
    titulo: "Alquiler de Tractor",
    descripcion: "Tractores disponibles por hora, día o semana.",
    imagen: "/images/publicidad/tractor.jpg",
    link: "#",
  },
  {
    titulo: "Semillas Certificadas",
    descripcion: "Mayor rendimiento y resistencia para tus cultivos.",
    imagen: "/images/publicidad/semillas.jpg",
    link: "#",
  },
  {
    titulo: "Semillas Certificadas 1",
    descripcion: "Mayor rendimiento y resistencia para tus cultivos.",
    imagen: "/images/publicidad/semillas.jpg",
    link: "#",
  },
  {
    titulo: "Semillas Certificadas 2",
    descripcion: "Mayor rendimiento y resistencia para tus cultivos.",
    imagen: "/images/publicidad/semillas.jpg",
    link: "#",
  },
];

export default function PublicidadPanel() {
  const [emblaApi, setEmblaApi] = useState<EmblaCarouselType | undefined>();

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
          {anuncios.map((anuncio) => (
            <CarouselItem
              key={anuncio.titulo}
              className="basis-full md:basis-1/2 lg:basis-1/3"
            >
              <PublicidadCard {...anuncio} />
            </CarouselItem>
          ))}
        </CarouselContent>

        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
