"use client";
import SkeletonCard from "@/components/generics/SkeletonCard";
import CardMarketAnimal from "@/components/marketplace/CardMarketAnimal";
import EmptyStateMarketplace from "@/components/marketplace/EmptyStateMarketplace";
import useUserLocation from "@/hooks/location/useUserLocation";
import useGetAnimalesMarket from "@/hooks/market-animales/useGetAnimalesMarket";
import { MapPin } from "lucide-react";
import { useParams } from "next/navigation";

const PublicacionesByCategory = () => {
  const params = useParams();
  const id = params.id as string;

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
          categoria: id,
        }
      : undefined,
  );

  const handleRefresh = () => {
    refetch();
  };

  const animales =
    animales_market?.pages.flatMap((page) => page.productos) ?? [];

  if (!location) {
    return <SkeletonCard />;
  }

  if (isLoading) {
    return <SkeletonCard />;
  }

  if (isError || animales.length === 0) {
    return (
      <div className="container mx-auto p-4">
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
    <div className="container">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold">Destacados de hoy</h1>
        <div className="flex gap-4 items-center">
          <MapPin size={20} />
          <p>
            {location.pais}, {location.ciudad}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 mt-8 gap-5">
        {animales.map((animal) => (
          <CardMarketAnimal key={animal.id} animal={animal} />
        ))}
      </div>
    </div>
  );
};

export default PublicacionesByCategory;
