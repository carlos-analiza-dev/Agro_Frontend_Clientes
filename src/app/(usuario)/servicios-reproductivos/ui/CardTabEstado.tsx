import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { estadoReproductivo } from "@/helpers/data/estadoServicioReproductivo";
import { Dispatch, SetStateAction } from "react";

interface Props {
  selectedEstado: string;
  handleEstadoChange: (estadoValue: string, checked: boolean) => void;
  setOpenModal: Dispatch<SetStateAction<boolean>>;
  handleActualizarEstado: () => void;
  isPending: boolean;
}

const CardTabEstado = ({
  selectedEstado,
  handleEstadoChange,
  setOpenModal,
  handleActualizarEstado,
  isPending,
}: Props) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Estado del Servicio</CardTitle>
        <CardDescription>
          Actualiza el estado actual del servicio reproductivo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {estadoReproductivo.map((estado) => (
              <div
                key={estado.id}
                className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Switch
                  id={estado.label}
                  checked={selectedEstado === estado.value}
                  onCheckedChange={(checked) =>
                    handleEstadoChange(estado.value, checked)
                  }
                />
                <Label htmlFor={estado.label} className="flex-1 cursor-pointer">
                  <div>
                    <p className="font-medium">{estado.label}</p>
                  </div>
                </Label>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setOpenModal(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleActualizarEstado}
              disabled={isPending || !selectedEstado}
            >
              {isPending ? "Actualizando..." : "Actualizar Estado"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardTabEstado;
