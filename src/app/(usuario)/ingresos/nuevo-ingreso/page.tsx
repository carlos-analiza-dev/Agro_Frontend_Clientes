"use client";
import ButtonBack from "@/components/generics/ButtonBack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { useRouter } from "next/navigation";
import FormIngresos from "../ui/FormIngresos";

const NuevoIngresoPage = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <ButtonBack isMobil={isMobile} />
          <h1 className="text-2xl font-bold">Registrar Ingreso</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Ingresa un nuevo ingreso</CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para ingresar el nuevo gasto
            </p>
          </CardHeader>
          <CardContent>
            <FormIngresos setOpenModal={() => router.back()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NuevoIngresoPage;
