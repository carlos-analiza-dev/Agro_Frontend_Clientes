"use client";
import useGetTotalAnimales from "@/hooks/dashboard/useGetTotalAnimales";
import useGetTotalFincas from "@/hooks/dashboard/useGetTotalFincas";
import CardTotales from "./ui/CardTotales";
import useGetTotalCitasCompletadas from "@/hooks/dashboard/useGetTotalCitasCompletadas";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import ProduccionGanadera from "./ui/ProduccionGanadera";
import { Construction, Wrench, Clock } from "lucide-react";
import { useState } from "react";

const PanelPageGanadero = () => {
  const { data: total_animales } = useGetTotalAnimales();
  const { data: total_fincas } = useGetTotalFincas();
  const { data: citas_completadas } = useGetTotalCitasCompletadas();
  const [nombreSeccion, setNombreSeccion] = useState<string>("Ganadero");

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Panel de {nombreSeccion}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <CardTotales
          titulo="Total de Animales Registrados"
          total={total_animales || 0}
          sub_titulo="Animales en total"
        />
        <CardTotales
          titulo="Total de Fincas"
          total={total_fincas || 0}
          sub_titulo="Fincas en total"
        />
        <CardTotales
          titulo="Total de Citas Completadas"
          total={citas_completadas || 0}
          sub_titulo="Citas en total"
        />
      </div>

      <div className="w-full">
        <Tabs defaultValue="ganaderia" className="w-full">
          <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full gap-2 mb-20 md:mb-8">
            <TabsTrigger
              onClick={() => setNombreSeccion("Ganaderia")}
              value="ganaderia"
              className="text-sm sm:text-base"
            >
              Ganadería
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setNombreSeccion("Agricultura")}
              value="agricola"
              className="text-sm sm:text-base"
            >
              Agrícola
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setNombreSeccion("Produccion")}
              value="produccion"
              className="text-sm sm:text-base"
            >
              Producción
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ganaderia">
            <ProduccionGanadera />
          </TabsContent>

          <TabsContent value="agricola">
            <Card className="w-full border-dashed border-2 border-yellow-300 bg-yellow-50">
              <CardHeader>
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="rounded-full bg-yellow-100 p-4">
                    <Construction className="h-12 w-12 text-yellow-600" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-yellow-700">
                    Módulo en Desarrollo
                  </CardTitle>
                  <CardDescription className="text-base text-yellow-600 max-w-md">
                    Estamos trabajando en el módulo Agrícola para ofrecerte las
                    mejores herramientas.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white border border-yellow-200 rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Próximamente Disponible
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Este módulo estará disponible en las próximas
                            actualizaciones del sistema.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Wrench className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Funcionalidades en Desarrollo
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Estamos implementando herramientas para gestión de
                            cultivos, cosechas y análisis agrícola.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <h4 className="font-medium text-gray-700 mb-2">
                      ¿Qué incluirá este módulo?
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700">
                          Gestión de Cultivos
                        </p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700">
                          Control de Cosechas
                        </p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700">
                          Análisis de Suelos
                        </p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700">
                          Planificación Agrícola
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button
                  disabled
                  className="bg-yellow-600 hover:bg-yellow-700 cursor-not-allowed opacity-70"
                >
                  <Clock className="mr-2 h-4 w-4" />
                  Módulo en Desarrollo
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="produccion">
            <Card className="w-full border-dashed border-2 border-blue-300 bg-blue-50">
              <CardHeader>
                <div className="flex flex-col items-center justify-center text-center space-y-4">
                  <div className="rounded-full bg-blue-100 p-4">
                    <Construction className="h-12 w-12 text-blue-600" />
                  </div>
                  <CardTitle className="text-xl sm:text-2xl font-bold text-blue-700">
                    Módulo en Construcción
                  </CardTitle>
                  <CardDescription className="text-base text-blue-600 max-w-md">
                    Estamos desarrollando el módulo de Producción con
                    herramientas avanzadas de análisis.
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="bg-white border border-blue-200 rounded-lg p-6">
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Clock className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            En Proceso de Desarrollo
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Este módulo se encuentra actualmente en fase de
                            desarrollo y pruebas.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start space-x-3">
                        <Wrench className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            Características Próximas
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Estamos trabajando en análisis de productividad,
                            reportes avanzados y métricas de producción.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center">
                    <h4 className="font-medium text-gray-700 mb-2">
                      Funcionalidades Planificadas
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700">
                          Análisis de Productividad
                        </p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700">
                          Reportes Avanzados
                        </p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700">
                          Métricas de Producción
                        </p>
                      </div>
                      <div className="bg-white border border-gray-200 rounded-lg p-3">
                        <p className="text-sm font-medium text-gray-700">
                          Planificación Estratégica
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-white border border-blue-100 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-gray-800">
                          Progreso del Desarrollo
                        </h5>
                        <p className="text-sm text-gray-600">
                          Estamos avanzando en las funcionalidades principales
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-2xl font-bold text-blue-600">
                          65%
                        </span>
                        <p className="text-xs text-gray-500">Completado</p>
                      </div>
                    </div>
                    <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: "65%" }}
                      ></div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col items-center space-y-4">
                <Button
                  disabled
                  className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 cursor-not-allowed opacity-70"
                >
                  <Construction className="mr-2 h-4 w-4" />
                  Módulo en Construcción
                </Button>
                <p className="text-sm text-gray-500 text-center">
                  Estimamos disponibilidad en las próximas semanas
                </p>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PanelPageGanadero;
