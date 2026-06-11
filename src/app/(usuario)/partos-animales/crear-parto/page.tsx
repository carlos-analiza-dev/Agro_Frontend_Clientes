"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormPartoAnimal from "../ui/FormPartoAnimal";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { useRouter } from "next/navigation";

const CrearPartoPage = () => {
  const router = useRouter();
  const { data: animales } = useGetAnimalesPropietario();

  const hembras = animales?.filter((a) => a.sexo === "Hembra");
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold">Ingresar Parto</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              Registrar Parto del Animal
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para registrar el nuevo parto de tu animal
            </p>
          </CardHeader>
          <CardContent>
            <FormPartoAnimal
              hembras={hembras}
              setOpenModal={() => router.back()}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrearPartoPage;
