"use client";

import { ProductoAnimal } from "@/api/market-animales/interfaces/response-market-animales.interface";

import { Card, CardContent, CardFooter } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";

import { MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  animal: ProductoAnimal;
}

const CardMarketAnimal = ({ animal }: Props) => {
  const router = useRouter();
  const image = animal.imagenes?.[0]?.url || "/images/agricultura.jpg";

  const linkCardAnimal = (aniaml: ProductoAnimal) => {
    router.push(`/marketplace/animales/${aniaml.id}`);
  };

  return (
    <Card
      onClick={() => linkCardAnimal(animal)}
      className="group overflow-hidden hover:cursor-pointer rounded-2xl border-0 py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative overflow-hidden">
        <img
          src={image}
          alt={animal.nombre}
          className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <Badge
          className={`absolute left-3 top-3 ${
            animal.disponible
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {animal.disponible ? "Disponible" : "No Disponible"}
        </Badge>

        <Badge
          className={`absolute right-3 top-3 ${
            !animal.vendido
              ? "bg-emerald-600 hover:bg-emerald-700"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {animal.vendido ? "Vendido" : "En Venta"}
        </Badge>
      </div>

      <CardContent className="space-y-4 p-5">
        <div>
          <h2 className="line-clamp-1 text-xl font-bold">{animal.nombre}</h2>

          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {animal.descripcion}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin size={16} />

            <span>{animal.ubicacion?.departamento}</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-5">
        <div>
          {Number(animal.precio_oferta) > 0 && animal.oferta ? (
            <div>
              <p className="text-xs text-muted-foreground line-through">
                {animal.moneda} {animal.precio}
              </p>

              <h3 className="text-2xl font-extrabold text-emerald-600">
                {animal.moneda} {animal.precio_oferta}
              </h3>
            </div>
          ) : (
            <h3 className="text-2xl font-extrabold text-emerald-600">
              {animal.moneda} {animal.precio}
            </h3>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardMarketAnimal;
