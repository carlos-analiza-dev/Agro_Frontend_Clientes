"use client";
import AnimalLocationMap from "@/components/marketplace/AnimalLocationMap";
import ImageCarouselMarketAnimal from "@/components/marketplace/ImageCarouselMarketAnimal";
import { ShareButtons } from "@/components/marketplace/ShareButtons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  formatDateLocal,
  formatDateLocalAnyo,
} from "@/helpers/funciones/formatDateOnly";
import useGetAnimalMarketById from "@/hooks/market-animales/useGetAnimalMarketById";
import { MessageCircle, Pencil, Tractor } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import DetailsSkeleton from "./ui/DetailsSkeleton";
import useGetAnimalesMarketSugerencias from "@/hooks/market-animales/useGetAnimalesMarketSugerencias";
import CardMarketAnimal from "@/components/marketplace/CardMarketAnimal";
import SkeletonCard from "@/components/generics/SkeletonCard";
import EmptyStateMarketplace from "@/components/marketplace/EmptyStateMarketplace";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { ProductoAnimal } from "@/api/market-animales/interfaces/response-market-animales.interface";
import { GuardarButton } from "@/components/marketplace/GuardarButton";
import PublicacionNoEncontrada from "@/components/marketplace/PublicacionNoEncontrada";
import { ChatModal } from "@/components/chat/ChatModal";

const DetailsAnimalesPage = () => {
  const { cliente } = useAuthStore();
  const params = useParams();
  const router = useRouter();
  const marketAnimalId = params.id as string;
  const { data: animal, isLoading } = useGetAnimalMarketById(marketAnimalId);
  const tipoProducto = animal?.tipo_producto ? animal.tipo_producto.id : "";
  const [isChatOpen, setIsChatOpen] = useState(false);
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
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

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
      <PublicacionNoEncontrada mensaje="La publicación que buscas no existe, fue eliminada o no está disponible" />
    );
  }

  const isVendido = animal.vendido === true;
  const esMiPublicacion = cliente?.id === animal.vendedor.id;

  return (
    <div className="container mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <ImageCarouselMarketAnimal images={animal?.imagenes ?? []} />
        </div>
        <div className="md:p-5">
          <h1 className="text-2xl font-black">{animal?.nombre}</h1>
          <p className="mt-3 text-lg font-bold">
            {animal?.moneda} {animal?.precio}
          </p>
          <p className="mt-3 text-sm text-gray-500">
            Publicado {formatDateLocal(animal?.created_at ?? "")},{" "}
            {animal?.direccion}
          </p>

          {isVendido ? (
            <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-600 font-medium">
                Este producto ya fue vendido
              </p>
              <p className="text-sm text-gray-500 mt-1">
                No está disponible para compra ni para compartir
              </p>
            </div>
          ) : (
            <>
              {!esMiPublicacion ? (
                <div className="flex flex-wrap items-center gap-3 w-full mt-5">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                    title="Enviar Mensaje"
                    onClick={() => setIsChatOpen(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Enviar Mensaje
                  </Button>
                  <GuardarButton
                    producto={animal}
                    variant="icon"
                    className="bg-gray-100 hover:bg-gray-200"
                    showToast={true}
                  />
                  <ShareButtons
                    title={animal.nombre}
                    description={`${animal.descripcion.slice(0, 100)}... Precio: ${animal.moneda} ${animal.precio}`}
                    url={currentUrl}
                    imageUrl={animal.imagenes?.[0]?.url}
                    variant="dropdown"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                  />
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 w-full mt-5">
                  <Button
                    className="bg-gray-200 hover:bg-gray-100 text-black flex-1 sm:flex-none"
                    variant="outline"
                    title="Editar publicacion"
                    onClick={() => handleClickEdit(animal)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <ShareButtons
                    title={animal.nombre}
                    description={`${animal.descripcion.slice(0, 100)}... Precio: ${animal.moneda} ${animal.precio}`}
                    url={currentUrl}
                    imageUrl={animal.imagenes?.[0]?.url}
                    variant="dropdown"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                  />
                </div>
              )}
            </>
          )}

          <div className="mt-6">
            <p className="text-xl font-bold">Descripción del vendedor</p>
            <p className="mt-3 text-gray-700 leading-relaxed">
              {animal?.descripcion}
            </p>
          </div>

          <div className="mt-6">
            <p className="text-xl font-bold mb-3">Ubicación</p>
            <AnimalLocationMap direccion={animal?.direccion ?? ""} />
          </div>

          <div className="mt-6">
            <p className="text-xl font-bold">Información del vendedor</p>
            <div className="flex gap-3 items-center mt-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={
                    animal?.vendedor && animal?.vendedor.imagenes?.length > 0
                      ? animal.vendedor.imagenes[0].url
                      : "/images/ProfileImage.png"
                  }
                  alt={`image-${animal?.id}`}
                />
                <AvatarFallback>
                  {animal?.vendedor.nombre?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-bold">{animal?.vendedor.nombre}</p>
                <p className="text-sm text-gray-500">
                  Vendedor verificad
                  {animal?.vendedor.nombre?.endsWith("a") ? "a" : "o"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3 items-center text-gray-600">
            <Tractor size={20} />
            <p className="text-sm">
              Se unió a AgroMarket en{" "}
              {formatDateLocalAnyo(animal?.vendedor.create ?? "")}
            </p>
          </div>

          <Separator className="mt-6" />

          {!isVendido && (
            <>
              {!esMiPublicacion ? (
                <div className="mt-6">
                  <div className="mt-4 flex items-center gap-2">
                    <MessageCircle size={20} className="text-green-500" />
                    <p className="font-medium">¿Necesitas información?</p>
                  </div>
                  <div className="mt-3">
                    <Button
                      onClick={() => setIsChatOpen(true)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat con el vendedor
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 mb-5">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Marcar como vendido
                  </Button>
                </div>
              )}
            </>
          )}

          {isVendido && esMiPublicacion && (
            <div className="mt-6 mb-5 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-700 font-medium">
                ✓ Producto marcado como vendido
              </p>
              <p className="text-sm text-gray-500 mt-1">
                Los compradores ya no pueden interactuar con esta publicación
              </p>
            </div>
          )}
        </div>
      </div>

      {!isVendido && !esMiPublicacion && filtersAnimales.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-black mb-6">Sugerencias de hoy</h2>
          {cargando ? (
            <SkeletonCard />
          ) : filtersAnimales.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtersAnimales.slice(0, 4).map((animalItem) => (
                <CardMarketAnimal key={animalItem.id} animal={animalItem} />
              ))}
            </div>
          ) : (
            <EmptyStateMarketplace
              variant="error"
              isLoading={false}
              description="No se encontraron productos sugeridos en este momento"
            />
          )}
        </div>
      )}

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        product={animal}
        seller={animal.vendedor}
        buyerId={cliente?.id || ""}
      />
    </div>
  );
};

export default DetailsAnimalesPage;
