"use client";
import ButtonBack from "@/components/generics/ButtonBack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetObtenerGastoById from "@/hooks/finanzas/gastos/useGetObtenerGastoById";
import { useParams, useRouter } from "next/navigation";
import FormGastos from "../ui/FormGastos";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";

const EditarGastos = () => {
  const { id } = useParams();
  const gastoId = id as string;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const router = useRouter();
  const { data: gasto } = useGetObtenerGastoById(gastoId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <ButtonBack isMobil={isMobile} />
          <h1 className="text-2xl font-bold">Editar Gasto</h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Editango el gasto</CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para editar el gasto
            </p>
          </CardHeader>
          <CardContent>
            <FormGastos setOpenModal={() => router.back()} gasto={gasto} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditarGastos;
