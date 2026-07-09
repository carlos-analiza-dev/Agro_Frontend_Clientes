"use client";

import { Separator } from "@/components/ui/separator";
import { User, Tag, PawPrint, Hash } from "lucide-react";

interface Raza {
  nombre: string;
}

interface Props {
  title: string;
  nombre?: string;
  arete?: string;
  razas?: Raza[];
  numeroParto?: number;
}

const AnimalParentInfo = ({
  title,
  nombre,
  arete,
  razas,
  numeroParto,
}: Props) => {
  if (!nombre && !arete && (!razas || razas.length === 0) && !numeroParto) {
    return null;
  }

  return (
    <div className="space-y-3">
      <Separator className="my-2" />

      <h3 className="text-base font-semibold text-foreground">{title}</h3>

      {nombre && (
        <div className="flex items-start gap-2 rounded-md bg-background p-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Nombre:</span> {nombre}
          </p>
        </div>
      )}

      {arete && (
        <div className="flex items-start gap-2 rounded-md bg-background p-2">
          <Tag className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Arete:</span> {arete}
          </p>
        </div>
      )}

      {razas && (
        <div className="flex items-start gap-2 rounded-md bg-background p-2">
          <PawPrint className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Raza:</span>{" "}
            {razas.length === 1
              ? razas[0].nombre
              : razas.length > 1
                ? "Encaste"
                : "Sin raza"}
          </p>
        </div>
      )}

      {numeroParto !== undefined && (
        <div className="flex items-start gap-2 rounded-md bg-background p-2">
          <Hash className="h-5 w-5 text-muted-foreground" />
          <p className="text-sm text-foreground">
            <span className="font-medium">Número de parto:</span> {numeroParto}
          </p>
        </div>
      )}
    </div>
  );
};

export default AnimalParentInfo;
