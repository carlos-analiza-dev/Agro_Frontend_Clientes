"use client";
import AnimalLocationMap from "@/components/marketplace/AnimalLocationMap";
import ImageCarouselMarketAnimal from "@/components/marketplace/ImageCarouselMarketAnimal";
import { ShareButtons } from "@/components/marketplace/ShareButtons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  formatDateLocal,
  formatDateLocalAnyo,
} from "@/helpers/funciones/formatDateOnly";
import useGetAnimalMarketById from "@/hooks/market-animales/useGetAnimalMarketById";
import {
  MessageCircle,
  Pencil,
  Tractor,
  Clock,
  Calendar,
  CalendarDays,
  CalendarRange,
  DollarSign,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useGetAnimalesMarketSugerencias from "@/hooks/market-animales/useGetAnimalesMarketSugerencias";
import CardMarketAnimal from "@/components/marketplace/CardMarketAnimal";
import SkeletonCard from "@/components/generics/SkeletonCard";
import EmptyStateMarketplace from "@/components/marketplace/EmptyStateMarketplace";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { ProductoAnimal } from "@/api/market-animales/interfaces/response-market-animales.interface";
import { GuardarButton } from "@/components/marketplace/GuardarButton";
import PublicacionNoEncontrada from "@/components/marketplace/PublicacionNoEncontrada";
import { ChatModal } from "@/components/chat/ChatModal";
import { TipoPublicacion } from "@/interfaces/enums/market/tipo_publicacion.enum";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import DetailsSkeleton from "@/components/marketplace/DetailsSkeleton";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";
import { marcarPublicacionVendida } from "@/api/market-animales/accions/marcar-vendido";
import { isAxiosError } from "axios";
import Modal from "@/components/generics/Modal";
import { useQueryClient } from "@tanstack/react-query";

const DetailsAnimalesPage = () => {
  const t = useTranslations("DetailsAnimalesPage");
  const { cliente } = useAuthStore();
  const queryClient = useQueryClient();
  const params = useParams();
  const router = useRouter();
  const marketAnimalId = params.id as string;
  const { data: animal, isLoading } = useGetAnimalMarketById(marketAnimalId);
  const tipoProducto = animal?.tipo_producto ? animal.tipo_producto.id : "";
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isMarkingSold, setIsMarkingSold] = useState(false);
  const [isPublicationMarked, setIsPublicationMarked] = useState(false);
  const { data: animales_market, isLoading: cargando } =
    useGetAnimalesMarketSugerencias({
      categoriaId: animal?.categoria.id,
      subcategoriaId: animal?.subcategoria.id,
      tipoProductoId: tipoProducto,
    });

  const esAlquiler = animal?.tipo_publicacion === TipoPublicacion.ALQUILERES;

  const handleClickEdit = (producto: ProductoAnimal) => {
    router.push(`/marketplace/mis-publicaciones/${producto.id}`);
  };

  const animales =
    animales_market?.pages.flatMap((page) => page.productos) ?? [];

  const filtersAnimales = animales.filter((item) => item.id !== marketAnimalId);

  const [message, setMessage] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");

  useEffect(() => {
    setCurrentUrl(window.location.href);
  }, []);

  useEffect(() => {
    if (animal?.vendedor?.nombre) {
      setMessage(`Hola, ${animal.vendedor.nombre}. ¿Sigue disponible?`);
    }
  }, [animal?.vendedor?.nombre]);

  const getTimeIcon = (unidad: string) => {
    switch (unidad) {
      case "hora":
        return <Clock className="w-5 h-5" />;
      case "día":
        return <Calendar className="w-5 h-5" />;
      case "semana":
        return <CalendarDays className="w-5 h-5" />;
      case "mes":
        return <CalendarRange className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const obtenerPreciosAlquiler = () => {
    const precios = [];
    if (animal?.precioHora && Number(animal.precioHora) > 0) {
      precios.push({
        label: t("prices.perHour"),
        valor: animal.precioHora,
        unidad: "hora",
        icon: getTimeIcon("hora"),
      });
    }
    if (animal?.precioDia && Number(animal.precioDia) > 0) {
      precios.push({
        label: t("prices.perDay"),
        valor: animal.precioDia,
        unidad: "día",
        icon: getTimeIcon("día"),
      });
    }
    if (animal?.precioSemana && Number(animal.precioSemana) > 0) {
      precios.push({
        label: t("prices.perWeek"),
        valor: animal.precioSemana,
        unidad: "semana",
        icon: getTimeIcon("semana"),
      });
    }
    if (animal?.precioMes && Number(animal.precioMes) > 0) {
      precios.push({
        label: t("prices.perMonth"),
        valor: animal.precioMes,
        unidad: "mes",
        icon: getTimeIcon("mes"),
      });
    }
    return precios;
  };

  const handleMarkAsSold = async () => {
    try {
      setIsMarkingSold(true);

      await marcarPublicacionVendida(marketAnimalId);

      setIsPublicationMarked(true);
      setIsConfirmModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ["mis-publicaciones"] });
      queryClient.invalidateQueries({ queryKey: ["publicaciones"] });
      toast.success(
        t("messages.markSuccess", {
          status: textVendido,
        }),
      );
    } catch (error) {
      const message = isAxiosError(error)
        ? error.response?.data?.message || t("messages.markError")
        : t("messages.markError");

      toast.error(message);
    } finally {
      setIsMarkingSold(false);
    }
  };

  const renderPrecio = () => {
    if (esAlquiler) {
      const precios = obtenerPreciosAlquiler();

      if (precios.length === 0) {
        return (
          <div className="mt-3">
            <p className="text-lg font-semibold text-yellow-600">
              {t("prices.availablePrices")}
            </p>
          </div>
        );
      }

      return (
        <div className="mt-3 space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {precios.map((precio, index) => (
              <div
                key={index}
                className="bg-gray-50 p-3 rounded-lg border border-gray-200"
              >
                <div className="flex items-center gap-2">
                  {precio.icon}
                  <span className="text-sm text-gray-600">{precio.label}</span>
                </div>
                <p className="text-xl font-bold text-blue-600">
                  {formatCurrency(precio.valor, animal.moneda)}
                </p>
              </div>
            ))}
          </div>
          {animal?.deposito && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-700">
                  {t("prices.securityDeposit")}
                </p>
                <p className="text-sm text-yellow-600">
                  {formatCurrency(animal.montoDeposito ?? 0, animal.moneda)}
                </p>
              </div>
            </div>
          )}
          <p className="text-xs text-gray-500">{t("prices.rentalHint")}</p>
        </div>
      );
    }

    if (Number(animal?.precio_oferta) > 0 && animal?.oferta) {
      return (
        <div className="mt-3">
          <p className="text-sm text-gray-400 line-through">
            {formatCurrency(animal.precio ?? 0, animal.moneda)}
          </p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(animal.precio_oferta ?? 0, animal.moneda)}
          </p>
        </div>
      );
    }

    return (
      <p className="mt-3 text-2xl font-bold text-green-600">
        {formatCurrency(animal?.precio ?? 0, animal?.moneda ?? "$")}
      </p>
    );
  };

  const renderTipoBadge = () => {
    if (esAlquiler) {
      return (
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          <Clock className="w-4 h-4" />
          {t("badges.availableForRent")}
        </div>
      );
    }
    return null;
  };

  const getEstadoDescripcion = () => {
    if (esAlquiler) {
      return t("rentalInfo.rentDescription");
    }
    return t("rentalInfo.purchaseDescription");
  };

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (!animal) {
    return <PublicacionNoEncontrada mensaje={t("notFound.message")} />;
  }

  const isVendido = animal.vendido === true || isPublicationMarked;
  const esMiPublicacion = cliente?.id === animal.vendedor.id;

  const textVendido = esAlquiler ? t("status.rented") : t("status.sold");
  const textVendidoCapitalized = esAlquiler
    ? t("status.rentedCapitalized")
    : t("status.soldCapitalized");

  return (
    <div className="container mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <ImageCarouselMarketAnimal images={animal?.imagenes ?? []} />
        </div>
        <div className="md:p-5">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-black">{animal?.nombre}</h1>
            {renderTipoBadge()}
          </div>

          {renderPrecio()}

          <p className="mt-3 text-sm text-gray-500">
            {t("publishedAt", {
              date: formatDateLocal(animal?.created_at ?? ""),
            })}
            , {animal?.direccion}
          </p>

          {isVendido ? (
            <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-600 font-medium">
                {t("status.alreadyStatus", { status: textVendido })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t("status.unavailableFor", {
                  action: esAlquiler
                    ? t("status.rental")
                    : t("status.purchase"),
                })}
              </p>
            </div>
          ) : (
            <>
              {!esMiPublicacion ? (
                <div className="flex flex-wrap items-center gap-3 w-full mt-5">
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white flex-1 sm:flex-none"
                    title={t("buttons.sendMessage")}
                    onClick={() => setIsChatOpen(true)}
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    {esAlquiler
                      ? t("buttons.checkAvailability")
                      : t("buttons.sendMessage")}
                  </Button>
                  <GuardarButton
                    producto={animal}
                    variant="icon"
                    className="bg-gray-100 hover:bg-gray-200"
                    showToast={true}
                  />
                  <ShareButtons
                    title={animal.nombre}
                    description={`${animal.descripcion.slice(0, 100)}... ${
                      esAlquiler
                        ? t("share.rentalPricesAvailable")
                        : t("share.priceValue", {
                            currency: animal.moneda ?? "$",
                            price: animal.precio ?? 0,
                          })
                    }`}
                    url={currentUrl}
                    imageUrl={animal.imagenes?.[0]?.url}
                    variant="dropdown"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                  />
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 w-full mt-5">
                  <Button
                    className="bg-gray-200 hover:bg-gray-100 text-black flex-1 sm:flex-none"
                    variant="outline"
                    title={t("buttons.editPublication")}
                    onClick={() => handleClickEdit(animal)}
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    {t("buttons.edit")}
                  </Button>
                  <ShareButtons
                    title={animal.nombre}
                    description={`${animal.descripcion.slice(0, 100)}... ${
                      esAlquiler
                        ? t("share.rentalPricesAvailable")
                        : t("share.priceValue", {
                            currency: animal.moneda ?? "$",
                            price: animal.precio ?? 0,
                          })
                    }`}
                    url={currentUrl}
                    imageUrl={animal.imagenes?.[0]?.url}
                    variant="dropdown"
                    className="bg-gray-100 text-gray-700 hover:bg-gray-200"
                  />
                </div>
              )}
            </>
          )}

          <div className="mt-6">
            <p className="text-xl font-bold">
              {t("sections.sellerDescription")}
            </p>
            <p className="mt-3 text-gray-700 leading-relaxed">
              {animal?.descripcion}
            </p>
            {esAlquiler && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  📋{" "}
                  <span className="font-medium">{t("rentalInfo.label")}</span>{" "}
                  {getEstadoDescripcion()}
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <p className="text-xl font-bold mb-3">{t("sections.location")}</p>
            <AnimalLocationMap direccion={animal?.direccion ?? ""} />
          </div>

          <div className="mt-6">
            <p className="text-xl font-bold">{t("sections.sellerInfo")}</p>
            <div className="flex gap-3 items-center mt-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={
                    animal?.vendedor && animal?.vendedor.imagenes?.length > 0
                      ? animal.vendedor.imagenes[0].url
                      : "/images/ProfileImage.png"
                  }
                  alt={`image-${animal?.id}`}
                />
                <AvatarFallback>
                  {animal?.vendedor.nombre?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-bold">{animal?.vendedor.nombre}</p>

                <p className="text-sm text-gray-500">
                  {animal.vendedor.verificado &&
                  animal.vendedor.tienePaqueteActivo &&
                  animal.vendedor.paqueteActivo?.nombre !== "Plan Free"
                    ? t("seller.verified")
                    : t("seller.notVerified")}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3 items-center text-gray-600">
            <Tractor size={20} />
            <p className="text-sm">
              {t("seller.joinedAt", {
                year: formatDateLocalAnyo(animal?.vendedor.create ?? ""),
              })}
            </p>
          </div>

          <Separator className="mt-6" />

          {!isVendido && (
            <>
              {!esMiPublicacion ? (
                <div className="mt-6">
                  <div className="mt-4 flex items-center gap-2">
                    <MessageCircle size={20} className="text-green-500" />
                    <p className="font-medium">
                      {esAlquiler
                        ? t("contact.rentalQuestion")
                        : t("contact.infoQuestion")}
                    </p>
                  </div>
                  <div className="mt-3">
                    <Button
                      onClick={() => setIsChatOpen(true)}
                      className="w-full bg-green-600 hover:bg-green-700"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      {esAlquiler
                        ? t("buttons.checkAvailability")
                        : t("buttons.chatWithSeller")}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="mt-6 mb-5">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => setIsConfirmModalOpen(true)}
                  >
                    {t("buttons.markAsStatus", { status: textVendido })}
                  </Button>
                </div>
              )}
            </>
          )}

          {isVendido && esMiPublicacion && (
            <div className="mt-6 mb-5 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-green-700 font-medium">
                {t("status.markedAsStatus", { status: textVendido })}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {t("status.usersCannotInteract", {
                  users: esAlquiler ? t("status.tenants") : t("status.buyers"),
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {!isVendido && !esMiPublicacion && filtersAnimales.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-black mb-6">{t("suggestions.title")}</h2>
          {cargando ? (
            <SkeletonCard />
          ) : filtersAnimales.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {filtersAnimales.slice(0, 4).map((animalItem) => (
                <CardMarketAnimal
                  key={animalItem.id}
                  animal={animalItem}
                  link_page={`/marketplace/animales/${animal.id}`}
                  isAuthenticated={true}
                />
              ))}
            </div>
          ) : (
            <EmptyStateMarketplace
              variant="error"
              isLoading={false}
              description={t("suggestions.emptyDescription")}
            />
          )}
        </div>
      )}

      <ChatModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        product={animal}
        seller={animal.vendedor}
        buyerId={cliente?.id || ""}
      />
      <Modal
        open={isConfirmModalOpen}
        onOpenChange={setIsConfirmModalOpen}
        title={t("confirmModal.title", { status: textVendidoCapitalized })}
        description={t("confirmModal.description", {
          status: textVendido,
        })}
        size="md"
        showCloseButton={!isMarkingSold}
      >
        <div className="space-y-5">
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <p className="text-sm text-yellow-800">
              {t("confirmModal.warning")}
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isMarkingSold}
              onClick={() => setIsConfirmModalOpen(false)}
            >
              {t("confirmModal.cancel")}
            </Button>

            <Button
              type="button"
              className="bg-green-600 text-white hover:bg-green-700"
              disabled={isMarkingSold}
              onClick={handleMarkAsSold}
            >
              {isMarkingSold
                ? t("confirmModal.processing")
                : t("confirmModal.confirm")}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DetailsAnimalesPage;
