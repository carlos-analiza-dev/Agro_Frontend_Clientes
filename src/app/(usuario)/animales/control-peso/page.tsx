"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { Buscador } from "@/components/generics/Buscador";
import SkeletonCard from "@/components/generics/SkeletonCard";
import CardAnimalPeso from "./ui/CardAnimal";

const HistorialAnimalPeso = () => {
  const t = useTranslations("historialAnimalPeso");
  const { data: animales, isLoading } = useGetAnimalesPropietario();
  const [searchTerm, setSearchTerm] = useState("");

  const animalesFiltrados = animales?.filter((animal) =>
    animal.identificador.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="container p-4">
      <div className="flex flex-col items-center gap-4 mb-6">
        <Buscador
          title={t("searchPlaceholder")}
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          className="w-full max-w-md"
        />
      </div>

      {animalesFiltrados && animalesFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4">
          {animalesFiltrados.map((animal) => (
            <CardAnimalPeso key={animal.id} animal={animal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {searchTerm ? t("emptySearch") : t("emptyAnimals")}
          </p>
        </div>
      )}
    </div>
  );
};

export default HistorialAnimalPeso;
