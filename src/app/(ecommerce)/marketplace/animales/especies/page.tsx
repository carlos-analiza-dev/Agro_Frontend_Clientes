"use client";

import { useRouter } from "next/navigation";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  PawPrint,
  PiggyBank,
  Egg,
  Cat,
  Beef,
  Dog,
  Rabbit,
  Bird,
  Fish,
  Bug,
  Turtle,
  Snail,
  ChevronRight,
} from "lucide-react";

const speciesIcons: Record<string, any> = {
  Porcino: PiggyBank,
  Avícola: Egg,
  Caprino: Cat,
  Bovino: Beef,
  Equino: Dog,
  Ovino: Rabbit,
  Vacuno: Beef,
  Caballo: Dog,
  Oveja: Rabbit,
  Cabra: Cat,
  Cerdo: PiggyBank,
  Pollo: Bird,
  Pato: Bird,
  Pavo: Bird,
  Conejo: Rabbit,
  Pez: Fish,
  Abeja: Bug,
  Tortuga: Turtle,
  Caracol: Snail,
};

const speciesColors: Record<string, string> = {
  Porcino: "from-pink-500 to-rose-500",
  Avícola: "from-yellow-500 to-amber-500",
  Caprino: "from-orange-500 to-amber-500",
  Bovino: "from-green-500 to-emerald-500",
  Equino: "from-blue-500 to-indigo-500",
  Ovino: "from-purple-500 to-violet-500",
  Vacuno: "from-green-500 to-emerald-500",
  Caballo: "from-blue-500 to-indigo-500",
  Oveja: "from-purple-500 to-violet-500",
  Cabra: "from-orange-500 to-amber-500",
  Cerdo: "from-pink-500 to-rose-500",
  Pollo: "from-yellow-500 to-amber-500",
};

const EspeciesPage = () => {
  const router = useRouter();
  const { data: especies, isLoading, isError } = useGetEspecies();

  const handleEspecieClick = (especie: string) => {
    const especieLower = especie.toLocaleLowerCase();
    router.push(`/marketplace/animales/especies/${especieLower}`);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="mb-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-6">
                <Skeleton className="h-24 w-24 rounded-full mx-auto mb-4" />
                <Skeleton className="h-6 w-32 mx-auto mb-2" />
                <Skeleton className="h-4 w-24 mx-auto" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <div className="bg-red-100 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <PawPrint className="h-8 w-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            Error al cargar las especies
          </h3>
          <p className="text-muted-foreground mb-4">
            No se pudieron cargar las especies. Por favor, intenta nuevamente.
          </p>
          <Button onClick={() => window.location.reload()}>Reintentar</Button>
        </div>
      </div>
    );
  }

  const especiesActivas = especies?.data?.filter((e: any) => e.isActive) || [];

  if (especiesActivas.length === 0) {
    return (
      <div className="container mx-auto p-4">
        <div className="text-center py-12">
          <div className="bg-muted rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
            <PawPrint className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">
            No hay especies disponibles
          </h3>
          <p className="text-muted-foreground">
            No se encontraron especies activas en el sistema.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-500 bg-clip-text text-transparent mb-2">
          Especies Disponibles
        </h1>
        <p className="text-muted-foreground">
          Explora los animales disponibles en el marketplace por especie
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {especiesActivas.map((especie: any) => {
          const Icon = speciesIcons[especie.nombre] || PawPrint;
          const colorGradient =
            speciesColors[especie.nombre] || "from-gray-500 to-gray-600";

          return (
            <Card
              key={especie.id}
              className="group cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
              onClick={() => handleEspecieClick(especie.nombre)}
            >
              <CardContent className="p-6 text-center">
                <div
                  className={`mb-4 inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br ${colorGradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="h-12 w-12 text-white" />
                </div>

                <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                  {especie.nombre}
                </h3>

                <div className="flex items-center justify-center gap-2 mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Activo
                  </span>
                </div>

                <Button
                  variant="ghost"
                  className="mt-2 gap-2 group-hover:gap-3 transition-all"
                >
                  Ver animales
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default EspeciesPage;
