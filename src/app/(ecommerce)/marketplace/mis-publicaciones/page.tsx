"use client";
import useGetMisPublicaciones from "@/hooks/market-animales/useGetMisPublicaciones";
import { Badge } from "@/components/ui/badge";
import SkeletonCard from "@/components/generics/SkeletonCard";
import MisPublicacionesCard from "./ui/MisPublicacionesCard";

const MisPublicacionesPage = () => {
  const { data: mis_publicaciones, isLoading } = useGetMisPublicaciones();
  const publicaciones = mis_publicaciones?.productos ?? [];

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="p-5">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-black">Mis publicaciones</h1>
          <p className="text-muted-foreground mt-1">
            Administra tus productos publicados
          </p>
        </div>

        <Badge variant="secondary" className="text-sm px-4 py-2">
          {publicaciones.length} publicaciones
        </Badge>
      </div>

      {publicaciones.length === 0 ? (
        <div className="h-[400px] flex flex-col items-center justify-center border rounded-2xl">
          <p className="text-xl font-bold">No tienes publicaciones</p>

          <p className="text-muted-foreground mt-2">
            Tus productos publicados aparecerán aquí.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {publicaciones.map((producto) => (
            <MisPublicacionesCard key={producto.id} producto={producto} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPublicacionesPage;
