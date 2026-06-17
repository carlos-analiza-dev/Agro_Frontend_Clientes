"use client";
import FormPublicacion from "@/components/marketplace/FormPublicacion";
import { Card, CardContent } from "@/components/ui/card";
import useGetAnimalMarketById from "@/hooks/market-animales/useGetAnimalMarketById";
import { TipoPublicacion } from "@/interfaces/enums/market/tipo_publicacion.enum";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useParams } from "next/navigation";

const EditPublicacionPage = () => {
  const { cliente } = useAuthStore();
  const params = useParams();

  const id = params.id as string;
  const { data: publicacion, isLoading } = useGetAnimalMarketById(id);

  const tipo = publicacion?.tipo_publicacion ?? TipoPublicacion.ANIMALES;
  const isAnimales = tipo === TipoPublicacion.ANIMALES;

  console.log("PUBLICACION", publicacion);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container w-full mx-auto px-4">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Editar publicación
                </h1>
                <p className="text-gray-600 mt-1">
                  Completa los detalles de tu{" "}
                  {isAnimales ? "animal" : "producto"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <FormPublicacion
          tipo_publicacion={tipo}
          cliente={cliente}
          publicacion={publicacion}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default EditPublicacionPage;
