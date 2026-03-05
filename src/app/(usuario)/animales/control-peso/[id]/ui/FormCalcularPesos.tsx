import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Calendar, HelpCircle, Info, Loader2, Scale } from "lucide-react";
import { FormEvent } from "react";

interface Props {
  handleSubmit: (e: FormEvent<Element>) => Promise<void>;
  edad: string;
  setEdad: React.Dispatch<React.SetStateAction<string>>;
  setError: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
  error: string;
  edadNum: number;
}

const FormCalcularPesos = ({
  handleSubmit,
  edad,
  setEdad,
  setError,
  isLoading,
  error,
  edadNum,
}: Props) => {
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label
            htmlFor="edad"
            className="text-sm font-medium text-gray-700 flex items-center gap-2"
          >
            <Calendar className="h-4 w-4 text-gray-400" />
            Edad del Animal
          </label>
          <Tooltip>
            <TooltipTrigger asChild>
              <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
            </TooltipTrigger>
            <TooltipContent side="top">
              <p>Ingrese la edad en meses (1-600 meses)</p>
              <p className="text-xs text-gray-300">Equivalente a 0-50 años</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="relative">
          <Input
            id="edad"
            type="number"
            min="1"
            max="600"
            step="1"
            placeholder="Ej: 24"
            value={edad}
            onChange={(e) => {
              setEdad(e.target.value);
              setError("");
            }}
            disabled={isLoading}
            className={cn(
              "pr-20 text-lg h-12",
              error && "border-red-500 focus-visible:ring-red-500",
              edad && "border-blue-200 focus-visible:border-blue-500",
            )}
          />
          <Badge
            variant="secondary"
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none bg-gray-100"
          >
            meses
          </Badge>
        </div>

        {edadNum > 0 && (
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-2 rounded-md">
            <Info className="h-4 w-4 text-blue-500" />
            <span>
              {edadNum} meses = {Math.floor(edadNum / 12)} años{" "}
              {edadNum % 12 > 0 ? `y ${edadNum % 12} meses` : ""}
            </span>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading || !edad}
        className="w-full h-12 text-base font-semibold"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Calculando...
          </>
        ) : (
          <>
            <Scale className="mr-2 h-5 w-5" />
            Calcular Peso Esperado
          </>
        )}
      </Button>

      <div className="pt-4 border-t">
        <p className="text-xs text-gray-500 mb-2">Edades sugeridas:</p>
        <div className="flex flex-wrap gap-2">
          {[6, 12, 24, 36, 48, 60].map((sugerencia) => (
            <Button
              key={sugerencia}
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setEdad(sugerencia.toString())}
              disabled={isLoading}
              className="text-xs"
            >
              {sugerencia} meses
            </Button>
          ))}
        </div>
      </div>
    </form>
  );
};

export default FormCalcularPesos;
