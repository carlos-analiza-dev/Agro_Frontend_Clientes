import { eliminarPublicacion } from "@/api/market-animales/accions/eliminar-publicacion";
import { marcarPublicacionVendida } from "@/api/market-animales/accions/marcar-vendido";
import { ProductoPublish } from "@/api/market-animales/interfaces/response-publicaciones.interface";
import Modal from "@/components/generics/Modal";
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
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { formatDateLocal } from "@/helpers/funciones/formatDateOnly";
import useGetViewsPublicacion from "@/hooks/views-publicaciones/useGetViewsPublicacion";
import { TipoPublicacion } from "@/interfaces/enums/market/tipo_publicacion.enum";
import { useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  Check,
  Eye,
  MapPin,
  MoreHorizontal,
  Pencil,
  Trash2,
  ImageOff,
  Clock,
  Calendar,
  CalendarDays,
  CalendarRange,
  DollarSign,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface Props {
  producto: ProductoPublish;
}

const MisPublicacionesCard = ({ producto }: Props) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [openModal, setOpenModal] = useState(false);
  const [openVendido, setOpenVendido] = useState(false);
  const { data: views, isLoading } = useGetViewsPublicacion(producto.id);
  const [imageError, setImageError] = useState(false);

  const esAlquiler = producto.tipo_publicacion === TipoPublicacion.ALQUILERES;

  const handleViewModal = () => {
    setOpenModal(true);
  };

  const handleDelete = async () => {
    try {
      await eliminarPublicacion(producto.id);
      queryClient.invalidateQueries({ queryKey: ["animales-market"] });
      queryClient.invalidateQueries({
        queryKey: ["animales-market-sugerencias"],
      });
      queryClient.invalidateQueries({ queryKey: ["mis-publicaciones"] });
      if (producto?.id) {
        queryClient.invalidateQueries({
          queryKey: ["animal-market-id", producto.id],
        });
      }
      toast.success("Publicacion eliminada con exito");
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error al eliminar la publicación";
        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado al eliminar la publicación");
      }
    }
  };

  const handleClickEdit = () => {
    router.push(`/marketplace/mis-publicaciones/${producto.id}`);
  };

  const handleLinkPublicacion = (publicacion: ProductoPublish) => {
    router.push(`/marketplace/animales/${publicacion.id}`);
  };

  const handleVendido = async (id: string) => {
    try {
      await marcarPublicacionVendida(id);
      queryClient.invalidateQueries({ queryKey: ["animales-market"] });
      queryClient.invalidateQueries({
        queryKey: ["animales-market-sugerencias"],
      });
      queryClient.invalidateQueries({ queryKey: ["mis-publicaciones"] });
      if (producto?.id) {
        queryClient.invalidateQueries({
          queryKey: ["animal-market-id", producto.id],
        });
      }
      setOpenVendido(false);
      toast.success("Publicacion Marcada como Vendida");
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error al eliminar la publicación";
        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado al marcar la publicación");
      }
    }
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

  const obtenerPrecioMasBajo = () => {
    const precios = [];
    if (producto.precioPorHora && producto.precioPorHora > 0)
      precios.push({ valor: producto.precioPorHora, unidad: "hora" });
    if (producto.precioPorDia && producto.precioPorDia > 0)
      precios.push({ valor: producto.precioPorDia, unidad: "día" });
    if (producto.precioPorSemana && producto.precioPorSemana > 0)
      precios.push({ valor: producto.precioPorSemana, unidad: "semana" });
    if (producto.precioPorMes && producto.precioPorMes > 0)
      precios.push({ valor: producto.precioPorMes, unidad: "mes" });

    if (precios.length === 0) return null;

    const masBajo = precios.reduce((min, p) => (p.valor < min.valor ? p : min));
    return masBajo;
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

      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {getTimeIcon(precioMasBajo.unidad)}
            <p className="text-2xl font-black text-blue-600">
              {formatCurrency(precioMasBajo.valor, producto.moneda)}
            </p>
            <span className="text-sm text-muted-foreground">
              /{precioMasBajo.unidad}
            </span>
          </div>
          {producto.requiereDeposito && (
            <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded-full">
              <DollarSign className="w-3 h-3" />
              Depósito:
              {formatCurrency(producto.montoDeposito ?? 0, producto.moneda)}
            </div>
          )}
        </div>
      );
    }

    return (
      <p className="text-2xl font-black text-green-600">
        {formatCurrency(producto.precio, producto.moneda)}
      </p>
    );
  };

  const getTipoBadge = () => {
    if (esAlquiler) {
      return (
        <Badge className="bg-blue-500 hover:bg-blue-500 shadow-sm">
          Alquiler
        </Badge>
      );
    }
    return null;
  };

  return (
    <>
      <Card className="overflow-hidden border-0 shadow-md rounded-3xl transition-all hover:shadow-lg hover:-translate-y-1 duration-300">
        <div className="relative w-full bg-gradient-to-br from-gray-100 to-gray-200">
          <div className="relative pt-[75%]">
            {imageError ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100">
                <ImageOff className="w-12 h-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 text-center px-4">
                  Imagen no disponible
                </p>
              </div>
            ) : (
              <Image
                src={
                  producto.imagenes?.[0]?.url ?? "/images/Image-not-found.png"
                }
                alt={producto.nombre}
                unoptimized
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={() => setImageError(true)}
                priority={false}
              />
            )}
          </div>

          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {getTipoBadge()}

            {producto.disponible ? (
              <Badge className="bg-green-500 hover:bg-green-500 shadow-sm">
                Disponible
              </Badge>
            ) : (
              <Badge variant="destructive" className="shadow-sm">
                No disponible
              </Badge>
            )}

            {producto.vendido && (
              <Badge className="bg-blue-500 hover:bg-blue-500 shadow-sm">
                Vendido
              </Badge>
            )}
          </div>

          {!producto.vendido && (
            <div className="absolute top-3 right-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="secondary"
                    className="rounded-full shadow-md bg-white/90 backdrop-blur-sm hover:bg-white"
                  >
                    <MoreHorizontal size={18} />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleClickEdit()}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar publicación
                  </DropdownMenuItem>

                  {producto.disponible && !producto.vendido && (
                    <DropdownMenuItem onClick={() => setOpenVendido(true)}>
                      <Check className="mr-2 h-4 w-4" />
                      Marcar como {esAlquiler ? "alquilada" : "vendida"}
                    </DropdownMenuItem>
                  )}

                  <DropdownMenuItem
                    onClick={handleViewModal}
                    className="text-red-600"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Eliminar publicación
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}

          {producto.imagenes && producto.imagenes.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              📸 +{producto.imagenes.length}
            </div>
          )}
        </div>

        <CardContent className="p-5">
          <h2 className="font-bold text-xl line-clamp-1 hover:text-green-600 transition-colors">
            {producto.nombre}
          </h2>

          <div className="mt-3">{renderPrecio()}</div>

          <div className="flex items-start gap-2 text-muted-foreground mt-3">
            <MapPin size={16} className="mt-0.5 flex-shrink-0" />
            <p className="text-sm line-clamp-2">{producto.direccion}</p>
          </div>

          <p className="text-xs text-muted-foreground mt-2">
            Publicado el {formatDateLocal(producto.created_at)}
          </p>

          <Separator className="my-4" />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Eye size={18} className="text-gray-500" />
              {isLoading ? (
                <Skeleton className="h-4 w-16" />
              ) : (
                <span className="text-sm font-medium">
                  {views?.totalVisualizaciones ?? 0} vistas
                </span>
              )}
            </div>
          </div>

          <div className="mt-5">
            <Button
              onClick={() => handleLinkPublicacion(producto)}
              className="w-full rounded-xl bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300"
            >
              Ver publicación
            </Button>
          </div>
        </CardContent>
      </Card>

      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title="Eliminar publicación"
        description="Esta acción es permanente. No podrás recuperar la publicación ni sus imágenes."
        showCloseButton={false}
      >
        <div className="p-6 space-y-5">
          <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-red-500" />
            <div className="text-sm text-red-700">
              Estás a punto de eliminar esta publicación de forma permanente.
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpenModal(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>

            <Button
              onClick={handleDelete}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
            >
              Eliminar publicación
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        open={openVendido}
        onOpenChange={setOpenVendido}
        title={`Marcar publicación como ${esAlquiler ? "alquilada" : "vendida"}`}
        description={`Esta acción es permanente. Una vez marques como ${esAlquiler ? "alquilada" : "vendida"}, no se puede restablecer`}
        showCloseButton={false}
      >
        <div className="p-6 space-y-5">
          <div className="flex items-start gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500" />
            <div className="text-sm text-green-700">
              Estás a punto de marcar esta publicación como{" "}
              {esAlquiler ? "alquilada" : "vendida"}.
            </div>
          </div>

          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpenVendido(false)}
              className="w-full sm:w-auto"
            >
              Cancelar
            </Button>

            <Button
              onClick={() => handleVendido(producto.id)}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
            >
              Marcar publicación
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default MisPublicacionesCard;
