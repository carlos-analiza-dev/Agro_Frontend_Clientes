"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import useAnimalesByPropietario from "@/hooks/animales/useAnimalesByPropietario";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  RefreshCw,
  Scale,
  PawPrint,
  Dna,
  Wheat,
  Utensils,
  UploadCloud,
  X,
  Filter,
} from "lucide-react";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useDebounce } from "@/hooks/debounce/useDebounce";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { Buscador } from "@/components/generics/Buscador";
import { FAB } from "@/components/generics/FAB";
import { uploadProfileImageAnimal } from "@/api/animales_profile/accions/uploadProfileImageAnimal";
import { toast } from "react-toastify";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import SkeletonCard from "@/components/generics/SkeletonCard";
import EmptyStateAnimales from "./ui/EmptyStateAnimales";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { Badge } from "@/components/ui/badge";
import AvicolaCard from "@/components/animales/cards/AvicolaCard";
import PiscicolaCard from "@/components/animales/cards/PiscicolaCard";
import EquinoCard from "@/components/animales/cards/EquinoCard";
import CaprinoCard from "@/components/animales/cards/CaprinoCard";
import OvinoCard from "@/components/animales/cards/OvinoCard";
import PorcinoCard from "@/components/animales/cards/PorcinoCard";
import CargaMasivaModal from "@/components/animales/info/CargaMasivaModal";
import AnimalCard from "@/components/animales/cards/AnimalCard";
import { getEspecieTipo } from "@/helpers/funciones/animales/obtener-especie";

const AnimalesPageGanadero = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cliente } = useAuthStore();
  const [fincaId, setFincaId] = useState("");
  const [especieId, setEspecieId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: fincas } = useFincasPropietarios(cliente?.id ?? "");
  const { data: especies } = useGetEspecies();
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isCargaMasivaOpen, setIsCargaMasivaOpen] = useState(false);
  const finca = fincaId === "all" ? "" : fincaId;

  const {
    data,
    isError,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useAnimalesByPropietario(
    cliente?.id ?? "",
    finca,
    "",
    debouncedSearchTerm,
  );

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage && !isScrolling) {
      setIsScrolling(true);
      fetchNextPage().finally(() => {
        setTimeout(() => setIsScrolling(false), 500);
      });
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage, isScrolling]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          loadMore();
        }
      },
      {
        rootMargin: "100px",
        threshold: 0.1,
      },
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, loadMore]);

  useEffect(() => {
    if (!isMobile) return;

    const handleScroll = () => {
      if (isFetchingNextPage || !hasNextPage) return;

      const scrollPosition =
        window.innerHeight + document.documentElement.scrollTop;
      const threshold = document.documentElement.offsetHeight - 200;

      if (scrollPosition >= threshold) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isFetchingNextPage, hasNextPage, loadMore, isMobile]);

  const handleUpdateProfileImage = async (
    imageUri: string,
    animalId: string,
  ) => {
    if (!cliente) return;
    try {
      await uploadProfileImageAnimal(imageUri, animalId);
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
      toast.success("Imagen actualizada correctamente");
    } catch (error) {
      toast.error("Error al actualizar la imagen de perfil");
    }
  };

  const handleClearFilters = () => {
    setFincaId("all");
    setEspecieId("all");
    setSearchTerm("");
  };

  const handleRefresh = () => {
    refetch();
  };

  const animales = data?.pages.flatMap((page) => page.data) || [];

  const getActiveFilterName = () => {
    const filters = [];

    if (debouncedSearchTerm) {
      filters.push(`Búsqueda: "${debouncedSearchTerm}"`);
    }

    if (fincaId && fincaId !== "all") {
      const fincaName = fincas?.data?.fincas.find(
        (f) => f.id === fincaId,
      )?.nombre_finca;
      filters.push(`Finca: ${fincaName || fincaId}`);
    }

    if (especieId && especieId !== "all") {
      const especieName = especies?.data?.find(
        (e) => e.id === especieId,
      )?.nombre;
      filters.push(`Especie: ${especieName || especieId}`);
    }

    return filters;
  };

  const activeFilters = getActiveFilterName();
  const hasActiveFilters = activeFilters.length > 0;

  const ActiveFiltersSection = () => {
    if (!hasActiveFilters) return null;

    return (
      <div
        id="id-animales-active-filters"
        className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Filter className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <span className="text-sm font-medium text-blue-700 dark:text-blue-300">
            Filtros activos:
          </span>

          <div className="flex flex-wrap gap-2">
            {activeFilters.map((filter, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300"
              >
                {filter}
              </Badge>
            ))}
          </div>

          <Button
            id="id-animales-clear-filters"
            variant="ghost"
            size="sm"
            onClick={handleClearFilters}
            className="ml-auto text-blue-600 hover:text-blue-700 hover:bg-blue-100 dark:text-blue-400 dark:hover:text-blue-300 dark:hover:bg-blue-900/50"
          >
            <X className="h-4 w-4 mr-1" />
            Limpiar todos
          </Button>
        </div>
      </div>
    );
  };

  const renderAnimalCard = (animal: any, index: number) => {
    const especieTipo = getEspecieTipo(animal.especie?.nombre || "");

    const commonProps = {
      animal,
      onEdit: () => router.push(`/animales/${animal.id}`),
      onUpdateProfileImage: handleUpdateProfileImage,
    };

    const key = `${animal.id}-${index}`;

    switch (especieTipo) {
      case "aves":
        return <AvicolaCard key={key} {...commonProps} />;
      case "peces":
        return <PiscicolaCard key={key} {...commonProps} />;
      case "equino":
        return <EquinoCard key={key} {...commonProps} />;
      case "caprino":
        return <CaprinoCard key={key} {...commonProps} />;
      case "ovino":
        return <OvinoCard key={key} {...commonProps} />;
      case "porcino":
        return <PorcinoCard key={key} {...commonProps} />;
      case "bovino":
        return <AnimalCard key={key} {...commonProps} />;
      default:
        return <AnimalCard key={key} {...commonProps} />;
    }
  };

  if (isLoading) {
    return <SkeletonCard />;
  }

  const renderFilters = () => (
    <>
      <div
        id="id-animales-filters"
        className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
      >
        <Buscador
          id="id-buscador-animal"
          title="Buscar por identificador o nombre..."
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />

        <div id="id-select-finca-animal">
          <Select value={fincaId} onValueChange={setFincaId}>
            <SelectTrigger id="id-select-finca-trigger">
              <SelectValue placeholder="Seleccionar finca" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>

              {fincas?.data?.fincas.map((finca) => (
                <SelectItem key={finca.id} value={finca.id}>
                  {finca.nombre_finca}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <ActiveFiltersSection />
    </>
  );

  if (animales.length === 0) {
    return (
      <div id="id-animales-container" className="container mx-auto p-4 pb-20">
        <div
          id="id-animales-header"
          className="block md:flex justify-between items-center mb-6"
        >
          <h1 className="text-lg md:text-3xl font-bold">Mis Animales</h1>

          <div
            id="id-animales-actions"
            className="mt-4 md:mt-0 flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full md:w-auto"
          >
            <Button
              id="id-carga-masiva"
              variant="outline"
              className="gap-2 w-full sm:w-auto"
              onClick={() => setIsCargaMasivaOpen(true)}
            >
              <UploadCloud className="h-4 w-4" />
              Carga Masiva
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger id="id-control-peso" asChild>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Scale className="h-4 w-4" />
                  Control de Peso
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  id="id-peso-por-animal"
                  className="hover:cursor-pointer"
                  onClick={() => router.push("/animales/control-peso")}
                >
                  <PawPrint className="h-4 w-4 mr-2" />
                  Por Animal
                </DropdownMenuItem>

                <DropdownMenuItem
                  id="id-peso-por-raza"
                  className="hover:cursor-pointer"
                  onClick={() => router.push("/animales/peso-raza")}
                >
                  <Dna className="h-4 w-4 mr-2" />
                  Por Raza
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger id="id-alimentacion-animal" asChild>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Wheat className="h-4 w-4" />
                  Alimentación
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  id="id-ver-alimentacion"
                  className="hover:cursor-pointer"
                  onClick={() => router.push("/animales/alimentacion")}
                >
                  <Utensils className="h-4 w-4 mr-2" />
                  Ver Alimentación
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {renderFilters()}

        <div id="id-empty-animales" className="container mx-auto p-4">
          <EmptyStateAnimales
            hasFilters={false}
            onRefresh={handleRefresh}
            isLoading={isLoading}
            title="No hay animales registrados"
            description="Comienza agregando tu primer animal o lote avícola."
            actionText="Agregar Animal"
          />
        </div>
        <CargaMasivaModal
          isOpen={isCargaMasivaOpen}
          onClose={() => setIsCargaMasivaOpen(false)}
        />
        <FAB
          id="add-animal-btn"
          titulo="Agregar Animal"
          onPress={() => router.push("/animales/crear-animal")}
        />
      </div>
    );
  }

  return (
    <div id="id-animales-container" className="container mx-auto p-4 pb-20">
      <div
        id="id-animales-header"
        className="block md:flex justify-between items-center mb-6"
      >
        <h1 className="text-lg md:text-3xl font-bold">Mis Animales</h1>

        <div
          id="id-animales-actions"
          className="mt-4 md:mt-0 flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full md:w-auto"
        >
          <Button
            id="id-carga-masiva"
            variant="outline"
            className="gap-2 w-full sm:w-auto"
            onClick={() => setIsCargaMasivaOpen(true)}
          >
            <UploadCloud className="h-4 w-4" />
            Carga Masiva
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger id="id-control-peso" asChild>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Scale className="h-4 w-4" />
                Control de Peso
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                id="id-peso-por-animal"
                className="hover:cursor-pointer"
                onClick={() => router.push("/animales/control-peso")}
              >
                <PawPrint className="h-4 w-4 mr-2" />
                Por Animal
              </DropdownMenuItem>

              <DropdownMenuItem
                id="id-peso-por-raza"
                className="hover:cursor-pointer"
                onClick={() => router.push("/animales/peso-raza")}
              >
                <Dna className="h-4 w-4 mr-2" />
                Por Raza
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger id="id-alimentacion-animal" asChild>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Wheat className="h-4 w-4" />
                Alimentación
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                id="id-ver-alimentacion"
                className="hover:cursor-pointer"
                onClick={() => router.push("/animales/alimentacion")}
              >
                <Utensils className="h-4 w-4 mr-2" />
                Ver Alimentación
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {renderFilters()}

      <div
        id="id-animales-list"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {animales.map((animal, index) => renderAnimalCard(animal, index))}
      </div>

      {hasNextPage && (
        <div ref={loadMoreRef} className="flex justify-center mt-6">
          {isFetchingNextPage ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span className="text-sm text-gray-500">Cargando más...</span>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={loadMore}
              className="w-full max-w-xs"
            >
              Cargar más animales
            </Button>
          )}
        </div>
      )}
      <CargaMasivaModal
        isOpen={isCargaMasivaOpen}
        onClose={() => setIsCargaMasivaOpen(false)}
      />
      <FAB
        id="add-animal-btn"
        titulo="Agregar Animal"
        onPress={() => router.push("/animales/crear-animal")}
      />
    </div>
  );
};

export default AnimalesPageGanadero;
