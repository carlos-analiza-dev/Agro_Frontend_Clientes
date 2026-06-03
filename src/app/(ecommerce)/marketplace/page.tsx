"use client";

import SkeletonCard from "@/components/generics/SkeletonCard";
import CardMarketAnimal from "@/components/marketplace/CardMarketAnimal";
import EmptyStateMarketplace from "@/components/marketplace/EmptyStateMarketplace";
import useUserLocation from "@/hooks/location/useUserLocation";
import useGetAnimalesMarket from "@/hooks/market-animales/useGetAnimalesMarket";
import { MapPin } from "lucide-react";

const MarketPlacePage = () => {
  const { location } = useUserLocation();

  const {
    data: animales_market,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetAnimalesMarket(
    location
      ? {
          latitud: location.latitud,
          longitud: location.longitud,
        }
      : undefined,
  );

  const handleRefresh = () => refetch();

  const animales =
    animales_market?.pages.flatMap((page) => page.productos) ?? [];

  if (!location || isLoading) {
    return <SkeletonCard />;
  }

  if (isError) {
    return (
      <div className="container mx-auto p-3 sm:p-4">
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
          Destacados de hoy
        </h1>

        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={18} className="shrink-0" />
          <p className="text-sm sm:text-base md:text-lg truncate max-w-[200px] sm:max-w-none">
            {location.pais}, {location.ciudad}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mt-6 sm:mt-8">
        {animales.map((animal) => (
          <CardMarketAnimal key={animal.id} animal={animal} />
        ))}
      </div>
    </div>
  );
};

export default MarketPlacePage;
