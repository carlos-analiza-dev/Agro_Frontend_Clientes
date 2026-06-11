"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useRouter } from "next/navigation";
import FormEquipos from "../ui/FormEquipos";

const IngresarEquipoPage = () => {
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Ingresar Equipo</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Ingresa un nuevo equipo</CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para ingresar el equipo
            </p>
          </CardHeader>
          <CardContent>
            <FormEquipos onSuccess={() => router.back()} moneda={moneda} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default IngresarEquipoPage;
