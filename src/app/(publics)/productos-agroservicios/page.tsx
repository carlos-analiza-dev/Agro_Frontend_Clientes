"use client";

import useGetProductosDisponibles from "@/hooks/productos/useGetProductosDisponibles";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, ShoppingCart } from "lucide-react";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { MessageError } from "@/components/generics/MessageError";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import SkeletonCard from "@/components/generics/SkeletonCard";
import ProductCard from "@/components/products/ProductCard";
import useGetProductosPublicosDisponibles from "@/hooks/productos/useGetProductosPublicosDisponibles";

const ProductosPage = () => {
  const { cliente } = useAuthStore();
  const paisStorage = localStorage.getItem("selectedCountry");
  const pais = paisStorage ? JSON.parse(paisStorage) : null;
  const paisId = pais?.id;

  const router = useRouter();
  const [tipoCategoria, setTipoCategoria] = useState("");
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    data: productosData,
    isError,
    isLoading,
    refetch,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useGetProductosPublicosDisponibles(10, tipoCategoria, paisId);

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
    return <SkeletonCard />;
  }

  if (isError) {
    return (
      <div className="min-h-screen max-w-7xl mx-auto bg-background p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5">
          <Button
            variant="outline"
            className={tipoCategoria === "" ? "border-blue-500" : ""}
            onClick={() => setTipoCategoria("")}
          >
            Todos
          </Button>

          <Button
            variant="outline"
            className={tipoCategoria === "Ganaderia" ? "border-blue-500" : ""}
            onClick={() => setTipoCategoria("Ganaderia")}
          >
            Ganadería
          </Button>

          <Button
            variant="outline"
            className={tipoCategoria === "Agricultura" ? "border-blue-500" : ""}
            onClick={() => setTipoCategoria("Agricultura")}
          >
            Agricultura
          </Button>
        </div>
        <MessageError
          titulo="Error al cargar los productos"
          descripcion="No se encontraron productos disponibles en este momento."
          onPress={onRefresh}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">Productos Disponibles</h1>
          <p className="text-muted-foreground">
            Descubre nuestra amplia gama de productos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-5">
          <Button
            variant="outline"
            className={tipoCategoria === "" ? "border-blue-500" : ""}
            onClick={() => setTipoCategoria("")}
          >
            Todos
          </Button>

          <Button
            variant="outline"
            className={tipoCategoria === "Ganaderia" ? "border-blue-500" : ""}
            onClick={() => setTipoCategoria("Ganaderia")}
          >
            Ganadería
          </Button>

          <Button
            variant="outline"
            className={tipoCategoria === "Agricultura" ? "border-blue-500" : ""}
            onClick={() => setTipoCategoria("Agricultura")}
          >
            Agricultura
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
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
