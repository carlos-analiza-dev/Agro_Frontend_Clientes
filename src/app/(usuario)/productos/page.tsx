"use client";

import useGetProductosDisponibles from "@/hooks/productos/useGetProductosDisponibles";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import SkeletonCard from "@/components/generics/SkeletonCard";
import ProductCard from "@/components/products/ProductCard";
import useGetCategorias from "@/hooks/categorias/useGetCategorias";
import { EmptyProducts } from "@/components/products/EmptyProducts";

const ProductosPage = () => {
  const { cliente } = useAuthStore();
  const router = useRouter();
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [categoriaId, setCategoriaId] = useState("");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    data: productosData,
    isError,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetProductosDisponibles(10, categoriaId);

  const { data: categorias } = useGetCategorias();

  const todosLosProductos = useMemo(() => {
    return productosData?.pages.flatMap((page) => page.productos) || [];
  }, [productosData]);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleProductClick = (productoId: string) => {
    router.push(`/productos/${productoId}`);
  };

  useEffect(() => {
    if (!isMobile || !hasNextPage || isFetchingNextPage) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [isMobile, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleLoadMore = () => {
    fetchNextPage();
  };

  if (isLoading) {
    return <SkeletonCard />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6 md:mb-8 text-center">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">
              Productos Disponibles
            </h1>
            <p className="text-sm md:text-base text-muted-foreground">
              Descubre nuestra amplia gama de productos
            </p>
          </div>
          <div className="relative mb-6">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none md:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none md:hidden" />

            <div
              ref={scrollContainerRef}
              className="overflow-x-auto overflow-y-hidden pb-3 scrollbar-thin scroll-smooth"
              style={{ scrollbarWidth: "thin" }}
            >
              <div className="flex gap-2 px-1 min-w-max">
                <button
                  onClick={() => setCategoriaId("")}
                  className={`
                  relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${
                    categoriaId === ""
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }
                `}
                >
                  Todos
                  {categoriaId === "" && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  )}
                </button>

                {categorias?.map((categoria) => (
                  <button
                    key={categoria.id}
                    onClick={() => setCategoriaId(categoria.id)}
                    className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${
                      categoriaId === categoria.id
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }
                  `}
                  >
                    {categoria.nombre}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <EmptyProducts onRefresh={onRefresh} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Productos Disponibles
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Descubre nuestra amplia gama de productos
          </p>
        </div>

        <div className="relative mb-6">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none md:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none md:hidden" />

          <div
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden pb-3 scrollbar-thin scroll-smooth"
            style={{ scrollbarWidth: "thin" }}
          >
            <div className="flex gap-2 px-1 min-w-max">
              <button
                onClick={() => setCategoriaId("")}
                className={`
                  relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                  ${
                    categoriaId === ""
                      ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }
                `}
              >
                Todos
                {categoriaId === "" && (
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                )}
              </button>

              {categorias?.map((categoria) => (
                <button
                  key={categoria.id}
                  onClick={() => setCategoriaId(categoria.id)}
                  className={`
                    px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap
                    ${
                      categoriaId === categoria.id
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md shadow-blue-200 scale-105"
                        : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                    }
                  `}
                >
                  {categoria.nombre}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {todosLosProductos.map((producto, index) => (
            <ProductCard
              key={`${producto.id}-${index}`}
              producto={producto}
              user={cliente}
              onPress={() => handleProductClick(producto.id)}
            />
          ))}
        </div>

        {isMobile && hasNextPage && (
          <div
            ref={loadMoreRef}
            className="w-full h-10 flex justify-center items-center mt-4"
          >
            {isFetchingNextPage ? (
              <RefreshCw className="w-6 h-6 animate-spin" />
            ) : (
              <span className="text-sm text-muted-foreground">
                Cargando más productos...
              </span>
            )}
          </div>
        )}

        {isFetchingNextPage && !isMobile && (
          <div className="flex justify-center mt-8">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
        )}

        {!isMobile && hasNextPage && !isFetchingNextPage && (
          <div className="flex justify-center mt-8">
            <Button onClick={handleLoadMore} variant="outline">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cargar más productos
            </Button>
          </div>
        )}

        {!hasNextPage && todosLosProductos.length > 0 && (
          <div className="text-center mt-8 text-muted-foreground">
            Has visto todos los productos disponibles
          </div>
        )}

        {todosLosProductos.length === 0 && (
          <div className="text-center mt-16">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">
              No hay productos disponibles
            </h3>
            <p className="text-muted-foreground">
              Prueba a recargar la página o vuelve más tarde
            </p>
            <Button onClick={onRefresh} className="mt-4">
              <RefreshCw className="w-4 h-4 mr-2" />
              Recargar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductosPage;
