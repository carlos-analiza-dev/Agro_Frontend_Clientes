"use client";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import useGetCitasByUser from "@/hooks/citas/useGetCitasByUser";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import CardCitas from "./ui/CardCitas";
import { FAB } from "@/components/generics/FAB";

const CitasPage = () => {
  const router = useRouter();
  const limit = 10;

  const {
    data: citas,
    isLoading,
    refetch,
    isRefetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useGetCitasByUser(limit);

  const [allCitas, setAllCitas] = useState<any[]>([]);

  useEffect(() => {
    if (citas?.pages) {
      const flattenedCitas = citas.pages.flatMap((page) => page.citas) || [];
      setAllCitas(flattenedCitas);
    }
  }, [citas]);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-4">
        <Skeleton className="h-8 w-64 mx-auto mb-8" />
        <div id="id-citas-loading-list" className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      id="id-citas-container"
      className="min-h-screen bg-background p-4 relative pb-24"
    >
      <div
        id="id-citas-header"
        className="flex justify-between items-center mb-6"
      >
        <h1 id="id-citas-title" className="text-lg md:text-3xl font-bold">
          Historial de Citas
        </h1>
        <Button
          id="id-citas-refresh"
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefetching}
        >
          {isRefetching ? "Actualizando..." : "Actualizar"}
        </Button>
      </div>

      <ScrollArea id="id-citas-scroll-area" className="h-[calc(100vh-200px)]">
        <div id="id-citas-list" className="space-y-4">
          {allCitas.map((item) => (
            <div id={`id-citas-card-wrapper`} key={item.id}>
              <CardCitas item={item} />
            </div>
          ))}
        </div>

        {allCitas.length === 0 && !isLoading && (
          <div
            id="id-citas-empty-container"
            className="flex justify-center items-center py-12"
          >
            <Alert id="id-citas-empty-alert" className="max-w-md text-center">
              <AlertTitle id="id-citas-empty-title">
                No se encontraron citas
              </AlertTitle>
              <AlertDescription id="id-citas-empty-description">
                No se encontraron citas para este módulo en este momento.
              </AlertDescription>
              <Button
                id="id-citas-empty-retry"
                onClick={onRefresh}
                className="mt-4"
              >
                Reintentar
              </Button>
            </Alert>
          </div>
        )}

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Skeleton
              id="id-citas-loading-spinner"
              className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"
            />
          </div>
        )}

        {hasNextPage && !isFetchingNextPage && allCitas.length > 0 && (
          <div
            id="id-citas-load-more-container"
            className="flex justify-center py-4"
          >
            <Button
              id="id-citas-load-more"
              variant="outline"
              onClick={loadMore}
              className="w-full max-w-xs"
            >
              Cargar más citas
            </Button>
          </div>
        )}
      </ScrollArea>

      <FAB id="id-citas-fab" onPress={() => router.push("/citas/crear-cita")} />
    </div>
  );
};

export default CitasPage;
