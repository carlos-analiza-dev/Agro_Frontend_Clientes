"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Plus, Eye, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { Producto } from "@/api/productos/interfaces/response-productos-disponibles.interface";
import { Cliente } from "@/interfaces/auth/cliente";
import { useFavoritos } from "@/hooks/favoritos/useFavoritos";

interface Props {
  producto: Producto;
  user: Cliente | undefined;
  onPress: () => void;
  className?: string;
}

const ProductCard = ({ producto, user, onPress, className = "" }: Props) => {
  const { esFavorito, toggleFavorito } = useFavoritos();

  const isFavorite = esFavorito(producto.id);
  const precioPrincipal = producto.preciosPorPais?.[0]?.precio || "0.00";
  const simboloMoneda = user?.pais.simbolo_moneda || "L.";
  const tieneImagenes = producto.imagenes && producto.imagenes.length > 0;

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorito(producto);
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPress();
  };

  return (
    <Card
      className={`group cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 border-2 hover:border-primary/20 ${className}`}
      onClick={onPress}
    >
      <CardHeader className="p-0 relative overflow-hidden">
        <div className="aspect-square relative bg-gradient-to-br from-muted/50 to-muted">
          {tieneImagenes ? (
            <Image
              src={producto.imagenes[0].url}
              unoptimized
              alt={producto.nombre}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/5 to-primary/10">
              <ShoppingCart className="w-12 h-12 text-primary/30" />
            </div>
          )}

          <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1">
            <Badge
              variant="secondary"
              className="bg-background/90 backdrop-blur-sm text-xs font-medium"
            >
              {producto.categoria?.nombre || "General"}
            </Badge>

            {!producto.disponible && (
              <Badge variant="destructive" className="text-xs">
                Agotado
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        <h3
          className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors min-h-[3rem]"
          title={producto.nombre}
        >
          {producto.nombre}
        </h3>

        {producto.marca && (
          <p className="text-xs text-muted-foreground font-medium">
            {producto.marca.nombre}
          </p>
        )}

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-2xl font-bold text-primary block">
              {simboloMoneda} {parseFloat(precioPrincipal).toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="icon"
            onClick={handleFavorite}
            className={`flex-1 max-w-[40px] transition-all duration-300 ${
              isFavorite
                ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                : "hover:bg-red-50 hover:text-red-600"
            }`}
            title={isFavorite ? "Remover de favoritos" : "Agregar a favoritos"}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </Button>

          <Button
            onClick={handleViewDetails}
            className="flex-1 gap-2 transition-all duration-300"
            disabled={!producto.disponible}
            size="lg"
          >
            {producto.disponible ? (
              <>
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Ver Detalles</span>
                <Plus className="h-4 w-4 sm:hidden" />
              </>
            ) : (
              "No Disponible"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
