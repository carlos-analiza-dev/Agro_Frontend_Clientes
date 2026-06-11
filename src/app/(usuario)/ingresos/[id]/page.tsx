"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetObtenerIngresoById from "@/hooks/finanzas/ingresos/useGetObtenerIngresoById";
import { useParams, useRouter } from "next/navigation";
import FormIngresos from "../ui/FormIngresos";
import SkeletonCard from "@/components/generics/SkeletonCard";

const EditarIngresoPage = () => {
  const { id } = useParams();
  const ingresoId = id as string;
  const router = useRouter();
  const { data: ingreso, isLoading } = useGetObtenerIngresoById(ingresoId);

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Editar Ingreso</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Editando el ingreso</CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para editar el ingreso
            </p>
          </CardHeader>
          <CardContent>
            <FormIngresos
              setOpenModal={() => router.back()}
              ingreso={ingreso}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarIngresoPage;
