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
  Egg,
  Fish,
} from "lucide-react";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useDebounce } from "@/hooks/debounce/useDebounce";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { Buscador } from "@/components/generics/Buscador";
import { FAB } from "@/components/generics/FAB";
import AnimalCard from "./ui/AnimalCard";
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
import CargaMasivaModal from "./ui/CargaMasivaModal";
import { Badge } from "@/components/ui/badge";
import AvicolaCard from "./ui/AvicolaCard";
import PiscicolaCard from "./ui/PiscicolaCard";
import CaprinoCard from "./ui/CaprinoCard";
import OvinoCard from "./ui/OvinoCard";
import PorcinoCard from "./ui/PorcinoCard";
import EquinoCard from "./ui/EquinoCard";

const ESPECIES = {
  AVES: ["aves", "avicola", "pollos", "gallinas"],
  EQUINO: ["equino", "caballo", "yegua", "potro"],
  BOVINO: ["bovino", "vaca", "toro", "ternero"],
  PORCINO: ["porcino", "cerdo", "chancho"],
  OVINO: ["ovino", "oveja", "carnero"],
  CAPRINO: ["caprino", "cabra", "chivo"],
  PECES: [
    "piscicola",
    "pez",
    "peces",
    "tilapia",
    "trucha",
    "salmón",
    "carpa",
    "mojarra",
  ],
};

const getEspecieTipo = (nombreEspecie: string): string => {
  if (!nombreEspecie) return "default";

  const nombreLower = nombreEspecie.toLowerCase();

  if (ESPECIES.AVES.some((e) => nombreLower.includes(e))) return "aves";
  if (ESPECIES.EQUINO.some((e) => nombreLower.includes(e))) return "equino";
  if (ESPECIES.BOVINO.some((e) => nombreLower.includes(e))) return "bovino";
  if (ESPECIES.PORCINO.some((e) => nombreLower.includes(e))) return "porcino";
  if (ESPECIES.OVINO.some((e) => nombreLower.includes(e))) return "ovino";
  if (ESPECIES.CAPRINO.some((e) => nombreLower.includes(e))) return "caprino";
  if (ESPECIES.PECES.some((e) => nombreLower.includes(e))) return "peces";

  return "default";
};

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

  const handleAddAnimal = () => {
    router.push("/animales/crear-animal");
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
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
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

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <EmptyStateAnimales
          hasFilters={false}
          onRefresh={handleRefresh}
          isLoading={isLoading}
          title="Error al cargar los animales"
          description="No se pudieron cargar los animales. Por favor, intenta nuevamente."
          actionText="Recargar"
        />
      </div>
    );
  }

  const renderFilters = () => (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <Buscador
          title="Buscar por identificador o nombre..."
          setSearchTerm={setSearchTerm}
          searchTerm={searchTerm}
        />

        <Select value={fincaId} onValueChange={setFincaId}>
          <SelectTrigger>
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

      <ActiveFiltersSection />
    </>
  );

  if (animales.length === 0) {
    return (
      <div className="container mx-auto p-4 pb-20">
        <div className="block md:flex justify-between items-center mb-6">
          <h1 className="text-lg md:text-3xl font-bold">Mis Animales</h1>

          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full md:w-auto">
            <Button
              variant="outline"
              className="gap-2 w-full sm:w-auto"
              onClick={() => setIsCargaMasivaOpen(true)}
            >
              <UploadCloud className="h-4 w-4" />
              Carga Masiva
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Scale className="h-4 w-4" />
                  Control de Peso
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={() => router.push("/animales/control-peso")}
                >
                  <PawPrint className="h-4 w-4 mr-2" />
                  Por Animal
                </DropdownMenuItem>

                <DropdownMenuItem
                  className="hover:cursor-pointer"
                  onClick={() => router.push("/animales/peso-raza")}
                >
                  <Dna className="h-4 w-4 mr-2" />
                  Por Raza
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2 w-full sm:w-auto">
                  <Wheat className="h-4 w-4" />
                  Alimentación
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem
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

        <div className="container mx-auto p-4">
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
          titulo="Agregar Animal"
          onPress={() => router.push("/animales/crear-animal")}
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 pb-20">
      <div className="block md:flex justify-between items-center mb-6">
        <h1 className="text-lg md:text-3xl font-bold">Mis Animales</h1>

        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full md:w-auto">
          <Button
            variant="outline"
            className="gap-2 w-full sm:w-auto"
            onClick={() => setIsCargaMasivaOpen(true)}
          >
            <UploadCloud className="h-4 w-4" />
            Carga Masiva
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Scale className="h-4 w-4" />
                Control de Peso
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => router.push("/animales/control-peso")}
              >
                <PawPrint className="h-4 w-4 mr-2" />
                Por Animal
              </DropdownMenuItem>

              <DropdownMenuItem
                className="hover:cursor-pointer"
                onClick={() => router.push("/animales/peso-raza")}
              >
                <Dna className="h-4 w-4 mr-2" />
                Por Raza
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Wheat className="h-4 w-4" />
                Alimentación
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        titulo="Agregar Animal"
        onPress={() => router.push("/animales/crear-animal")}
      />
    </div>
  );
};

export default AnimalesPageGanadero;
