// components/control-peso/PesoRazaAnimal.tsx
"use client";
import ButtonBack from "@/components/generics/ButtonBack";
import SkeletonCard from "@/components/generics/SkeletonCard";
import useGetPesosByRaza from "@/hooks/historial-pesos/useGetPesosByRaza";
import { Card, CardContent } from "@/components/ui/card";
import { Scale } from "lucide-react";
import { ResponsePesoByRaza } from "@/api/peso-promedio-animal/interfaces/obtener-pesos-by-raza.interface";
import CardRazas from "./ui/CardRazas";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import FormAddPesoRaza from "./ui/FormAddPesoRaza";

const PesoRazaAnimal = () => {
  const { data: pesos, isLoading } = useGetPesosByRaza();
  const [openModal, setOpenModal] = useState(false);
  const [selectedPeso, setSelectedPeso] = useState<ResponsePesoByRaza | null>(
    null,
  );

  const formatNumber = (value: string) => {
    return parseFloat(value).toFixed(2);
  };

  const handleEdit = (item: ResponsePesoByRaza) => {
    setSelectedPeso(item);
    setOpenModal(true);
  };

  const handleAdd = () => {
    setSelectedPeso(null);
    setOpenModal(true);
  };

  if (isLoading) {
    return (
      <div className="container p-4">
        <ButtonBack />
        <SkeletonCard />
      </div>
    );
  }

  return (
    <div className="container p-4">
      <ButtonBack />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Pesos Promedio por Raza
        </h1>
        <Button onClick={handleAdd}>Agregar +</Button>
      </div>

      {!pesos || pesos.length === 0 ? (
        <Card className="bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Scale className="h-16 w-16 text-gray-400 mb-4" />
            <p className="text-xl text-gray-600 text-center">
              No hay registros de pesos por raza
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Los pesos promedio aparecerán aquí cuando tengas registros
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pesos.map((item: ResponsePesoByRaza) => (
            <CardRazas key={item.id} item={item} onEdit={handleEdit} />
          ))}
        </div>
      )}

      <AlertDialog open={openModal} onOpenChange={setOpenModal}>
        <AlertDialogContent>
          <div className="flex justify-end">
            <AlertDialogCancel>X</AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedPeso ? "Editar Peso por Raza" : "Agregar Peso por Raza"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedPeso
                ? "Modifica el rango de peso promedio diario para esta raza"
                : "En este formulario podras agregar el peso promedio diario de tus animales por raza"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="p-3">
            <FormAddPesoRaza
              openModal={openModal}
              setOpenModal={setOpenModal}
              pesoData={selectedPeso}
              onSuccess={() => setSelectedPeso(null)}
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PesoRazaAnimal;
