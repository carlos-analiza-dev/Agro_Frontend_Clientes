import { ArrowRight, Crown, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "../ui/button";
import { Dispatch, SetStateAction } from "react";

interface Props {
  setShowPlanAlert: Dispatch<SetStateAction<boolean>>;
  redirect: () => void;
}

const AlertNotLogued = ({ setShowPlanAlert, redirect }: Props) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setShowPlanAlert(false)}
      />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-green-600 to-green-700 p-6 text-white text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-3">
            <Crown className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold">
            Necesitas un plan con AgroMarket
          </h2>
          <p className="text-sm text-green-50 mt-1">
            Desbloquea toda la información de las publicaciones
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-3 mb-6">
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-green-100 rounded-full shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm text-gray-700">
                Contacta directamente con vendedores verificados
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-green-100 rounded-full shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm text-gray-700">
                Accede a la ubicación exacta de cada publicación
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-1.5 bg-green-100 rounded-full shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4 text-green-600" />
              </div>
              <p className="text-sm text-gray-700">
                Más información, imágenes y detalles del producto
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={() => redirect()}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
            >
              Registrate
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button
              variant="ghost"
              onClick={() => setShowPlanAlert(false)}
              className="w-full text-gray-500"
            >
              Más tarde
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertNotLogued;
