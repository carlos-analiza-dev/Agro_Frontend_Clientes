"use client";

import SkeletonCard from "@/components/generics/SkeletonCard";
import CardMarketAnimal from "@/components/marketplace/CardMarketAnimal";
import EmptyStateMarketplace from "@/components/marketplace/EmptyStateMarketplace";
import { PriceRangeFilter } from "@/components/marketplace/PriceRangeFilter";
import { RadioFilter } from "@/components/marketplace/RadioFilter";
import useUserLocation from "@/hooks/location/useUserLocation";
import useGetAllPublicaciones from "@/hooks/market-animales/useGetAllPublicaciones";
import { MapPin, Sparkles } from "lucide-react";
import { useCallback, useRef, useState } from "react";

const AgroMarketPublicPage = () => {
  const { location } = useUserLocation();
  const [radio, setRadio] = useState<number>(100);
  const [priceMin, setPriceMin] = useState<number | undefined>(undefined);
  const [priceMax, setPriceMax] = useState<number | undefined>(undefined);

  const {
    data: publicaciones,
    isLoading,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAllPublicaciones(
    location
      ? {
          latitud: location.latitud,
          longitud: location.longitud,
          radio: radio,
          priceMax,
          priceMin,
        }
      : undefined,
  );

  const handleRefresh = () => {
    refetch();
    window.location.reload();
  };

  const handleRadiusChange = (newRadius: number) => {
    setRadio(newRadius);
  };

  const handlePriceChange = (
    min: number | undefined,
    max: number | undefined,
  ) => {
    setPriceMin(min);
    setPriceMax(max);
  };

  const publicaciones_publicas =
    publicaciones?.pages.flatMap((page) => page.productos) ?? [];

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastPublicacionRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (isLoading || isFetchingNextPage) return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      });

      if (node) {
        observerRef.current.observe(node);
      }
    },
    [isLoading, isFetchingNextPage, hasNextPage, fetchNextPage],
  );
  if (!location || isLoading) {
    return <SkeletonCard />;
  }

  if (publicaciones_publicas.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-green-50/30 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center relative">
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-200/20 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-white/40 mb-4">
              <Sparkles className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-gray-500">
                Sin resultados
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-700 bg-clip-text text-transparent">
              Destacados de hoy
            </h1>
            <p className="text-sm md:text-base text-gray-400 mt-2">
              Ajusta los filtros para encontrar más publicaciones
            </p>
          </div>

          <div className="relative z-10 flex flex-wrap items-center justify-center gap-3 mb-6">
            <div className="rounded-full bg-white/70 backdrop-blur-sm border border-gray-200/50 shadow-[0_4px_16px_rgba(0,0,0,0.04)] px-2 py-1">
              <RadioFilter
                onRadiusChange={handleRadiusChange}
                currentRadius={radio}
              />
            </div>
            <div className="rounded-full bg-white/70 backdrop-blur-sm border border-gray-200/50 shadow-[0_4px_16px_rgba(0,0,0,0.04)] px-2 py-1">
              <PriceRangeFilter
                onPriceChange={handlePriceChange}
                minPrice={0}
                maxPrice={5000000}
                initialMin={priceMin}
                initialMax={priceMax}
              />
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-gray-200/50 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-gray-600">
              <MapPin size={18} className="shrink-0 text-green-600" />
              <p className="text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
                {location.pais}, {location.ciudad}
              </p>
            </div>
          </div>

          <div className="relative z-0">
            <EmptyStateMarketplace
              variant="error"
              onRefresh={handleRefresh}
              isLoading={isLoading}
              description={
                error?.message || "No se pudieron cargar los productos"
              }
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-green-50/30 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center relative">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-0 left-1/4 w-64 h-64 bg-green-200/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-blue-200/20 rounded-full blur-3xl" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-white/40 mb-4">
            <Sparkles className="h-4 w-4 text-green-500" />
            <span className="text-xs font-medium text-gray-500">
              {publicaciones_publicas.length} publicaciones disponibles
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-700 bg-clip-text text-transparent">
            Destacados de hoy
          </h1>
          <p className="text-sm md:text-base text-gray-400 mt-2">
            Descubre los mejores animales disponibles
          </p>
        </div>

        <div className="relative z-30 flex flex-wrap items-center justify-center gap-3 mb-6">
          <RadioFilter
            onRadiusChange={handleRadiusChange}
            currentRadius={radio}
          />
          <PriceRangeFilter
            onPriceChange={handlePriceChange}
            minPrice={0}
            maxPrice={5000000}
            initialMin={priceMin}
            initialMax={priceMax}
          />
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/70 backdrop-blur-sm border border-gray-200/50 shadow-[0_4px_16px_rgba(0,0,0,0.04)] text-gray-600">
            <MapPin size={18} className="shrink-0 text-green-600" />
            <p className="text-sm sm:text-base truncate max-w-[200px] sm:max-w-none">
              {location.pais}, {location.ciudad}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {publicaciones_publicas.map((publicacion, index) => {
            if (index === publicaciones_publicas.length - 1) {
              return (
                <div ref={lastPublicacionRef} key={publicacion.id}>
                  <CardMarketAnimal
                    animal={publicacion}
                    link_page={`/agro-market/${publicacion.id}`}
                    isAuthenticated={false}
                  />
                </div>
              );
            }
            return (
              <CardMarketAnimal
                key={publicacion.id}
                animal={publicacion}
                link_page={`/agro-market/${publicacion.id}`}
                isAuthenticated={false}
              />
            );
          })}
        </div>

        {isFetchingNextPage && (
          <div className="flex justify-center items-center py-8">
            <div className="flex flex-col items-center gap-3">
              <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-muted-foreground">
                Cargando más publicaciones...
              </p>
            </div>
          </div>
        )}

        {!hasNextPage && publicaciones_publicas.length > 0 && (
          <div className="text-center mt-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-gray-200/50">
              <span className="text-sm text-gray-400">
                Has visto todas las publicaciones disponibles
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgroMarketPublicPage;
