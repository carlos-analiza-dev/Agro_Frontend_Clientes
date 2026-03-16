"use client";
import { Card, CardContent } from "@/components/ui/card";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Scale,
  TrendingUp,
} from "lucide-react";
import React, { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import { CalcularPesoPromedio } from "@/api/peso-promedio-animal/accions/calcular-rango-peso";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import FormCalcularPesos from "./ui/FormCalcularPesos";
import CardPesos from "./ui/CardPesos";
import ResumenCalc from "./ui/ResumenCalc";
import { ResponseRangoEdad } from "@/api/peso-promedio-animal/interfaces/calcular-rango-peso.interface";
import ButtonBack from "@/components/generics/ButtonBack";
import useGetHistorialPeso from "@/hooks/historial-pesos/useGetHistorialPeso";
import { TableSkeleton } from "@/components/generics/TableSkeleton ";
import TableHistorial from "./ui/TableHistorial";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import FormAddPeso from "./ui/FormAddPeso";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";

const AnimalHistorialPesoId = () => {
  const { id } = useParams();
  const animalId = id?.toString() ?? "";
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: historial, isLoading: cargando_historial } =
    useGetHistorialPeso(animalId);
  const [openModal, setOpenModal] = useState(false);
  const [edad, setEdad] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [pesos, setPesos] = useState<ResponseRangoEdad | null>(null);
  const [error, setError] = useState<string>("");
  const [activeTab, setActiveTab] = useState("calculadora");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const edadNum = parseInt(edad);

    if (isNaN(edadNum) || edadNum <= 0) {
      setError("Por favor ingrese una edad válida (mayor a 0)");
      return;
    }

    if (edadNum > 600) {
      setError("La edad ingresada es demasiado alta (máximo 600 meses)");
      return;
    }

    setIsLoading(true);

    try {
      const res = await CalcularPesoPromedio({
        animalId: animalId,
        edadMeses: edadNum,
      });

      setPesos(res);
      setActiveTab("resultados");

      toast.success(
        <div>
          <p className="font-semibold">¡Cálculo exitoso!</p>
          <p className="text-sm">
            Rango de peso para {res.raza} calculado correctamente
          </p>
        </div>,
        {
          icon: <CheckCircle2 className="h-5 w-5 text-green-500" />,
          style: { backgroundColor: "#f0fdf4", color: "#166534" },
        },
      );
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al calcular el rango de peso";

        setError(errorMessage);
        toast.error(errorMessage, {
          icon: <AlertCircle className="h-5 w-5 text-red-500" />,
          style: { backgroundColor: "#fef2f2", color: "#991b1b" },
        });
      } else {
        const errorMsg = "Ocurrió un error al procesar el rango de peso";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const edadNum = parseInt(edad);
  const pesoPromedio = pesos
    ? Math.round((pesos.pesoMinimoEsperado + pesos.pesoMaximoEsperado) / 2)
    : 0;

  const estadisticas = useMemo(() => {
    if (!historial || historial.length === 0) return null;

    const pesosNumericos = historial.map((h) => {
      if (typeof h.peso === "number") return h.peso;

      const pesoNum = parseFloat(h.peso);
      return isNaN(pesoNum) ? 0 : pesoNum;
    });

    const ultimoPeso = pesosNumericos[pesosNumericos.length - 1];

    return {
      totalRegistros: historial.length,
      pesoActual: ultimoPeso,
      pesoMinimo: Math.min(...pesosNumericos),
      pesoMaximo: Math.max(...pesosNumericos),
      pesoPromedio: Math.round(
        pesosNumericos.reduce((a, b) => a + b, 0) / pesosNumericos.length,
      ),
      fechaUltimoRegistro: historial[0]?.fecha,
    };
  }, [historial]);

  return (
    <TooltipProvider>
      <div className="container p-4 md:p-6 space-y-6">
        <ButtonBack isMobil={isMobile} />

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              Control de Peso
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Gestione y monitoree el peso del animal a lo largo del tiempo
            </p>
          </div>

          {estadisticas && (
            <div className="flex gap-2">
              <Badge variant="outline" className="px-3 py-1">
                <span className="text-xs text-gray-500 mr-1">Último:</span>
                <span className="font-semibold">
                  {estadisticas.pesoActual} Kg
                </span>
              </Badge>
              {pesos && (
                <Badge variant="outline" className="px-3 py-1 bg-blue-50">
                  <Scale className="h-3 w-3 mr-1 text-blue-500" />
                  <span className="font-semibold">{pesos.raza}</span>
                </Badge>
              )}
            </div>
          )}
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-4"
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="calculadora">Calculadora</TabsTrigger>
            <TabsTrigger value="resultados" disabled={!pesos}>
              Resultados
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calculadora" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="lg:col-span-1">
                <CardContent className="p-6">
                  <FormCalcularPesos
                    handleSubmit={handleSubmit}
                    edad={edad}
                    setEdad={setEdad}
                    setError={setError}
                    isLoading={isLoading}
                    error={error}
                    edadNum={edadNum}
                  />
                </CardContent>
              </Card>

              <div className="lg:col-span-2 space-y-6">
                {!pesos && !isLoading && !error && (
                  <Card className="bg-gray-50 border-dashed">
                    <CardContent className="p-12 text-center">
                      <div className="bg-white rounded-full w-20 h-20 mx-auto mb-4 flex items-center justify-center shadow-sm">
                        <Scale className="h-10 w-10 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">
                        Sin datos para mostrar
                      </h3>
                      <p className="text-gray-500 max-w-md mx-auto">
                        Ingrese la edad del animal y presione
                        &quot;Calcular&quot; para ver el rango de peso estimado
                        según su raza
                      </p>
                    </CardContent>
                  </Card>
                )}

                {isLoading && (
                  <Card>
                    <CardContent className="p-8">
                      <div className="flex flex-col items-center justify-center space-y-4">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
                        <div className="text-center">
                          <p className="text-lg font-medium text-gray-700">
                            Calculando rango de peso...
                          </p>
                          <p className="text-sm text-gray-500">
                            Esto tomará solo unos segundos
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {pesos && !isLoading && (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <CardPesos
                        tipo="minimo"
                        peso={pesos.pesoMinimoEsperado}
                        rangoEdad={pesos.rangoEdad}
                      />
                      <CardPesos
                        tipo="maximo"
                        peso={pesos.pesoMaximoEsperado}
                        rangoEdad={pesos.rangoEdad}
                      />
                    </div>

                    <ResumenCalc pesoPromedio={pesoPromedio} pesos={pesos} />
                  </>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="resultados" className="space-y-6">
            {pesos && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="lg:col-span-1">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-blue-500" />
                      Comparativa con el Historial
                    </h3>

                    {estadisticas ? (
                      <div className="space-y-4">
                        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <span className="text-sm text-gray-600">
                            Peso actual:
                          </span>
                          <span className="font-bold text-lg">
                            {estadisticas.pesoActual} Kg
                          </span>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Rango esperado:
                            </span>
                            <span className="font-medium">
                              {pesos.pesoMinimoEsperado} -{" "}
                              {pesos.pesoMaximoEsperado} Kg
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 text-center py-8">
                        No hay historial de pesos para comparar
                      </p>
                    )}
                  </CardContent>
                </Card>

                <div className="lg:col-span-2">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <CardPesos
                      tipo="minimo"
                      peso={pesos.pesoMinimoEsperado}
                      rangoEdad={pesos.rangoEdad}
                    />
                    <CardPesos
                      tipo="maximo"
                      peso={pesos.pesoMaximoEsperado}
                      rangoEdad={pesos.rangoEdad}
                    />
                  </div>
                  <ResumenCalc pesoPromedio={pesoPromedio} pesos={pesos} />
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-xl font-bold">Historial de Pesos</h2>
              {estadisticas && (
                <p className="text-sm text-gray-500">
                  {estadisticas.totalRegistros} registros • Último:{" "}
                  {estadisticas.pesoActual} Kg
                </p>
              )}
            </div>
            <Button onClick={() => setOpenModal(true)}>Agregar +</Button>
          </div>

          {cargando_historial ? (
            <TableSkeleton />
          ) : (
            <TableHistorial
              historial={historial}
              rangoPeso={
                pesos
                  ? {
                      minimo: pesos.pesoMinimoEsperado,
                      maximo: pesos.pesoMaximoEsperado,
                    }
                  : null
              }
            />
          )}
        </div>
      </div>

      <AlertDialog
        open={openModal}
        onOpenChange={() => setOpenModal(!openModal)}
      >
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle> ¿Agregar nuevo peso?</AlertDialogTitle>
            <AlertDialogDescription>
              Ingresa el peso actual del animal.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <FormAddPeso
            animalId={animalId}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
};

export default AnimalHistorialPesoId;
