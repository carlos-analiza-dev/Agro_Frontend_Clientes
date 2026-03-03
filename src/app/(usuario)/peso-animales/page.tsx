"use client";
import { useState } from "react";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { useAuthStore } from "@/providers/store/useAuthStore";
import SkeletonCard from "./ui/SkeletonCard";
import CardAnimal from "./ui/CardAnimal";
import { Buscador } from "@/components/generics/Buscador";

const HistorialAnimalPeso = () => {
  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const { data: animales, isLoading } = useGetAnimalesPropietario(clienteId);
  const [searchTerm, setSearchTerm] = useState("");

  const animalesFiltrados = animales?.data.filter((animal) =>
    animal.identificador.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="container p-4">
      <div className="flex flex-col items-center gap-4 mb-6">
        <Buscador
          title="Buscar por identificador..."
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
          className="w-full max-w-md"
        />
      </div>

      {animalesFiltrados && animalesFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 p-4">
          {animalesFiltrados.map((animal) => (
            <CardAnimal key={animal.id} animal={animal} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">
            {searchTerm
              ? "No se encontraron animales con ese identificador"
              : "No hay animales disponibles"}
          </p>
        </div>
      )}
    </div>
  );
};

export default HistorialAnimalPeso;
