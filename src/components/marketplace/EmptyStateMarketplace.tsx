"use client";

import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  FilterX,
  RefreshCw,
  MapPin,
  AlertCircle,
  PackageSearch,
  Store,
  Locate,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface EmptyStateMarketplaceProps {
  variant?:
    | "no-products"
    | "no-filters"
    | "error"
    | "no-location"
    | "no-nearby";
  hasFilters?: boolean;
  onClearFilters?: () => void;
  onRefresh?: () => void;
  onRetryLocation?: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  actionText?: string;
  location?: {
    pais?: string;
    ciudad?: string;
    radio?: number;
  };
}

const EmptyStateMarketplace = ({
  variant = "no-products",
  hasFilters = false,
  onClearFilters,
  onRefresh,
  onRetryLocation,
  isLoading = false,
  title,
  description,
  location,
}: EmptyStateMarketplaceProps) => {
  const router = useRouter();

  const getVariantConfig = () => {
    switch (variant) {
      case "error":
        return {
          icon: AlertCircle,
          iconColor: "text-destructive",
          bgColor: "bg-destructive/10",
          defaultTitle: "Error al cargar productos",
          defaultDescription:
            "No se pudieron cargar los productos. Por favor, intenta nuevamente.",
          showRefreshButton: true,
          showClearButton: false,
          showBrowseButton: false,
        };
      case "no-location":
        return {
          icon: MapPin,
          iconColor: "text-muted-foreground",
          bgColor: "bg-muted",
          defaultTitle: "Ubicación no disponible",
          defaultDescription:
            "Necesitamos tu ubicación para mostrarte productos cercanos.",
          showRefreshButton: false,
          showClearButton: false,
          showBrowseButton: false,
          showRetryButton: true,
        };
      case "no-nearby":
        return {
          icon: MapPin,
          iconColor: "text-muted-foreground",
          bgColor: "bg-muted",
          defaultTitle: "No hay productos cercanos",
          defaultDescription: location?.radio
            ? `No encontramos productos en un radio de ${location.radio} km de tu ubicación.`
            : "No encontramos productos cerca de tu ubicación.",
          showRefreshButton: true,
          showClearButton: false,
          showBrowseButton: true,
          showRetryButton: false,
        };
      case "no-filters":
        return {
          icon: PackageSearch,
          iconColor: "text-muted-foreground",
          bgColor: "bg-muted",
          defaultTitle: "No se encontraron productos",
          defaultDescription:
            "No hay productos que coincidan con los filtros seleccionados.",
          showRefreshButton: true,
          showClearButton: true,
          showBrowseButton: false,
          showRetryButton: false,
        };
      default:
        return {
          icon: ShoppingBag,
          iconColor: "text-muted-foreground",
          bgColor: "bg-muted",
          defaultTitle: "No hay productos disponibles",
          defaultDescription:
            "Actualmente no hay productos publicados en el marketplace.",
          showRefreshButton: true,
          showClearButton: false,
          showBrowseButton: false,
          showRetryButton: false,
        };
    }
  };

  const config = getVariantConfig();
  const Icon = config.icon;

  const handleBrowseProducts = () => {
    router.push("/marketplace");
  };

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center min-h-[400px]">
      <div className="relative">
        <div className={`rounded-full p-4 mb-4 ${config.bgColor}`}>
          <Icon className={`h-12 w-12 ${config.iconColor}`} />
        </div>

        {hasFilters && variant === "no-filters" && (
          <div className="absolute -top-2 -right-2 bg-destructive rounded-full p-1.5">
            <FilterX className="h-4 w-4 text-destructive-foreground" />
          </div>
        )}

        {variant === "no-nearby" && (
          <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1.5 animate-pulse">
            <MapPin className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </div>

      <h3
        className={`text-xl font-semibold mb-2 ${variant === "error" ? "text-destructive" : ""}`}
      >
        {title || config.defaultTitle}
      </h3>

      <p className="text-muted-foreground text-sm max-w-md mb-6">
        {description || config.defaultDescription}
      </p>

      {location && variant === "no-nearby" && (
        <div className="bg-muted/50 rounded-lg p-3 mb-6 max-w-md">
          <div className="flex items-center justify-center gap-2 text-sm">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground">
              Tu ubicación: {location.ciudad}, {location.pais}
            </span>
          </div>
          {location.radio && (
            <p className="text-xs text-muted-foreground mt-1">
              Radio de búsqueda: {location.radio} km
            </p>
          )}
        </div>
      )}

      <div className="flex gap-3 flex-wrap justify-center">
        {config.showClearButton && onClearFilters && (
          <Button
            variant="outline"
            onClick={onClearFilters}
            disabled={isLoading}
            className="gap-2"
          >
            <FilterX className="h-4 w-4" />
            Limpiar filtros
          </Button>
        )}

        {config.showRefreshButton && onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Recargar productos
          </Button>
        )}

        {config.showBrowseButton && (
          <Button
            onClick={handleBrowseProducts}
            variant="default"
            className="gap-2"
          >
            <Store className="h-4 w-4" />
            Ver todos los productos
          </Button>
        )}

        {config.showRetryButton && onRetryLocation && (
          <Button
            onClick={onRetryLocation}
            disabled={isLoading}
            className="gap-2"
          >
            <Locate className="h-4 w-4" />
            Reintentar ubicación
          </Button>
        )}
      </div>

      {variant === "no-nearby" && (
        <div className="mt-6 pt-4 border-t max-w-md">
          <p className="text-xs text-muted-foreground">
            💡 Sugerencia: Puedes aumentar el radio de búsqueda en los filtros
            para encontrar más productos.
          </p>
        </div>
      )}
    </div>
  );
};

export default EmptyStateMarketplace;
