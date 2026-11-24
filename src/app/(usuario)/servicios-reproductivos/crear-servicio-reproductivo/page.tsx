"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormServicioReproductivo from "../ui/FormServicioReproductivo";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useRouter } from "next/navigation";

const CrearServicioReproductivo = () => {
  const t = useTranslations("crearServicioReproductivo");
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const router = useRouter();

  const { data: animalesData, isLoading: animalesLoading } =
    useGetAnimalesPropietario();

  const hembras =
    animalesData?.filter((animal) => animal.sexo === "Hembra") || [];

  const machos =
    animalesData?.filter((animal) => animal.sexo === "Macho") || [];

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
            <FormServicioReproductivo
              setOpenModal={() => router.back()}
              hembras={hembras}
              machos={machos}
              moneda={moneda}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrearServicioReproductivo;
