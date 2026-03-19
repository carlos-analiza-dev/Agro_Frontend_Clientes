"use client";
import ButtonBack from "@/components/generics/ButtonBack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormCelosAnimal from "../ui/FormCelosAnimal";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { useRouter } from "next/navigation";

const CrearPeriodoCelo = () => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const { data: animales, isLoading: animalesLoading } =
    useGetAnimalesPropietario(clienteId);
  const hembras = animales?.data.filter((animal) => animal.sexo === "Hembra");
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <ButtonBack isMobil={isMobile} />
          <h1 className="text-2xl font-bold">Nueva Celo</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Registrar Celo del Animal</CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para registrar el nuevo celo de tu animal
            </p>
          </CardHeader>
          <CardContent>
            <FormCelosAnimal
              hembras={hembras}
              setOpenModal={() => router.back()}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrearPeriodoCelo;
