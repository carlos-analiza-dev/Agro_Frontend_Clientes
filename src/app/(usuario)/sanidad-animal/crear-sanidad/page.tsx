"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import FormSanidad from "../ui/FormSanidad";
import { ESPECIE_COLORS } from "@/helpers/data/colors/colors-espcies";
import { useRouter, useSearchParams } from "next/navigation";
import { tiposServiciosSanidadData } from "@/helpers/data/sanidad/tipos_servicios_sanidad";
import { useState } from "react";
import { Sanidad } from "@/api/sanidad-animal/interface/response-sanidad-animal.interface";

const CrearSanidadAnimalByEspecie = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [selectedSanidad, setSelectedSanidad] = useState<Sanidad | null>(null);
  const especie_animal = (
    searchParams.get("especie") ?? "bovino"
  ).toLowerCase();

  const colors = ESPECIE_COLORS[especie_animal] || ESPECIE_COLORS.bovino;

  const opciones_servicios_especie = tiposServiciosSanidadData.filter(
    (data) => {
      if (data.especies.includes("todas")) {
        return especie_animal !== "peces";
      }
      return data.especies.includes(especie_animal);
    },
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold capitalize">
            Ingresar Sanidad — {especie_animal}
          </h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              Ingresa un nuevo evento de sanidad
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para ingresar el evento de sanidad
            </p>
          </CardHeader>
          <CardContent>
            <FormSanidad
              opciones_especie={opciones_servicios_especie}
              setOpenModal={() => router.back()}
              onSuccess={() => {
                router.back();
                setSelectedSanidad(null);
              }}
              especie_animal={especie_animal}
              sanidad={selectedSanidad}
              borderColor={colors.border
                .replace("border-l-4 border-l-", "")
                .replace("-500", "-200")}
              bgColor={colors.tag
                .replace("bg-", "bg-")
                .replace(" text-", "/50")}
              textColor={colors.title}
              iconColor={colors.icon}
              hoverBgColor={`hover:bg-${colors.icon.split("-")[1]}-50`}
              selectedBgColor={`bg-${colors.icon.split("-")[1]}-50`}
              selectedBorderColor={`border-${colors.icon.split("-")[1]}-500`}
              selectedTextColor={`text-${colors.icon.split("-")[1]}-700`}
              buttonBgColor={colors.button}
              buttonHoverColor={colors.buttonHover}
              tagBgColor={`bg-${colors.icon.split("-")[1]}-100`}
              tagTextColor={`text-${colors.icon.split("-")[1]}-700`}
              tagBorderColor={`border-${colors.icon.split("-")[1]}-200`}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrearSanidadAnimalByEspecie;
