import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { Badge } from "@/components/ui/badge";
import { BatteryPlus } from "lucide-react";

interface Props {
  animal: Animal;
}

const AnimalComplementos = ({ animal }: Props) => {
  return (
    <div className="flex items-start space-x-2 p-2 rounded-lg bg-muted/40">
      <BatteryPlus className="h-5 w-5 mt-1 text-muted-foreground" />
      <div className="flex flex-wrap gap-2">
        {animal?.complementos?.map((complemento, index) => (
          <Badge
            key={`${complemento.complemento}-${index}`}
            variant="secondary"
            className="text-xs py-1 px-2"
          >
            {complemento.complemento}
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default AnimalComplementos;
