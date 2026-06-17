"use client";
import SkeletonCard from "@/components/generics/SkeletonCard";
import CardMarketAnimal from "@/components/marketplace/CardMarketAnimal";
import EmptyStateMarketplace from "@/components/marketplace/EmptyStateMarketplace";
import useUserLocation from "@/hooks/location/useUserLocation";
import useGetAnimalesMarket from "@/hooks/market-animales/useGetAnimalesMarket";
import { useSearchParams } from "next/navigation";

const BsuquedasPage = () => {
  const searchParams = useSearchParams();
  const nombre = searchParams.get("q") as string;

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
          nombre,
        }
      : undefined,
  );

  const handleRefresh = () => {
    refetch();
    window.location.reload();
  };

  const animales =
    animales_market?.pages.flatMap((page) => page.productos) ?? [];

  if (!location || isLoading) {
    return <SkeletonCard />;
  }

  if (isError || animales.length === 0) {
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
          Resultados de la Busqueda "{nombre}"
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 mt-6 sm:mt-8">
        {animales.map((animal) => (
          <CardMarketAnimal key={animal.id} animal={animal} />
        ))}
      </div>
    </div>
  );
};

export default BsuquedasPage;
