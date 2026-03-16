import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";

interface Props {
  moneda: string;
  costoTotalGeneral: number;
  promedioPorAnimal: string | number;
}

const SummaryTotalsCard = ({
  costoTotalGeneral,
  moneda,
  promedioPorAnimal,
}: Props) => {
  return (
    <Card className="bg-muted/50">
      <CardContent className="py-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between text-sm">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="font-medium">Resumen diario:</span>
          </div>

          <div className="flex flex-col gap-2 md:flex-row md:gap-6">
            <div>
              <span className="text-muted-foreground">Total general:</span>{" "}
              <span className="font-bold text-primary">
                {moneda} {costoTotalGeneral.toFixed(2)}
              </span>
            </div>

            <div>
              <span className="text-muted-foreground">Promedio/animal:</span>{" "}
              <span className="font-bold">
                {moneda} {promedioPorAnimal}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryTotalsCard;
