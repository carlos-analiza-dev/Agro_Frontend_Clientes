"use client";

import { useTranslations } from "next-intl";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertCircle, Loader2, PawPrint, Stethoscope } from "lucide-react";

interface Props {
  diagnosticoResultado: string | null;
  isPending: boolean;
  sintomasValue: string[];
  especieValue: string;
  razaValue: string;
  edadValue: number;
}

const CardResults = ({
  diagnosticoResultado,
  isPending,
  sintomasValue,
  especieValue,
  razaValue,
  edadValue,
}: Props) => {
  const t = useTranslations("cardResults");

  return (
    <Card className="shadow-lg lg:sticky lg:top-6 h-fit">
      <CardHeader className="bg-primary/5 border-b">
        <CardTitle className="flex items-center gap-2">
          <PawPrint className="h-5 w-5" />
          {t("title")}
        </CardTitle>
        <CardDescription>{t("description")}</CardDescription>
      </CardHeader>

      <CardContent className="p-0">
        {isPending ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 h-[500px]">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">{t("loading")}</p>
          </div>
        ) : diagnosticoResultado ? (
          <ScrollArea className="h-[500px] lg:h-[600px] w-full p-6">
            <div className="space-y-4 pr-4">
              {Array.isArray(sintomasValue) && sintomasValue.length > 0 && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-medium mb-2">
                    {t("reportedSymptoms")}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {sintomasValue.map((s, i) => (
                      <Badge key={i} variant="secondary">
                        {s}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-primary/5 p-3 rounded-lg">
                <p className="text-sm font-medium mb-1">{t("patient")}</p>
                <p className="text-sm">
                  {especieValue} - {razaValue} ({edadValue} {t("months")})
                </p>
              </div>

              <div className="prose prose-sm max-w-none dark:prose-invert">
                {diagnosticoResultado.split("\n").map((linea, index) => {
                  if (linea.match(/\*\*\d+\./)) {
                    return (
                      <h3
                        key={index}
                        className="text-lg font-bold text-primary mt-4 mb-2"
                      >
                        {linea.replace(/\*\*/g, "")}
                      </h3>
                    );
                  } else if (linea.match(/###/)) {
                    return (
                      <h4
                        key={index}
                        className="font-semibold text-md mt-3 mb-1"
                      >
                        {linea.replace(/###/g, "").trim()}
                      </h4>
                    );
                  } else if (linea.trim().startsWith("-")) {
                    return (
                      <li key={index} className="ml-4 list-disc text-sm">
                        {linea.replace("-", "").trim()}
                      </li>
                    );
                  } else if (linea.trim()) {
                    return (
                      <p key={index} className="text-sm leading-relaxed">
                        {linea}
                      </p>
                    );
                  }
                  return <br key={index} />;
                })}
              </div>
            </div>
          </ScrollArea>
        ) : (
          <div className="flex flex-col items-center justify-center h-[400px] px-4 text-center">
            <div className="bg-muted/50 p-4 rounded-full mb-4">
              <Stethoscope className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="font-semibold mb-2">{t("empty.title")}</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              {t("empty.description")}
            </p>
          </div>
        )}
      </CardContent>

      {diagnosticoResultado && (
        <CardFooter className="border-t bg-amber-50/50 dark:bg-amber-950/20">
          <Alert className="border-amber-200">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>{t("warning.title")}</AlertTitle>
            <AlertDescription className="text-xs">
              {t("warning.description")}
            </AlertDescription>
          </Alert>
        </CardFooter>
      )}
    </Card>
  );
};

export default CardResults;
