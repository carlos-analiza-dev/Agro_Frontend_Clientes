"use client";
import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PawPrintIcon } from "lucide-react";
import FormAddAnimal from "@/components/animales/FormAddAnimal";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import FormAddAvicola from "@/components/animales/FormAddAvicola";
import FormAddPeces from "@/components/animales/FormAddPeces";
import FormAddEquino from "@/components/animales/FormAddEquino";
import FormAddCaprino from "@/components/animales/FormAddCaprino";
import FormAddOvino from "@/components/animales/FormAddOvino";
import FormAddPorcino from "@/components/animales/FormAddPorcino";

const CrearAnimalPage = () => {
  const especiesConPadres = ["bovino"];
  const [activeTab, setActiveTab] = useState("animal");
  const [especieName, setEspecieName] = useState("");
  const [selectedEspecieId, setSelectedEspecieId] = useState("");
  const { data: especies } = useGetEspecies();

  const especieNombreNormalizado = especieName.toLowerCase();
  const mostrarTabs = especiesConPadres.includes(especieNombreNormalizado);

  const especiesItems =
    especies?.data.map((especie) => ({
      label: especie.nombre,
      value: especie.id,
    })) || [];

  return (
    <div className="container mx-auto max-w-4xl">
      <div className="flex items-center mb-6">
        <PawPrintIcon className="h-5 w-5 md:h-8 md:w-8 mr-2" />
        <h1 className="text-lg md:text-3xl font-bold">Crear Nuevo Animal</h1>
      </div>

      <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border">
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Especie <span className="text-red-500">*</span>
          </Label>
          <RadioGroup
            value={selectedEspecieId}
            onValueChange={(value) => {
              setSelectedEspecieId(value);

              const especieSeleccionada = especies?.data.find(
                (especie) => especie.id === value,
              );

              setEspecieName(especieSeleccionada?.nombre || "");
            }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3"
          >
            {especiesItems.map((especie) => (
              <Label
                key={especie.value}
                htmlFor={`especie-${especie.value}`}
                className={`
        flex items-center gap-3 rounded-lg border p-4 cursor-pointer
        hover:bg-muted transition-colors
        ${
          selectedEspecieId === especie.value
            ? "border-primary bg-primary/10"
            : ""
        }
      `}
              >
                <RadioGroupItem
                  value={especie.value}
                  id={`especie-${especie.value}`}
                />
                <span className="font-medium">{especie.label}</span>
              </Label>
            ))}
          </RadioGroup>

          {!selectedEspecieId && (
            <p className="text-sm text-amber-600 dark:text-amber-400">
              ⚠️ Selecciona una especie para continuar
            </p>
          )}
        </div>
      </div>

      {!especieName && (
        <div className="mt-8 rounded-xl border border-dashed bg-muted/30 p-10 text-center">
          <PawPrintIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />

          <h2 className="text-2xl font-semibold mb-2">
            Selecciona una especie
          </h2>

          <p className="text-muted-foreground max-w-md mx-auto">
            Elige la especie del animal que deseas registrar para mostrar el
            formulario correspondiente.
          </p>
        </div>
      )}

      {especieName.toLowerCase() === "avicola" && (
        <FormAddAvicola selectedEspecieId={selectedEspecieId} />
      )}
      {especieName.toLowerCase() === "porcino" && (
        <FormAddPorcino selectedEspecieId={selectedEspecieId} />
      )}
      {especieName.toLowerCase() === "caprino" && (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-[90vh]"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="animal">Datos Animal</TabsTrigger>
            <TabsTrigger value="padre">Datos Padre</TabsTrigger>
            <TabsTrigger value="madre">Datos Madre</TabsTrigger>
          </TabsList>

          <FormAddCaprino
            setActiveTab={setActiveTab}
            selectedEspecieId={selectedEspecieId}
          />
        </Tabs>
      )}
      {especieName.toLowerCase() === "ovino" && (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-[90vh]"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="animal">Datos Animal</TabsTrigger>
            <TabsTrigger value="padre">Datos Padre</TabsTrigger>
            <TabsTrigger value="madre">Datos Madre</TabsTrigger>
          </TabsList>

          <FormAddOvino
            setActiveTab={setActiveTab}
            selectedEspecieId={selectedEspecieId}
          />
        </Tabs>
      )}
      {especieName.toLowerCase() === "peces" && (
        <FormAddPeces selectedEspecieId={selectedEspecieId} />
      )}
      {especieName.toLowerCase() === "equino" && (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-[90vh]"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="animal">Datos Animal</TabsTrigger>
            <TabsTrigger value="padre">Datos Padre</TabsTrigger>
            <TabsTrigger value="madre">Datos Madre</TabsTrigger>
          </TabsList>

          <FormAddEquino
            setActiveTab={setActiveTab}
            selectedEspecieId={selectedEspecieId}
          />
        </Tabs>
      )}

      {mostrarTabs && (
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full h-[90vh]"
        >
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="animal">Datos Animal</TabsTrigger>
            <TabsTrigger value="padre">Datos Padre</TabsTrigger>
            <TabsTrigger value="madre">Datos Madre</TabsTrigger>
          </TabsList>

          <FormAddAnimal
            setActiveTab={setActiveTab}
            selectedEspecieId={selectedEspecieId}
          />
        </Tabs>
      )}
    </div>
  );
};

export default CrearAnimalPage;
