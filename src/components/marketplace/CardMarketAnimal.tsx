"use client";

import { ProductoAnimal } from "@/api/market-animales/interfaces/response-market-animales.interface";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Clock,
  Calendar,
  CalendarDays,
  CalendarRange,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { newViewPublicacion } from "@/api/view-publicaciones/acciones/new-view-publicacion";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { TipoPublicacion } from "@/interfaces/enums/market/tipo_publicacion.enum";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";

interface Props {
  animal: ProductoAnimal;
}

const CardMarketAnimal = ({ animal }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const image = animal.imagenes?.[0]?.url || "/images/agricultura.jpg";

  const esAlquiler = animal.tipo_publicacion === TipoPublicacion.ALQUILERES;

  const linkCardAnimal = async (animal: ProductoAnimal) => {
    router.push(`/marketplace/animales/${animal.id}`);
    await newViewPublicacion(animal.id);
    queryClient.invalidateQueries({ queryKey: ["views"] });
  };

  const obtenerPrecioMasBajo = () => {
    const precios = [];
    if (animal.precioHora && Number(animal.precioHora) > 0)
      precios.push({ valor: animal.precioHora, unidad: "hora" });
    if (animal.precioDia && Number(animal.precioDia) > 0)
      precios.push({ valor: animal.precioDia, unidad: "día" });
    if (animal.precioSemana && Number(animal.precioSemana) > 0)
      precios.push({ valor: animal.precioSemana, unidad: "semana" });
    if (animal.precioMes && Number(animal.precioMes) > 0)
      precios.push({ valor: animal.precioMes, unidad: "mes" });

    if (precios.length === 0) return null;

    const masBajo = precios.reduce((min, p) => (p.valor < min.valor ? p : min));
    return masBajo;
  };

  const getTimeIcon = (unidad: string) => {
    switch (unidad) {
      case "hora":
        return <Clock className="w-4 h-4" />;
      case "día":
        return <Calendar className="w-4 h-4" />;
      case "semana":
        return <CalendarDays className="w-4 h-4" />;
      case "mes":
        return <CalendarRange className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const renderPrecio = () => {
    if (esAlquiler) {
      const precioMasBajo = obtenerPrecioMasBajo();

      if (!precioMasBajo) {
        return (
          <div className="text-sm text-muted-foreground">
            <span className="font-semibold text-yellow-600">
              Precios disponibles
            </span>
          </div>
        );
      }

      const cantidadPrecios = [
        animal.precioHora,
        animal.precioDia,
        animal.precioSemana,
        animal.precioMes,
      ].filter((p) => p != null && Number(p) > 0).length;

      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {getTimeIcon(precioMasBajo.unidad)}
            <h3 className="text-2xl font-extrabold text-emerald-600">
              {animal.moneda} {precioMasBajo.valor}
            </h3>
            <span className="text-sm text-muted-foreground">
              /{precioMasBajo.unidad}
            </span>
          </div>
          {cantidadPrecios > 1 && (
            <p className="text-xs text-muted-foreground">
              + {cantidadPrecios - 1}{" "}
              {cantidadPrecios - 1 === 1 ? "opción" : "opciones"} más
            </p>
          )}
          {animal.deposito && (
            <Badge
              variant="outline"
              className="text-xs border-yellow-400 text-yellow-600"
            >
              Depósito:{" "}
              {formatCurrency(animal.montoDeposito ?? 0, animal.moneda)}
            </Badge>
          )}
        </div>
      );
    }

    if (Number(animal.precio_oferta) > 0 && animal.oferta) {
      return (
        <div>
          <p className="text-xs text-muted-foreground line-through">
            {formatCurrency(animal.precio ?? 0, animal.moneda)}
          </p>
          <h3 className="text-2xl font-extrabold text-emerald-600">
            {formatCurrency(animal.precio_oferta, animal.moneda)}
          </h3>
        </div>
      );
    }

    return (
      <h3 className="text-2xl font-extrabold text-emerald-600">
        {formatCurrency(animal.precio ?? 0, animal.moneda)}
      </h3>
    );
  };

  const getDisponibilidadInfo = () => {
    if (!esAlquiler) return null;

    const tienePrecios = [
      animal.precioHora,
      animal.precioDia,
      animal.precioSemana,
      animal.precioMes,
    ].some((p) => p != null && Number(p) > 0);

    if (!tienePrecios) return null;

    return (
      <Badge
        variant="secondary"
        className="text-xs bg-blue-50 text-blue-600 border-blue-200"
      >
        Disponible para alquiler
      </Badge>
    );
  };

  return (
    <Card
      onClick={() => linkCardAnimal(animal)}
      className="group overflow-hidden hover:cursor-pointer rounded-2xl border-0 py-0 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      <div className="relative overflow-hidden">
        <Image
          src={image}
          alt={animal.nombre}
          unoptimized
          width={800}
          height={600}
          className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {esAlquiler && (
            <Badge className="bg-blue-500 hover:bg-blue-600 text-white">
              Alquiler
            </Badge>
          )}
          {animal.oferta && !esAlquiler && (
            <Badge className="bg-red-500 hover:bg-red-600 text-white">
              Oferta
            </Badge>
          )}
        </div>
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

          {getDisponibilidadInfo()}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-5">
        {renderPrecio()}
      </CardFooter>
    </Card>
  );
};

export default CardMarketAnimal;
