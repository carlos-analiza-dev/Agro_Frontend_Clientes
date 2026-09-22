"use client";
import SkeletonCard from "@/components/generics/SkeletonCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import useGetSanidadAnimalById from "@/hooks/sanidad-animal/useGetSanidadAnimalById";
import { useParams, useRouter } from "next/navigation";
import FormSanidad from "../ui/FormSanidad";
import { ESPECIE_COLORS } from "@/helpers/data/colors/colors-espcies";
import { tiposServiciosSanidadData } from "@/helpers/data/sanidad/tipos_servicios_sanidad";

const SanidadAnimalByIdPage = () => {
  const { id } = useParams();
  const sanidadId = id as string;
  const router = useRouter();
  const { data: sanidad, isLoading } = useGetSanidadAnimalById(sanidadId);
  const especie_animal =
    sanidad?.animal.especie.nombre.toLowerCase() ?? "bovino";

  const colors = ESPECIE_COLORS[especie_animal] || ESPECIE_COLORS.bovino;

  const opciones_servicios_especie = tiposServiciosSanidadData.filter(
    (data) => {
      if (data.especies.includes("todas")) {
        return especie_animal !== "peces";
      }
      return data.especies.includes(especie_animal);
    },
  );

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3 mb-6">
          <h1 className="text-2xl font-bold capitalize">
            Editar Sanidad — {especie_animal}
          </h1>
        </div>

        <Card className="shadow-lg border-t-4 border-t-primary">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">
              Editando el evento sanitario
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Completa los datos para editar el evento sanitario
            </p>
          </CardHeader>
          <CardContent>
            <FormSanidad
              opciones_especie={opciones_servicios_especie}
              setOpenModal={() => router.back()}
              onSuccess={() => {
                router.back();
              }}
              especie_animal={especie_animal}
              sanidad={sanidad}
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

export default SanidadAnimalByIdPage;
