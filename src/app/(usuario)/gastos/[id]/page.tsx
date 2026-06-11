"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetObtenerGastoById from "@/hooks/finanzas/gastos/useGetObtenerGastoById";
import { useParams, useRouter } from "next/navigation";
import FormGastos from "../ui/FormGastos";
import SkeletonCard from "@/components/generics/SkeletonCard";

const EditarGastos = () => {
  const { id } = useParams();
  const gastoId = id as string;
  const router = useRouter();
  const { data: gasto, isLoading } = useGetObtenerGastoById(gastoId);

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Editar Gasto</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Editando el gasto</CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para editar el gasto
            </p>
          </CardHeader>
          <CardContent>
            <FormGastos setOpenModal={() => router.back()} gasto={gasto} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarGastos;
