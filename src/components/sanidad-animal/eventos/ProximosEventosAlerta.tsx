import { Sanidad } from "@/api/sanidad-animal/interface/response-sanidad-animal.interface";
import { differenceInCalendarDays } from "date-fns";
import { AlertCircle, Calendar, Clock, CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/helpers/funciones/formatDate";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import CalendarioEventos from "../calendario/CalendarioEventos";
import Modal from "@/components/generics/Modal";

interface ProximosEventosAlertaProps {
  eventos: Sanidad[];
  borderColor?: string;
  bgColor?: string;
  textColor?: string;
  iconColor?: string;
}

const ProximosEventosAlerta = ({
  eventos,
  borderColor = "border-yellow-300",
  bgColor = "bg-yellow-50/50",
  textColor = "text-yellow-800",
  iconColor = "text-yellow-600",
}: ProximosEventosAlertaProps) => {
  const [mostrarCalendario, setMostrarCalendario] = useState(false);

  const eventosConProxima = eventos
    .filter((item) => item.proxima_fecha_evento)
    .map((item) => ({
      ...item,
      diasHasta: differenceInCalendarDays(
        new Date(item.proxima_fecha_evento!),
        new Date(),
      ),
    }))
    .filter((item) => item.diasHasta >= 0)
    .sort((a, b) => a.diasHasta - b.diasHasta)
    .slice(0, 5);

  if (eventosConProxima.length === 0) {
    return null;
  }

  const getUrgenciaColor = (dias: number) => {
    if (dias <= 1) return "bg-red-100 text-red-800 border-red-300";
    if (dias <= 3) return "bg-orange-100 text-orange-800 border-orange-300";
    if (dias <= 7) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    return `${bgColor.replace("/50", "")} ${textColor} border-${borderColor.split("-")[1]}-300`;
  };

  const getUrgenciaLabel = (dias: number) => {
    if (dias === 0) return "¡Hoy!";
    if (dias === 1) return "Mañana";
    if (dias <= 3) return "Muy pronto";
    if (dias <= 7) return "Próximamente";
    return "Programado";
  };

  return (
    <>
      <Card className={`mt-3 sm:mt-4 border ${borderColor} ${bgColor}`}>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-start gap-2 sm:gap-3">
            <div className="flex-shrink-0 mt-0.5">
              <AlertCircle className={`h-4 w-4 sm:h-5 sm:w-5 ${iconColor}`} />
            </div>
            <div className="flex-1 space-y-2 sm:space-y-3">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4
                    className={`text-xs sm:text-sm font-semibold ${textColor} flex flex-wrap items-center gap-1 sm:gap-2`}
                  >
                    Próximos eventos programados
                    <Badge
                      variant="outline"
                      className={`${bgColor.replace("/50", "")} ${textColor} border ${borderColor} text-[10px] sm:text-xs`}
                    >
                      {eventosConProxima.length} eventos
                    </Badge>
                  </h4>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setMostrarCalendario(true)}
                    className={`text-[10px] sm:text-xs h-7 sm:h-8 ${borderColor} ${textColor} hover:${bgColor}`}
                  >
                    <CalendarDays className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Ver calendario completo
                  </Button>
                </div>
                <p
                  className={`text-[10px] sm:text-xs ${textColor.replace("800", "700")} mt-0.5`}
                >
                  Eventos programados para los próximos días que requieren
                  atención
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-2 sm:gap-3">
                {eventosConProxima.map((evento) => (
                  <div
                    key={evento.id}
                    className={`p-2 sm:p-3 rounded-lg border ${getUrgenciaColor(evento.diasHasta)} transition-all duration-200 hover:shadow-md`}
                  >
                    <div className="flex items-start justify-between gap-1 sm:gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs font-medium truncate">
                          {evento.tipo_servicio || "Evento"}
                        </p>
                        <p className="text-[10px] sm:text-xs truncate text-gray-600">
                          {evento.animal?.nombre_animal ||
                            evento.animal?.identificador ||
                            "Sin identificar"}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={`ml-1 sm:ml-2 text-[8px] sm:text-[10px] flex-shrink-0 ${getUrgenciaColor(evento.diasHasta)}`}
                      >
                        {getUrgenciaLabel(evento.diasHasta)}
                      </Badge>
                    </div>

                    <div className="mt-1.5 sm:mt-2 flex flex-wrap items-center gap-1 sm:gap-2 text-[10px] sm:text-xs">
                      <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0" />
                      <span className="truncate">
                        {evento.proxima_fecha_evento &&
                          formatDate(evento.proxima_fecha_evento)}
                      </span>
                      <span className="text-gray-500 hidden xs:inline">•</span>
                      <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3 flex-shrink-0 hidden xs:inline" />
                      <span className="hidden xs:inline">
                        {evento.diasHasta === 0
                          ? "Hoy"
                          : evento.diasHasta === 1
                            ? "1 día"
                            : `${evento.diasHasta + 1} días`}
                      </span>

                      <span className="xs:hidden text-gray-500">
                        {evento.diasHasta === 0
                          ? "Hoy"
                          : evento.diasHasta === 1
                            ? "1d"
                            : `${evento.diasHasta + 1}d`}
                      </span>
                    </div>

                    {evento.responsable && (
                      <p className="mt-1 text-[8px] sm:text-[10px] text-gray-600 truncate">
                        Resp: {evento.responsable}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Modal
        title="Calendario"
        open={mostrarCalendario}
        onOpenChange={setMostrarCalendario}
        height="auto"
        size="4xl"
      >
        <CalendarioEventos eventos={eventos} />
      </Modal>
    </>
  );
};

export default ProximosEventosAlerta;
