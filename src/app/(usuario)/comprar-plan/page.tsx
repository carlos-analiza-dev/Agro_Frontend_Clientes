"use client";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/providers/store/useAuthStore";
import useGetPaquetesByPais from "@/hooks/paquetes/useGetPaquetesByPais";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Clock } from "lucide-react";
import { toast } from "react-toastify";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ComprarPlanSkeleton } from "./ui/ComprarPlanSkeleton";
import { PricingCard } from "./ui/PricingCard";
import {
  TipoPaquete,
  TipoPrecio,
} from "@/interfaces/enums/paquetes/paquetes.enum";
import {
  getBadgeColor,
  getPlanColor,
  getPlanIcon,
} from "@/helpers/funciones/paquetes/get-infos";
import { ComprarPaquete } from "@/api/paquetes/accions/comprar-paquete";
import { useFavoritos } from "@/hooks/favoritos/useFavoritos";
import { useCartStore } from "@/providers/store/useCartStore";
import { isAxiosError } from "axios";
import {
  PreciosPorPai,
  ResponsePaquetesInterface,
} from "@/api/paquetes/interface/response-paquetes.interface";
import { useQueryClient } from "@tanstack/react-query";
import ModalConfirmCompra from "./ui/ModalConfirmCompra";
import ModalCompraSucces from "./ui/ModalCompraSucces";
import { CompraExitosa } from "@/api/paquetes/interface/comprar-paquete.interface";

const calcularDiasRestantes = (fechaFin: string): number => {
  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  const fechaFinDate = new Date(fechaFin);
  fechaFinDate.setHours(0, 0, 0, 0);

  const diferencia = fechaFinDate.getTime() - hoy.getTime();
  const diasRestantes = Math.ceil(diferencia / (1000 * 3600 * 24));

  return Math.max(0, diasRestantes);
};

const sumarDiasAFecha = (fechaInicio: Date, dias: number): Date => {
  const nuevaFecha = new Date(fechaInicio);
  nuevaFecha.setDate(nuevaFecha.getDate() + dias);
  return nuevaFecha;
};

const ComprarPlanPage = () => {
  const { cliente, logout } = useAuthStore();
  const { limpiarFavoritos } = useFavoritos();
  const { clearCart } = useCartStore();
  const { data: paquetes, isLoading, refetch } = useGetPaquetesByPais();
  const router = useRouter();
  const [selectedPaquete, setSelectedPaquete] =
    useState<ResponsePaquetesInterface | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tipoPago, setTipoPago] = useState<TipoPrecio>(TipoPrecio.MENSUAL);
  const [activeTab, setActiveTab] = useState<"mensual" | "anual">("mensual");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [compraExitosa, setCompraExitosa] = useState<CompraExitosa | null>(
    null,
  );
  const queryClient = useQueryClient();

  const tienePlanActivo = cliente?.tienePlanActivo;
  const planActivo = cliente?.paqueteActivo;

  const diasRestantes = useMemo(() => {
    if (!planActivo?.fechaFin) return 0;
    return calcularDiasRestantes(planActivo.fechaFin);
  }, [planActivo?.fechaFin]);

  const estaPorVencer = planActivo?.estaPorVencer || false;
  const puedeRenovarAntes = diasRestantes > 0;

  useEffect(() => {
    if (selectedPaquete?.tipo === TipoPaquete.FREE) {
      setTipoPago(TipoPrecio.MENSUAL);
      setActiveTab("mensual");
    } else {
      const nuevoTipoPago =
        activeTab === "mensual" ? TipoPrecio.MENSUAL : TipoPrecio.ANUAL;
      setTipoPago(nuevoTipoPago);
    }
  }, [activeTab, selectedPaquete]);

  useEffect(() => {
    if (selectedPaquete) {
      if (selectedPaquete.tipo === TipoPaquete.FREE) {
        setTipoPago(TipoPrecio.MENSUAL);
        setActiveTab("mensual");
      } else {
        const nuevoTipoPago =
          activeTab === "mensual" ? TipoPrecio.MENSUAL : TipoPrecio.ANUAL;
        setTipoPago(nuevoTipoPago);
      }
    }
  }, [selectedPaquete]);

  const getDuracionDias = (tipo: TipoPrecio): number => {
    return tipo === TipoPrecio.MENSUAL ? 30 : 365;
  };

  const calcularNuevaFechaFin = (tipo: TipoPrecio): string => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const duracionDias = getDuracionDias(tipo);
    let totalDias = duracionDias;

    const puedeSumarDias =
      puedeRenovarAntes &&
      diasRestantes > 0 &&
      planActivo?.paquete?.tipo !== TipoPaquete.FREE;

    if (puedeSumarDias) {
      totalDias = duracionDias + diasRestantes;
    }

    const nuevaFechaFin = sumarDiasAFecha(hoy, totalDias);
    nuevaFechaFin.setHours(23, 59, 59, 999);

    return nuevaFechaFin.toISOString();
  };

  const calcularFechas = (tipo: TipoPrecio) => {
    const fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);
    const fechaFin = calcularNuevaFechaFin(tipo);

    return {
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin,
    };
  };

  const calcularFechasFree = () => {
    const fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);

    let totalDias = 30;

    if (
      puedeRenovarAntes &&
      diasRestantes > 0 &&
      planActivo?.paquete?.tipo === TipoPaquete.FREE
    ) {
      totalDias = 30 + diasRestantes;
    }

    const fechaFin = sumarDiasAFecha(fechaInicio, totalDias);
    fechaFin.setHours(23, 59, 59, 999);

    return {
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
    };
  };

  const paquetesDisponibles = paquetes?.filter((paquete: any) => {
    if (tienePlanActivo && paquete.tipo === TipoPaquete.FREE) {
      return false;
    }
    return paquete.isActive === true;
  });

  const getPrecio = (paquete: ResponsePaquetesInterface) => {
    const precioPais = paquete.preciosPorPais?.find(
      (p: PreciosPorPai) => p.pais?.id === cliente?.pais?.id,
    );

    if (precioPais) {
      return {
        mensual: parseFloat(precioPais.precioMensual),
        anual: parseFloat(precioPais.precioAnual),
        moneda: precioPais.pais?.simbolo_moneda || "L",
        paisNombre: precioPais.pais?.nombre,
      };
    }

    const primerPrecio = paquete.preciosPorPais?.[0];
    if (primerPrecio) {
      return {
        mensual: parseFloat(primerPrecio.precioMensual),
        anual: parseFloat(primerPrecio.precioAnual),
        moneda: primerPrecio.pais?.simbolo_moneda || "$",
        paisNombre: primerPrecio.pais?.nombre,
      };
    }

    return { mensual: 0, anual: 0, moneda: "$", paisNombre: "No disponible" };
  };

  const calcularAhorro = (precioMensual: number, precioAnual: number) => {
    if (precioMensual === 0 || precioAnual === 0) return 0;
    const totalMensualAnual = precioMensual * 12;
    const ahorro = totalMensualAnual - precioAnual;
    const porcentaje = (ahorro / totalMensualAnual) * 100;
    return Math.round(porcentaje);
  };

  const handleComprar = (paquete: ResponsePaquetesInterface) => {
    setSelectedPaquete(paquete);
    setShowConfirmDialog(true);
  };

  const handleConfirmarCompra = async () => {
    if (!selectedPaquete) return;

    setIsProcessing(true);
    try {
      let data;

      if (selectedPaquete.tipo === TipoPaquete.FREE) {
        const fechas = calcularFechasFree();
        data = {
          paqueteId: selectedPaquete.id,
          fechaInicio: fechas.fechaInicio,
          fechaFin: fechas.fechaFin,
        };
      } else {
        const fechas = calcularFechas(tipoPago);
        data = {
          paqueteId: selectedPaquete.id,
          fechaInicio: fechas.fechaInicio,
          fechaFin: fechas.fechaFin,
        };
      }

      await ComprarPaquete(data);

      setCompraExitosa({
        nombre: selectedPaquete.nombre,
        tipo: selectedPaquete.tipo,
        fechaFin: data.fechaFin,
        diasAgregados:
          puedeRenovarAntes &&
          diasRestantes > 0 &&
          planActivo?.paquete?.tipo !== TipoPaquete.FREE
            ? diasRestantes
            : 0,
        duracionComprada: getDuracionDias(tipoPago),
      });

      setShowConfirmDialog(false);
      setShowSuccessModal(true);

      queryClient.invalidateQueries({ queryKey: ["paquetes-pais"] });
      await refetch();
    } catch (error) {
      if (isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          error.message ||
          "Error al ejecutar la compra";
        toast.error(errorMessage);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReiniciarSesion = async () => {
    setShowSuccessModal(false);

    toast.info("Cerrando sesión...");

    await new Promise((resolve) => setTimeout(resolve, 500));

    await logout();
    limpiarFavoritos();
    clearCart();

    router.push("/");
  };

  const handleContinuar = () => {
    setShowSuccessModal(false);
    window.location.reload();
  };

  const esPaqueteFree = selectedPaquete?.tipo === TipoPaquete.FREE;

  const getFechaFinPreview = () => {
    if (esPaqueteFree) {
      const fechas = calcularFechasFree();
      return new Date(fechas.fechaFin).toLocaleDateString();
    }
    const fechas = calcularFechas(tipoPago);
    return new Date(fechas.fechaFin).toLocaleDateString();
  };

  const getMensajeRenovacionModal = () => {
    if (!diasRestantes || diasRestantes <= 0) return null;

    return (
      <div className="bg-green-50 rounded-lg p-3 border border-green-200">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-green-600" />
          <span className="text-sm text-green-800">
            ✨ <strong>Beneficio por renovación:</strong> Sumarás los{" "}
            <strong>{diasRestantes} días</strong> restantes de tu plan actual a
            esta nueva suscripción.
          </span>
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <ComprarPlanSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="text-center text-white">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              Elige el Plan Perfecto
            </h1>
            <p className="text-base md:text-lg text-blue-100 max-w-2xl mx-auto">
              Selecciona el plan que mejor se adapte a tus necesidades y
              comienza a optimizar tu producción ganadera
            </p>
          </div>
        </div>
      </div>

      {tienePlanActivo && planActivo && (
        <div className="container mx-auto px-4 -mt-6">
          <Alert className="bg-green-50 border-green-200">
            <AlertCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Actualmente tienes el plan{" "}
              <strong>{planActivo.paquete?.nombre}</strong> activo.
              {planActivo.fechaFin && (
                <span>
                  {" "}
                  Vence el {new Date(planActivo.fechaFin).toLocaleDateString()}
                  {diasRestantes > 0 && (
                    <span className="ml-2 text-blue-600">
                      (Te quedan {diasRestantes} días)
                    </span>
                  )}
                </span>
              )}
              {estaPorVencer && !planActivo.estaVencido && (
                <span className="block text-yellow-600 text-sm mt-1">
                  ⚠️ ¡Tu plan está por vencer! Renueva ahora y suma los días
                  restantes a tu nuevo plan.
                </span>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}

      {diasRestantes > 0 &&
        planActivo?.paquete?.tipo !== TipoPaquete.FREE &&
        getMensajeRenovacionModal()}

      <div className="container mx-auto px-4 py-12">
        <Tabs
          defaultValue="mensual"
          className="w-full"
          onValueChange={(value) => setActiveTab(value as "mensual" | "anual")}
          value={activeTab}
        >
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="mensual">Pago Mensual</TabsTrigger>
              <TabsTrigger value="anual">
                Pago Anual
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Ahorra
                </span>
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="mensual" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paquetesDisponibles?.map(
                (paquete: ResponsePaquetesInterface, index: number) => {
                  const precio = getPrecio(paquete);
                  const esPlanActual = planActivo?.paquete?.id === paquete.id;
                  const esFree = paquete.tipo === TipoPaquete.FREE;
                  const ahorro = calcularAhorro(precio.mensual, precio.anual);

                  return (
                    <PricingCard
                      key={paquete.id}
                      paquete={paquete}
                      precio={precio}
                      tipoPago="mensual"
                      icon={getPlanIcon(paquete.tipo)}
                      badgeColor={getBadgeColor(paquete.tipo)}
                      cardColor={getPlanColor(paquete.tipo)}
                      index={index}
                      esPlanActual={esPlanActual}
                      esFree={esFree}
                      ahorro={ahorro}
                      onComprar={() => handleComprar(paquete)}
                    />
                  );
                },
              )}
            </div>
          </TabsContent>

          <TabsContent value="anual" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paquetesDisponibles?.map((paquete: any, index: number) => {
                const precio = getPrecio(paquete);
                const esPlanActual = planActivo?.paquete?.id === paquete.id;
                const esFree = paquete.tipo === TipoPaquete.FREE;
                const ahorro = calcularAhorro(precio.mensual, precio.anual);

                return (
                  <PricingCard
                    key={paquete.id}
                    paquete={paquete}
                    precio={precio}
                    tipoPago="anual"
                    icon={getPlanIcon(paquete.tipo)}
                    badgeColor={getBadgeColor(paquete.tipo)}
                    cardColor={getPlanColor(paquete.tipo)}
                    index={index}
                    esPlanActual={esPlanActual}
                    esFree={esFree}
                    ahorro={ahorro}
                    onComprar={() => handleComprar(paquete)}
                  />
                );
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <ModalConfirmCompra
        showConfirmDialog={showConfirmDialog}
        setShowConfirmDialog={setShowConfirmDialog}
        selectedPaquete={selectedPaquete}
        diasRestantes={diasRestantes}
        tipoPago={tipoPago}
        setTipoPago={setTipoPago}
        esPaqueteFree={esPaqueteFree}
        getPrecio={getPrecio}
        getFechaFinPreview={getFechaFinPreview}
        calcularAhorro={calcularAhorro}
        isProcessing={isProcessing}
        handleConfirmarCompra={handleConfirmarCompra}
        planActualEsFree={planActivo?.paquete?.tipo === TipoPaquete.FREE}
      />

      <ModalCompraSucces
        showSuccessModal={showSuccessModal}
        setShowSuccessModal={setShowSuccessModal}
        compraExitosa={compraExitosa}
        handleReiniciarSesion={handleReiniciarSesion}
        handleContinuar={handleContinuar}
      />
    </div>
  );
};

export default ComprarPlanPage;
