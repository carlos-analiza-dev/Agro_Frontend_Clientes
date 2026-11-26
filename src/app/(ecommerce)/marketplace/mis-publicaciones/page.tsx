"use client";
import useGetMisPublicaciones from "@/hooks/market-animales/useGetMisPublicaciones";
import { Badge } from "@/components/ui/badge";
import SkeletonCard from "@/components/generics/SkeletonCard";
import MisPublicacionesCard from "./ui/MisPublicacionesCard";
import { useTranslations } from "next-intl";

const MisPublicacionesPage = () => {
  const t = useTranslations("marketPlaceMyPublicationsPage");
  const { data: mis_publicaciones, isLoading } = useGetMisPublicaciones();
  const publicaciones = mis_publicaciones?.productos ?? [];

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="px-3 py-4 md:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black">{t("title")}</h1>

          <p className="text-sm md:text-base text-muted-foreground mt-1">
            {t("description")}
          </p>
        </div>

        <Badge
          variant="secondary"
          className="w-fit text-xs sm:text-sm px-3 py-1.5"
        >
          {t("publicationCount", { count: publicaciones.length })}
        </Badge>
      </div>

      {publicaciones.length === 0 ? (
        <div className="min-h-[300px] md:h-[400px] flex flex-col items-center justify-center border rounded-2xl px-4 text-center">
          <p className="text-lg md:text-xl font-bold">{t("empty.title")}</p>

          <p className="text-sm md:text-base text-muted-foreground mt-2">
            {t("empty.description")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
          {publicaciones.map((producto) => (
            <MisPublicacionesCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPublicacionesPage;
