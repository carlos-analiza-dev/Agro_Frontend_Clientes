"use client";

import { TipoPublicacion } from "@/interfaces/enums/market/tipo_publicacion.enum";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/providers/store/useAuthStore";
import SkeletonPublicacion from "@/components/marketplace/SkeletonPublicacion";
import FormPublicacion from "@/components/marketplace/FormPublicacion";

const CreatePublicacionPage = () => {
  const t = useTranslations("marketPlaceCreatePublicacionPage");
  const { cliente } = useAuthStore();
  const params = useParams();

  const tipo_publicacion = params.tipo as TipoPublicacion;

  const isAnimales = tipo_publicacion === TipoPublicacion.ANIMALES;

  if (!tipo_publicacion) {
    return <SkeletonPublicacion />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container w-full mx-auto px-4">
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {t("title")}
                </h1>
                <p className="text-gray-600 mt-1">
                  {t("description", {
                    type: isAnimales ? t("types.animal") : t("types.product"),
                  })}
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
