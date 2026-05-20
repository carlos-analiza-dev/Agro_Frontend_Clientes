import { CompraExitosa } from "@/api/paquetes/interface/comprar-paquete.interface";
import Modal from "@/components/generics/Modal";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Calendar, Clock, Crown, LogIn } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  showSuccessModal: boolean;
  setShowSuccessModal: Dispatch<SetStateAction<boolean>>;
  compraExitosa: CompraExitosa | null;
  handleReiniciarSesion: () => Promise<void>;
  handleContinuar: () => void;
}

const ModalCompraSucces = ({
  showSuccessModal,
  setShowSuccessModal,
  compraExitosa,
  handleReiniciarSesion,
  handleContinuar,
}: Props) => {
  return (
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

        {compraExitosa && compraExitosa?.diasAgregados > 0 && (
          <div className="bg-green-50 rounded-lg p-4 border border-green-200">
            <div className="flex items-start gap-3">
              <Clock className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-green-800 mb-1">
                  ¡Beneficio aplicado!
                </p>
                <p className="text-sm text-green-700">
                  Se han sumado{" "}
                  <strong>{compraExitosa.diasAgregados} días</strong> de tu plan
                  anterior a tu nueva suscripción. ¡No perdiste ningún día!
                </p>
                <p className="text-xs text-green-600 mt-1">
                  Duración comprada: {compraExitosa.duracionComprada} días +{" "}
                  {compraExitosa.diasAgregados} días adicionales ={" "}
                  {compraExitosa.duracionComprada + compraExitosa.diasAgregados}{" "}
                  días totales
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-blue-800 mb-1">
                Para activar tu plan y ver todos los beneficios
              </p>
              <p className="text-sm text-blue-700">
                Es necesario que cierres sesión y vuelvas a iniciar sesión. Esto
                actualizará tus permisos y te dará acceso a todas las
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
            💡 <span className="font-semibold">Nota:</span> Si no cierras sesión
            ahora, los cambios se reflejarán automáticamente cuando tu sesión
            expire.
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
  );
};

export default ModalCompraSucces;
