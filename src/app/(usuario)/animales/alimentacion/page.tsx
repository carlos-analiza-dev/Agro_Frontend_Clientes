"use client";

import ButtonBack from "@/components/generics/ButtonBack";
import useGetAlimentacionAnimales from "@/hooks/alimentacion_animales/useGetAlimentacionAnimales";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { DollarSign, PiggyBank, TrendingUp, CalendarDays } from "lucide-react";
import Image from "next/image";
import SkeletonTable from "@/components/generics/SkeletonTable";
import TableAlimentacionAnimal from "./ui/TableAlimentacionAnimal";
import { useAuthStore } from "@/providers/store/useAuthStore";

const AlimentacionAnimal = () => {
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda || "$";
  const { data: alimentacion, isLoading } = useGetAlimentacionAnimales();

  if (isLoading) {
    return (
      <>
        <div className="mb-5">
          <SkeletonTable />
        </div>
        <div className="mb-5">
          <SkeletonTable />
        </div>
      </>
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

  const fechaActual = new Date().toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <ButtonBack />

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Alimentación de Animales</h1>
        <Badge variant="outline" className="px-3 py-1">
          <CalendarDays className="h-4 w-4 mr-2" />
          {fechaActual}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Costo Total General Diario
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-primary">
              {moneda} {costoTotalGeneral.toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Total de todos los animales
            </p>
          </CardContent>
        </Card>

        <Card className="bg-secondary/5 border-secondary/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <PiggyBank className="h-4 w-4 text-secondary-foreground" />
              Promedio por Animal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-secondary-foreground">
              {moneda} {promedioPorAnimal}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Por animal/día</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total Animales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{alimentacion?.length || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">
              Animales con registros
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6">
        {alimentacion?.map((item) => {
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

          return (
            <Card key={animal.id} className="shadow-md overflow-hidden">
              <CardHeader className="border-b bg-muted/30">
                <CardTitle className="flex items-center gap-4">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20">
                    <Image
                      src={imagen}
                      alt={animal.identificador}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-lg font-semibold">
                          {animal.identificador}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {animal.sexo} • {animal.color}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-muted-foreground">
                          Costo diario
                        </p>
                        <p className="text-xl font-bold text-primary">
                          {moneda} {totalCosto.toFixed(2)}
                        </p>
                        <Badge variant="secondary" className="mt-1">
                          {porcentajeDelTotal}% del total
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="pt-4">
                <TableAlimentacionAnimal
                  alimentos={alimentos}
                  totalCosto={totalCosto}
                  moneda={moneda}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>

      {alimentacion && alimentacion.length > 0 && (
        <Card className="bg-muted/50">
          <CardContent className="py-4">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="font-medium">Resumen diario:</span>
              </div>
              <div className="flex gap-6">
                <div>
                  <span className="text-muted-foreground">Total general: </span>
                  <span className="font-bold text-primary">
                    {moneda} {costoTotalGeneral.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-muted-foreground">
                    Promedio/animal:{" "}
                  </span>
                  <span className="font-bold">
                    {moneda} {promedioPorAnimal}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AlimentacionAnimal;
