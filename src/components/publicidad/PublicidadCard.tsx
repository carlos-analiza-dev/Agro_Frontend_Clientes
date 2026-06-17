"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface Props {
  titulo: string;
  descripcion: string;
  imagen: string;
  link?: string;
}

export default function PublicidadCard({
  titulo,
  descripcion,
  imagen,
  link,
}: Props) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm hover:shadow-md transition-all">
      <div className="relative h-40 w-full">
        <Image src={imagen} alt={titulo} fill className="object-cover" />

        <span className="absolute top-2 right-2 rounded-full bg-black/70 px-2 py-1 text-xs text-white">
          Patrocinado
        </span>
      </div>

      <div className="space-y-3 p-4">
        <h3 className="font-semibold text-sm">{titulo}</h3>

        <p className="text-xs text-muted-foreground line-clamp-3">
          {descripcion}
        </p>

        {link && (
          <Button asChild size="sm" className="w-full">
            <a href={link} target="_blank" rel="noopener noreferrer">
              Ver más
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
