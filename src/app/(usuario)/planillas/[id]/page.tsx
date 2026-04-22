"use client";
import ButtonBack from "@/components/generics/ButtonBack";
import SkeletonCard from "@/components/generics/SkeletonCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import useGetPlanillasById from "@/hooks/planillas/useGetPlanillasById";
import { useParams, useRouter } from "next/navigation";
import FormPlanilla from "../ui/FormPlanilla";

const EditarPlanillaPage = () => {
  const { id } = useParams();
  const planillaId = id as string;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const { data: planilla, isLoading } = useGetPlanillasById(planillaId);

  if (isLoading) {
    return <SkeletonCard />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <ButtonBack isMobil={isMobile} />
          <h1 className="text-2xl font-bold">Editar Planilla</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Editando la Planilla</CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para editar la planilla
            </p>
          </CardHeader>
          <CardContent>
            <FormPlanilla onSuccess={() => router.back()} planilla={planilla} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarPlanillaPage;
