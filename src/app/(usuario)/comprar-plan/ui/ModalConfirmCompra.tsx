import { ResponsePaquetesInterface } from "@/api/paquetes/interface/response-paquetes.interface";
import Modal from "@/components/generics/Modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getBadgeColor,
  getPlanColor,
  getPlanIcon,
} from "@/helpers/funciones/paquetes/get-infos";
import {
  TipoPaquete,
  TipoPrecio,
} from "@/interfaces/enums/paquetes/paquetes.enum";
import { Calendar, Clock, CreditCard } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  showConfirmDialog: boolean;
  setShowConfirmDialog: Dispatch<SetStateAction<boolean>>;
  selectedPaquete: ResponsePaquetesInterface | null;
  diasRestantes: number;
  tipoPago: TipoPrecio;
  setTipoPago: Dispatch<SetStateAction<TipoPrecio>>;
  esPaqueteFree: boolean;
  getPrecio: (paquete: ResponsePaquetesInterface) => {
    mensual: number;
    anual: number;
    moneda: string;
    paisNombre: string;
  };
  getFechaFinPreview: () => string;
  calcularAhorro: (precioMensual: number, precioAnual: number) => number;
  isProcessing: boolean;
  handleConfirmarCompra: () => Promise<void>;
  planActualEsFree: boolean;
}

const ModalConfirmCompra = ({
  setShowConfirmDialog,
  showConfirmDialog,
  diasRestantes,
  selectedPaquete,
  tipoPago,
  setTipoPago,
  esPaqueteFree,
  getPrecio,
  getFechaFinPreview,
  calcularAhorro,
  isProcessing,
  handleConfirmarCompra,
  planActualEsFree,
}: Props) => {
  return (
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
                <h3 className="font-bold text-lg">{selectedPaquete.nombre}</h3>
                <Badge className={getBadgeColor(selectedPaquete.tipo)}>
                  {selectedPaquete.tipo}
                </Badge>
              </div>
            </div>

            <Separator className="my-3" />

            <div className="space-y-3">
              {diasRestantes > 0 &&
                !planActualEsFree &&
                selectedPaquete?.tipo !== TipoPaquete.FREE && (
                  <div className="bg-green-50 rounded-lg p-3 border border-green-200">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-green-800">
                        ✨ <strong>Beneficio por renovación:</strong> Sumarás
                        los <strong>{diasRestantes} días</strong> restantes de
                        tu plan actual a esta nueva suscripción.
                      </span>
                    </div>
                  </div>
                )}

              <div>
                <Label className="text-sm font-semibold">
                  Tipo de suscripción
                </Label>
                <RadioGroup
                  value={tipoPago}
                  onValueChange={(value) => setTipoPago(value as TipoPrecio)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      value={TipoPrecio.MENSUAL}
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
                            value={TipoPrecio.ANUAL}
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
                    {tipoPago === TipoPrecio.MENSUAL
                      ? getPrecio(selectedPaquete).mensual.toFixed(2)
                      : getPrecio(selectedPaquete).anual.toFixed(2)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {tipoPago === TipoPrecio.MENSUAL
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
                    {!planActualEsFree && (
                      <span className="block text-xs text-green-600 mt-1">
                        ✅ Incluye {diasRestantes} días adicionales de tu plan
                        anterior
                      </span>
                    )}
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
                  {diasRestantes > 0
                    ? "Renovar y Aprovechar Días"
                    : "Confirmar"}
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default ModalConfirmCompra;
