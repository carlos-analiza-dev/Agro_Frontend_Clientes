"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const router = useRouter();
  const { data: animalesData } = useGetAnimalesPropietario();

  const hembras =
    animalesData?.filter((animal) => animal.sexo === "Hembra") || [];
  const machos =
    animalesData?.filter((animal) => animal.sexo === "Macho") || [];

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
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
              moneda={moneda}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarServicioReproductivoPage;
