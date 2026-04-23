import { Configuraciones } from "@/api/configuraciones-trabajadores/interface/response-config-trabajadores.interface";
import Modal from "@/components/generics/Modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import {
  Calendar,
  Mail,
  MapPin,
  Phone,
  CalendarDays,
  Clock,
} from "lucide-react";
import { Dispatch, SetStateAction, useMemo } from "react";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";

interface Props {
  selectedTrabajador: Configuraciones | null;
  setSelectedTrabajador: Dispatch<SetStateAction<Configuraciones | null>>;
  moneda: string;
}

const ModalConfig = ({
  selectedTrabajador,
  setSelectedTrabajador,
  moneda,
}: Props) => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const valoresCalculados = useMemo(() => {
    if (!selectedTrabajador) {
      return {
        horasPorDia: 0,
        valorHoraNormal: 0,
        valorHoraExtraDiurna: 0,
        valorHoraExtraNocturna: 0,
        valorHoraExtraFestiva: 0,
        salarioSemanal: 0,
        salarioMensual: 0,
        totalBonificaciones: 0,
        totalDeducciones: 0,
        totalNetoMensual: 0,
      };
    }

    const salarioDiario = Number(selectedTrabajador.salarioDiario);
    const diasTrabajadosSemanal = selectedTrabajador.diasTrabajadosSemanal || 5;
    const horasJornadaSemanal = selectedTrabajador.horasJornadaSemanal || 40;
    const factorHoraExtraDiurnas =
      Number(selectedTrabajador.factorHoraExtraDiurnas) || 1.5;
    const factorHoraExtraNocturnas =
      Number(selectedTrabajador.factorHoraExtraNocturnas) || 1.75;
    const factorHoraExtraFestivas =
      Number(selectedTrabajador.factorHoraExtraFestivas) || 2;

    const horasPorDia = horasJornadaSemanal / diasTrabajadosSemanal;
    const valorHoraNormal = horasPorDia > 0 ? salarioDiario / horasPorDia : 0;
    const valorHoraExtraDiurna = valorHoraNormal * factorHoraExtraDiurnas;
    const valorHoraExtraNocturna = valorHoraNormal * factorHoraExtraNocturnas;
    const valorHoraExtraFestiva = valorHoraNormal * factorHoraExtraFestivas;
    const salarioSemanal = salarioDiario * diasTrabajadosSemanal;
    const salarioMensual = salarioSemanal * 4;

    const totalBonificaciones =
      selectedTrabajador.bonificacionesFijas?.reduce(
        (sum, b) => sum + (Number(b.montoMensual) || 0),
        0,
      ) || 0;

    const totalDeducciones =
      selectedTrabajador.deduccionesFijas?.reduce(
        (sum, d) => sum + (Number(d.montoMensual) || 0),
        0,
      ) || 0;

    const totalNetoMensual =
      salarioMensual + totalBonificaciones - totalDeducciones;

    return {
      horasPorDia,
      valorHoraNormal,
      valorHoraExtraDiurna,
      valorHoraExtraNocturna,
      valorHoraExtraFestiva,
      salarioSemanal,
      salarioMensual,
      totalBonificaciones,
      totalDeducciones,
      totalNetoMensual,
    };
  }, [selectedTrabajador]);

  if (!selectedTrabajador) return null;

  return (
    <Modal
      open={!!selectedTrabajador}
      onOpenChange={() => setSelectedTrabajador(null)}
      title="Detalle del Trabajador"
      description="Información completa de configuración laboral"
      size="2xl"
      height="auto"
    >
      <div className="mt-6 mb-6">
        <Tabs defaultValue="general" className="w-full">
          <TabsList
            className={`grid w-full ${isMobile ? "grid-cols-2 gap-2" : "grid-cols-4"} mb-6`}
          >
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              General
            </TabsTrigger>
            <TabsTrigger
              value="bonificaciones"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Bonificaciones
            </TabsTrigger>
            {!isMobile && (
              <>
                <TabsTrigger
                  value="deducciones"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Deducciones
                </TabsTrigger>
                <TabsTrigger
                  value="historial"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Historial
                </TabsTrigger>
              </>
            )}
          </TabsList>

          {isMobile && (
            <div className="flex gap-2 mb-6">
              <TabsList className="grid grid-cols-2 gap-2 w-full">
                <TabsTrigger
                  value="deducciones"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Deducciones
                </TabsTrigger>
                <TabsTrigger
                  value="historial"
                  className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  Historial
                </TabsTrigger>
              </TabsList>
            </div>
          )}

          <TabsContent value="general" className="space-y-6 mt-2">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Información Personal
              </h3>
              <div
                className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-2 gap-4"}`}
              >
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Nombre Completo
                  </label>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">
                    {selectedTrabajador.trabajador.nombre}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Identificación
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedTrabajador.trabajador.identificacion}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Cargo
                  </label>
                  <p className="text-gray-900 dark:text-gray-100">
                    {selectedTrabajador.cargo || "No especificado"}
                  </p>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Estado
                  </label>
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        selectedTrabajador.activo
                          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {selectedTrabajador.activo ? "Activo" : "Inactivo"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Configuración Laboral
              </h3>
              <div
                className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-2 gap-4"}`}
              >
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Fecha Contratación</p>
                  <p className="text-sm font-medium">
                    {selectedTrabajador.fechaContratacion}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Salario Diario</p>
                  <p className="text-sm font-medium text-green-600">
                    {formatCurrency(selectedTrabajador.salarioDiario, moneda)}
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">Días por Semana</p>
                  </div>
                  <p className="text-sm font-medium">
                    {selectedTrabajador.diasTrabajadosSemanal || 5} días
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <p className="text-xs text-gray-500">Horas por Semana</p>
                  </div>
                  <p className="text-sm font-medium">
                    {selectedTrabajador.horasJornadaSemanal || 40} horas
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs text-gray-500">Horas por Día</p>
                  <p className="text-sm font-medium">
                    {valoresCalculados.horasPorDia.toFixed(1)} horas
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Factores de Hora Extra
              </h3>
              <div className="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Factor Hora Extra Diurna:
                  </span>
                  <span className="font-semibold text-orange-600">
                    {selectedTrabajador.factorHoraExtraDiurnas || 1.5}x
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Factor Hora Extra Nocturna:
                  </span>
                  <span className="font-semibold text-red-600">
                    {selectedTrabajador.factorHoraExtraNocturnas || 1.75}x
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Factor Hora Extra Festiva:
                  </span>
                  <span className="font-semibold text-purple-600">
                    {selectedTrabajador.factorHoraExtraFestivas || 2}x
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Desglose Salarial
              </h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Valor Hora Normal:
                  </span>
                  <span className="font-semibold text-blue-600">
                    {formatCurrency(valoresCalculados.valorHoraNormal, moneda)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Valor Hora Extra Diurna:
                  </span>
                  <span className="font-semibold text-orange-600">
                    {formatCurrency(
                      valoresCalculados.valorHoraExtraDiurna,
                      moneda,
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Valor Hora Extra Nocturna:
                  </span>
                  <span className="font-semibold text-red-600">
                    {formatCurrency(
                      valoresCalculados.valorHoraExtraNocturna,
                      moneda,
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Valor Hora Extra Festiva:
                  </span>
                  <span className="font-semibold text-purple-600">
                    {formatCurrency(
                      valoresCalculados.valorHoraExtraFestiva,
                      moneda,
                    )}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Salario Semanal:
                  </span>
                  <span className="font-semibold text-purple-600">
                    {formatCurrency(valoresCalculados.salarioSemanal, moneda)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t">
                  <span className="text-sm font-medium">
                    Salario Mensual Base:
                  </span>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(valoresCalculados.salarioMensual, moneda)}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Contacto
              </h3>
              <div
                className={`space-y-3 ${!isMobile && "grid grid-cols-2 gap-4"}`}
              >
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {selectedTrabajador.trabajador.telefono}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {selectedTrabajador.trabajador.email || "No registrado"}
                  </span>
                </div>
                <div className="flex items-center gap-2 col-span-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {selectedTrabajador.trabajador.direccion}
                  </span>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bonificaciones" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Bonificaciones Fijas</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Total mensual:{" "}
                  {formatCurrency(
                    valoresCalculados.totalBonificaciones,
                    moneda,
                  )}
                </p>
              </CardHeader>
              <CardContent>
                {selectedTrabajador.bonificacionesFijas &&
                selectedTrabajador.bonificacionesFijas?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTrabajador.bonificacionesFijas.map(
                      (bono: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{bono.concepto}</p>
                            <p className="text-sm text-gray-500">
                              Bonificación fija mensual
                            </p>
                          </div>
                          <p className="text-lg font-semibold text-green-600">
                            {formatCurrency(bono.montoMensual, moneda)}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No hay bonificaciones registradas
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="deducciones" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Deducciones Fijas</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Total mensual:{" "}
                  {formatCurrency(valoresCalculados.totalDeducciones, moneda)}
                </p>
              </CardHeader>
              <CardContent>
                {selectedTrabajador.deduccionesFijas &&
                selectedTrabajador.deduccionesFijas?.length > 0 ? (
                  <div className="space-y-3">
                    {selectedTrabajador.deduccionesFijas.map(
                      (deduccion: any, idx: number) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg"
                        >
                          <div>
                            <p className="font-medium">{deduccion.concepto}</p>
                            <p className="text-sm text-gray-500">
                              Deducción fija mensual
                            </p>
                          </div>
                          <p className="text-lg font-semibold text-red-600">
                            {formatCurrency(deduccion.montoMensual, moneda)}
                          </p>
                        </div>
                      ),
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">
                    No hay deducciones registradas
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historial" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  Resumen Financiero Mensual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Salario Base Mensual:</span>
                    <span className="font-semibold">
                      {formatCurrency(valoresCalculados.salarioMensual, moneda)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-green-600">
                    <span>Total Bonificaciones:</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        valoresCalculados.totalBonificaciones,
                        moneda,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-red-600">
                    <span>Total Deducciones:</span>
                    <span className="font-semibold">
                      {formatCurrency(
                        valoresCalculados.totalDeducciones,
                        moneda,
                      )}
                    </span>
                  </div>
                  <div className="border-t pt-3">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Neto Mensual:</span>
                      <span className="text-blue-600">
                        {formatCurrency(
                          valoresCalculados.totalNetoMensual,
                          moneda,
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-500">
                    Historial de Cambios
                  </label>
                  <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="font-medium">Fecha de Contratación</p>
                      <p className="text-sm text-gray-500">
                        {selectedTrabajador.fechaContratacion}
                      </p>
                    </div>
                  </div>
                  {selectedTrabajador.fechaBaja && (
                    <div className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                      <Calendar className="h-5 w-5 text-red-500" />
                      <div>
                        <p className="font-medium">Fecha de Baja</p>
                        <p className="text-sm text-gray-500">
                          {selectedTrabajador.fechaBaja}
                        </p>
                        <p className="text-sm text-gray-500">
                          Motivo: {selectedTrabajador.motivoBaja}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Modal>
  );
};

export default ModalConfig;
