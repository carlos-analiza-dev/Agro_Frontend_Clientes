"use client";
import SkeletonCard from "@/components/generics/SkeletonCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetJornadasTranajadoresById from "@/hooks/jornadas-trabajadores/useGetJornadasTranajadoresById";
import { useParams, useRouter } from "next/navigation";
import FormJornadaTrabajador from "../ui/FormJornadaTrabajador";

const EditJornadaPage = () => {
  const { id } = useParams();
  const jornadaId = id as string;
  const router = useRouter();
  const { data: jornada, isLoading } =
    useGetJornadasTranajadoresById(jornadaId);

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Editar Jornada</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Editando la Jornada</CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para editar la jornada laboral
            </p>
          </CardHeader>
          <CardContent>
            <FormJornadaTrabajador
              onSuccess={() => router.back()}
              jornada={jornada}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditJornadaPage;
