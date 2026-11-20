"use client";

import SkeletonCard from "@/components/generics/SkeletonCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetCultivoById from "@/hooks/cultivos/useGetCultivoById";
import { useParams, useRouter } from "next/navigation";
import FormCultivo from "../ui/FormCultivo";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useTranslations } from "next-intl";

const EditarCultivoPage = () => {
  const t = useTranslations("editarCultivoPage");

  const { id } = useParams();
  const cultivoId = id as string;

  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
  const moneda = cliente?.pais.simbolo_moneda ?? "$";

  const { data: fincasData } = useFincasPropietarios(propietarioId);

  const router = useRouter();
  const { data: cultivo, isLoading } = useGetCultivoById(cultivoId);

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
            <CardTitle className="text-lg">{t("cardTitle")}</CardTitle>
            <p className="text-sm text-muted-foreground">{t("description")}</p>
          </CardHeader>

          <CardContent>
            <FormCultivo
              onSuccess={() => router.back()}
              fincas={fincasData?.data.fincas}
              cultivo={cultivo}
              moneda={moneda}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarCultivoPage;
