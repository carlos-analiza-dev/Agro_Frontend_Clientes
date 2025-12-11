import { Producto } from "@/api/productos/interfaces/response-productos-disponibles.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cliente } from "@/interfaces/auth/cliente";
import { Heart, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";

interface Props {
  producto: Producto;
  cliente: Cliente | undefined;
  isFavorite: boolean;
  toggleFavorito: (producto: Producto) => void;
}

const CardProductosRelacionados = ({
  producto,
  cliente,
  isFavorite,
  toggleFavorito,
}: Props) => {
  const router = useRouter();
  const getPrecio = (producto: Producto) => {
    if (!producto?.preciosPorPais || producto.preciosPorPais.length === 0) {
      return "0.00";
    }
    return producto.preciosPorPais[0]?.precio || "0.00";
  };

  const getImagenPrincipal = (imagenes: any[]) => {
    if (!imagenes || imagenes.length === 0) {
      return "/images/ProductNF.png";
    }
    return imagenes[0]?.url || "/images/ProductNF.png";
  };

  const handleToggleFavorite = (e: React.MouseEvent, producto: any) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorito(producto);
  };

  return (
    <Card
      onClick={() => router.push(`/productos/${producto.id}`)}
      className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-primary/20 h-full hover:cursor-pointer max-w-sm mx-auto"
    >
      <CardContent className="p-0 flex flex-col h-full">
        <div className="relative h-48 w-full overflow-hidden flex-shrink-0 bg-gray-100">
          <Image
            src={getImagenPrincipal(producto.imagenes)}
            alt={producto.nombre}
            unoptimized
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {producto.marca && (
              <Badge
                variant="secondary"
                className="text-xs bg-black/80 text-white"
              >
                {producto.marca.nombre}
              </Badge>
            )}
            <Badge
              variant={producto.disponible ? "default" : "destructive"}
              className="text-xs"
            >
              {producto.disponible ? "Disponible" : "Agotado"}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className={`absolute top-2 right-2 h-8 w-8 rounded-full transition-all duration-300 ${
              isFavorite
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "bg-white/90 hover:bg-white"
            }`}
            onClick={(e) => handleToggleFavorite(e, producto)}
            title={isFavorite ? "Remover de favoritos" : "Agregar a favoritos"}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <Link
            href={`/productos/${producto.id}`}
            className="font-semibold text-sm mb-2 line-clamp-2 flex-grow hover:text-blue-600 group-hover:underline group-hover:text-blue-600"
          >
            {producto.nombre}
          </Link>

          <div className="flex items-center justify-between mb-3">
            <span className="text-lg font-bold text-green-600">
              {cliente?.pais?.simbolo_moneda || "$"}
              {getPrecio(producto)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardProductosRelacionados;
