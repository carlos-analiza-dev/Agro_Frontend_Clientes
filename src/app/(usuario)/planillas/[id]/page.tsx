"use client";

import SkeletonCard from "@/components/generics/SkeletonCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetPlanillasById from "@/hooks/planillas/useGetPlanillasById";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import FormPlanilla from "../ui/FormPlanilla";

const EditarPlanillaPage = () => {
  const { id } = useParams();
  const planillaId = id as string;
  const router = useRouter();
  const t = useTranslations("editarPlanillaPage");

  const { data: planilla, isLoading } = useGetPlanillasById(planillaId);

  if (isLoading) {
    return <SkeletonCard />;
  }

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
            <FormPlanilla onSuccess={() => router.back()} planilla={planilla} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarPlanillaPage;
