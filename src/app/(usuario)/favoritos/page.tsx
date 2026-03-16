"use client";

import { Button } from "@/components/ui/button";
import { useFavoritos } from "@/hooks/favoritos/useFavoritos";
import ProductCard from "../productos/ui/ProductCard";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import ButtonBack from "@/components/generics/ButtonBack";

export default function FavoritosPage() {
  const { favoritos, limpiarFavoritos } = useFavoritos();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const tieneFavoritos = favoritos.length > 0;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <ButtonBack isMobil={isMobile} />

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Heart className="h-5 w-5" />
            <span className="font-medium">{favoritos.length} favoritos</span>
          </div>

          {tieneFavoritos && (
            <Button
              variant="outline"
              onClick={limpiarFavoritos}
              size="sm"
              className="gap-2"
            >
              <Trash2 className="h-4 w-4" />
              Limpiar
            </Button>
          )}
        </div>
      </div>

      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Mis Favoritos</h1>

        {!tieneFavoritos ? (
          <div className="py-16 space-y-4">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground">
              No tienes productos favoritos
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {favoritos.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  user={undefined}
                  onPress={() => router.push(`/productos/${producto.id}`)}
                  className="h-full"
                />
              ))}
            </div>

            <div className="mt-8 pt-6 border-t">
              <p className="text-sm text-muted-foreground">
                {favoritos.length} producto{favoritos.length !== 1 ? "s" : ""}{" "}
                en favoritos
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
