"use client";

import CardMarketAnimal from "@/components/marketplace/CardMarketAnimal";
import { Button } from "@/components/ui/button";
import { Bookmark, Trash2 } from "lucide-react";
import EmptyStateMarketplace from "@/components/marketplace/EmptyStateMarketplace";
import { useRouter } from "next/navigation";
import { useMarketplaceGuardados } from "@/hooks/market-animales/useMarketplaceGuardados";

const PublicacionesGuardadasPage = () => {
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
          title="No tienes publicaciones guardadas"
          description="Explora nuestro marketplace y guarda las publicaciones que te interesen para verlas más tarde."
          actionText="Explorar marketplace"
          onRefresh={() => router.push("/marketplace")}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black flex items-center gap-2">
            <Bookmark className="w-8 h-8 text-blue-500" />
            Publicaciones guardadas
          </h1>
          <p className="text-gray-500 mt-1">
            Tienes {guardadosCount} publicación(es) guardada(s)
          </p>
        </div>

        {guardados.length > 0 && (
          <Button
            variant="outline"
            onClick={handleLimpiarGuardados}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Limpiar guardados
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {guardados.map((producto) => (
          <CardMarketAnimal key={producto.id} animal={producto} />
        ))}
      </div>
    </div>
  );
};

export default PublicacionesGuardadasPage;
