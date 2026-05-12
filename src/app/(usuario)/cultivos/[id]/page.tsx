"use client";
import ButtonBack from "@/components/generics/ButtonBack";
import SkeletonCard from "@/components/generics/SkeletonCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetCultivoById from "@/hooks/cultivos/useGetCultivoById";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { useParams, useRouter } from "next/navigation";
import FormCultivo from "../ui/FormCultivo";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";

const EditarCultivoPage = () => {
  const { id } = useParams();
  const cultivoId = id as string;
  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const { data: fincasData } = useFincasPropietarios(propietarioId);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const { data: cultivo, isLoading } = useGetCultivoById(cultivoId);

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <ButtonBack isMobil={isMobile} />
          <h1 className="text-2xl font-bold">Editar Cultivo</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Editando el cultivo</CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para editar el cultivo
            </p>
          </CardHeader>
          <CardContent>
            <FormCultivo
              onSuccess={() => router.back()}
              fincas={fincasData?.data.fincas}
              cultivo={cultivo}
              moneda={moneda}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarCultivoPage;
