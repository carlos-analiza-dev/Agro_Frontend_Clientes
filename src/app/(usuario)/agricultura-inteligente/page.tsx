"use client";

import { useState } from "react";
import { Sprout, Leaf, ThermometerSun } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import FormConsultaAgricola from "./ui/FormConsultaAgricola";
import CardResults from "./ui/CardResults";

const AgriculturaInteligentePage = () => {
  const [consultaResultado, setConsultaResultado] = useState<string | null>(
    null,
  );
  const [isPending, setIsPending] = useState(false);
  const [cultivoValue, setCultivoValue] = useState("");
  const [tipoSueloValue, setTipoSueloValue] = useState("");
  const [climaValue, setClimaValue] = useState("");
  const [problemasValue, setProblemasValue] = useState<string[]>([]);

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-green-500/10 p-3 rounded-full">
          <Sprout className="h-6 w-6 text-green-600" />
        </div>
        <h1 className="text-lg md:text-3xl font-bold">
          Consultor Agrícola Inteligente
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-t-4 border-t-green-600">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Leaf className="h-5 w-5" />
              Datos del Cultivo
            </CardTitle>
            <CardDescription>
              Ingresa la información del cultivo, suelo, clima y problemas
              observados para obtener un diagnóstico y recomendaciones
              personalizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormConsultaAgricola
              setConsultaResultado={setConsultaResultado}
              setIsPending={setIsPending}
              setCultivoValue={setCultivoValue}
              setTipoSueloValue={setTipoSueloValue}
              setClimaValue={setClimaValue}
              setProblemasValue={setProblemasValue}
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

        <CardResults
          consultaResultado={consultaResultado}
          isPending={isPending}
          cultivoValue={cultivoValue}
          tipoSueloValue={tipoSueloValue}
          climaValue={climaValue}
          problemasValue={problemasValue}
        />
      </div>
    </div>
  );
};

export default AgriculturaInteligentePage;
