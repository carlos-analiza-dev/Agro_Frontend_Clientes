"use client";
import ButtonBack from "@/components/generics/ButtonBack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useParams, useRouter } from "next/navigation";
import FormEquipos from "../ui/FormEquipos";
import useGetEquipoMaquinariaById from "@/hooks/equipos-maquinaria/useGetEquipoMaquinariaById";
import SkeletonCard from "@/components/generics/SkeletonCard";

const EditarEquipoPage = () => {
  const { id } = useParams();
  const equipoId = id as string;
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const { data: equipo, isLoading } = useGetEquipoMaquinariaById(equipoId);

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <ButtonBack isMobil={isMobile} />
          <h1 className="text-2xl font-bold">Editar Equipo</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Edita un nuevo equipo</CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para editar el equipo
            </p>
          </CardHeader>
          <CardContent>
            <FormEquipos
              onSuccess={() => router.back()}
              moneda={moneda}
              equipo={equipo}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarEquipoPage;
