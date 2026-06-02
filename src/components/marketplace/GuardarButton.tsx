"use client";

import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { ProductoAnimal } from "@/api/market-animales/interfaces/response-market-animales.interface";

import { useState } from "react";
import { useMarketplaceGuardados } from "@/hooks/market-animales/useMarketplaceGuardados";

interface GuardarButtonProps {
  producto: ProductoAnimal;
  variant?: "icon" | "button" | "full";
  className?: string;
  showToast?: boolean;
}

export const GuardarButton = ({
  producto,
  variant = "icon",
  className = "",
  showToast = true,
}: GuardarButtonProps) => {
  const { esGuardado, toggleGuardado } = useMarketplaceGuardados();
  const [isLoading, setIsLoading] = useState(false);
  const esGuardadoProducto = esGuardado(producto.id);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      toggleGuardado(producto, showToast);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };

  if (variant === "full") {
    return (
      <Button
        onClick={handleClick}
        disabled={isLoading}
        className={`${className} ${
          esGuardadoProducto
            ? "bg-blue-500 hover:bg-blue-600 text-white"
            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
        }`}
      >
        <Bookmark
          className={`w-4 h-4 mr-2 ${esGuardadoProducto ? "fill-current" : ""}`}
        />
        {esGuardadoProducto ? "Guardado" : "Guardar publicación"}
      </Button>
    );
  }

  if (variant === "button") {
    return (
      <Button
        onClick={handleClick}
        variant="outline"
        disabled={isLoading}
        className={className}
      >
        <Bookmark
          className={`w-4 h-4 mr-2 ${esGuardadoProducto ? "fill-blue-500 text-blue-500" : ""}`}
        />
        {esGuardadoProducto ? "Guardado" : "Guardar"}
      </Button>
    );
  }

  return (
    <Button
      onClick={handleClick}
      variant="outline"
      size="icon"
      disabled={isLoading}
      className={`${className} ${esGuardadoProducto ? "bg-blue-50" : ""}`}
      title={
        esGuardadoProducto ? "Eliminar de guardados" : "Guardar publicación"
      }
    >
      <Bookmark
        className={`w-4 h-4 transition-all ${
          esGuardadoProducto ? "fill-blue-500 text-blue-500" : "text-gray-500"
        }`}
      />
    </Button>
  );
};
