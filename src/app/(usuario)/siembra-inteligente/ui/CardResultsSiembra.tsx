"use client";

import { useTranslations } from "next-intl";
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

const CardResultsSiembra = ({
  consultaResultado,
  isPending,
  cultivoValue,
  tipoTerrenoValue,
  climaValue,
  areaValue,
  unidadValue,
}: CardResultsSiembraProps) => {
  const t = useTranslations("cardResultsSiembra");
  const [showAlert, setShowAlert] = useState(false);

  const unidadesLabels: Record<string, string> = {
    ha: t("units.hectares"),
    mz: t("units.manzanas"),
    m2: t("units.squareMeters"),
    ac: t("units.acres"),
  };

  useEffect(() => {
    if (consultaResultado && !isPending) {
      setShowAlert(true);

      toast.info(t("notifications.aiRecommendation"), {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [consultaResultado, isPending, t]);

  if (isPending) {
    return (
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Loader2 className="h-5 w-5 animate-spin" />
            {t("loading.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground text-center">
            {t("loading.description")}
            <br />
            {t("loading.wait")}
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
            {t("empty.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted/30 rounded-full p-4 mb-4">
            <Sprout className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="font-semibold text-lg mb-2">{t("empty.heading")}</h3>
          <p className="text-muted-foreground">{t("empty.description")}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2">
          <Ruler className="h-5 w-5 text-blue-600" />
          {t("results.title")}
        </CardTitle>

        <div className="grid grid-cols-2 gap-3 mt-3 pt-2">
          <div className="flex items-center gap-2 text-sm">
            <Sprout className="h-4 w-4 text-green-600" />
            <span className="font-medium">{t("fields.crop")}</span>
            <span className="text-muted-foreground">{cultivoValue}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Mountain className="h-4 w-4 text-orange-500" />
            <span className="font-medium">{t("fields.land")}</span>
            <span className="text-muted-foreground">{tipoTerrenoValue}</span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Sun className="h-4 w-4 text-yellow-500" />
            <span className="font-medium">{t("fields.climate")}</span>
            <span className="text-muted-foreground">{climaValue}</span>
          </div>

          <div className="flex items-center gap-2 text-sm col-span-2">
            <Square className="h-4 w-4 text-purple-500" />
            <span className="font-medium">{t("fields.area")}</span>
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
              {t("aiAlert.title")}
            </AlertTitle>
            <AlertDescription className="text-blue-700 dark:text-blue-300 text-sm">
              {t("aiAlert.description")}{" "}
              <strong>{t("aiAlert.professional")}</strong>{" "}
              {t("aiAlert.closing")}
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
