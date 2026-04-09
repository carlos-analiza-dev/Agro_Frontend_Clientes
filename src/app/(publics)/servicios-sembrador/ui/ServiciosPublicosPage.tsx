"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import { MessageError } from "@/components/generics/MessageError";
import SkeletonCard from "@/components/generics/SkeletonCard";
import Paginacion from "@/components/generics/Paginacion";
import useGetCategoriasServices from "@/hooks/servicios/useGetCategoriasServices";
import CardServicios from "./CardServicios";

const ServiciosPublicosPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 6;
  const offset = (currentPage - 1) * limit;

  const paisStorage = localStorage.getItem("selectedCountry");
  const pais = paisStorage ? JSON.parse(paisStorage) : null;
  const paisId = pais?.id;

  useEffect(() => {
    if (!paisId) {
      router.push("/not-selected-country");
    }
  }, [paisId, router]);

  const {
    data: serviciosData,
    isError,
    isLoading,
    refetch,
  } = useGetCategoriasServices(paisId, limit, offset);

  const servicios = serviciosData?.servicios || [];
  const total = serviciosData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return <SkeletonCard />;
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto">
          <MessageError
            titulo="Error al cargar los servicios"
            descripcion="No se pudieron cargar los servicios disponibles en este momento."
            onPress={refetch}
          />
        </div>
      </div>
    );
  }

  if (servicios.length === 0) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="max-w-7xl mx-auto text-center mt-16">
          <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">
            No hay servicios disponibles
          </h3>
          <p className="text-muted-foreground mb-4">
            No encontramos servicios disponibles en tu país
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Servicios Disponibles
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Descubre nuestra amplia gama de servicios profesionales
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((categoria) => (
            <CardServicios key={categoria.id} categoria={categoria} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Paginacion
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}

        <div className="mt-12 text-center text-sm text-muted-foreground border-t pt-6">
          <p>
            ¿Necesitas más información? Contáctanos para consultar sobre
            nuestros servicios
          </p>
        </div>
      </div>
    </div>
  );
};

export default ServiciosPublicosPage;
