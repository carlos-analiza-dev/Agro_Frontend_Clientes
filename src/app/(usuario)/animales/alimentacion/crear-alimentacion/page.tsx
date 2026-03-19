"use client";

import { useAuthStore } from "@/providers/store/useAuthStore";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import FormAlimentacionAnimal from "../ui/FormAlimentacionAnimal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ButtonBack from "@/components/generics/ButtonBack";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";

const NuevaAlimentacionPage = () => {
  const { cliente } = useAuthStore();
  const router = useRouter();
  const moneda = cliente?.pais.simbolo_moneda || "$";
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <ButtonBack isMobil={isMobile} />
          <h1 className="text-2xl font-bold">Nueva Alimentación</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              Registrar alimentación diaria
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para registrar la alimentación de tu animal
            </p>
          </CardHeader>
          <CardContent>
            <FormAlimentacionAnimal
              moneda={moneda}
              cliente={cliente}
              openModal={true}
              setOpenModal={() => router.back()}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NuevaAlimentacionPage;
