"use client";
import ButtonBack from "@/components/generics/ButtonBack";
import SkeletonCard from "@/components/generics/SkeletonCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetConfigTrabajadoresById from "@/hooks/config-trabajadores/useGetConfigTrabajadoresById";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { useParams, useRouter } from "next/navigation";
import FormConfigTrabajadores from "../ui/FormConfigTrabajadores";
import { useAuthStore } from "@/providers/store/useAuthStore";

const EditConfiguracionTrabajador = () => {
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const { id } = useParams();
  const configuracionId = id as string;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const { data: configuracion, isLoading } =
    useGetConfigTrabajadoresById(configuracionId);

  if (isLoading) {
    return <SkeletonCard />;
  }
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <ButtonBack isMobil={isMobile} />
          <h1 className="text-2xl font-bold">Editar Configuracion</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Editando la Configuracion</CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para editar la configuracion
            </p>
          </CardHeader>
          <CardContent>
            <FormConfigTrabajadores
              onSuccess={() => router.back()}
              configuracion={configuracion}
              moneda={moneda}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditConfiguracionTrabajador;
