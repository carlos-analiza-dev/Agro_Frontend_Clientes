"use client";

import ButtonBack from "@/components/generics/ButtonBack";
import useGetAlimentacionAnimales from "@/hooks/alimentacion_animales/useGetAlimentacionAnimales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  PiggyBank,
  ChevronRight,
  CircleDollarSign,
  Beef,
  Clock,
  AlertCircle,
  Plus,
} from "lucide-react";
import Image from "next/image";
import SkeletonTable from "@/components/generics/SkeletonTable";
import TableAlimentacionAnimal from "./ui/TableAlimentacionAnimal";
import { useAuthStore } from "@/providers/store/useAuthStore";
import SummaryTotalsCard from "./ui/SummaryTotalsCard";
import CardCostos from "./ui/CardCostos";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Modal from "@/components/generics/Modal";
import FormAlimentacionAnimal from "./ui/FormAlimentacionAnimal";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";

const AlimentacionAnimal = () => {
  const { cliente } = useAuthStore();

  const [openModal, setOpenModal] = useState(false);
  const moneda = cliente?.pais.simbolo_moneda || "$";
  const { data: alimentacion, isLoading } = useGetAlimentacionAnimales();
  const [selectedAnimal, setSelectedAnimal] = useState<string | null>(null);
  const router = useRouter();

  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleAddAlimentacion = () => {
    if (isMobile) {
      router.push("/animales/alimentacion/crear-alimentacion");
    } else {
      setOpenModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-muted rounded-full animate-pulse" />
            <div className="h-8 w-48 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <SkeletonTable />
            <SkeletonTable />
            <SkeletonTable />
          </div>
          <SkeletonTable />
        </div>
      </div>
    );
  }

  const costoTotalGeneral =
    alimentacion?.reduce((totalGeneral, item) => {
      const totalPorAnimal = item.alimentos.reduce(
        (total, alimento) => total + parseFloat(alimento.costo_diario),
        0,
      );
      return totalGeneral + totalPorAnimal;
    }, 0) || 0;

  const promedioPorAnimal = alimentacion?.length
    ? (costoTotalGeneral / alimentacion.length).toFixed(2)
    : 0;

  const animalesOrdenados = alimentacion?.sort((a, b) => {
    const totalA = a.alimentos.reduce(
      (sum, item) => sum + parseFloat(item.costo_diario),
      0,
    );
    const totalB = b.alimentos.reduce(
      (sum, item) => sum + parseFloat(item.costo_diario),
      0,
    );
    return totalB - totalA;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
        <ButtonBack isMobil={isMobile} />

        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Alimentación</h1>
          <Button
            onClick={handleAddAlimentacion}
            className="gap-2"
            size={isMobile ? "default" : "default"}
          >
            <Plus className="h-4 w-4" />
            {isMobile ? "Agregar" : "Agregar Alimentación"}
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          <CardCostos
            title="Costo Total General Diario"
            moneda={moneda}
            number={costoTotalGeneral.toFixed(2)}
            description="Total de todos los animales"
            icon={CircleDollarSign}
            primary={true}
          />

          <CardCostos
            title="Promedio por Animal"
            moneda={moneda}
            number={promedioPorAnimal}
            description="Por animal/día"
            icon={PiggyBank}
            primary={false}
          />

          <CardCostos
            title="Total Animales"
            number={alimentacion?.length || 0}
            description="Animales con registros"
            icon={Beef}
            primary={false}
          />
        </div>

        {alimentacion && alimentacion.length > 0 && (
          <div className="block sm:hidden">
            <p className="text-sm font-medium mb-2 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Acceso rápido
            </p>
            <ScrollArea className="w-full whitespace-nowrap rounded-lg border">
              <div className="flex w-max space-x-2 p-2">
                {animalesOrdenados?.map((item) => {
                  const totalCosto = item.alimentos.reduce(
                    (total, alimento) =>
                      total + parseFloat(alimento.costo_diario),
                    0,
                  );
                  return (
                    <Badge
                      key={item.animal.id}
                      variant="secondary"
                      className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors py-2 px-3"
                      onClick={() => setSelectedAnimal(item.animal.id)}
                    >
                      <span className="mr-1">{item.animal.identificador}</span>
                      <span className="text-xs opacity-70">
                        {moneda}
                        {totalCosto.toFixed(2)}
                      </span>
                    </Badge>
                  );
                })}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        )}

        <div className="space-y-4 sm:space-y-6">
          {animalesOrdenados?.map((item) => {
            const animal = item.animal;
            const alimentos = item.alimentos;

            const imagen =
              animal?.profileImages?.length > 0
                ? animal.profileImages[0].url
                : "/images/Image-not-found.png";

            const totalCosto = alimentos.reduce(
              (total, item) => total + parseFloat(item.costo_diario),
              0,
            );

            const porcentajeDelTotal = (
              (totalCosto / costoTotalGeneral) *
              100
            ).toFixed(1);

            const isSelected = selectedAnimal === animal.id;

            return (
              <Card
                key={animal.id}
                className={`
                  shadow-sm sm:shadow-md overflow-hidden transition-all duration-300
                  ${isSelected ? "ring-2 ring-primary border-primary" : "hover:shadow-lg"}
                `}
                id={animal.id}
              >
                <CardHeader className="p-4 sm:p-6 border-b bg-gradient-to-r from-muted/30 to-transparent">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div className="flex items-center gap-4">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-primary/20 shrink-0">
                        <Image
                          src={imagen}
                          alt={animal.identificador}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-lg sm:text-xl font-semibold truncate">
                            {animal.identificador}
                          </p>
                          <Badge variant="outline" className="text-xs">
                            {porcentajeDelTotal}%
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-2 flex-wrap">
                          <span>{animal.sexo}</span>
                          <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                          <span>{animal.color}</span>
                          {animal.razas?.[0]?.nombre && (
                            <>
                              <span className="w-1 h-1 bg-muted-foreground rounded-full" />
                              <span>{animal.razas[0].nombre}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="sm:text-right flex sm:block items-center justify-between mt-2 sm:mt-0">
                      <div>
                        <p className="text-xs text-muted-foreground sm:text-sm">
                          Costo diario
                        </p>
                        <div className="flex items-center gap-2 sm:justify-end">
                          <p className="text-xl sm:text-2xl font-bold text-primary">
                            {moneda} {totalCosto.toFixed(2)}
                          </p>
                          <ChevronRight className="h-5 w-5 text-muted-foreground sm:hidden" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="p-0 sm:p-4">
                  <TableAlimentacionAnimal
                    alimentos={alimentos}
                    totalCosto={totalCosto}
                    isMobile={isMobile}
                    moneda={moneda}
                    cliente={cliente}
                  />
                </CardContent>
              </Card>
            );
          })}
        </div>

        {alimentacion && alimentacion.length > 0 && (
          <SummaryTotalsCard
            moneda={moneda}
            costoTotalGeneral={costoTotalGeneral}
            promedioPorAnimal={promedioPorAnimal}
          />
        )}

        {(!alimentacion || alimentacion.length === 0) && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="bg-muted/50 p-4 rounded-full mb-4">
                <AlertCircle className="h-12 w-12 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold mb-2">
                No hay registros de alimentación
              </h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Comienza agregando alimentos a tus animales para ver su
                información aquí.
              </p>
              <Button onClick={handleAddAlimentacion} className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Agregar Primer Registro
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {!isMobile && (
        <Modal
          open={openModal}
          onOpenChange={setOpenModal}
          title="Agregar Alimentación"
          description="Registra la alimentación diaria de tu animal"
          size="xl"
        >
          <FormAlimentacionAnimal
            moneda={moneda}
            cliente={cliente}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default AlimentacionAnimal;
