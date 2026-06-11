"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import FormActividades from "../ui/FormActividades";
import { useAuthStore } from "@/providers/store/useAuthStore";

const CrearActividadPage = () => {
  const { cliente } = useAuthStore();
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Ingresar Actividad</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              Ingresa una nueva actividad
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para ingresar la actividad
            </p>
          </CardHeader>
          <CardContent>
            <FormActividades
              onSuccess={() => router.back()}
              cliente={cliente}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrearActividadPage;
