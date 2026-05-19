"use client";
import useGetPaqueteByCliente from "@/hooks/paquetes/useGetPaqueteByCliente";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Crown,
  Calendar,
  AlertCircle,
  TrendingUp,
  Building2,
  PawPrint,
  Users,
  CheckCircle2,
  XCircle,
  ArrowRight,
  Gift,
  Sparkles,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { MiPlanSkeleton } from "./ui/MiPlanSkeleton";
import {
  getBadgeColor,
  getPlanColor,
  getPlanIcon,
} from "@/helpers/funciones/paquetes/get-infos";

const MiPlanPage = () => {
  const { data: paquete, isLoading } = useGetPaqueteByCliente();
  const router = useRouter();

  if (isLoading) {
    return <MiPlanSkeleton />;
  }

  if (!paquete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto text-center">
            <CardHeader>
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Crown className="h-10 w-10 text-gray-400" />
              </div>
              <CardTitle className="text-2xl">Sin Plan Activo</CardTitle>
              <CardDescription>
                Aún no tienes un plan activo. Adquiere uno para acceder a todos
                los beneficios.
              </CardDescription>
            </CardHeader>
            <CardFooter className="flex justify-center">
              <Button
                onClick={() => router.push("/comprar-plan")}
                className="bg-gradient-to-r from-blue-600 to-purple-600"
              >
                <Gift className="mr-2 h-4 w-4" />
                Ver Planes Disponibles
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    );
  }

  const { fechaInicio, fechaFin, activo, paquete: plan } = paquete;

  const fechaInicioDate = new Date(fechaInicio);
  const fechaFinDate = fechaFin ? new Date(fechaFin) : null;
  const ahora = new Date();

  const diasTotales = fechaFinDate
    ? Math.ceil(
        (fechaFinDate.getTime() - fechaInicioDate.getTime()) /
          (1000 * 60 * 60 * 24),
      )
    : 30;
  const diasTranscurridos = fechaFinDate
    ? Math.min(
        Math.ceil(
          (ahora.getTime() - fechaInicioDate.getTime()) / (1000 * 60 * 60 * 24),
        ),
        diasTotales,
      )
    : Math.min(
        Math.ceil(
          (ahora.getTime() - fechaInicioDate.getTime()) / (1000 * 60 * 60 * 24),
        ),
        diasTotales,
      );
  const diasRestantes = Math.max(diasTotales - diasTranscurridos, 0);
  const progreso = (diasTranscurridos / diasTotales) * 100;

  const estaPorVencer = diasRestantes <= 7 && diasRestantes > 0;
  const estaVencido = fechaFinDate && fechaFinDate < ahora;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Plan Actual</h1>
          <p className="text-gray-600 mt-2">
            Aquí puedes ver los detalles de tu plan y su estado actual
          </p>
        </div>

        {estaVencido && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Plan Vencido</AlertTitle>
            <AlertDescription>
              Tu plan ha vencido. Renueva para seguir usando el sistema y no
              perder beneficios.
              <Button
                variant="link"
                className="text-red-700 font-semibold px-0 ml-2"
                onClick={() => router.push("/comprar-plan")}
              >
                Renovar ahora
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {estaPorVencer && !estaVencido && (
          <Alert className="mb-6 bg-yellow-50 border-yellow-200">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertTitle className="text-yellow-800">Plan por vencer</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Tu plan vencerá en {diasRestantes} días. Renueva pronto para no
              perder acceso a las funcionalidades.
              <Button
                variant="link"
                className="text-yellow-700 font-semibold px-0 ml-2"
                onClick={() => router.push("/comprar-plan")}
              >
                Renovar ahora
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card
              className={`overflow-hidden border-2 ${getPlanColor(plan.tipo)}`}
            >
              <CardHeader className="relative">
                <div className="absolute top-4 right-4">
                  <Badge className={getBadgeColor(plan.tipo)}>
                    {plan.tipo}
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-full bg-white shadow-md">
                    {getPlanIcon(plan.tipo)}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{plan.nombre}</CardTitle>
                    <CardDescription>
                      Desde el {formatDate(fechaInicioDate)}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white rounded-lg">
                  <div className="flex items-center gap-2">
                    {activo && !estaVencido ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                    <span className="font-medium">
                      {activo && !estaVencido ? "Plan Activo" : "Plan Inactivo"}
                    </span>
                  </div>
                  {fechaFinDate && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">
                        Vence: {formatDate(fechaFinDate)}
                      </span>
                    </div>
                  )}
                </div>

                {!estaVencido && fechaFinDate && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progreso del plan</span>
                      <span className="font-medium">
                        {diasTranscurridos} / {diasTotales} días
                      </span>
                    </div>
                    <Progress value={progreso} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Inicio: {formatDate(fechaInicioDate)}</span>
                      <span>Fin: {formatDate(fechaFinDate)}</span>
                    </div>
                  </div>
                )}

                <Separator />

                <div>
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Características incluidas
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <Building2 className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm text-gray-600">Fincas</p>
                        <p className="font-semibold">Hasta {plan.maxFincas}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <PawPrint className="h-5 w-5 text-green-500" />
                      <div>
                        <p className="text-sm text-gray-600">Animales</p>
                        <p className="font-semibold">
                          Hasta {plan.maxAnimales}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg">
                      <Users className="h-5 w-5 text-purple-500" />
                      <div>
                        <p className="text-sm text-gray-600">Trabajadores</p>
                        <p className="font-semibold">
                          Hasta {plan.maxTrabajadores}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-3">
                {!estaVencido && plan.tipo !== "FREE" && (
                  <Button
                    variant="outline"
                    onClick={() => router.push("/comprar-plan")}
                    className="flex-1"
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Cambiar Plan
                  </Button>
                )}
                {estaVencido && (
                  <Button
                    onClick={() => router.push("/comprar-plan")}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Gift className="mr-2 h-4 w-4" />
                    Renovar Plan
                  </Button>
                )}
                {!estaVencido && plan.tipo === "FREE" && (
                  <Button
                    onClick={() => router.push("/comprar-plan")}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <TrendingUp className="mr-2 h-4 w-4" />
                    Mejorar Plan
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Próximos Pasos</CardTitle>
                <CardDescription>
                  Recomendaciones para aprovechar tu plan
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <button
                  onClick={() => router.push("/fincas")}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Registrar tu primera finca</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </button>
                <Separator />
                <button
                  onClick={() => router.push("/animales")}
                  className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <PawPrint className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Agregar animales</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                </button>
                <Separator />
              </CardContent>
            </Card>

            {plan.tipo !== "FREE" && (
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-yellow-500" />
                    Beneficios Exclusivos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Soporte prioritario 24/7</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Reportes avanzados</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>API de integración</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span>Múltiples usuarios por finca</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiPlanPage;
