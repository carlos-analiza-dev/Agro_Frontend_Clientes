"use client";
import ButtonBack from "@/components/generics/ButtonBack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormTrabajador from "../ui/FormTrabajador";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";

const CrearTrabajadorPage = () => {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <ButtonBack isMobil={isMobile} />
          <h1 className="text-2xl font-bold">Nuevo Trabajador</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Registrar Trabajador</CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para registrar el nuevo trabajador
            </p>
          </CardHeader>
          <CardContent>
            <FormTrabajador onSuccess={() => router.back()} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrearTrabajadorPage;
