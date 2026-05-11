import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, X } from "lucide-react";

interface SummaryProblemasProps {
  problemasValue: string[];
  eliminarProblema: (index: number) => void;
}

const SummaryProblemas = ({
  problemasValue,
  eliminarProblema,
}: SummaryProblemasProps) => {
  if (!problemasValue || problemasValue.length === 0) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardContent className="pt-4">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
          <div className="flex-1">
            <h4 className="font-medium text-sm mb-2">
              Problemas reportados ({problemasValue.length})
            </h4>
            <div className="flex flex-wrap gap-2">
              {problemasValue.map((problema, index) => (
                <div
                  key={index}
                  className="inline-flex items-center gap-1 bg-background border rounded-md px-2 py-1 text-sm"
                >
                  <span>{problema}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 hover:bg-transparent hover:text-red-500 ml-1"
                    onClick={() => eliminarProblema(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummaryProblemas;
