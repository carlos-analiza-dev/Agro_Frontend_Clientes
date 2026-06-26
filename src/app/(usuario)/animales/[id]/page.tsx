"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PawPrintIcon, RefreshCw, AlertCircle } from "lucide-react";
import useAnimalById from "@/hooks/animales/useAnimalById";
import { useParams } from "next/navigation";
import FormEditAnimales from "@/components/animales/FormEditAnimales";
import FormAddPorcino from "@/components/animales/FormAddPorcino";
import FormAddPeces from "@/components/animales/FormAddPeces";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import FormEditEquino from "@/components/animales/FormEditEquino";
import FormEditAvicola from "@/components/animales/FormEditAvicola";
import FormEditPeces from "@/components/animales/FormEditPeces";

const AnimalDetailsPage = () => {
  const params = useParams();
  const animalId = params.id as string;
  const [activeTab, setActiveTab] = useState("animal");
  const { data: animalData, isLoading } = useAnimalById(animalId);
  const animal = animalData?.data;

  const especiesConPadres = ["caprino", "ovino", "bovino", "porcino"];
  const especiesConFormularioEspecifico = ["avicola", "piscicola", "equino"];

  if (isLoading) {
    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (!animal) {
    return (
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <p>No se encontró el animal</p>
        </div>
      </div>
    );
  }

  const especieNombre = animal.especie?.nombre?.toLowerCase() || "";

  const tieneFormularioEspecifico =
    especiesConFormularioEspecifico.includes(especieNombre);
  const tienePadres = especiesConPadres.includes(especieNombre);
  const tieneFormulario = tieneFormularioEspecifico || tienePadres;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="flex items-center mb-6">
        <PawPrintIcon className="h-5 w-5 md:h-8 md:w-8 mr-2" />
        <h1 className="text-lg md:text-3xl font-bold">Editar Animal</h1>
      </div>

      {tieneFormulario ? (
        <>
          {especieNombre === "porcino" && <FormAddPorcino />}
          {especieNombre === "avicola" && (
            <FormEditAvicola animal={animal} animalId={animalId} />
          )}
          {especieNombre === "piscicola" && (
            <FormEditPeces animal={animal} animalId={animalId} />
          )}

          {especieNombre === "equino" && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="animal">Datos Animal</TabsTrigger>
                <TabsTrigger value="padre">Datos Padre</TabsTrigger>
                <TabsTrigger value="madre">Datos Madre</TabsTrigger>
              </TabsList>

              <FormEditEquino
                animalId={animalId}
                setActiveTab={setActiveTab}
                animal={animal}
              />
            </Tabs>
          )}

          {especiesConPadres.includes(especieNombre) && (
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="animal">Datos Animal</TabsTrigger>
                <TabsTrigger value="padre">Datos Padre</TabsTrigger>
                <TabsTrigger value="madre">Datos Madre</TabsTrigger>
              </TabsList>

              <FormEditAnimales
                animalId={animalId}
                setActiveTab={setActiveTab}
                animal={animal}
              />
            </Tabs>
          )}
        </>
      ) : (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-5 w-5" />
          <AlertTitle>Formulario no disponible</AlertTitle>
          <AlertDescription>
            No se encontró un formulario específico para la especie "
            {animal.especie?.nombre || "No especificada"}". Esta especie no
            tiene configurado un formulario de edición en el sistema.
            {especieNombre && (
              <div className="mt-2 text-sm text-muted-foreground">
                Especies disponibles para edición: porcino, avicola, piscicola,
                equino, caprino, ovino, bovino
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AnimalDetailsPage;
