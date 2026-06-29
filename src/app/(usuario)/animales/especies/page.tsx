"use client";
import useGetEspecies from "@/hooks/especies/useGetEspecies";

const Page = () => {
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
            <div
              key={especie.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {especie.nombre}
                  </h2>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      especie.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {especie.isActive ? "Activo" : "Inactivo"}
                  </span>
                </div>
                <p className="text-sm text-gray-500">
                  ID: {especie.id.substring(0, 8)}...
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Total de especies: {especiesList.length}
      </div>
    </div>
  );
};

export default Page;
