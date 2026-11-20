"use client";

import { Button } from "@/components/ui/button";
import { useFavoritos } from "@/hooks/favoritos/useFavoritos";
import { Heart, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import ProductCard from "@/components/products/ProductCard";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function FavoritosPage() {
  const { favoritos, limpiarFavoritos } = useFavoritos();
  const router = useRouter();
  const t = useTranslations("favorites");

  const [paisId, setPaisId] = useState<string | null>(null);
  const [isCheckingCountry, setIsCheckingCountry] = useState(true);

  useEffect(() => {
    try {
      const paisStorage = localStorage.getItem("selectedCountry");
      const pais = paisStorage ? JSON.parse(paisStorage) : null;

      setPaisId(pais?.id ?? null);
    } catch {
      setPaisId(null);
    } finally {
      setIsCheckingCountry(false);
    }
  }, []);

  useEffect(() => {
    if (!isCheckingCountry && !paisId) {
      router.push("/not-selected-country");
    }
  }, [paisId, isCheckingCountry, router]);

  if (isCheckingCountry || !paisId) {
    return null;
  }

  const tieneFavoritos = favoritos.length > 0;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">{t("title")}</h1>

            <p className="text-muted-foreground text-sm">
              {t("savedProducts", { count: favoritos.length })}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Heart className="h-5 w-5" />
              <span className="font-medium">{favoritos.length}</span>
            </div>

            {tieneFavoritos && (
              <Button
                variant="outline"
                onClick={limpiarFavoritos}
                size="sm"
                className="gap-2"
              >
                <Trash2 className="h-4 w-4" />
                {t("clear")}
              </Button>
            )}
          </div>
        </div>

        {!tieneFavoritos ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <div className="bg-muted/40 p-6 rounded-2xl mb-4">
              <Heart className="h-14 w-14 text-muted-foreground/50" />
            </div>

            <h2 className="text-xl font-semibold mb-2">{t("emptyTitle")}</h2>

            <p className="text-muted-foreground max-w-md">
              {t("emptyDescription")}
            </p>

            <Button
              onClick={() => router.push("/productos-agroservicios")}
              className="mt-6"
            >
              {t("exploreProducts")}
            </Button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {favoritos.map((producto) => (
                <ProductCard
                  key={producto.id}
                  producto={producto}
                  user={undefined}
                  onPress={() =>
                    router.push(`/productos-agroservicios/${producto.id}`)
                  }
                  className="h-full"
                />
              ))}
            </div>

            <div className="mt-10 pt-6 border-t text-center">
              <p className="text-sm text-muted-foreground">
                {t("productsInFavorites", {
                  count: favoritos.length,
                })}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
