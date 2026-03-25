import { Label } from "@/components/ui/label";
import RenderIntensidadBadge from "./RenderIntensidadBadge";
import { format } from "date-fns";
import { Celo } from "@/api/reproduccion/interfaces/response-celos-animal,interface";
import { cn } from "@/lib/utils";

interface Props {
  selectedCelo: Celo;
}

const DetailsCelo = ({ selectedCelo }: Props) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 border-b pb-2">
          Información del Animal
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-xs sm:text-sm text-muted-foreground block mb-1">
              Identificador
            </Label>
            <p className="font-medium text-sm sm:text-base break-words">
              {selectedCelo.animal.identificador}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-xs sm:text-sm text-muted-foreground block mb-1">
              Especie
            </Label>
            <p className="font-medium text-sm sm:text-base">
              {selectedCelo.animal.especie.nombre}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-xs sm:text-sm text-muted-foreground block mb-1">
              Sexo
            </Label>
            <p className="font-medium text-sm sm:text-base capitalize">
              {selectedCelo.animal.sexo.toLowerCase()}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-xs sm:text-sm text-muted-foreground block mb-1">
              Color
            </Label>
            <p className="font-medium text-sm sm:text-base capitalize">
              {selectedCelo.animal.color?.toLowerCase() || "No especificado"}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 border-b pb-2">
          Datos del Celo
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-xs sm:text-sm text-muted-foreground block mb-1">
              Número de Celo
            </Label>
            <p className="font-medium text-sm sm:text-base">
              #{selectedCelo.numeroCelo}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-xs sm:text-sm text-muted-foreground block mb-1">
              Intensidad
            </Label>
            <div className="mt-1">
              <RenderIntensidadBadge intensidad={selectedCelo.intensidad} />
            </div>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-xs sm:text-sm text-muted-foreground block mb-1">
              Fecha Inicio
            </Label>
            <p className="font-medium text-sm sm:text-base">
              {format(new Date(selectedCelo.fechaInicio), "dd/MM/yyyy HH:mm")}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <Label className="text-xs sm:text-sm text-muted-foreground block mb-1">
              Fecha Fin
            </Label>
            <p className="font-medium text-sm sm:text-base">
              {selectedCelo.fechaFin ? (
                format(new Date(selectedCelo.fechaFin), "dd/MM/yyyy HH:mm")
              ) : (
                <span className="inline-flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  Activo
                </span>
              )}
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg sm:col-span-2">
            <Label className="text-xs sm:text-sm text-muted-foreground block mb-1">
              Método de Detección
            </Label>
            <p className="font-medium text-sm sm:text-base">
              {selectedCelo.metodo_deteccion}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 border-b pb-2">
          Signos Observados
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 mb-4">
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <div
              className={cn(
                "w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0",
                selectedCelo.signos_observados.monta_otros
                  ? "bg-green-500"
                  : "bg-red-500",
              )}
            />
            <span className="text-xs sm:text-sm truncate">Monta a otros</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <div
              className={cn(
                "w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0",
                selectedCelo.signos_observados.acepta_monta
                  ? "bg-green-500"
                  : "bg-red-500",
              )}
            />
            <span className="text-xs sm:text-sm truncate">Acepta monta</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <div
              className={cn(
                "w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0",
                selectedCelo.signos_observados.inquietud
                  ? "bg-green-500"
                  : "bg-red-500",
              )}
            />
            <span className="text-xs sm:text-sm truncate">Inquietud</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded-lg">
            <div
              className={cn(
                "w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0",
                selectedCelo.signos_observados.vulva_inflamada
                  ? "bg-green-500"
                  : "bg-red-500",
              )}
            />
            <span className="text-xs sm:text-sm truncate">Vulva inflamada</span>
          </div>
        </div>

        <div className="mb-4">
          <Label className="text-xs sm:text-sm text-muted-foreground block mb-2">
            Secreciones
          </Label>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm sm:text-base">
              {selectedCelo.signos_observados.secreciones || "No registrado"}
            </p>
          </div>
        </div>

        {selectedCelo.signos_observados.otros?.length > 0 && (
          <div>
            <Label className="text-xs sm:text-sm text-muted-foreground block mb-2">
              Otros signos
            </Label>
            <div className="flex flex-wrap gap-2">
              {selectedCelo.signos_observados.otros.map(
                (signo: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs sm:text-sm"
                  >
                    {signo}
                  </span>
                ),
              )}
            </div>
          </div>
        )}
      </div>

      {selectedCelo.observaciones && selectedCelo.observaciones !== "N/A" && (
        <div>
          <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 border-b pb-2">
            Observaciones
          </h3>
          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
            <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words">
              {selectedCelo.observaciones}
            </p>
          </div>
        </div>
      )}

      {(!selectedCelo.observaciones || selectedCelo.observaciones === "N/A") &&
        !selectedCelo.signos_observados.otros?.length && (
          <div className="text-center py-4 text-gray-500 text-sm">
            No hay información adicional registrada
          </div>
        )}
    </div>
  );
};

export default DetailsCelo;
