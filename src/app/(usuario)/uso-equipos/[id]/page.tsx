"use client";
import SkeletonCard from "@/components/generics/SkeletonCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetUsoEquipoById from "@/hooks/uso-equipos/useGetUsoEquipoById";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useParams, useRouter } from "next/navigation";
import FormUsoEquipo from "../ui/FormUsoEquipo";

const EditarUsoEquipoPage = () => {
  const { id } = useParams();
  const usoId = id as string;
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const router = useRouter();
  const { data: usoEquipo, isLoading } = useGetUsoEquipoById(usoId);

  if (isLoading) {
    return <SkeletonCard />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Editar Uso</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Edita un nuevo uso</CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para editar el uso
            </p>
          </CardHeader>
          <CardContent>
            <FormUsoEquipo
              onSuccess={() => router.back()}
              moneda={moneda}
              usoEquipo={usoEquipo}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarUsoEquipoPage;
