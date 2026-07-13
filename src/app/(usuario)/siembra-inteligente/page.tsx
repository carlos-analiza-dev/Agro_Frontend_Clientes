"use client";

import { useState } from "react";
import { Ruler, ThermometerSun, Info, LandPlot } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CardResultsSiembra from "./ui/CardResultsSiembra";
import FormSiembraInteligente from "./ui/FormSiembraInteligente";

const SiembraInteligentePage = () => {
  const [consultaResultado, setConsultaResultado] = useState<string | null>(
    null,
  );
  const [isPending, setIsPending] = useState(false);
  const [cultivoValue, setCultivoValue] = useState("");
  const [tipoTerrenoValue, setTipoTerrenoValue] = useState("");
  const [climaValue, setClimaValue] = useState("");
  const [areaValue, setAreaValue] = useState(0);
  const [unidadValue, setUnidadValue] = useState("");

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-500/10 p-3 rounded-full">
          <Ruler className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-lg md:text-3xl font-bold">
          Calculadora de Densidad de Siembra
        </h1>
      </div>

      <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-950 dark:border-amber-800">
        <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertTitle className="text-amber-800 dark:text-amber-300 font-semibold">
          Información importante
        </AlertTitle>
        <AlertDescription className="text-amber-700 dark:text-amber-300">
          Esta calculadora proporciona recomendaciones basadas en inteligencia
          artificial. Los resultados son orientativos y deben ser validados por
          un profesional del sector agrícola según las condiciones específicas
          de tu terreno.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-t-4 border-t-green-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LandPlot className="h-5 w-5" />
              Datos del Terreno
            </CardTitle>
            <CardDescription>
              Ingresa la información del cultivo, terreno y clima para obtener
              una recomendación óptima de densidad de siembra
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormSiembraInteligente
              setConsultaResultado={setConsultaResultado}
              setIsPending={setIsPending}
              setCultivoValue={setCultivoValue}
              setTipoTerrenoValue={setTipoTerrenoValue}
              setClimaValue={setClimaValue}
              setAreaValue={setAreaValue}
              setUnidadValue={setUnidadValue}
            />
          </CardContent>
          <CardFooter className="bg-muted/50 border-t">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <ThermometerSun className="h-4 w-4" />
              Recomendaciones basadas en análisis agronómico. Consulta con un
              ingeniero agrónomo para decisiones críticas.
            </p>
          </CardFooter>
        </Card>

        <CardResultsSiembra
          consultaResultado={consultaResultado}
          isPending={isPending}
          cultivoValue={cultivoValue}
          tipoTerrenoValue={tipoTerrenoValue}
          climaValue={climaValue}
          areaValue={areaValue}
          unidadValue={unidadValue}
        />
      </div>
    </div>
  );
};

export default SiembraInteligentePage;
