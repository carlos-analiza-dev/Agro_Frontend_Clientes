"use client";
import ButtonBack from "@/components/generics/ButtonBack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormPartoAnimal from "../ui/FormPartoAnimal";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useParams, useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import useGetPartoById from "@/hooks/reproduccion/useGetPartoById";

const EditarPartoPage = () => {
  const { cliente } = useAuthStore();
  const { id } = useParams();
  const partoId = id as string;
  const { data: parto } = useGetPartoById(partoId);

  const clienteId = cliente?.id ?? "";
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: animales } = useGetAnimalesPropietario(clienteId);
  const hembras = animales?.data?.filter((a) => a.sexo === "Hembra");
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <ButtonBack isMobil={isMobile} />
          <h1 className="text-2xl font-bold">Editar Parto</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Editar Parto del Animal</CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para editar el parto de tu animal
            </p>
          </CardHeader>
          <CardContent>
            <FormPartoAnimal
              hembras={hembras}
              setOpenModal={() => router.back()}
              parto={parto}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarPartoPage;
