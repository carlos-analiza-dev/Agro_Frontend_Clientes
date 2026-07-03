"use client";

import CardEspecies from "@/components/especies/CardEspecies";
import useGetEspecies from "@/hooks/especies/useGetEspecies";

const EspeciesPage = () => {
  const { data: especies, isLoading } = useGetEspecies();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Cargando especies...</div>
      </div>
    );
  }

  const especiesList = especies?.data || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Lista de Especies
      </h1>

      {especiesList.length === 0 ? (
        <p className="text-gray-500">No hay especies disponibles</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {especiesList.map((especie) => (
            <CardEspecies
              key={especie.id}
              especie={especie}
              link_page={`/sanidad-animal/especies/${especie.nombre.toLowerCase()}`}
            />
          ))}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Total de especies: {especiesList.length}
      </div>
    </div>
  );
};

export default EspeciesPage;
