"use client";

import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import {
  Calendar,
  Clock,
  Palette,
  Dna,
  Baby,
  CalendarCheck,
} from "lucide-react";

interface Props {
  animal: Animal;
}

const InfoAnimal = ({ animal }: Props) => {
  return (
    <div className="space-y-2">
      <div className="flex items-start gap-2 rounded-md bg-background p-2">
        <Calendar className="w-5 h-5 text-muted-foreground mt-1" />
        <p className="text-sm text-foreground">
          <span className="font-medium">Nacimiento:</span>{" "}
          {animal.fecha_nacimiento}
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-md bg-background p-2">
        <CalendarCheck className="w-5 h-5 text-muted-foreground mt-1" />
        <p className="text-sm text-foreground">
          <span className="font-medium">Registro:</span>{" "}
          {new Date(animal.fecha_registro).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-md bg-background p-2">
        <Palette className="w-5 h-5 text-muted-foreground mt-1" />
        <p className="text-sm text-foreground">
          <span className="font-medium">Color:</span> {animal.color}
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-md bg-background p-2">
        <Clock className="w-5 h-5 text-muted-foreground mt-1" />
        <p className="text-sm text-foreground">
          <span className="font-medium">Edad:</span> {animal.edad_promedio} años
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-md bg-background p-2">
        <Dna className="w-5 h-5 text-muted-foreground mt-1" />
        <p className="text-sm text-foreground">
          <span className="font-medium">Pureza:</span> {animal.pureza}
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-md bg-background p-2">
        <Baby className="w-5 h-5 text-muted-foreground mt-1" />
        <p className="text-sm text-foreground">
          <span className="font-medium">Reproducción:</span>{" "}
          {animal.tipo_reproduccion}
        </p>
      </div>
    </div>
  );
};

export default InfoAnimal;
