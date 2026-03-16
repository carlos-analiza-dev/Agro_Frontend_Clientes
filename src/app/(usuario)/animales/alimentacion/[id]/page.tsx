"use client";

import { useAuthStore } from "@/providers/store/useAuthStore";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import FormAlimentacionAnimal from "../ui/FormAlimentacionAnimal";
import useGetAlimentacionPorId from "@/hooks/alimentacion_animales/useGetAlimentacionPorId";

const EditarAlimentacionPage = () => {
  const { cliente } = useAuthStore();
  const router = useRouter();
  const params = useParams();
  const alimentacionId = params.id as string;

  const moneda = cliente?.pais.simbolo_moneda || "$";

  const {
    data: alimentacion,
    isLoading,
    error,
  } = useGetAlimentacionPorId(alimentacionId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-8 w-48" />
          </div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-36" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error || !alimentacion) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.back()}
              className="shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold">Error</h1>
          </div>
          <Card className="border-destructive">
            <CardContent className="py-8 text-center">
              <p className="text-destructive mb-2">
                No se pudo cargar la información
              </p>
              <Button onClick={() => router.back()} variant="outline">
                Volver
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const alimentacionData = {
    id: alimentacion.id,
    tipoAlimento: alimentacion.tipoAlimento,
    origen: alimentacion.origen,
    cantidad: alimentacion.cantidad,
    unidad: alimentacion.unidad,
    costo_diario: alimentacion.costo_diario,
    fecha: alimentacion.fecha,
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold">Editar Alimentación</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              Editando registro de {alimentacion.tipoAlimento}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Modifica los datos de la alimentación del animal
            </p>
          </CardHeader>
          <CardContent>
            <FormAlimentacionAnimal
              moneda={moneda}
              cliente={cliente}
              openModal={true}
              setOpenModal={() => router.back()}
              isEdit={true}
              editAlimentacion={alimentacionData}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarAlimentacionPage;
