"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  FilterX,
  RefreshCw,
  PawPrint,
  AlertCircle,
  Loader2,
} from "lucide-react";

type EmptyStateVariant = "no-data" | "no-filters" | "error" | "loading";

interface EmptyStateAnimalesProps {
  variant?: EmptyStateVariant;
  hasFilters?: boolean;
  onClearFilters?: () => void;
  onRefresh?: () => void;
  onAddAnimal?: () => void;
  isLoading?: boolean;
  title?: string;
  description?: string;
  actionText?: string;
  error?: string;
}

const EmptyStateAnimales = ({
  variant = "no-data",
  hasFilters = false,
  onClearFilters,
  onRefresh,
  onAddAnimal,
  isLoading = false,
  title,
  description,
  actionText,
  error,
}: EmptyStateAnimalesProps) => {
  const t = useTranslations("emptyStateAnimales");

  const getVariantConfig = () => {
    switch (variant) {
      case "error":
        return {
          icon: AlertCircle,
          iconColor: "text-destructive",
          bgColor: "bg-destructive/10",
          defaultTitle: t("variants.error.title"),
          defaultDescription: error || t("variants.error.description"),
          showAddButton: false,
          showClearButton: false,
        };

      case "loading":
        return {
          icon: Loader2,
          iconColor: "text-muted-foreground",
          bgColor: "bg-muted",
          defaultTitle: t("variants.loading.title"),
          defaultDescription: t("variants.loading.description"),
          showAddButton: false,
          showClearButton: false,
        };

      case "no-filters":
        return {
          icon: PawPrint,
          iconColor: "text-muted-foreground",
          bgColor: "bg-muted",
          defaultTitle: t("variants.noFilters.title"),
          defaultDescription: t("variants.noFilters.description"),
          showAddButton: false,
          showClearButton: true,
        };

      default:
        return {
          icon: PawPrint,
          iconColor: "text-muted-foreground",
          bgColor: "bg-muted",
          defaultTitle: t("variants.noData.title"),
          defaultDescription: t("variants.noData.description"),
          showAddButton: true,
          showClearButton: false,
        };
    }
  };

  const config = getVariantConfig();
  const Icon = config.icon;

  if (variant === "loading") {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
        <div className="relative">
          <div className="bg-muted rounded-full p-4 mb-4">
            <Icon className="h-12 w-12 text-muted-foreground animate-spin" />
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-2">
          {title || config.defaultTitle}
        </h3>

        <p className="text-muted-foreground text-sm max-w-md">
          {description || config.defaultDescription}
        </p>
      </div>
    );
  }

  const showFilters = variant === "no-filters" || hasFilters;
  const defaultActionText = showFilters
    ? t("buttons.clearFilters")
    : t("buttons.addAnimal");

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="relative">
        <div className={`rounded-full p-4 mb-4 ${config.bgColor}`}>
          <Icon
            className={`h-12 w-12 ${config.iconColor} ${
              variant === "error" ? "animate-pulse" : ""
            }`}
          />
        </div>

        {showFilters && (
          <div className="absolute -top-2 -right-2 bg-destructive rounded-full p-1.5">
            <FilterX className="h-4 w-4 text-destructive-foreground" />
          </div>
        )}
      </div>

      <h3
        className={`text-xl font-semibold mb-2 ${
          variant === "error" ? "text-destructive" : ""
        }`}
      >
        {title || config.defaultTitle}
      </h3>

      <p className="text-muted-foreground text-sm max-w-md mb-6">
        {description || config.defaultDescription}
      </p>

      <div className="flex gap-3">
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

        {config.showAddButton && onAddAnimal && (
          <Button onClick={onAddAnimal} disabled={isLoading} className="gap-2">
            <PlusCircle className="h-4 w-4" />
            {actionText || defaultActionText}
          </Button>
        )}

        {onRefresh && (
          <Button
            variant={config.showAddButton ? "ghost" : "default"}
            onClick={onRefresh}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            {t("buttons.refresh")}
          </Button>
        )}
      </div>
    </div>
  );
};

export default EmptyStateAnimales;
