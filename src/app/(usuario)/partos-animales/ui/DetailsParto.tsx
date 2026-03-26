import { Parto } from "@/api/reproduccion/interfaces/response-partos.interface";
import { Baby, CalendarDays, Droplets, Syringe, X } from "lucide-react";
import React from "react";

interface Props {
  partosFiltrados: Parto[];
}

const DetailsParto = ({ partosFiltrados }: Props) => {
  return (
    <div className="mt-4 pt-4 border-t flex flex-wrap gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <Baby className="h-4 w-4" />
        <span>
          Total crías:{" "}
          {partosFiltrados.reduce((sum, p) => sum + p.numero_crias, 0)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Droplets className="h-4 w-4 text-green-600" />
        <span>
          Crías vivas:{" "}
          {partosFiltrados.reduce((sum, p) => sum + p.numero_crias_vivas, 0)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <X className="h-4 w-4 text-red-500" />
        <span>
          Crías muertas:{" "}
          {partosFiltrados.reduce((sum, p) => sum + p.numero_crias_muertas, 0)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <CalendarDays className="h-4 w-4" />
        <span>
          Partos normales:{" "}
          {partosFiltrados.filter((p) => p.tipo_parto === "NORMAL").length}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Syringe className="h-4 w-4 text-orange-600" />
        <span>
          Partos con complicaciones:{" "}
          {
            partosFiltrados.filter(
              (p) => p.complicaciones && p.complicaciones !== "Ninguna",
            ).length
          }
        </span>
      </div>
    </div>
  );
};

export default DetailsParto;
