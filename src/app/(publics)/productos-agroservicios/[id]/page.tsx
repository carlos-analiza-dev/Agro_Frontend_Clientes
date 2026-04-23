"use client";
import { Button } from "@/components/ui/button";
import { MessageSquarePlus, CheckCircle, Share2 } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/providers/store/useAuthStore";
import useGetProductoById from "@/hooks/productos/useGetProductoById";
import { MessageError } from "@/components/generics/MessageError";
import useGetSucursalesPais from "@/hooks/sucursales/useGetSucursalesPais";
import useGetExistenciaProductoBySucursal from "@/hooks/productos/useGetExistenciaProductoBySucursal";
import { useFavoritos } from "@/hooks/favoritos/useFavoritos";
import { CarouselApi } from "@/components/ui/carousel";
import useGetOpinionesByProducto from "@/hooks/opiniones/useGetOpinionesByProducto";
import useGetRatingProducto from "@/hooks/rating/useGetRatingProducto";
import useGetProductoCompradoByCliente from "@/hooks/pedidos/useGetProductoCompradoByCliente";
import useGetProductoOpinadoCliente from "@/hooks/opiniones/useGetProductoOpinadoCliente";
import Paginacion from "@/components/generics/Paginacion";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import ButtonBack from "@/components/generics/ButtonBack";
import CardDetailsProducto from "@/components/products/CardDetailsProducto";
import DetailsProducto from "@/components/products/DetailsProducto";
import FormOpinionProducto from "@/components/products/FormOpinionProducto";
import CardRatingResumen from "@/components/products/CardRatingResumen";
import CardOpinionesProducto from "@/components/products/CardOpinionesProducto";
import NoOpiniones from "@/components/products/NoOpiniones";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "react-toastify";

const ProductDetailsPage = () => {
  const { id: productoId } = useParams();
  const router = useRouter();
  const { esFavorito, toggleFavorito } = useFavoritos();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { cliente } = useAuthStore();
  const paisStorage = localStorage.getItem("selectedCountry");
  const pais = paisStorage ? JSON.parse(paisStorage) : null;
  const paisId = pais?.id;
  const moneda = pais?.simbolo_moneda as string;

  useEffect(() => {
    if (!paisId) {
      router.push("/not-selected-country");
    }
  }, [paisId, router]);

  const limit = 5;
  const [offset, setOffset] = useState(0);

  const [mostrarFormOpinion, setMostrarFormOpinion] = useState(false);

  const {
    data: sucursales,
    isLoading: isLoadingSucursales,
    isError: isErrorSucursales,
  } = useGetSucursalesPais(paisId);

  const [sucursalId, setSucursalId] = useState<string>("");

  const {
    data: existencia,
    isLoading: isLoadingExistencia,
    isError: isErrorExistencia,
    refetch: refetchExistencia,
  } = useGetExistenciaProductoBySucursal(productoId as string, sucursalId);

  const {
    data: producto,
    isError: isErrorProducto,
    isLoading: isLoadingProducto,
    refetch: refetchProducto,
  } = useGetProductoById(productoId as string);

  const { data: opiniones_producto, refetch: refetchOpiniones } =
    useGetOpinionesByProducto({
      productoId: productoId as string,
      limit: limit,
      offset: offset,
    });

  const totalPages = opiniones_producto
    ? Math.ceil(opiniones_producto.total / limit)
    : 1;
  const currentPage = Math.floor(offset / limit) + 1;

  const handlePageChange = (page: number) => {
    setOffset((page - 1) * limit);
  };

  const { data: rating_producto } = useGetRatingProducto(productoId as string);

  const { data: producto_comprado } = useGetProductoCompradoByCliente(
    productoId as string,
  );

  const { data: producto_opinado } = useGetProductoOpinadoCliente(
    productoId as string,
  );

  const isFavorite = producto ? esFavorito(producto.id) : false;

  useEffect(() => {
    if (sucursales && sucursales.length > 0 && !sucursalId) {
      setSucursalId(sucursales[0].id);
    }
  }, [sucursales, sucursalId]);

  const getPrecio = () => {
    if (!producto?.preciosPorPais || producto.preciosPorPais.length === 0) {
      return "0.00";
    }
    return producto.preciosPorPais[0].precio || "0.00";
  };

  const getCantidadDisponible = () => {
    if (!existencia || !sucursalId) return 0;
    return existencia || 0;
  };

  const getNombreSucursalSeleccionada = () => {
    if (!sucursales || !sucursalId) return "";
    const sucursal = sucursales.find((s) => s.id === sucursalId);
    return sucursal?.nombre || "";
  };

  const [quantity, setQuantity] = useState(1);
  const [totalPrecio, setTotalPrecio] = useState(0);
  const [notas, setNotas] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const handleToggleFavorite = () => {
    if (producto) {
      toggleFavorito(producto);
    }
  };

  const handleOpinionSuccess = () => {
    setMostrarFormOpinion(false);
    refetchOpiniones();
  };

  useEffect(() => {
    if (carouselApi && selectedImageIndex !== undefined) {
      carouselApi.scrollTo(selectedImageIndex);
    }
  }, [selectedImageIndex, carouselApi]);

  useEffect(() => {
    if (!carouselApi) return;

    const handleSelect = () => {
      setSelectedImageIndex(carouselApi.selectedScrollSnap());
    };

    carouselApi.on("select", handleSelect);
    return () => {
      carouselApi.off("select", handleSelect);
    };
  }, [carouselApi]);

  const handleIncrease = () => {
    const cantidadDisponible = getCantidadDisponible();
    if (producto && quantity < cantidadDisponible) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const onRefresh = useCallback(async () => {
    await refetchProducto();
    if (sucursalId) {
      await refetchExistencia();
    }
  }, [refetchProducto, refetchExistencia, sucursalId]);

  const handleSucursalChange = (value: string) => {
    setSucursalId(value);
    setQuantity(1);
  };

  const getImagenes = () => {
    if (producto?.imagenes && producto.imagenes.length > 0) {
      return producto.imagenes;
    }

    return [
      {
        id: "default",
        url: "/images/ProductNF.png",
        key: "default",
        mimeType: "image/jpeg",
      },
    ];
  };

  const imagenes = getImagenes();

  useEffect(() => {
    const precio = getPrecio();
    const total = quantity * Number(precio);
    setTotalPrecio(total);
  }, [quantity, producto]);

  const handleShareWhatsApp = () => {
    const urlBase = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

    const productUrl = `${urlBase}/productos-agroservicios/${productoId}`;

    const precio = getPrecio();
    const simboloMoneda = moneda || "L.";

    const mensaje = encodeURIComponent(
      `🌟 *${producto?.nombre}* 🌟\n\n` +
        `💰 *Precio:* ${simboloMoneda} ${parseFloat(precio).toFixed(2)}\n` +
        `${producto?.marca?.nombre ? `🏷️ *Marca:* ${producto.marca.nombre}\n` : ""}` +
        `${producto?.categoria?.nombre ? `📂 *Categoría:* ${producto.categoria.nombre}\n` : ""}\n` +
        `${isAvailable ? "✅ Disponible" : "❌ No disponible"}\n\n` +
        `🔗 ${productUrl}\n\n` +
        `¡Encuéntralo en Agroservicios!`,
    );

    window.open(`https://wa.me/?text=${mensaje}`, "_blank");
  };

  const handleShareFacebook = () => {
    const urlBase = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const productUrl = `${urlBase}/productos-agroservicios/${productoId}`;
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
      "_blank",
    );
  };

  const handleShareTwitter = () => {
    const urlBase = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const productUrl = `${urlBase}/productos-agroservicios/${productoId}`;
    const text = encodeURIComponent(`¡Mira este producto! ${producto?.nombre}`);
    window.open(
      `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(productUrl)}`,
      "_blank",
    );
  };

  const handleCopyLink = async () => {
    const urlBase = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
    const productUrl = `${urlBase}/productos-agroservicios/${productoId}`;
    try {
      await navigator.clipboard.writeText(productUrl);
    } catch (err) {
      toast.error("Error al copiar el link");
    }
  };

  if (isErrorSucursales || isErrorProducto) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <MessageError
          titulo="Error al cargar la información"
          descripcion="Ocurrió un error al cargar los datos del producto o sucursales"
          onPress={onRefresh}
        />
      </div>
    );
  }

  if (isLoadingProducto) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!producto) {
    return (
      <div className="flex items-center justify-center min-h-screen px-4">
        <MessageError
          titulo="No se encontró el producto seleccionado"
          descripcion="El producto que buscas no está disponible"
          onPress={onRefresh}
        />
      </div>
    );
  }

  const isAvailable = producto.disponible && getCantidadDisponible() > 0;
  const cantidadDisponible = getCantidadDisponible();
  const precio = getPrecio();
  const nombreSucursal = getNombreSucursalSeleccionada();

  return (
    <div className="container">
      <div>
        <div className="flex justify-between items-center">
          <ButtonBack isMobil={isMobile} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="gap-2 w-auto">
                <Share2 className="h-4 w-4" />
                {!isMobile && (
                  <span className="hidden sm:inline">Compartir</span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={handleShareWhatsApp}
                className="cursor-pointer"
              >
                <svg
                  className="h-4 w-4 mr-2 text-green-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.514 1.086 3.584l-1.133 3.839 3.951-1.122c1.015.524 2.159.803 3.34.804 3.18 0 5.767-2.587 5.768-5.766.001-3.18-2.586-5.767-5.766-5.767l.001-.001zm0 9.352c-.891 0-1.768-.241-2.529-.692l-.179-.107-2.346.666.736-2.287-.117-.185c-.492-.787-.752-1.689-.752-2.617 0-2.642 2.149-4.79 4.791-4.79 2.642 0 4.79 2.148 4.79 4.79 0 2.642-2.148 4.79-4.79 4.79z" />
                </svg>
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleShareFacebook}
                className="cursor-pointer"
              >
                <svg
                  className="h-4 w-4 mr-2 text-blue-600"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z" />
                </svg>
                Facebook
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleShareTwitter}
                className="cursor-pointer"
              >
                <svg
                  className="h-4 w-4 mr-2 text-sky-500"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Twitter/X
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleCopyLink}
                className="cursor-pointer"
              >
                <svg
                  className="h-4 w-4 mr-2 text-gray-600"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
                Copiar enlace
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          <div className="w-full">
            <CardDetailsProducto
              imagenes={imagenes}
              producto={producto}
              setCarouselApi={setCarouselApi}
              selectedImageIndex={selectedImageIndex}
              setSelectedImageIndex={setSelectedImageIndex}
            />
          </div>

          <div className="lg:h-[700px] lg:overflow-y-scroll">
            <DetailsProducto
              producto={producto}
              isLoadingSucursales={isLoadingSucursales}
              sucursalId={sucursalId}
              handleSucursalChange={handleSucursalChange}
              sucursales={sucursales}
              isLoadingExistencia={isLoadingExistencia}
              isErrorExistencia={isErrorExistencia}
              nombreSucursal={nombreSucursal}
              isAvailable={isAvailable}
              cantidadDisponible={cantidadDisponible}
              moneda={moneda}
              precio={precio}
              handleDecrease={handleDecrease}
              setQuantity={setQuantity}
              quantity={quantity}
              handleIncrease={handleIncrease}
              notas={notas}
              setNotas={setNotas}
              totalPrecio={totalPrecio}
              isFavorite={isFavorite}
              handleToggleFavorite={handleToggleFavorite}
            />
          </div>
        </div>

        <div className="mt-8 lg:mt-12 px-0 sm:px-2 lg:px-4 max-w-6xl mx-auto pb-8 lg:pb-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-xl sm:text-2xl font-bold">
              Opiniones Destacadas
            </h1>

            {cliente && producto_comprado && !producto_opinado && (
              <Button
                onClick={() => setMostrarFormOpinion(!mostrarFormOpinion)}
                variant={mostrarFormOpinion ? "secondary" : "default"}
                className="gap-2 w-full sm:w-auto"
                size="sm"
              >
                <MessageSquarePlus className="h-4 w-4" />
                {mostrarFormOpinion ? "Cancelar" : "Agregar opinión"}
              </Button>
            )}

            {cliente && producto_opinado && (
              <div className="flex items-center gap-2 p-3 border border-green-200 bg-green-50 rounded-lg w-full sm:w-auto">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                <p className="text-xs sm:text-sm font-medium text-green-800">
                  Ya opinaste sobre este producto
                </p>
              </div>
            )}
          </div>

          {mostrarFormOpinion &&
            cliente &&
            producto_comprado &&
            !producto_opinado && (
              <div className="mb-6 lg:mb-8">
                <FormOpinionProducto
                  productoId={productoId as string}
                  productoNombre={producto.nombre}
                  onSuccess={handleOpinionSuccess}
                  onCancel={() => setMostrarFormOpinion(false)}
                />
              </div>
            )}

          {opiniones_producto && opiniones_producto?.opiniones.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="col-span-1">
                <CardRatingResumen rating={rating_producto} />

                {cliente &&
                  producto_comprado &&
                  !producto_opinado &&
                  !mostrarFormOpinion && (
                    <div className="mt-6 p-4 border rounded-lg bg-blue-50">
                      <h3 className="font-semibold text-blue-800 mb-2 text-sm sm:text-base">
                        ¿Te gustó este producto?
                      </h3>
                      <p className="text-xs sm:text-sm text-blue-700 mb-3">
                        Comparte tu experiencia con otros clientes
                      </p>
                      <Button
                        onClick={() => setMostrarFormOpinion(true)}
                        variant="outline"
                        size="sm"
                        className="w-full text-xs sm:text-sm"
                      >
                        Escribir mi opinión
                      </Button>
                    </div>
                  )}
              </div>

              <div className="space-y-6 col-span-1 lg:col-span-2 h-[400px] overflow-y-scroll pr-2">
                {opiniones_producto?.opiniones.map((opinion) => (
                  <CardOpinionesProducto
                    key={opinion.id}
                    opinion={opinion}
                    cliente={cliente}
                  />
                ))}
                {opiniones_producto && opiniones_producto.total > limit && (
                  <div className="mt-4">
                    <Paginacion
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <NoOpiniones
              haComprado={!!producto_comprado}
              onAgregarOpinion={() => setMostrarFormOpinion(true)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
