import { ProductoPublish } from "@/api/market-animales/interfaces/response-publicaciones.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { formatDateLocal } from "@/helpers/funciones/formatDateOnly";
import {
  Check,
  Eye,
  Heart,
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  producto: ProductoPublish;
}

const MisPublicacionesCard = ({ producto }: Props) => {
  const router = useRouter();
  const handleClickEdit = (productoEdit: ProductoPublish) => {
    router.push(`/marketplace/mis-publicaciones/${producto.id}`);
  };

  const handleLinkPublicacion = (publicacion: ProductoPublish) => {
    router.push(`/marketplace/animales/${publicacion.id}`);
  };
  return (
    <Card className="overflow-hidden border-0 shadow-md rounded-3xl">
      <div className="relative h-[250px] w-full">
        <Image
          src={producto.imagenes?.[0]?.url ?? "/images/Image-not-found.png"}
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
            <Badge className="bg-blue-500 hover:bg-blue-500">Vendido</Badge>
          )}
        </div>

        <div className="absolute top-3 right-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="icon" variant="secondary" className="rounded-full">
                <MoreHorizontal size={18} />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleClickEdit(producto)}>
                <Pencil className="mr-2 h-4 w-4" />
                Editar
              </DropdownMenuItem>

              <DropdownMenuItem className="text-red-500">
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar
              </DropdownMenuItem>
              <DropdownMenuItem className="text-green-500">
                <Check className="mr-2 h-4 w-4" />
                Marcar como vendida
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <CardContent className="p-4">
        <h2 className="font-black text-xl line-clamp-1">{producto.nombre}</h2>

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
            <span className="text-sm">{producto.favoritos} favoritos</span>
          </div>
        </div>

        <div className="mt-5 ">
          <Button
            onClick={() => handleLinkPublicacion(producto)}
            className="w-full rounded-xl bg-green-500 hover:bg-green-700"
          >
            Ver publicación
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MisPublicacionesCard;
