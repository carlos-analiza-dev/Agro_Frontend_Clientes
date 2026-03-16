"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BadgeDollarSign, PackagePlus, ShoppingBasket } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { useAuthStore } from "@/providers/store/useAuthStore";
import useGetProduccionesUserId from "@/hooks/producciones/useGetProduccionesUserId";
import { MessageError } from "@/components/generics/MessageError";
import ProduccionList from "./ui/ProduccionList";
import { FAB } from "@/components/generics/FAB";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ProduccionGanaderoPage = () => {
  const { cliente } = useAuthStore();
  const userId = cliente?.id || "";
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const {
    data: producciones,

    isLoading,
    refetch,
  } = useGetProduccionesUserId(userId);

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await refetch();
    } finally {
      setRefreshing(false);
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="min-h-screen bg-background relative pb-24">
      <div className="container mx-auto px-4 py-6">
        <div className="block md:flex justify-between items-center mb-6">
          <h1 className="text-lg md:text-2xl font-bold">Mis Producciones</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="mt-4 md:mt-0">
              <Button variant="outline" className="gap-2">
                <BadgeDollarSign className="h-4 w-4" />
                Control de Productos
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => router.push("/produccion/precios-productos")}
              >
                <ShoppingBasket className="h-4 w-4 mr-2" />
                Productos
              </DropdownMenuItem>
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => router.push("/produccion/inventario-productos")}
              >
                <PackagePlus className="h-4 w-4 mr-2" />
                Inventario
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="space-y-4">
          {producciones?.map((item) => (
            <ProduccionList key={item.id} produccion={item} />
          ))}
        </div>

        {!producciones?.length && (
          <Card className="mt-8">
            <CardContent className="pt-6 text-center">
              <MessageError
                titulo="No hay producciones registradas"
                descripcion="No se encontraron producciones registradas. Puedes crear una nueva producción haciendo clic en el botón +"
                onPress={onRefresh}
              />
            </CardContent>
          </Card>
        )}
      </div>

      <FAB onPress={() => router.push("/produccion/crear-produccion")} />
    </div>
  );
};

const LoadingState = () => {
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="w-full">
            <CardContent className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProduccionGanaderoPage;
