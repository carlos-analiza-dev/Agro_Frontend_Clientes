"use client";

import { useState, useEffect, useMemo } from "react";
import { Sanidad } from "@/api/sanidad-animal/interface/response-sanidad-animal.interface";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isToday,
  isPast,
  getDate,
  startOfWeek,
  endOfWeek,
  addMonths,
  subMonths,
  isSameMonth,
  parseISO,
} from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useLocale, useTranslations } from "next-intl";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "react-toastify";

interface CalendarioEventosProps {
  eventos: Sanidad[];
}

const CalendarioEventos = ({ eventos }: CalendarioEventosProps) => {
  const t = useTranslations("calendarioEventos");
  const locale = useLocale();

  const dateLocale = locale.startsWith("en") ? enUS : es;

  const [fechaActual, setFechaActual] = useState(new Date());
  const [eventosPorFecha, setEventosPorFecha] = useState<
    Map<string, Sanidad[]>
  >(new Map());

  useEffect(() => {
    const mapa = new Map<string, Sanidad[]>();

    eventos
      .filter((item) => item.proxima_fecha_evento)
      .forEach((item) => {
        const fechaEvento = parseISO(item.proxima_fecha_evento!);
        const fecha = format(fechaEvento, "yyyy-MM-dd");

        if (!mapa.has(fecha)) {
          mapa.set(fecha, []);
        }
        mapa.get(fecha)!.push(item);
      });

    setEventosPorFecha(mapa);
  }, [eventos]);

  const diasDelMes = useMemo(() => {
    const inicio = startOfMonth(fechaActual);
    const fin = endOfMonth(fechaActual);
    const inicioSemana = startOfWeek(inicio, { weekStartsOn: 1 });
    const finSemana = endOfWeek(fin, { weekStartsOn: 1 });

    return eachDayOfInterval({ start: inicioSemana, end: finSemana });
  }, [fechaActual]);

  const mesAnterior = () => setFechaActual(subMonths(fechaActual, 1));
  const mesSiguiente = () => setFechaActual(addMonths(fechaActual, 1));
  const irHoy = () => setFechaActual(new Date());

  const obtenerEventosDelDia = (fecha: Date): Sanidad[] => {
    const key = format(fecha, "yyyy-MM-dd");
    return eventosPorFecha.get(key) || [];
  };

  const getColorEvento = (evento: Sanidad) => {
    const fecha = new Date(evento.proxima_fecha_evento!);
    const dias = Math.ceil(
      (fecha.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
    );

    if (dias <= 1) return "bg-red-500";
    if (dias <= 3) return "bg-orange-500";
    if (dias <= 7) return "bg-yellow-500";
    return "bg-blue-500";
  };

  const agregarAGoogleCalendar = (evento: Sanidad) => {
    if (!evento.proxima_fecha_evento) {
      toast.error(t("messages.eventWithoutDate"));
      return;
    }

    try {
      const fechaEvento = parseISO(evento.proxima_fecha_evento);
      const fechaInicio = format(fechaEvento, "yyyyMMdd'T'HHmmss");

      const fechaFin = format(
        new Date(fechaEvento.getTime() + 60 * 60 * 1000),
        "yyyyMMdd'T'HHmmss",
      );

      const nombreAnimal =
        evento.animal?.identificador ||
        evento.animal?.nombre_animal ||
        t("animal.unidentified");

      const titulo = `${evento.tipo_servicio} - ${nombreAnimal}`;

      const url = new URL("https://calendar.google.com/calendar/render");
      url.searchParams.append("action", "TEMPLATE");
      url.searchParams.append("text", titulo);
      url.searchParams.append("dates", `${fechaInicio}/${fechaFin}`);
      url.searchParams.append(
        "details",
        `${t("calendarDetails.type")}: ${evento.tipo_servicio}\n${t("calendarDetails.animal")}: ${nombreAnimal}\n${t("calendarDetails.id")}: ${evento.id}`,
      );

      if (evento.animal?.nombre_animal) {
        url.searchParams.append(
          "location",
          `${t("calendarDetails.animal")}: ${evento.animal.nombre_animal}`,
        );
      }

      window.open(url.toString(), "_blank");

      toast.success(t("messages.openingGoogleCalendar"));
    } catch (error) {
      toast.error(t("messages.googleCalendarError"));
    }
  };

  const renderizarDia = (dia: Date) => {
    const eventosDelDia = obtenerEventosDelDia(dia);
    const esMesActual = isSameMonth(dia, fechaActual);
    const esHoy = isToday(dia);
    const esPasado = isPast(dia) && !isToday(dia);
    const cantidadEventos = eventosDelDia.length;

    return (
      <div
        key={dia.toString()}
        className={`
          min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 border border-gray-200 
          ${!esMesActual ? "bg-gray-50 text-gray-400" : "bg-white"}
          ${esHoy ? "bg-blue-50 border-blue-300" : ""}
          ${esPasado && esMesActual ? "opacity-50" : ""}
          relative group
        `}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-start">
            <span
              className={`
              text-xs sm:text-sm font-medium
              ${esHoy ? "bg-blue-500 text-white rounded-full w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center" : ""}
              ${!esMesActual ? "text-gray-400" : ""}
            `}
            >
              {getDate(dia)}
            </span>

            {cantidadEventos > 0 && (
              <Badge
                variant="secondary"
                className="text-[8px] sm:text-[10px] px-1 sm:px-1.5 py-0"
              >
                {cantidadEventos}
              </Badge>
            )}
          </div>

          {cantidadEventos > 0 && (
            <div className="flex flex-wrap gap-0.5 mt-0.5 sm:mt-1">
              {eventosDelDia.slice(0, 3).map((evento, idx) => (
                <div
                  key={idx}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${getColorEvento(evento)}`}
                />
              ))}
              {cantidadEventos > 3 && (
                <span className="text-[8px] text-gray-500">
                  +{cantidadEventos - 3}
                </span>
              )}
            </div>
          )}

          {cantidadEventos > 0 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute inset-0 cursor-pointer" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs p-2">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold">
                      {format(dia, "EEEE d MMMM", { locale: dateLocale })}
                    </p>
                    {eventosDelDia.map((evento) => (
                      <div
                        key={evento.id}
                        className="text-xs py-1 border-t border-gray-100 first:border-t-0"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex-1 cursor-pointer hover:text-blue-600">
                            <span className="font-medium">
                              {evento.tipo_servicio}
                            </span>
                            <span className="text-gray-500">
                              {" - "}
                              {evento.animal?.identificador ||
                                evento.animal?.nombre_animal ||
                                t("animal.unidentified")}
                            </span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              agregarAGoogleCalendar(evento);
                            }}
                            className="text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded p-1 transition-colors"
                            title={t("buttons.addToGoogleCalendar")}
                            aria-label={t("buttons.addToGoogleCalendar")}
                          >
                            <CalendarIcon className="h-3 w-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
    );
  };

  const diasSemana = [
    t("weekdays.monday"),
    t("weekdays.tuesday"),
    t("weekdays.wednesday"),
    t("weekdays.thursday"),
    t("weekdays.friday"),
    t("weekdays.saturday"),
    t("weekdays.sunday"),
  ];

  const eventosDelMes = Array.from(eventosPorFecha.entries()).filter(
    ([fecha]) => {
      const fechaObj = parseISO(fecha);
      return isSameMonth(fechaObj, fechaActual);
    },
  );

  const totalEventosMes = eventosDelMes.reduce(
    (total, [_, eventos]) => total + eventos.length,
    0,
  );

  return (
    <Card className="w-full mt-5">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm sm:text-base flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 sm:h-5 sm:w-5" />
            {t("title")}
          </CardTitle>
          <div className="flex items-center gap-1 sm:gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={irHoy}
              className="text-xs h-7 sm:h-8"
            >
              {t("buttons.today")}
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={mesAnterior}
              className="h-7 w-7 sm:h-8 sm:w-8"
              aria-label={t("buttons.previousMonth")}
              title={t("buttons.previousMonth")}
            >
              <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
            <span className="text-xs sm:text-sm font-medium min-w-[100px] text-center">
              {format(fechaActual, "MMMM yyyy", { locale: dateLocale })}
            </span>
            <Button
              variant="outline"
              size="icon"
              onClick={mesSiguiente}
              className="h-7 w-7 sm:h-8 sm:w-8"
              aria-label={t("buttons.nextMonth")}
              title={t("buttons.nextMonth")}
            >
              <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mt-2 text-[10px] sm:text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500" />
            <span>{t("legend.urgent")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-orange-500" />
            <span>{t("legend.soon")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500" />
            <span>{t("legend.upcoming")}</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500" />
            <span>{t("legend.scheduled")}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-t-lg overflow-hidden">
          {diasSemana.map((dia) => (
            <div
              key={dia}
              className="bg-gray-50 text-center py-1 sm:py-2 text-[10px] sm:text-xs font-medium text-gray-600"
            >
              {dia}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-b-lg overflow-hidden">
          {diasDelMes.map((dia) => renderizarDia(dia))}
        </div>

        <div className="mt-3 sm:mt-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
          <p className="text-[10px] sm:text-xs text-gray-600">
            <span className="font-medium">{t("summary.label")}</span>{" "}
            {totalEventosMes > 0
              ? t("summary.withEvents", {
                  events: totalEventosMes,
                  totalDays: eventosDelMes.length,
                })
              : t("summary.noEvents")}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CalendarioEventos;
