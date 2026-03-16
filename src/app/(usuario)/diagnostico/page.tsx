"use client";

import { useState } from "react";
import { Stethoscope, Activity, AlertTriangle } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import CardResults from "./ui/CardResults";
import FormDiagnostico from "./ui/FormDiagnostico";

const DiagnosticoAnimalPage = () => {
  const [diagnosticoResultado, setDiagnosticoResultado] = useState<
    string | null
  >(null);
  const [isPending, setIsPending] = useState(false);
  const [sintomasValue, setSintomasValue] = useState<string[]>([]);
  const [especieValue, setEspecieValue] = useState("");
  const [razaValue, setRazaValue] = useState("");
  const [edadValue, setEdadValue] = useState(0);

  return (
    <div className="container mx-auto py-6 px-4 md:px-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-primary/10 p-3 rounded-full">
          <Stethoscope className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-lg md:text-3xl font-bold">
          Diagnóstico Veterinario
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Datos del Paciente
            </CardTitle>
            <CardDescription>
              Ingresa los síntomas y datos del animal para obtener un
              diagnóstico preliminar
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormDiagnostico
              setDiagnosticoResultado={setDiagnosticoResultado}
              setIsPending={setIsPending}
              setSintomasValue={setSintomasValue}
              setEspecieValue={setEspecieValue}
              setRazaValue={setRazaValue}
              setEdadValue={setEdadValue}
            />
          </CardContent>
          <CardFooter className="bg-muted/50 border-t">
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Este es un diagnóstico preliminar. Siempre consulta con un
              veterinario profesional.
            </p>
          </CardFooter>
        </Card>

        <CardResults
          diagnosticoResultado={diagnosticoResultado}
          isPending={isPending}
          sintomasValue={sintomasValue}
          especieValue={especieValue}
          razaValue={razaValue}
          edadValue={edadValue}
        />
      </div>
    </div>
  );
};

export default DiagnosticoAnimalPage;
