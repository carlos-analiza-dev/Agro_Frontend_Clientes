import useGetProductosRelacionados from "@/hooks/productos/useGetProductosRelacionados";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuthStore } from "@/providers/store/useAuthStore";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useFavoritos } from "@/hooks/favoritos/useFavoritos";
import CardProductosRelacionados from "./CardProductosRelacionados";

interface Props {
  categoriaId: string;
  producto: string;
  tipo: string;
  limit?: number;
}

const ProductosRelacionados = ({
  categoriaId,
  producto,
  tipo,
  limit = 6,
}: Props) => {
  const { cliente } = useAuthStore();
  const { esFavorito, toggleFavorito } = useFavoritos();

  const {
    data: productos_relacionados,
    isLoading,
    isError,
  } = useGetProductosRelacionados(categoriaId ?? "", producto, tipo ?? "");

  if (isError) {
    return (
      <Card className="mt-8">
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">
            Error al cargar productos relacionados
          </p>
        </CardContent>
      </Card>
    );
  }

  if (
    !isLoading &&
    (!productos_relacionados || productos_relacionados.length === 0)
  ) {
    return null;
  }

  return (
    <Card className="mt-12">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-base md:text-xl font-bold">
            ¿Qué otros productos compran los clientes tras ver este producto?
          </span>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/productos">
              Ver todos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: limit }).map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-0">
                  <Skeleton className="h-48 w-full" />
                  <div className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-6 w-1/2 mb-3" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <div className="relative">
              <CarouselContent className="-ml-2 md:-ml-4">
                {productos_relacionados?.slice(0, limit).map((producto) => {
                  const isFavorite = esFavorito(producto.id);

                  return (
                    <CarouselItem
                      key={producto.id}
                      className="pl-2 md:pl-4 basis-full sm:basis-1/2 lg:basis-1/3 xl:basis-1/4"
                    >
                      <CardProductosRelacionados
                        producto={producto}
                        cliente={cliente}
                        isFavorite={isFavorite}
                        toggleFavorito={toggleFavorito}
                      />
                    </CarouselItem>
                  );
                })}
              </CarouselContent>

              <CarouselPrevious className="left-0 -translate-x-1/2 hidden sm:flex" />
              <CarouselNext className="right-0 translate-x-1/2 hidden sm:flex" />
            </div>
          </Carousel>
        )}
      </CardContent>
    </Card>
  );
};

export default ProductosRelacionados;
