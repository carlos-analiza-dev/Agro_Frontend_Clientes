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
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="text-muted-foreground">Identificador</Label>
          <p className="font-medium">{selectedCelo.animal.identificador}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Especie</Label>
          <p className="font-medium">{selectedCelo.animal.especie.nombre}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Sexo</Label>
          <p className="font-medium">{selectedCelo.animal.sexo}</p>
        </div>
        <div>
          <Label className="text-muted-foreground">Color</Label>
          <p className="font-medium">{selectedCelo.animal.color}</p>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Datos del Celo</h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-muted-foreground">Número de Celo</Label>
            <p className="font-medium">{selectedCelo.numeroCelo}</p>
          </div>
          <div>
            <Label className="text-muted-foreground">Intensidad</Label>
            <div className="mt-1">
              <RenderIntensidadBadge intensidad={selectedCelo.intensidad} />
            </div>
          </div>
          <div>
            <Label className="text-muted-foreground">Fecha Inicio</Label>
            <p className="font-medium">
              {format(new Date(selectedCelo.fechaInicio), "dd/MM/yyyy HH:mm")}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">Fecha Fin</Label>
            <p className="font-medium">
              {selectedCelo.fechaFin
                ? format(new Date(selectedCelo.fechaFin), "dd/MM/yyyy HH:mm")
                : "Activo"}
            </p>
          </div>
          <div>
            <Label className="text-muted-foreground">Método Detección</Label>
            <p className="font-medium">{selectedCelo.metodo_deteccion}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4">
        <h4 className="font-semibold mb-3">Signos Observados</h4>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                selectedCelo.signos_observados.monta_otros
                  ? "bg-green-500"
                  : "bg-red-500",
              )}
            />
            <span>Monta a otros</span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                selectedCelo.signos_observados.acepta_monta
                  ? "bg-green-500"
                  : "bg-red-500",
              )}
            />
            <span>Acepta monta</span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                selectedCelo.signos_observados.inquietud
                  ? "bg-green-500"
                  : "bg-red-500",
              )}
            />
            <span>Inquietud</span>
          </div>
          <div className="flex items-center space-x-2">
            <div
              className={cn(
                "w-2 h-2 rounded-full",
                selectedCelo.signos_observados.vulva_inflamada
                  ? "bg-green-500"
                  : "bg-red-500",
              )}
            />
            <span>Vulva inflamada</span>
          </div>
        </div>

        <div className="mt-3">
          <Label className="text-muted-foreground">Secreciones</Label>
          <p className="font-medium">
            {selectedCelo.signos_observados.secreciones}
          </p>
        </div>

        {selectedCelo.signos_observados.otros?.length > 0 && (
          <div className="mt-3">
            <Label className="text-muted-foreground">Otros signos</Label>
            <ul className="list-disc list-inside">
              {selectedCelo.signos_observados.otros.map(
                (signo: string, idx: number) => (
                  <li key={idx} className="text-sm">
                    {signo}
                  </li>
                ),
              )}
            </ul>
          </div>
        )}
      </div>

      {selectedCelo.observaciones && selectedCelo.observaciones !== "N/A" && (
        <div className="border-t pt-4">
          <Label className="text-muted-foreground">Observaciones</Label>
          <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-md">
            {selectedCelo.observaciones}
          </p>
        </div>
      )}
    </div>
  );
};

export default DetailsCelo;
