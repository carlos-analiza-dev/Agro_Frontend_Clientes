"use client";
import { Card, CardContent } from "@/components/ui/card";
import useGetAnimalMarketById from "@/hooks/market-animales/useGetAnimalMarketById";
import { TipoPublicacion } from "@/interfaces/enums/market/tipo_publicacion.enum";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useParams } from "next/navigation";
import FormPublicacion from "../../create/[tipo]/ui/FormPublicacion";

const EditPublicacionPage = () => {
  const { cliente } = useAuthStore();
  const params = useParams();

  const id = params.id as string;
  const { data: publicacion, isLoading } = useGetAnimalMarketById(id);
  const tipo = publicacion?.tipo_publicacion ?? TipoPublicacion.ANIMALES;
  const isAnimales = tipo === TipoPublicacion.ANIMALES;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
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
        />
      </div>
    </div>
  );
};

export default EditPublicacionPage;
