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
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 relative pb-24">
      <h1 className="text-3xl font-bold text-center mb-8 text-foreground">
        Historial de Citas
      </h1>

      <ScrollArea className="h-[calc(100vh-200px)]">
        <div className="space-y-4">
          {allCitas.map((item) => (
            <CardCitas key={item.id} item={item} />
          ))}
        </div>

        {allCitas.length === 0 && !isLoading && (
          <div className="flex justify-center items-center py-12">
            <Alert className="max-w-md text-center">
              <AlertTitle>No se encontraron citas</AlertTitle>
              <AlertDescription>
                No se encontraron citas para este módulo en este momento.
              </AlertDescription>
              <Button onClick={onRefresh} className="mt-4">
                Reintentar
              </Button>
            </Alert>
          </div>
        )}

        {isFetchingNextPage && (
          <div className="flex justify-center py-4">
            <Skeleton className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        )}
      </ScrollArea>

      <FAB onPress={() => router.push("/citas/crear-cita")} />
    </div>
  );
};

export default CitasPage;
