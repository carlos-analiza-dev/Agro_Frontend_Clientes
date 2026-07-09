"use client";

import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { Boxes } from "lucide-react";

interface Props {
  animal: Animal;
}

const AnimalTipoAlimentacion = ({ animal }: Props) => {
  return (
    <div className="flex items-start gap-2 p-2 rounded-md bg-background">
      <Boxes className="w-5 h-5 text-muted-foreground mt-1" />

      <div className="flex flex-wrap gap-2 flex-1">
        {animal.tipo_alimentacion.map((alimento, index) => {
          const label = (() => {
            if (alimento.origen === "comprado y producido") {
              return `${alimento.alimento} (${alimento.origen} - ${alimento.porcentaje_comprado}% comprado, ${alimento.porcentaje_producido}% producido)`;
            } else if (alimento.origen) {
              return `${alimento.alimento} (${alimento.origen})`;
            }
            return alimento.alimento;
          })();

          return (
            <div
              key={`${alimento.alimento}-${index}`}
              className="bg-secondary-container text-on-secondary-container rounded-full px-3 py-1 text-xs max-w-full break-words"
            >
              {label}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimalTipoAlimentacion;
