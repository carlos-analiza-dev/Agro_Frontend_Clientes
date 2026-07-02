"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Grid3x3, RefreshCw, ShoppingCart, Sparkles } from "lucide-react";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { MessageError } from "@/components/generics/MessageError";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import SkeletonCard from "@/components/generics/SkeletonCard";
import ProductCard from "@/components/products/ProductCard";
import useGetProductosPublicosDisponibles from "@/hooks/productos/useGetProductosPublicosDisponibles";
import useGetCategorias from "@/hooks/categorias/useGetCategorias";
import { EmptyProducts } from "@/components/products/EmptyProducts";
import LoaderProducts from "@/components/products/LoaderProducts";
import CategoryButton from "@/components/products/CategoryButton";
import SkeletonProducts from "@/components/products/SkeletonProducts";

const ProductosClient = () => {
  const { cliente } = useAuthStore();
  const paisStorage = localStorage.getItem("selectedCountry");
  const pais = paisStorage ? JSON.parse(paisStorage) : null;

  const paisId = pais?.id;

  const router = useRouter();
  const [categoriaId, setCategoriaId] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!paisId) {
      router.push("/not-selected-country");
    }
  }, [paisId, router]);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    data: productosData,
    isError,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetProductosPublicosDisponibles(10, categoriaId, paisId);

  const { data: categorias, isLoading: isLoadingCategorias } = useGetCategorias(
    { is_market: false },
  );

  const todosLosProductos = useMemo(() => {
    return productosData?.pages.flatMap((page) => page.productos) || [];
  }, [productosData]);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const handleProductClick = (productoId: string) => {
    router.push(`/productos-agroservicios/${productoId}`);
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
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-green-50/30 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/50 backdrop-blur-sm border border-white/40 mb-4">
              <Sparkles className="h-4 w-4 text-green-500" />
              <span className="text-xs font-medium text-gray-500">
                Cargando productos...
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-700 bg-clip-text text-transparent">
              Productos Disponibles
            </h1>
            <p className="text-sm md:text-base text-gray-400 mt-2">
              Descubre nuestra amplia gama de productos
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <SkeletonProducts key={i} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50/50 via-white to-green-50/30 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-700 bg-clip-text text-transparent">
              Productos Disponibles
            </h1>
            <p className="text-sm md:text-base text-gray-400 mt-2">
              Descubre nuestra amplia gama de productos
            </p>
          </div>

          <div className="relative mb-6">
            <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50/50 to-transparent z-10 pointer-events-none md:hidden" />
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50/50 to-transparent z-10 pointer-events-none md:hidden" />

            <div
              ref={scrollContainerRef}
              className="overflow-x-auto overflow-y-hidden pb-3 scrollbar-thin scroll-smooth"
              style={{ scrollbarWidth: "thin" }}
            >
              <div className="flex gap-2 px-1 min-w-max">
                <CategoryButton
                  isActive={categoriaId === ""}
                  onClick={() => setCategoriaId("")}
                >
                  Todos
                </CategoryButton>
                {categorias?.map((categoria) => (
                  <CategoryButton
                    key={categoria.id}
                    isActive={categoriaId === categoria.id}
                    onClick={() => setCategoriaId(categoria.id)}
                  >
                    {categoria.nombre}
                  </CategoryButton>
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
              {todosLosProductos.length} productos disponibles
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-700 via-green-600 to-green-700 bg-clip-text text-transparent">
            Productos Disponibles
          </h1>
          <p className="text-sm md:text-base text-gray-400 mt-2">
            Descubre nuestra amplia gama de productos
          </p>
        </div>

        <div className="relative mb-6">
          <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50/50 to-transparent z-10 pointer-events-none md:hidden" />
          <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50/50 to-transparent z-10 pointer-events-none md:hidden" />

          <div
            ref={scrollContainerRef}
            className="overflow-x-auto overflow-y-hidden pb-3 scrollbar-thin scroll-smooth"
            style={{ scrollbarWidth: "thin" }}
          >
            <div className="flex gap-2 px-1 min-w-max">
              <CategoryButton
                isActive={categoriaId === ""}
                onClick={() => setCategoriaId("")}
              >
                Todos
              </CategoryButton>
              {categorias?.map((categoria) => (
                <CategoryButton
                  key={categoria.id}
                  isActive={categoriaId === categoria.id}
                  onClick={() => setCategoriaId(categoria.id)}
                >
                  {categoria.nombre}
                </CategoryButton>
              ))}
            </div>
          </div>
        </div>

        {todosLosProductos.length > 0 ? (
          <>
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
                className="w-full h-12 flex justify-center items-center mt-6"
              >
                {isFetchingNextPage ? (
                  <LoaderProducts text="Cargando más productos..." />
                ) : (
                  <span className="text-sm text-gray-400">
                    Desplázate para cargar más
                  </span>
                )}
              </div>
            )}

            {isFetchingNextPage && !isMobile && (
              <div className="flex justify-center mt-8">
                <LoaderProducts text="Cargando..." />
              </div>
            )}

            {!isMobile && hasNextPage && !isFetchingNextPage && (
              <div className="flex justify-center mt-8">
                <Button
                  onClick={handleLoadMore}
                  className="rounded-full px-6 py-2.5 bg-white/80 backdrop-blur-sm hover:bg-green-50/80 border border-gray-200/50 hover:border-green-200/50 text-gray-600 hover:text-green-600 transition-all duration-300 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.1)]"
                  variant="ghost"
                >
                  <Grid3x3 className="w-4 h-4 mr-2" />
                  Cargar más productos
                </Button>
              </div>
            )}

            {!hasNextPage && todosLosProductos.length > 0 && (
              <div className="text-center mt-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 backdrop-blur-sm border border-gray-200/50">
                  <span className="text-sm text-gray-400">
                    🎉 Has visto todos los productos disponibles
                  </span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="text-center mt-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/80 backdrop-blur-sm border border-gray-200/50 mb-4">
              <ShoppingCart className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay productos disponibles
            </h3>
            <p className="text-gray-400 mb-4">
              Prueba a recargar la página o vuelve más tarde
            </p>
            <Button
              onClick={onRefresh}
              className="rounded-full px-6 py-2.5 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-[0_4px_16px_rgba(34,197,94,0.3)] transition-all duration-300"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Recargar
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductosClient;
