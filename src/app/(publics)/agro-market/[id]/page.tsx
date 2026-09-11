"use client";

import useGetAnimalMarketByIdPublic from "@/hooks/market-animales/useGetAnimalMarketByIdPublic";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import ImageCarouselMarketAnimal from "@/components/marketplace/ImageCarouselMarketAnimal";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  formatDateLocal,
  formatDateLocalAnyo,
} from "@/helpers/funciones/formatDateOnly";
import {
  MessageCircle,
  Tractor,
  Clock,
  Calendar,
  CalendarDays,
  CalendarRange,
  DollarSign,
  Lock,
  MapPin,
  Sparkles,
  Crown,
  ShieldCheck,
} from "lucide-react";
import PublicacionNoEncontrada from "@/components/marketplace/PublicacionNoEncontrada";
import { TipoPublicacion } from "@/interfaces/enums/market/tipo_publicacion.enum";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import DetailsSkeleton from "@/components/marketplace/DetailsSkeleton";
import AlertNotLogued from "@/components/marketplace/AlertNotLogued";

const DetailsPublicacionesPage = () => {
  const params = useParams();
  const router = useRouter();
  const marketAnimalId = params.id as string;
  const { data: publicacion, isLoading } =
    useGetAnimalMarketByIdPublic(marketAnimalId);

  const [showPlanAlert, setShowPlanAlert] = useState(false);

  const esAlquiler =
    publicacion?.tipo_publicacion === TipoPublicacion.ALQUILERES;

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
    if (publicacion?.precioHora && Number(publicacion.precioHora) > 0) {
      precios.push({
        label: "Por hora",
        valor: publicacion.precioHora,
        unidad: "hora",
        icon: getTimeIcon("hora"),
      });
    }
    if (publicacion?.precioDia && Number(publicacion.precioDia) > 0) {
      precios.push({
        label: "Por día",
        valor: publicacion.precioDia,
        unidad: "día",
        icon: getTimeIcon("día"),
      });
    }
    if (publicacion?.precioSemana && Number(publicacion.precioSemana) > 0) {
      precios.push({
        label: "Por semana",
        valor: publicacion.precioSemana,
        unidad: "semana",
        icon: getTimeIcon("semana"),
      });
    }
    if (publicacion?.precioMes && Number(publicacion.precioMes) > 0) {
      precios.push({
        label: "Por mes",
        valor: publicacion.precioMes,
        unidad: "mes",
        icon: getTimeIcon("mes"),
      });
    }
    return precios;
  };

  const renderPrecio = () => {
    if (esAlquiler) {
      const precios = obtenerPreciosAlquiler();

      if (precios.length === 0) {
        return (
          <div className="mt-3">
            <p className="text-lg font-semibold text-yellow-600">
              Precios disponibles
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
                  {formatCurrency(precio.valor, publicacion.moneda)}
                </p>
              </div>
            ))}
          </div>
          {publicacion?.deposito && (
            <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <DollarSign className="w-5 h-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-yellow-700">
                  Depósito de garantía
                </p>
                <p className="text-sm text-yellow-600">
                  {formatCurrency(
                    publicacion.montoDeposito ?? 0,
                    publicacion.moneda,
                  )}
                </p>
              </div>
            </div>
          )}
        </div>
      );
    }

    if (Number(publicacion?.precio_oferta) > 0 && publicacion?.oferta) {
      return (
        <div className="mt-3">
          <p className="text-sm text-gray-400 line-through">
            {formatCurrency(publicacion.precio ?? 0, publicacion.moneda)}
          </p>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(publicacion.precio_oferta ?? 0, publicacion.moneda)}
          </p>
        </div>
      );
    }

    return (
      <p className="mt-3 text-2xl font-bold text-green-600">
        {formatCurrency(publicacion?.precio ?? 0, publicacion?.moneda ?? "$")}
      </p>
    );
  };

  const renderTipoBadge = () => {
    if (esAlquiler) {
      return (
        <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
          <Clock className="w-4 h-4" />
          Disponible para alquiler
        </div>
      );
    }
    return null;
  };

  const handleRequirePlan = () => {
    setShowPlanAlert(true);
  };

  if (isLoading) {
    return <DetailsSkeleton />;
  }

  if (!publicacion) {
    return (
      <PublicacionNoEncontrada mensaje="La publicación que buscas no existe, fue eliminada o no está disponible" />
    );
  }

  const isVendido = publicacion.vendido === true;
  const textVendido = esAlquiler ? "alquilado" : "vendido";

  return (
    <div className="container mb-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <ImageCarouselMarketAnimal images={publicacion?.imagenes ?? []} />
        </div>
        <div className="md:p-5">
          <div className="flex items-start justify-between gap-3 flex-wrap">
            <h1 className="text-2xl font-black">{publicacion?.nombre}</h1>
            {renderTipoBadge()}
          </div>

          {renderPrecio()}

          <p className="mt-3 text-sm text-gray-500">
            Publicado {formatDateLocal(publicacion?.created_at ?? "")}
          </p>

          {isVendido ? (
            <div className="mt-5 p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-red-600 font-medium">
                Este producto ya fue {textVendido}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                No está disponible para {esAlquiler ? "alquiler" : "compra"}
              </p>
            </div>
          ) : (
            <div className="mt-5 p-4 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-amber-100 rounded-full shrink-0">
                  <Lock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-amber-800 flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    Información exclusiva para suscriptores
                  </p>
                  <p className="text-sm text-amber-700 mt-1">
                    Para ver la ubicación exacta, contactar al vendedor y
                    obtener más información, necesitas un plan que incluya
                    AgroMarket.
                  </p>
                  <Button
                    onClick={handleRequirePlan}
                    className="mt-3 bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-md"
                    size="sm"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Ver planes disponibles
                  </Button>
                </div>
              </div>
            </div>
          )}

          <div className="mt-6">
            <p className="text-xl font-bold">Descripción</p>
            <p className="mt-3 text-gray-700 leading-relaxed">
              {publicacion?.descripcion}
            </p>
            {esAlquiler && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700">
                  <span className="font-medium">Alquiler:</span> Contacta con el
                  vendedor para más detalles sobre las condiciones.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6">
            <p className="text-xl font-bold mb-3">Ubicación</p>
            <div className="relative rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <div className="h-40 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 flex items-center justify-center">
                <div className="text-center px-4">
                  <MapPin className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-600">
                    Ubicación disponible solo para suscriptores
                  </p>
                  <Button
                    onClick={handleRequirePlan}
                    variant="outline"
                    size="sm"
                    className="mt-3 border-amber-300 text-amber-700 hover:bg-amber-50"
                  >
                    <Lock className="w-3.5 h-3.5 mr-1.5" />
                    Desbloquear ubicación
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <p className="text-xl font-bold">Información del vendedor</p>
            <div className="flex gap-3 items-center mt-4 p-4 bg-gray-50 rounded-lg">
              <Avatar className="w-16 h-16">
                <AvatarImage
                  src={
                    publicacion?.vendedor &&
                    publicacion?.vendedor.imagenes?.length > 0
                      ? publicacion.vendedor.imagenes[0].url
                      : "/images/ProfileImage.png"
                  }
                  alt={`image-${publicacion?.id}`}
                />
                <AvatarFallback>
                  {publicacion?.vendedor.nombre?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-lg font-bold">
                  {publicacion?.vendedor.nombre}
                </p>
                <p className="text-sm text-gray-500">
                  {publicacion.vendedor.verificado &&
                  publicacion.vendedor.tienePaqueteActivo &&
                  publicacion.vendedor.paqueteActivo?.nombre !== "Plan Free"
                    ? `Vendedor verificad${
                        publicacion?.vendedor.nombre?.endsWith("a") ? "a" : "o"
                      }`
                    : `Vendedor no verificad${
                        publicacion?.vendedor.nombre?.endsWith("a") ? "a" : "o"
                      }`}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-3 items-center text-gray-600">
            <Tractor size={20} />
            <p className="text-sm">
              Se unió a AgroMarket en{" "}
              {formatDateLocalAnyo(publicacion?.vendedor.create ?? "")}
            </p>
          </div>

          <Separator className="mt-6" />

          {!isVendido && (
            <div className="mt-6">
              <div className="mt-4 flex items-center gap-2">
                <MessageCircle size={20} className="text-green-500" />
                <p className="font-medium">
                  {esAlquiler
                    ? "¿Necesitas información sobre el alquiler?"
                    : "¿Necesitas más información?"}
                </p>
              </div>
              <div className="mt-3">
                <Button
                  onClick={handleRequirePlan}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                >
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  {esAlquiler
                    ? "Consultar disponibilidad"
                    : "Contactar al vendedor"}
                </Button>
              </div>
              <p className="text-xs text-gray-400 text-center mt-2">
                Requiere un plan activo de AgroMarket
              </p>
            </div>
          )}
        </div>
      </div>

      {showPlanAlert && (
        <AlertNotLogued
          setShowPlanAlert={setShowPlanAlert}
          redirect={() => router.push("/register")}
        />
      )}
    </div>
  );
};

export default DetailsPublicacionesPage;
