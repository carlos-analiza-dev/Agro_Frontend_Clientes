"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormTrabajador from "../ui/FormTrabajador";
import { useRouter } from "next/navigation";

const CrearTrabajadorPage = () => {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
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
