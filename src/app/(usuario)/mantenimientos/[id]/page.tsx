"use client";
import SkeletonCard from "@/components/generics/SkeletonCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetMantenimientoById from "@/hooks/mantenimientos/useGetMantenimientoById";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useParams, useRouter } from "next/navigation";
import FormMantenimiento from "../ui/FormMantenimiento";

const EditarMantenimientoPage = () => {
  const { id } = useParams();
  const mantenimientoId = id as string;
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const router = useRouter();
  const { data: mantenimiento, isLoading } =
    useGetMantenimientoById(mantenimientoId);

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Editar Mantenimiento</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              Edita un nuevo mantenimiento
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para editar el mantenimiento
            </p>
          </CardHeader>
          <CardContent>
            <FormMantenimiento
              onSuccess={() => router.back()}
              moneda={moneda}
              mantenimiento={mantenimiento}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarMantenimientoPage;
