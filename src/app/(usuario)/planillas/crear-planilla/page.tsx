"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import FormPlanilla from "../ui/FormPlanilla";

const CrearPlanillaPage = () => {
  const router = useRouter();
  const t = useTranslations("crearPlanillaPage");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">{t("title")}</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">{t("card.title")}</CardTitle>

            <p className="text-sm text-muted-foreground">
              {t("card.description")}
            </p>
          </CardHeader>

          <CardContent>
            <FormPlanilla onSuccess={() => router.back()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrearPlanillaPage;
