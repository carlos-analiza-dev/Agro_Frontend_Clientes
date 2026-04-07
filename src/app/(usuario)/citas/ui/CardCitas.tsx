"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Cita } from "@/api/citas/interfaces/response-citas-user.interface";
import { Calendar, Clock, MapPin, PawPrint, User } from "lucide-react";

interface Props {
  item: Cita;
  onPress?: () => void;
}

const CardCitas = ({ item, onPress }: Props) => {
  const { cliente } = useAuthStore();
  const pais = cliente?.pais;

  const formatDate = (date: any): string => {
    if (!date) return "N/A";

    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };

    if (typeof date === "string") {
      const [year, month, day] = date.split("-").map(Number);
      const dateObj = new Date(year, month - 1, day);

      return dateObj.toLocaleDateString("es-ES", options);
    }

    if (date instanceof Date) {
      return date.toLocaleDateString("es-ES", options);
    }

    return "N/A";
  };

  const getStatusColor = () => {
    switch (item.estado.toLowerCase()) {
      case "pendiente":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "cancelada":
        return "bg-red-100 text-red-800 border-red-200";
      case "completada":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-md"
      onClick={onPress}
    >
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2 flex-1 min-w-0">
            <PawPrint className="h-5 w-5 text-blue-500 flex-shrink-0" />
            <h3 className="font-semibold text-lg truncate">
              {item.subServicio.nombre} - {item.codigo}
            </h3>
          </div>
          <Badge variant="outline" className={getStatusColor()}>
            {item.estado.toUpperCase()}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex justify-between items-center bg-muted p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{formatDate(item.fecha)}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">
              {formatTime(item.horaInicio)} - {formatTime(item.horaFin)}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate">Dr. {item.medico.nombre}</span>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm truncate">
              {item.finca.nombre} -{" "}
              {item.finca.ubicacion.split(",")[1]?.trim() ||
                item.finca.ubicacion}
            </span>
          </div>
        </div>

        {item.animales.length > 0 && (
          <div className="border-t pt-3">
            <h4 className="font-medium text-sm mb-2">
              Animales ({item.animales.length})
            </h4>
            <div className="space-y-2">
              {item.animales.map((animal, index) => (
                <div
                  key={`${animal.id}-${index}`}
                  className="flex justify-between items-center"
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <PawPrint className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                    <span className="text-sm truncate">
                      {animal.identificador} - {animal.especie}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground italic">
                    {animal.razas.length === 1
                      ? animal.razas[0]
                      : animal.razas.length > 1
                        ? "Encaste"
                        : "Sin raza"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t pt-3">
        <div className="w-full text-right">
          <span className="font-bold text-green-700">
            Total: {pais?.simbolo_moneda || "$"}{" "}
            {parseFloat(item.totalPagar).toFixed(2)}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardCitas;
