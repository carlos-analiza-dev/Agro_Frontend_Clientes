"use client";
import ButtonBack from "@/components/generics/ButtonBack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { useParams, useRouter } from "next/navigation";
import FormServicioReproductivo from "../ui/FormServicioReproductivo";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { useAuthStore } from "@/providers/store/useAuthStore";
import useGetServicioById from "@/hooks/reproduccion/useGetServicioById";
import SkeletonCard from "@/components/generics/SkeletonCard";

const EditarServicioReproductivoPage = () => {
  const { id } = useParams();
  const servicioId = id as string;
  const { data: servicio, isLoading } = useGetServicioById(servicioId);

  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const { data: animalesData } = useGetAnimalesPropietario(clienteId);

  const hembras =
    animalesData?.data?.filter((animal) => animal.sexo === "Hembra") || [];
  const machos =
    animalesData?.data?.filter((animal) => animal.sexo === "Macho") || [];

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <ButtonBack isMobil={isMobile} />
          <h1 className="text-2xl font-bold">Editar Servicio</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              Editar Servicio del Animal
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para editar el Servicio de tu animal
            </p>
          </CardHeader>
          <CardContent>
            <FormServicioReproductivo
              hembras={hembras}
              machos={machos}
              setOpenModal={() => router.back()}
              servicio={servicio}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarServicioReproductivoPage;
