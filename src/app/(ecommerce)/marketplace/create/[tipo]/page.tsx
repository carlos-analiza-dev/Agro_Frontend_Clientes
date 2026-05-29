"use client";
import { TipoPublicacion } from "@/interfaces/enums/market/tipo_publicacion.enum";
import { useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/providers/store/useAuthStore";
import FormPublicacion from "./ui/FormPublicacion";

const CreatePublicacionPage = () => {
  const { cliente } = useAuthStore();
  const params = useParams();

  const tipo_publicacion = params.tipo as TipoPublicacion;

  const isAnimales = tipo_publicacion === TipoPublicacion.ANIMALES;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container max-w-4xl mx-auto px-4">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Crear nueva publicación
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
          tipo_publicacion={tipo_publicacion}
          cliente={cliente}
        />
      </div>
    </div>
  );
};

export default CreatePublicacionPage;
