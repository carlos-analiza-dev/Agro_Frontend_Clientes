"use client";

import { useState, useEffect, useCallback } from "react";
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
  AlertCircle,
  Scale,
  PawPrint,
  Dna,
  Wheat,
  Utensils,
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

const AnimalesPageGanadero = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { cliente } = useAuthStore();
  const [fincaId, setFincaId] = useState("");
  const [especieId, setEspecieId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const { data: fincas } = useFincasPropietarios(cliente?.id ?? "");
  const { data: especies } = useGetEspecies();

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
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleUpdateProfileImage = async (
    imageUri: string,
    animalId: string,
  ) => {
    if (!cliente) return;
    try {
      await uploadProfileImageAnimal(imageUri, animalId);
      queryClient.invalidateQueries({ queryKey: ["animales-propietario"] });
    } catch (error) {
      toast.error("Error al actualizar la imagen de perfil");
    }
  };

  const animales = data?.pages.flatMap((page) => page.data) || [];

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loadMore]);

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
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

      {animales.length === 0 && !isLoading && isError ? (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No hay animales</h3>
          <p className="text-muted-foreground mb-4">
            {fincaId || especieId || debouncedSearchTerm
              ? "No se encontraron animales con los filtros aplicados."
              : "No tienes animales registrados en tu cuenta."}
          </p>
          <Button onClick={() => refetch()}>Recargar</Button>
        </div>
      ) : (
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
      )}

      {isFetchingNextPage && (
        <div className="flex justify-center mt-6">
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
      )}

      {hasNextPage && !isFetchingNextPage && (
        <div className="flex justify-center mt-6">
          <Button variant="outline" onClick={loadMore}>
            Cargar más animales
          </Button>
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
