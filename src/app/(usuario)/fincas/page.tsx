"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Skeleton } from "@/components/ui/skeleton";
import { Buscador } from "@/components/generics/Buscador";
import { MessageError } from "@/components/generics/MessageError";
import { FAB } from "@/components/generics/FAB";
import { CardFincas } from "./ui/CardFincas";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getPropietarioId } from "@/helpers/funciones/getPropietarioId";
import { TipoCliente } from "@/interfaces/enums/clientes.enums";

export default function FincasPageGanaderos() {
  const router = useRouter();
  const { cliente } = useAuthStore();
  const clienteId = cliente ? getPropietarioId(cliente) : null;
  const isPropietario = cliente?.rol === TipoCliente.PROPIETARIO;
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const {
    data: fincas,
    isError,
    isLoading,
    refetch,
  } = useFincasPropietarios(clienteId ?? "", debouncedSearchTerm);

  const onRefresh = useCallback(async () => {
    await refetch();
  }, [refetch]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="space-y-4 w-full max-w-2xl">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-8 w-1/3" />
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (!fincas || fincas.data.fincas.length === 0 || isError) {
    return (
      <div className="min-h-screen p-4 bg-background">
        <div className="p-4 pb-2">
          <Buscador
            title="Buscar finca por nombre..."
            setSearchTerm={setSearchTerm}
            searchTerm={searchTerm}
          />
        </div>
        <MessageError
          titulo="Sin fincas"
          descripcion="No se encontraron fincas disponibles en este momento"
          onPress={onRefresh}
        />
        {isPropietario && (
          <FAB
            titulo="Crear Finca"
            onPress={() => router.push("/fincas/crear-fincas")}
          />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-4 pb-2">
        <Buscador
          title="Buscar finca por nombre..."
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />
      </div>

      <ScrollArea className="h-[calc(100vh-140px)] p-4 pt-0">
        <h2 className="text-xl font-bold mb-4 mt-2">Mis Fincas</h2>

        {fincas.data.fincas.map((finca) => (
          <CardFincas
            key={finca.id}
            finca={finca}
            onPress={() => router.push(`/fincas/${finca.id}`)}
          />
        ))}
      </ScrollArea>

      {isPropietario && (
        <FAB
          titulo="Crear Finca"
          onPress={() => router.push("/fincas/crear-fincas")}
        />
      )}
    </div>
  );
}
