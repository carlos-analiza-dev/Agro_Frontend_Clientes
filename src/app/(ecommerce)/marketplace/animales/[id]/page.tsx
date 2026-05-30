"use client";
import AnimalLocationMap from "@/components/marketplace/AnimalLocationMap";
import ImageCarouselMarketAnimal from "@/components/marketplace/ImageCarouselMarketAnimal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  formatDateLocal,
  formatDateLocalAnyo,
} from "@/helpers/funciones/formatDateOnly";
import useGetAnimalMarketById from "@/hooks/market-animales/useGetAnimalMarketById";
import { Bookmark, MessageCircle, Pencil, Send, Tractor } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DetailsSkeleton from "./ui/DetailsSkeleton";
import useGetAnimalesMarketSugerencias from "@/hooks/market-animales/useGetAnimalesMarketSugerencias";
import CardMarketAnimal from "@/components/marketplace/CardMarketAnimal";
import SkeletonCard from "@/components/generics/SkeletonCard";
import EmptyStateMarketplace from "@/components/marketplace/EmptyStateMarketplace";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { ProductoAnimal } from "@/api/market-animales/interfaces/response-market-animales.interface";

const DetailsAnimalesPage = () => {
  const { cliente } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const marketAnimalId = params.id as string;
  const { data: animal, isLoading } = useGetAnimalMarketById(marketAnimalId);
  const tipoProducto = animal?.tipo_producto ? animal.tipo_producto.id : "";
  const { data: animales_market, isLoading: cargando } =
    useGetAnimalesMarketSugerencias({
      categoriaId: animal?.categoria.id,
      subcategoriaId: animal?.subcategoria.id,
      tipoProductoId: tipoProducto,
    });

  const handleClickEdit = (producto: ProductoAnimal) => {
    router.push(`/marketplace/mis-publicaciones/${producto.id}`);
  };

  const animales =
    animales_market?.pages.flatMap((page) => page.productos) ?? [];

  const filtersAnimales = animales.filter((item) => item.id !== marketAnimalId);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (animal?.vendedor?.nombre) {
      setMessage(`Hola, ${animal.vendedor.nombre}. ¿Sigue disponible?`);
    }
  }, [animal?.vendedor?.nombre]);

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (!animal) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Producto no encontrado</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 h-screen">
        <div>
          <ImageCarouselMarketAnimal images={animal?.imagenes ?? []} />
        </div>
        <div className="p-5">
          <h1 className="text-2xl font-black">{animal?.nombre}</h1>
          <p className="mt-3 text-lg font-bold">
            {animal?.moneda} {animal?.precio}
          </p>
          <p className="mt-3">
            Publicado {formatDateLocal(animal?.created_at ?? "")},{" "}
            {animal?.direccion}
          </p>
          {cliente?.id !== animal.vendedor.id ? (
            <div className="flex items-center gap-4 w-full mt-5">
              <Button
                className="bg-gray-200 text-black font-bold md:w-3/5 "
                variant={"outline"}
                title="Enviar Mensaje"
              >
                <MessageCircle /> Enviar Mensaje
              </Button>
              <Button
                className="bg-gray-200 text-black font-bold md:w-1/5 "
                variant={"outline"}
                title="Guardar"
              >
                <Bookmark />
              </Button>
              <Button
                className="bg-gray-200 text-black font-bold md:w-1/5 "
                variant={"outline"}
                title="Compartir"
              >
                <Send />
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4 w-full mt-5">
              <Button
                className="bg-gray-200 text-black font-bold md:w-3/5 "
                variant={"outline"}
                title="Editar publicacion"
                onClick={() => handleClickEdit(animal)}
              >
                <Pencil /> Editar
              </Button>

              <Button
                className="bg-gray-200 text-black font-bold md:w-1/5 "
                variant={"outline"}
                title="Compartir"
              >
                <Send />
              </Button>
            </div>
          )}
          <div className="mt-4">
            <p className="text-xl font-bold">Descripción del vendedor</p>
            <p className="mt-3">{animal?.descripcion}</p>
          </div>
          <div className="mt-5">
            <AnimalLocationMap direccion={animal?.direccion ?? ""} />
          </div>
          <div className="mt-5">
            <p className="text-xl font-bold">Información del vendedor</p>
            <div className="flex gap-3 items-center mt-4">
              <Avatar>
                <AvatarImage
                  src={
                    animal?.vendedor && animal?.vendedor.imagenes?.length > 0
                      ? animal.vendedor.imagenes[0].url
                      : "/images/ProfileImage.png"
                  }
                  alt={`image-${animal?.id}`}
                  className="grayscale"
                />
                <AvatarFallback>
                  {animal?.animal.identificador.slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-bold">{animal?.vendedor.nombre}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-3 items-center">
            <Tractor size={20} />
            <p>
              Se unió a AgroMarket en{" "}
              {formatDateLocalAnyo(animal?.vendedor.create ?? "")}
            </p>
          </div>
          <Separator className="mt-5" />
          {cliente?.id !== animal.vendedor.id ? (
            <div>
              <div className="mt-4 flex items-center gap-2">
                <MessageCircle size={20} className="text-green-500" />
                <p>Envía un mensaje al vendedor</p>
              </div>
              <div className="mt-2 flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                />
                <Button className="bg-green-500 hover:bg-green-600">
                  Enviar
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5">
              <Button className="w-full bg-green-500 hover:bg-green-700">
                Marcar como vendido
              </Button>
            </div>
          )}
        </div>
      </div>
      {cliente?.id !== animal.vendedor.id && filtersAnimales.length > 0 && (
        <div className="mt-5">
          <h1 className="text-2xl font-black">Sugerencias de hoy</h1>

          {cargando ? (
            <SkeletonCard />
          ) : filtersAnimales.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 mt-8 gap-5">
              {filtersAnimales.map((animalItem) => (
                <CardMarketAnimal key={animalItem.id} animal={animalItem} />
              ))}
            </div>
          ) : (
            <div className="container mx-auto p-4">
              <EmptyStateMarketplace
                variant="error"
                isLoading={false}
                description="No se encontraron productos sugeridos en este momento"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DetailsAnimalesPage;
