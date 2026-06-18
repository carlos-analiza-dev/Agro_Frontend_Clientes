"use client";

import Image from "next/image";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { ResponseAnunciosInterface } from "@/api/anuncios/interface/response-anuncios.interface";

interface Props {
  anuncio: ResponseAnunciosInterface;
}

export default function PublicidadCard({ anuncio }: Props) {
  const { titulo, descripcion, link, etiqueta, anucioImages } = anuncio;

  const imageUrl =
    anucioImages && anucioImages.length > 0 ? anucioImages[0].url : null;

  if (!link) {
    return (
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition-all h-full flex flex-col">
        <div className="relative h-40 w-full flex-shrink-0">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={titulo}
              fill
              unoptimized
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Sin imagen</span>
            </div>
          )}

          {etiqueta && (
            <span className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
              {etiqueta}
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col p-4">
          <h3 className="font-semibold text-sm line-clamp-2">{titulo}</h3>
          <p className="text-xs text-muted-foreground line-clamp-3 mt-2 flex-1">
            {descripcion}
          </p>
        </div>
      </div>
    );
  }

  return (
    <Link
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="block h-full transition-all hover:shadow-lg hover:-translate-y-1"
    >
      <div className="overflow-hidden rounded-xl border bg-white shadow-sm h-full flex flex-col">
        <div className="relative h-40 w-full flex-shrink-0 overflow-hidden">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={titulo}
              fill
              unoptimized
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400 text-sm">Sin imagen</span>
            </div>
          )}

          {etiqueta && (
            <span className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
              {etiqueta}
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col p-4">
          <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
            {titulo}
          </h3>

          <p className="text-xs text-muted-foreground line-clamp-3 mt-2 flex-1">
            {descripcion}
          </p>

          <div className="flex items-center gap-1 text-xs font-medium text-green-600 mt-3 group-hover:gap-2 transition-all">
            <span>Ver más</span>
            <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
