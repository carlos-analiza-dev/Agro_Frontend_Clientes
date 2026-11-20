"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import FormCultivo from "../ui/FormCultivo";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/providers/store/useAuthStore";

const CrearCuktivoPage = () => {
  const t = useTranslations("crearCultivoPage");

  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
  const moneda = cliente?.pais.simbolo_moneda ?? "$";

  const { data: fincasData } = useFincasPropietarios(propietarioId);

  const router = useRouter();

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
              moneda={moneda}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrearCuktivoPage;
