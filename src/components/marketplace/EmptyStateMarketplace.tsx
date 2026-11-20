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
import { useTranslations } from "next-intl";

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
  const t = useTranslations("emptyStateMarketplace");

  const getVariantConfig = () => {
    switch (variant) {
      case "error":
        return {
          icon: AlertCircle,
          iconColor: "text-destructive",
          bgColor: "bg-destructive/10",
          defaultTitle: t("variants.error.title"),
          defaultDescription: t("variants.error.description"),
          showRefreshButton: true,
          showClearButton: false,
          showBrowseButton: false,
        };

      case "no-location":
        return {
          icon: MapPin,
          iconColor: "text-muted-foreground",
          bgColor: "bg-muted",
          defaultTitle: t("variants.noLocation.title"),
          defaultDescription: t("variants.noLocation.description"),
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
          defaultTitle: t("variants.noNearby.title"),
          defaultDescription: location?.radio
            ? t("variants.noNearby.descriptionWithRadius", {
                radius: location.radio,
              })
            : t("variants.noNearby.description"),
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
          defaultTitle: t("variants.noFilters.title"),
          defaultDescription: t("variants.noFilters.description"),
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
          defaultTitle: t("variants.noProducts.title"),
          defaultDescription: t("variants.noProducts.description"),
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
              {t("location.yourLocation", {
                city: location.ciudad || "",
                country: location.pais || "",
              })}
            </span>
          </div>

          {location.radio && (
            <p className="text-xs text-muted-foreground mt-1">
              {t("location.searchRadius", {
                radius: location.radio,
              })}
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
            {t("buttons.clearFilters")}
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
            {t("buttons.refreshProducts")}
          </Button>
        )}

        {config.showBrowseButton && (
          <Button
            onClick={handleBrowseProducts}
            variant="default"
            className="gap-2"
          >
            <Store className="h-4 w-4" />
            {t("buttons.viewAllProducts")}
          </Button>
        )}

        {config.showRetryButton && onRetryLocation && (
          <Button
            onClick={onRetryLocation}
            disabled={isLoading}
            className="gap-2"
          >
            <Locate className="h-4 w-4" />
            {t("buttons.retryLocation")}
          </Button>
        )}
      </div>

      {variant === "no-nearby" && (
        <div className="mt-6 pt-4 border-t max-w-md">
          <p className="text-xs text-muted-foreground">{t("suggestion")}</p>
        </div>
      )}
    </div>
  );
};

export default EmptyStateMarketplace;
