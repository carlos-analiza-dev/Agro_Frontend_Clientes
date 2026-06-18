"use client";
import { useState } from "react";
import SkeletonCard from "@/components/generics/SkeletonCard";
import CardMarketAnimal from "@/components/marketplace/CardMarketAnimal";
import EmptyStateMarketplace from "@/components/marketplace/EmptyStateMarketplace";
import { RadioFilter } from "@/components/marketplace/RadioFilter";
import useUserLocation from "@/hooks/location/useUserLocation";
import useGetAnimalesMarket from "@/hooks/market-animales/useGetAnimalesMarket";
import { MapPin } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useRef } from "react";

const BsuquedasPage = () => {
  const searchParams = useSearchParams();
  const nombre = searchParams.get("q") as string;

  const { location } = useUserLocation();
  const [radio, setRadio] = useState<number>(100);

  const {
    data: animales_market,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetAnimalesMarket(
    location
      ? {
          latitud: location.latitud,
          longitud: location.longitud,
          radio: radio,
          nombre,
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

  const animales =
    animales_market?.pages.flatMap((page) => page.productos) ?? [];

  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastAnimalRef = useCallback(
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

  if (isError || animales.length === 0) {
    return (
      <div className="container mx-auto px-3 sm:px-4 lg:px-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
          <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
            Resultados de la Búsqueda "{nombre}"
          </h1>

          <div className="flex items-center gap-2">
            <RadioFilter
              onRadiusChange={handleRadiusChange}
              currentRadius={radio}
            />
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin size={18} className="shrink-0" />
              <p className="text-sm sm:text-base md:text-lg truncate max-w-[200px] sm:max-w-none">
                {location.pais}, {location.ciudad}
              </p>
            </div>
          </div>
        </div>
        <EmptyStateMarketplace
          variant="error"
          onRefresh={handleRefresh}
          isLoading={isLoading}
          description={error?.message || "No se pudieron cargar los productos"}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 lg:px-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold">
          Resultados de la Búsqueda "{nombre}"
        </h1>

        <div className="flex items-center gap-2">
          <RadioFilter
            onRadiusChange={handleRadiusChange}
            currentRadius={radio}
          />
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin size={18} className="shrink-0" />
            <p className="text-sm sm:text-base md:text-lg truncate max-w-[200px] sm:max-w-none">
              {location.pais}, {location.ciudad}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mt-6 sm:mt-8">
        {animales.map((animal, index) => {
          if (index === animales.length - 1) {
            return (
              <div ref={lastAnimalRef} key={animal.id}>
                <CardMarketAnimal animal={animal} />
              </div>
            );
          }
          return <CardMarketAnimal key={animal.id} animal={animal} />;
        })}
      </div>

      {isFetchingNextPage && (
        <div className="flex justify-center items-center py-8">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-muted-foreground">
              Cargando más resultados...
            </p>
          </div>
        </div>
      )}

      {!hasNextPage && animales.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-muted-foreground">
            No hay más resultados para mostrar
          </p>
        </div>
      )}
    </div>
  );
};

export default BsuquedasPage;
