"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { BadgeDollarSign, PackagePlus, ShoppingBasket } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
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
  const router = useRouter();
  const t = useTranslations("produccionGanaderoPage");

  const { data: producciones, isLoading, refetch } = useGetProduccionesUserId();

  const onRefresh = async () => {
    await refetch();
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div
      id="id-produccion-container"
      className="min-h-screen bg-background relative pb-24"
    >
      <div className="container mx-auto px-4 py-6">
        <div
          id="id-produccion-header"
          className="block md:flex justify-between items-center mb-6"
        >
          <h1 className="text-lg md:text-2xl font-bold">{t("title")}</h1>

          <DropdownMenu>
            <DropdownMenuTrigger
              id="id-produccion-control-productos"
              asChild
              className="mt-4 md:mt-0"
            >
              <Button variant="outline" className="gap-2">
                <BadgeDollarSign className="h-4 w-4" />
                {t("productControl")}
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent id="id-produccion-control-menu" align="end">
              <DropdownMenuItem
                id="id-produccion-productos"
                className="hover:cursor-pointer"
                onClick={() => router.push("/produccion/precios-productos")}
              >
                <ShoppingBasket className="h-4 w-4 mr-2" />
                {t("products")}
              </DropdownMenuItem>

              <DropdownMenuItem
                id="id-produccion-inventario"
                className="hover:cursor-pointer"
                onClick={() => router.push("/produccion/inventario-productos")}
              >
                <PackagePlus className="h-4 w-4 mr-2" />
                {t("inventory")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div id="id-produccion-list" className="space-y-4">
          {producciones?.map((item) => (
            <div id={`id-produccion-card-${item.id}`} key={item.id}>
              <ProduccionList produccion={item} />
            </div>
          ))}
        </div>

        {!producciones?.length && (
          <Card id="id-produccion-empty" className="mt-8">
            <CardContent className="pt-6 text-center">
              <MessageError
                titulo={t("empty.title")}
                descripcion={t("empty.description")}
                onPress={onRefresh}
              />
            </CardContent>
          </Card>
        )}
      </div>

      <FAB
        id="id-add-produccion"
        onPress={() => router.push("/produccion/crear-produccion")}
      />
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
