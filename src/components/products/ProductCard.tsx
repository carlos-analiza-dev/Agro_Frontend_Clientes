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
import { cn } from "@/lib/utils";
import { useState } from "react";

interface Props {
  producto: Producto;
  user: Cliente | undefined;
  onPress: () => void;
  className?: string;
}

const FavoriteButton = ({
  isFavorite,
  onClick,
}: {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
}) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    className={cn(
      "relative h-9 w-9 rounded-full transition-all duration-300 backdrop-blur-sm",
      "hover:scale-110 active:scale-95",
      isFavorite
        ? "bg-red-50/80 border border-red-200/50 text-red-500 shadow-[0_2px_12px_rgba(239,68,68,0.15)]"
        : "bg-white/80 border border-gray-200/50 text-gray-400 hover:bg-red-50/50 hover:text-red-500 hover:border-red-200/50",
    )}
    title={isFavorite ? "Remover de favoritos" : "Agregar a favoritos"}
  >
    <Heart
      className={cn(
        "h-4 w-4 transition-all duration-300",
        isFavorite && "fill-current",
      )}
    />
    {isFavorite && (
      <span className="absolute -top-1 -right-1 flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
      </span>
    )}
  </Button>
);

const ActionButton = ({
  children,
  onClick,
  disabled,
  variant = "primary",
}: {
  children: React.ReactNode;
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  variant?: "primary" | "outline";
}) => {
  const variants = {
    primary:
      "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-[0_4px_16px_rgba(34,197,94,0.25)] hover:shadow-[0_6px_20px_rgba(34,197,94,0.35)]",
    outline:
      "bg-white/80 hover:bg-green-50/80 border border-gray-200/50 hover:border-green-200/50 text-gray-600 hover:text-green-600",
  };

  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex-1 gap-2 rounded-full px-4 py-2.5 h-auto text-sm font-medium transition-all duration-300",
        "hover:scale-105 active:scale-95",
        variants[variant],
        disabled && "opacity-50 cursor-not-allowed hover:scale-100",
      )}
    >
      {children}
    </Button>
  );
};

const ProductCard = ({ producto, user, onPress, className = "" }: Props) => {
  const { esFavorito, toggleFavorito } = useFavoritos();
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const paisStorage = localStorage.getItem("selectedCountry");
  const pais = paisStorage ? JSON.parse(paisStorage) : null;
  const simbolo_storage = pais?.simbolo_moneda ?? "L";
  const simbolo = user ? user?.pais.simbolo_moneda : simbolo_storage;
  const isFavorite = esFavorito(producto.id);
  const precioPrincipal = producto.preciosPorPais?.[0]?.precio || "0.00";
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
      className={cn(
        "group overflow-hidden transition-all duration-400 cursor-pointer",
        "bg-white/80 backdrop-blur-sm border border-white/40",
        "shadow-[0_4px_24px_rgba(0,0,0,0.04)]",
        "hover:shadow-[0_12px_48px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:border-green-200/50",
        className,
      )}
      onClick={onPress}
    >
      <CardHeader className="p-0 relative overflow-hidden">
        <div className="aspect-square relative bg-gradient-to-br from-gray-50/50 to-green-50/30">
          {tieneImagenes ? (
            <>
              <Image
                src={producto.imagenes[0].url}
                unoptimized
                alt={producto.nombre}
                fill
                className={cn(
                  "object-cover transition-all duration-700",
                  "group-hover:scale-110",
                  isImageLoaded ? "opacity-100" : "opacity-0",
                )}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onLoad={() => setIsImageLoaded(true)}
              />

              {!isImageLoaded && (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-gray-200/50 to-gray-300/30" />
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-50/30 to-green-100/30">
              <ShoppingCart className="w-16 h-16 text-green-200/50" />
            </div>
          )}

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent" />
          </div>

          <div className="absolute top-3 left-3 right-3 flex flex-wrap gap-1.5">
            <Badge variant="default" className="text-xs bg-green-700">
              {producto.categoria?.nombre || "General"}
            </Badge>

            {!producto.disponible && (
              <Badge variant="destructive" className="text-xs">
                Agotado
              </Badge>
            )}
          </div>

          <div className="absolute top-3 right-3">
            <FavoriteButton isFavorite={isFavorite} onClick={handleFavorite} />
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {producto.marca && (
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-4 bg-gradient-to-r from-green-500 to-green-600 rounded-full" />
            <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
              {producto.marca.nombre}
            </span>
          </div>
        )}

        <h3
          className="font-bold text-base leading-tight line-clamp-2 transition-colors duration-300 min-h-[2.5rem] group-hover:text-green-600"
          title={producto.nombre}
        >
          {producto.nombre}
        </h3>

        <div className="flex items-end justify-between">
          <div className="space-y-1">
            <span className="text-2xl font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent">
              {simbolo} {parseFloat(precioPrincipal).toFixed(2)}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="p-4 pt-0">
        <div className="flex gap-2 w-full">
          <ActionButton
            onClick={handleViewDetails}
            disabled={!producto.disponible}
            variant="primary"
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
          </ActionButton>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
