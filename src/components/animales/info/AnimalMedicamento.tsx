"use client";

import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { BriefcaseMedical } from "lucide-react";

interface Props {
  animal: Animal;
}

const AnimalMedicamento = ({ animal }: Props) => {
  return (
    <div className="flex items-start gap-2 rounded-md bg-background p-2 my-1">
      <BriefcaseMedical className="h-5 w-5 text-muted-foreground mt-1" />
      <p className="text-sm text-foreground">
        <span className="font-medium">Medicamento:</span> {animal.medicamento}
      </p>
    </div>
  );
};

export default AnimalMedicamento;
