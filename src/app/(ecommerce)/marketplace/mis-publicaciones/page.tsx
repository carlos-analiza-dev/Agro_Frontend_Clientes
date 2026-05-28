"use client";
import Image from "next/image";
import {
  Eye,
  Heart,
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import useGetMisPublicaciones from "@/hooks/market-animales/useGetMisPublicaciones";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDateLocal } from "@/helpers/funciones/formatDateOnly";
import SkeletonCard from "@/components/generics/SkeletonCard";

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
            <Card
              key={producto.id}
              className="overflow-hidden border-0 shadow-md rounded-3xl"
            >
              <div className="relative h-[250px] w-full">
                <Image
                  src={
                    producto.imagenes?.[0]?.url ?? "/images/Image-not-found.png"
                  }
                  alt={producto.nombre}
                  unoptimized
                  width={500}
                  height={600}
                  className="object-cover"
                />

                <div className="absolute top-3 left-3 flex gap-2">
                  {producto.disponible ? (
                    <Badge className="bg-green-500 hover:bg-green-500">
                      Disponible
                    </Badge>
                  ) : (
                    <Badge variant="destructive">No disponible</Badge>
                  )}

                  {producto.vendido && (
                    <Badge className="bg-blue-500 hover:bg-blue-500">
                      Vendido
                    </Badge>
                  )}
                </div>

                <div className="absolute top-3 right-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        variant="secondary"
                        className="rounded-full"
                      >
                        <MoreHorizontal size={18} />
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>

                      <DropdownMenuItem className="text-red-500">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <CardContent className="p-4">
                <h2 className="font-black text-xl line-clamp-1">
                  {producto.nombre}
                </h2>

                <p className="text-2xl font-black mt-2">
                  {producto.moneda} {producto.precio}
                </p>

                <div className="flex items-center gap-2 text-muted-foreground mt-3">
                  <MapPin size={16} />

                  <p className="text-sm line-clamp-1">{producto.direccion}</p>
                </div>

                <p className="text-sm text-muted-foreground mt-2">
                  Publicado el {formatDateLocal(producto.created_at)}
                </p>

                <Separator className="my-4" />

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Eye size={18} />
                    <span className="text-sm">{producto.views} vistas</span>
                  </div>

                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Heart size={18} />
                    <span className="text-sm">
                      {producto.favoritos} favoritos
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <Button variant="outline" className="rounded-xl">
                    Editar
                  </Button>

                  <Button className="rounded-xl">Ver publicación</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisPublicacionesPage;
