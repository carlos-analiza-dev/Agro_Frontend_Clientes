"use client";

import useServicioById from "@/hooks/servicios/useServicioById";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ShoppingCart,
  Tag,
  Building2,
  DollarSign,
  Clock,
  TrendingUp,
  Layers,
  Info,
  LogIn,
  UserPlus,
  Mail,
  Phone,
  MapPin as MapPinIcon,
} from "lucide-react";
import Link from "next/link";
import { PreciosPorPai } from "@/api/servicios/interfaces/response-categorias-services";
import SkeletonCard from "@/components/generics/SkeletonCard";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import ButtonBack from "@/components/generics/ButtonBack";
import Modal from "@/components/generics/Modal";

const ServicioPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const servicioId = id as string;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const paisStorage = localStorage.getItem("selectedCountry");
  const pais = paisStorage ? JSON.parse(paisStorage) : null;
  const paisId = pais?.id;
  const { data: servicio, isLoading } = useServicioById(servicioId);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSubServicio, setSelectedSubServicio] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const user = localStorage.getItem("user");
      setIsAuthenticated(!!token && !!user);
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!paisId) {
      router.push("/not-selected-country");
    }
  }, [paisId, router]);

  const handleSolicitarServicio = (subServicio: any) => {
    setSelectedSubServicio(subServicio);

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    const isAuth = !!token && !!user;

    if (isAuth) {
      router.push(`/solicitar-servicio/${subServicio.id}`);
    } else {
      setOpenModal(true);
    }
  };

  const handleLoginRedirect = () => {
    localStorage.setItem("redirectAfterLogin", window.location.pathname);
    localStorage.setItem(
      "selectedSubServicio",
      JSON.stringify(selectedSubServicio),
    );
    router.push("/login");
  };

  const handleRegisterRedirect = () => {
    localStorage.setItem("redirectAfterRegister", window.location.pathname);
    localStorage.setItem(
      "selectedSubServicio",
      JSON.stringify(selectedSubServicio),
    );
    router.push("/register");
  };

  if (isLoading) {
    return <SkeletonCard />;
  }

  if (!servicio) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-8">
          <Card className="text-center py-12">
            <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <CardTitle className="text-2xl mb-2">
              Servicio no encontrado
            </CardTitle>
            <p className="text-muted-foreground mb-6">
              No pudimos encontrar el servicio que estás buscando.
            </p>
            <Link href="/servicios">
              <Button variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Volver a servicios
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="max-w-6xl mx-auto">
          <ButtonBack isMobil={isMobile} />
          <div className="mb-8">
            <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20">
              <CheckCircle className="w-3 h-3 mr-1" />
              {servicio.data.isActive ? "Activo" : "Inactivo"}
            </Badge>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              {servicio.data.nombre}
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed">
              {servicio.data.descripcion}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Layers className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {servicio.data.subServicios?.length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Servicios</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">
                      {servicio.data.subServicios?.filter(
                        (s: any) => s.isActive,
                      ).length || 0}
                    </p>
                    <p className="text-sm text-muted-foreground">Activos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Package className="h-6 w-6 text-primary" />
              Servicios Disponibles
            </h2>
            <p className="text-muted-foreground mb-6">
              Explora todos los servicios disponibles dentro de{" "}
              {servicio.data.nombre}
            </p>

            {servicio.data.subServicios &&
            servicio.data.subServicios.length > 0 ? (
              <Tabs
                defaultValue={servicio.data.subServicios[0]?.id}
                className="w-full"
              >
                <TabsList className="w-full justify-start overflow-x-auto flex-nowrap mb-6">
                  {servicio.data.subServicios.map((subServicio: any) => (
                    <TabsTrigger
                      key={subServicio.id}
                      value={subServicio.id}
                      className="flex-shrink-0"
                    >
                      {subServicio.nombre}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {servicio.data.subServicios.map((subServicio: any) => (
                  <TabsContent key={subServicio.id} value={subServicio.id}>
                    <Card>
                      <CardHeader>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <CardTitle className="text-2xl mb-2">
                              {subServicio.nombre}
                            </CardTitle>
                            <Badge
                              variant={
                                subServicio.isActive ? "default" : "destructive"
                              }
                            >
                              {subServicio.isActive
                                ? "Disponible"
                                : "No disponible"}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {subServicio.descripcion && (
                          <div>
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                              <Info className="h-4 w-4" />
                              Descripción
                            </h3>
                            <p className="text-muted-foreground">
                              {subServicio.descripcion}
                            </p>
                          </div>
                        )}

                        <Separator />

                        {subServicio.preciosPorPais &&
                          subServicio.preciosPorPais.length > 0 && (
                            <div>
                              <h3 className="font-semibold mb-4 flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Paquetes por País
                              </h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {subServicio.preciosPorPais.map(
                                  (precio: PreciosPorPai) => (
                                    <Card
                                      key={precio.id}
                                      className="bg-muted/30"
                                    >
                                      <CardContent className="pt-4">
                                        <div className="flex justify-between items-start mb-3">
                                          <div>
                                            <p className="font-semibold flex items-center gap-1">
                                              <Building2 className="h-4 w-4" />
                                              {precio.pais?.nombre}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                              {precio.pais?.code}
                                            </p>
                                          </div>
                                          <Badge variant="outline">
                                            {precio.pais?.simbolo_moneda}{" "}
                                            {precio.precio}
                                          </Badge>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                                          <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                              <p className="text-muted-foreground text-xs">
                                                Tiempo
                                              </p>
                                              <p className="font-medium">
                                                {precio.tiempo} hrs
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Tag className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                              <p className="text-muted-foreground text-xs">
                                                Cantidad
                                              </p>
                                              <p className="font-medium">
                                                {precio.cantidadMin} -{" "}
                                                {precio.cantidadMax} animales
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                        <Separator />

                        <Button
                          className="w-full md:w-auto gap-2"
                          disabled={!subServicio.isActive}
                          size="lg"
                          onClick={() => handleSolicitarServicio(subServicio)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Solicitar {subServicio.nombre}
                        </Button>
                      </CardContent>
                    </Card>
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <Card className="text-center py-12">
                <AlertCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <CardTitle className="text-xl mb-2">
                  No hay servicios disponibles
                </CardTitle>
                <p className="text-muted-foreground">
                  Este servicio no tiene servicios asociados actualmente.
                </p>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title="🔐 Autenticación Requerida"
        description="Para solicitar nuestros servicios es necesario que estés autenticado en nuestro sitio"
        size="xl"
        height="auto"
      >
        <div className="space-y-6 py-4">
          {selectedSubServicio && (
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/20">
              <h4 className="font-semibold text-primary mb-2">
                Servicio seleccionado:
              </h4>
              <p className="text-foreground font-medium">
                {selectedSubServicio.nombre}
              </p>
              {selectedSubServicio.descripcion && (
                <p className="text-sm text-muted-foreground mt-1">
                  {selectedSubServicio.descripcion.substring(0, 100)}...
                </p>
              )}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <Mail className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-medium text-sm">
                  Seguimiento en tiempo real
                </p>
                <p className="text-xs text-muted-foreground">
                  Recibe notificaciones y actualizaciones de tu solicitud
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
              <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-lg">
                <Phone className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Soporte prioritario</p>
                <p className="text-xs text-muted-foreground">
                  Atención personalizada para usuarios registrados
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-lg">
                <MapPinIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Historial de servicios</p>
                <p className="text-xs text-muted-foreground">
                  Accede a tu historial completo de solicitudes
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/50 rounded-lg">
                <DollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="font-medium text-sm">Ofertas exclusivas</p>
                <p className="text-xs text-muted-foreground">
                  Accede a promociones especiales para miembros
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={handleLoginRedirect}
              className="flex-1 gap-2 bg-primary hover:bg-primary/90"
              size="lg"
            >
              <LogIn className="h-4 w-4" />
              Iniciar Sesión
            </Button>
            <Button
              onClick={handleRegisterRedirect}
              variant="outline"
              className="flex-1 gap-2"
              size="lg"
            >
              <UserPlus className="h-4 w-4" />
              Registrarse
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground pt-2">
            Al autenticarte, aceptas nuestros{" "}
            <Link href="/terminos" className="text-primary hover:underline">
              términos y condiciones
            </Link>{" "}
            y{" "}
            <Link href="/privacidad" className="text-primary hover:underline">
              políticas de privacidad
            </Link>
          </p>
        </div>
      </Modal>
    </div>
  );
};

export default ServicioPage;
