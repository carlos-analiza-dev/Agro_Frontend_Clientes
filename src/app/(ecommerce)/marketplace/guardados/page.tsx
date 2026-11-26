"use client";

import CardMarketAnimal from "@/components/marketplace/CardMarketAnimal";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2 } from "lucide-react";
import EmptyStateMarketplace from "@/components/marketplace/EmptyStateMarketplace";
import { useRouter } from "next/navigation";
import { useMarketplaceGuardados } from "@/hooks/market-animales/useMarketplaceGuardados";
import { useTranslations } from "next-intl";

const PublicacionesGuardadasPage = () => {
  const t = useTranslations("marketPlaceSavedPublicationsPage");
  const router = useRouter();
  const { guardados, limpiarGuardados, guardadosCount } =
    useMarketplaceGuardados();

  const handleLimpiarGuardados = () => {
    limpiarGuardados();
  };

  if (guardados.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <EmptyStateMarketplace
          variant="no-products"
          title={t("empty.title")}
          description={t("empty.description")}
          actionText={t("empty.action")}
          onRefresh={() => router.push("/marketplace")}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-lg md:text-3xl font-black flex items-center gap-2">
            <Bookmark className="w-8 h-8 text-blue-500" />
            {t("title")}
          </h1>
          <p className="text-gray-500 mt-1">
            {t("savedCount", { count: guardadosCount })}
          </p>
        </div>

        {guardados.length > 0 && (
          <Button
            variant="outline"
            onClick={handleLimpiarGuardados}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {t("buttons.clear")}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {guardados.map((producto) => (
          <CardMarketAnimal
            key={producto.id}
            animal={producto}
            link_page={`/marketplace/animales/${producto.id}`}
            isAuthenticated={true}
          />
        ))}
      </div>
    </div>
  );
};

export default PublicacionesGuardadasPage;
