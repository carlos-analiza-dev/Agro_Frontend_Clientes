"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  PawPrint,
  Package,
  Sprout,
  ArrowRight,
  Check,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { categorias_publish } from "@/helpers/data/marketpalce/category-publish";

type CategoriaType =
  | "animales"
  | "productos_ganaderos"
  | "productos_agricolas"
  | null;

const CrearPublicacionPage = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<CategoriaType>(null);
  const [isHovered, setIsHovered] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedCategory) {
      router.push(`/marketplace/create/${selectedCategory}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-white/20 text-white hover:bg-white/30 border-none">
              Nueva Publicación
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              ¿Qué deseas publicar hoy?
            </h1>
            <p className="text-lg md:text-xl text-green-100">
              Elige la categoría que mejor describa tu producto y comienza a
              vender en AgroMarket
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 pb-16 mt-5">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {categorias_publish.map((categoria) => {
            const Icon = categoria.icono;
            const isSelected = selectedCategory === categoria.id;
            const isHoveredState = isHovered === categoria.id;

            return (
              <Card
                key={categoria.id}
                className={cn(
                  "cursor-pointer transition-all duration-300 overflow-hidden border-2",
                  categoria.borderColor,
                  categoria.hoverColor,
                  isSelected && "ring-2 ring-green-500 shadow-lg",
                  isHoveredState && "transform scale-[1.02] shadow-xl",
                )}
                onClick={() => setSelectedCategory(categoria.id)}
                onMouseEnter={() => setIsHovered(categoria.id)}
                onMouseLeave={() => setIsHovered(null)}
              >
                <CardHeader className={cn("pb-4", categoria.bgColor)}>
                  <div className="flex justify-between items-start">
                    <div
                      className={cn(
                        "p-3 rounded-xl bg-gradient-to-r text-white",
                        categoria.color,
                      )}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                    {isSelected && (
                      <div className="bg-green-500 rounded-full p-1">
                        <Check className="h-5 w-5 text-white" />
                      </div>
                    )}
                  </div>
                  <CardTitle className="text-2xl mt-4">
                    {categoria.titulo}
                  </CardTitle>
                  <CardDescription className="text-sm">
                    {categoria.descripcion}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Ejemplos de publicación:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {categoria.ejemplos.map((ejemplo, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs"
                        >
                          {ejemplo}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="pt-0">
                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "w-full gap-2",
                      isSelected &&
                        "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600",
                    )}
                  >
                    {isSelected ? (
                      <>
                        <Check className="h-4 w-4" />
                        Categoría seleccionada
                      </>
                    ) : (
                      <>
                        Seleccionar
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>

        {selectedCategory && (
          <div className="fixed bottom-6 left-0 right-0 flex justify-center animate-in slide-in-from-bottom-5 duration-300">
            <div className="bg-white shadow-lg rounded-full p-2 flex gap-3 items-center border border-gray-200">
              <div className="px-4 py-2">
                <p className="text-sm text-gray-600">
                  Categoría seleccionada:{" "}
                  <span className="font-bold text-gray-900">
                    {
                      categorias_publish.find((c) => c.id === selectedCategory)
                        ?.titulo
                    }
                  </span>
                </p>
              </div>
              <Button
                onClick={handleContinue}
                className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 rounded-full gap-2"
              >
                Continuar
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-gray-500">
            Al publicar, aceptas nuestros{" "}
            <Link
              href="/terminos"
              target="_blank"
              className="text-green-600 hover:underline"
            >
              Términos y Condiciones
            </Link>{" "}
            y{" "}
            <Link
              href="/privacidad"
              target="_blank"
              className="text-green-600 hover:underline"
            >
              Políticas de Publicación
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default CrearPublicacionPage;
