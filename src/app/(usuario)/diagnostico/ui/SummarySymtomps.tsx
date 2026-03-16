import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface Props {
  sintomasValue: string[];
  eliminarSintoma: (index: number) => void;
}

const SummarySymtomps = ({ sintomasValue, eliminarSintoma }: Props) => {
  return (
    <div className="bg-muted/50 p-3 rounded-lg">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium">Síntomas ingresados:</p>
        <span className="text-xs text-muted-foreground">
          {sintomasValue.length} síntoma(s)
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {sintomasValue.map((sintoma, index) => (
          <Badge
            key={index}
            variant="secondary"
            className="flex items-center gap-1 pl-2 pr-1 py-1"
          >
            {sintoma}
            <button
              type="button"
              onClick={() => eliminarSintoma(index)}
              className="ml-1 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default SummarySymtomps;
