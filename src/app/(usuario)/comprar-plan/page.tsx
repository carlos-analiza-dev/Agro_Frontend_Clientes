"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/providers/store/useAuthStore";
import useGetPaquetesByPais from "@/hooks/paquetes/useGetPaquetesByPais";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, Calendar, CreditCard, LogIn, Crown } from "lucide-react";
import { toast } from "react-toastify";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ComprarPlanSkeleton } from "./ui/ComprarPlanSkeleton";
import { PricingCard } from "./ui/PricingCard";
import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";
import {
  getBadgeColor,
  getPlanColor,
  getPlanIcon,
} from "@/helpers/funciones/paquetes/get-infos";
import Modal from "@/components/generics/Modal";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ComprarPaquete } from "@/api/paquetes/accions/comprar-paquete";
import { useFavoritos } from "@/hooks/favoritos/useFavoritos";
import { useCartStore } from "@/providers/store/useCartStore";

const ComprarPlanPage = () => {
  const { cliente, logout } = useAuthStore();
  const { limpiarFavoritos } = useFavoritos();
  const { clearCart } = useCartStore();
  const { data: paquetes, isLoading, refetch } = useGetPaquetesByPais();
  const router = useRouter();
  const [selectedPaquete, setSelectedPaquete] = useState<any>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [tipoPago, setTipoPago] = useState<"MENSUAL" | "ANUAL">("MENSUAL");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [compraExitosa, setCompraExitosa] = useState<any>(null);

  const tienePlanActivo = cliente?.tienePlanActivo;
  const planActivo = cliente?.paqueteActivo;

  useEffect(() => {
    if (selectedPaquete) {
      if (selectedPaquete.tipo === TipoPaquete.FREE) {
        setTipoPago("MENSUAL");
      }
    }
  }, [selectedPaquete]);

  const calcularFechas = (tipo: "MENSUAL" | "ANUAL") => {
    const fechaInicio = new Date();

    fechaInicio.setHours(0, 0, 0, 0);

    let fechaFin = new Date(fechaInicio);

    if (tipo === "MENSUAL") {
      fechaFin.setDate(fechaFin.getDate() + 30);
    } else {
      fechaFin.setDate(fechaFin.getDate() + 365);
    }

    fechaFin.setHours(23, 59, 59, 999);

    return {
      fechaInicio: fechaInicio.toISOString(),
      fechaFin: fechaFin.toISOString(),
    };
  };

  const calcularFechasFree = () => {
    const fechaInicio = new Date();
    fechaInicio.setHours(0, 0, 0, 0);

    let fechaFin = new Date(fechaInicio);
    fechaFin.setDate(fechaFin.getDate() + 30);
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

  const getPrecio = (paquete: any) => {
    const precioPais = paquete.preciosPorPais?.find(
      (p: any) => p.pais?.id === cliente?.pais?.id,
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

  const handleComprar = (paquete: any) => {
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
      });

      setShowConfirmDialog(false);

      setShowSuccessModal(true);

      refetch();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Error al procesar la compra",
      );
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
                </span>
              )}
              {planActivo.estaPorVencer && !planActivo.estaVencido && (
                <span className="block text-yellow-600 text-sm mt-1">
                  ⚠️ Tu plan está por vencer. ¡Renueva para no perder
                  beneficios!
                </span>
              )}
            </AlertDescription>
          </Alert>
        </div>
      )}

      <div className="container mx-auto px-4 py-12">
        <Tabs defaultValue="mensual" className="w-full">
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
              })}
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

      <Modal
        open={showConfirmDialog}
        onOpenChange={setShowConfirmDialog}
        title="Confirmar Compra"
        description="¿Estás seguro de que deseas adquirir este plan?"
      >
        {selectedPaquete && (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg ${getPlanColor(selectedPaquete.tipo)}`}
            >
              <div className="flex items-center gap-3 mb-3">
                {getPlanIcon(selectedPaquete.tipo)}
                <div>
                  <h3 className="font-bold text-lg">
                    {selectedPaquete.nombre}
                  </h3>
                  <Badge className={getBadgeColor(selectedPaquete.tipo)}>
                    {selectedPaquete.tipo}
                  </Badge>
                </div>
              </div>

              <Separator className="my-3" />

              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-semibold">
                    Tipo de suscripción
                  </Label>
                  <RadioGroup
                    value={tipoPago}
                    onValueChange={(value) =>
                      setTipoPago(value as "MENSUAL" | "ANUAL")
                    }
                    className="flex gap-4 mt-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="MENSUAL"
                        id="mensual"
                        disabled={esPaqueteFree}
                      />
                      <Label
                        htmlFor="mensual"
                        className={`cursor-pointer ${esPaqueteFree ? "text-gray-400" : ""}`}
                      >
                        Mensual
                      </Label>
                    </div>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="ANUAL"
                              id="anual"
                              disabled={esPaqueteFree}
                            />
                            <Label
                              htmlFor="anual"
                              className={`cursor-pointer ${esPaqueteFree ? "text-gray-400" : ""}`}
                            >
                              Anual
                              {getPrecio(selectedPaquete).mensual > 0 &&
                                !esPaqueteFree && (
                                  <span className="ml-2 text-xs text-green-600">
                                    Ahorra{" "}
                                    {calcularAhorro(
                                      getPrecio(selectedPaquete).mensual,
                                      getPrecio(selectedPaquete).anual,
                                    )}
                                    %
                                  </span>
                                )}
                            </Label>
                          </div>
                        </TooltipTrigger>
                        {esPaqueteFree && (
                          <TooltipContent>
                            <p className="text-xs">
                              El plan FREE solo está disponible en modalidad
                              mensual
                            </p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </RadioGroup>

                  {esPaqueteFree && (
                    <p className="text-xs text-blue-600 mt-2">
                      ℹ️ El plan gratuito solo está disponible en modalidad
                      mensual
                    </p>
                  )}
                </div>

                <div className="bg-white rounded-lg p-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Total a pagar:</span>
                    <span className="text-2xl font-bold text-blue-600">
                      {getPrecio(selectedPaquete).moneda}{" "}
                      {tipoPago === "MENSUAL"
                        ? getPrecio(selectedPaquete).mensual.toFixed(2)
                        : getPrecio(selectedPaquete).anual.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {tipoPago === "MENSUAL"
                      ? "Se realizará un cargo mensual"
                      : "Se realizará un cargo único anual"}
                  </p>
                </div>

                <div className="bg-blue-50 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-blue-600" />
                    <span className="text-gray-700">
                      Tu plan estará activo hasta el{" "}
                      <strong>{getFechaFinPreview()}</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleConfirmarCompra}
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Confirmar
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        open={showSuccessModal}
        onOpenChange={setShowSuccessModal}
        title="¡Compra Exitosa! 🎉"
        size="lg"
        showCloseButton={false}
      >
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
              <Crown className="h-10 w-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              ¡Felicidades!
            </h3>
            <p className="text-gray-600">
              Has adquirido el plan <strong>{compraExitosa?.nombre}</strong>{" "}
              exitosamente.
            </p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-blue-800 mb-1">
                  Para activar tu plan y ver todos los beneficios
                </p>
                <p className="text-sm text-blue-700">
                  Es necesario que cierres sesión y vuelvas a iniciar sesión.
                  Esto actualizará tus permisos y te dará acceso a todas las
                  funcionalidades incluidas en tu nuevo plan.
                </p>
              </div>
            </div>
          </div>

          {compraExitosa?.fechaFin && (
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-gray-600">
                  Tu plan estará activo hasta:{" "}
                  <strong>
                    {new Date(compraExitosa.fechaFin).toLocaleDateString()}
                  </strong>
                </span>
              </div>
            </div>
          )}

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              💡 <span className="font-semibold">Nota:</span> Si no cierras
              sesión ahora, los cambios se reflejarán automáticamente cuando tu
              sesión expire.
            </p>
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleReiniciarSesion}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
              size="lg"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Cerrar Sesión y Volver a Iniciar
            </Button>
            <Button
              onClick={handleContinuar}
              variant="outline"
              className="w-full"
            >
              Continuar sin cerrar sesión
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ComprarPlanPage;
