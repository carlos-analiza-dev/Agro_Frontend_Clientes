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
import { RefreshCw, Scale, PawPrint, Dna, Wheat, Utensils } from "lucide-react";
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

  const finca = fincaId === "all" ? "" : fincaId;
  const especie = especieId === "all" ? "" : especieId;

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
    especie,
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

  const hasActiveFilters =
    (fincaId && fincaId !== "all") ||
    (especieId && especieId !== "all") ||
    debouncedSearchTerm !== "";

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </div>
    );
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

  if (animales.length === 0) {
    return (
      <div className="container mx-auto p-4 pb-20">
        <div className="block md:flex justify-between items-center mb-6">
          <h1 className="text-lg md:text-3xl font-bold">Mis Animales</h1>

          <div className="mt-4 md:mt-0 flex justify-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
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
                <Button variant="outline" className="gap-2">
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Buscador
            title="Buscar por identificador..."
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

          <Select value={especieId} onValueChange={setEspecieId}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar especie" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {especies?.data?.map((especie) => (
                <SelectItem key={especie.id} value={especie.id}>
                  {especie.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <EmptyStateAnimales
          hasFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onAddAnimal={handleAddAnimal}
          onRefresh={handleRefresh}
          isLoading={isFetchingNextPage}
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

        <div className="mt-4 md:mt-0 flex justify-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
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
              <Button variant="outline" className="gap-2">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Buscador
          title="Buscar por identificador..."
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

        <Select value={especieId} onValueChange={setEspecieId}>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar especie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            {especies?.data?.map((especie) => (
              <SelectItem key={especie.id} value={especie.id}>
                {especie.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {animales.map((animal) => (
          <AnimalCard
            key={animal.id}
            animal={animal}
            onEdit={() => router.push(`/animales/${animal.id}`)}
            onUpdateProfileImage={handleUpdateProfileImage}
          />
        ))}
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

      <FAB
        titulo="Agregar Animal"
        onPress={() => router.push("/animales/crear-animal")}
      />
    </div>
  );
};

export default AnimalesPageGanadero;
