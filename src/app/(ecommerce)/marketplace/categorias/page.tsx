"use client";

import { useTranslations } from "next-intl";
import useGetCategorias from "@/hooks/categorias/useGetCategorias";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import EmptyStateMarketplace from "@/components/marketplace/EmptyStateMarketplace";
import { Skeleton } from "@/components/ui/skeleton";
import CategorySkeleton from "./ui/CategorySkeleton";
import CategoryCard from "./ui/CategoryCard";

const CategoriasPage = () => {
  const t = useTranslations("marketPlaceCategoriesPage");

  const { data: categorias, isLoading } = useGetCategorias({
    is_market: true,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>

        <div className="mb-8">
          <Skeleton className="h-12 w-full rounded-lg" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <CategorySkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (!categorias || categorias.length === 0) {
    return (
      <div className="container mx-auto px-4 py-10">
        <EmptyStateMarketplace
          variant="no-products"
          title={t("empty.title")}
          description={t("empty.description")}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-xl md:text-4xl font-black text-gray-800 mb-3">
            {t("title")}
          </h1>
          <p className="text-gray-500 max-w-2xl mx-auto">{t("description")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-green-600">
              {categorias.length}
            </p>
            <p className="text-sm text-gray-500">{t("statistics.total")}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">
              {categorias.filter((c) => c.is_active).length}
            </p>
            <p className="text-sm text-gray-500">{t("statistics.active")}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-purple-600">
              {categorias.filter((c) => c.destacada).length}
            </p>
            <p className="text-sm text-gray-500">{t("statistics.featured")}</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm text-center">
            <div className="flex items-center justify-center gap-1">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <p className="text-sm font-medium text-orange-600">
                {t("statistics.popular")}
              </p>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {t("statistics.animalSales")}
            </p>
          </div>
        </div>

        {categorias.length === 0 ? (
          <EmptyStateMarketplace
            variant="no-filters"
            title={t("empty.filteredTitle")}
            description={t("empty.filteredDescription")}
            hasFilters={true}
          />
        ) : (
          <div
            className={`grid gap-6 ${"grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"}`}
          >
            {categorias.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        )}

        <div className="mt-12 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl text-center">
          <h3 className="font-semibold text-gray-800 mb-2">
            {t("footer.title")}
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            {t("footer.description")}
          </p>
          <Button
            variant="outline"
            className="bg-white hover:bg-gray-50"
            onClick={() => (window.location.href = "/marketplace")}
          >
            {t("footer.button")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CategoriasPage;
