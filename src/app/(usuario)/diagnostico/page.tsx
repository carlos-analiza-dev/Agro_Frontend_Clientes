"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
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
import AlertaInteligente from "@/components/consultas-inteligentes/AlertaInteligente";

const DiagnosticoAnimalPage = () => {
  const t = useTranslations("diagnosticoAnimalPage");

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
      <div id="id-header-diagnostico" className="flex items-center gap-3 mb-6">
        <div className="bg-green-500/10 p-3 rounded-full">
          <Stethoscope className="h-6 w-6 text-green-600" />
        </div>

        <h1 className="text-lg md:text-3xl font-bold">{t("title")}</h1>
      </div>

      <AlertaInteligente
        title={t("importantAlert.title")}
        description={t("importantAlert.description")}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card
          id="id-form-diagnostico"
          className="shadow-lg border-t-4 border-t-primary"
        >
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              {t("patient.title")}
            </CardTitle>

            <CardDescription>{t("patient.description")}</CardDescription>
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
              {t("preliminaryDiagnosis")}
            </p>
          </CardFooter>
        </Card>

        <div id="id-resultados-diagnostico">
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
    </div>
  );
};

export default DiagnosticoAnimalPage;
