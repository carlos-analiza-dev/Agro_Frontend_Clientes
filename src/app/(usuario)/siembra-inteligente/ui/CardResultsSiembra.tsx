import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Loader2,
  Ruler,
  Sprout,
  Mountain,
  Sun,
  Bot,
  Square,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

interface CardResultsSiembraProps {
  consultaResultado: string | null;
  isPending: boolean;
  cultivoValue: string;
  tipoTerrenoValue: string;
  climaValue: string;
  areaValue: number;
  unidadValue: string;
}

const unidadesLabels: Record<string, string> = {
  ha: "Hectáreas (ha)",
  mz: "Manzanas (mz)",
  m2: "Metros cuadrados (m²)",
  ac: "Acres (ac)",
};

const CardResultsSiembra = ({
  consultaResultado,
  isPending,
  cultivoValue,
  tipoTerrenoValue,
  climaValue,
  areaValue,
  unidadValue,
}: CardResultsSiembraProps) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (consultaResultado && !isPending) {
      setShowAlert(true);
      toast.info(
        "🤖 Recomendación generada por IA - Consulta con un ingeniero agrónomo para validar la densidad de siembra",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      );
    }
  }, [consultaResultado, isPending]);

  if (isPending) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            Calculando densidad óptima
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-center">
            Analizando las características de tu terreno...
            <br />
            Esto puede tomar unos segundos
          </p>
        </CardContent>
      </Card>
    );
  }

  if (!consultaResultado) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Ruler className="h-5 w-5" />
            Recomendación de Densidad de Siembra
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted/30 rounded-full p-4 mb-4">
            <Sprout className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">
            Esperando datos del terreno
          </h3>
          <p className="text-muted-foreground">
            Completa el formulario para obtener una recomendación personalizada
            de densidad de siembra para tu cultivo.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-5 w-5 text-blue-600" />
          Recomendación de Densidad de Siembra
        </CardTitle>
        <div className="grid grid-cols-2 gap-3 mt-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Sprout className="h-4 w-4 text-green-600" />
            <span className="font-medium">Cultivo:</span>
            <span className="text-muted-foreground">{cultivoValue}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Mountain className="h-4 w-4 text-orange-500" />
            <span className="font-medium">Terreno:</span>
            <span className="text-muted-foreground">{tipoTerrenoValue}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sun className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">Clima:</span>
            <span className="text-muted-foreground">{climaValue}</span>
          </div>
          <div className="flex items-center gap-2 text-sm col-span-2">
            <Square className="h-4 w-4 text-purple-500" />
            <span className="font-medium">Área:</span>
            <span className="text-muted-foreground">
              {areaValue} {unidadesLabels[unidadValue] || unidadValue}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {showAlert && (
          <Alert className="mb-4 bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800">
            <Bot className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-800 dark:text-blue-300 font-semibold">
              Recomendación generada por Inteligencia Artificial
            </AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
              Esta recomendación ha sido generada automáticamente. La densidad
              de siembra óptima puede variar según condiciones específicas del
              terreno. Se recomienda consultar con un{" "}
              <strong>Ingeniero Agrónomo</strong> para validar estos valores
              antes de la siembra.
            </AlertDescription>
          </Alert>
        )}

        <ScrollArea className="h-[450px] pr-4">
          <div className="prose prose-sm max-w-none">
            {consultaResultado.split("\n").map((paragraph, index) => (
              <p key={index} className="mb-2 text-sm leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default CardResultsSiembra;
