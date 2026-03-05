import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React from "react";
import CardProduccionFinca from "./CardProduccionFinca";
import CardEspeciesByFinca from "./CardEspeciesByFinca";
import CardTipoExplotacion from "./CardTipoExplotacion";
import CardPastelEstados from "./CardPastelEstados";
import CardOrigenAnimal from "./CardOrigenAnimal";
import CardSexo from "./CardSexo";
import CardDetalles from "./CardDetalles";
import CardTasaReproduccion from "./CardTasaReproduccion";
import useGetTotalAnimalesSexo from "@/hooks/dashboard/useGetTotalAnimalesSexo";
import useGetTotalAnimalesMuerte from "@/hooks/dashboard/useGetTotalAnimalesMuerte";
import useGetTotalAnimalesCompradosNacidos from "@/hooks/dashboard/useGetTotalAnimalesCompradosNacidos";
import useGetFincasTipoExplotacion from "@/hooks/dashboard/useGetFincasTipoExplotacion";
import useGetEspeciesByFincas from "@/hooks/dashboard/useGetEspeciesByFincas";
import useGetProduccionGanaderaFinca from "@/hooks/dashboard/useGetProduccionGanaderaFinca";
import {
  ResponseEspeciesByFinca,
  Especie,
} from "@/api/dashboard/interfaces/response-especies-fincas.interface";
import {
  COLORS,
  ESPECIES_COLORS,
  EXPLOTACION_COLORS,
  MORTALIDAD_COLORS,
  ORIGEN_COLORS,
} from "@/helpers/data/colorDashboard";
import GananciaPesoAnimalMes from "./GananciaPesoAnimalMes";
import GananciasPesoByFinca from "./GananciasPesoByFinca";

const ProduccionGanadera = () => {
  const { data: animales_sexo } = useGetTotalAnimalesSexo();
  const { data: animales_muerte } = useGetTotalAnimalesMuerte();
  const { data: comprados_nacidos } = useGetTotalAnimalesCompradosNacidos();
  const { data: tipo_explotacion } = useGetFincasTipoExplotacion();
  const { data: especies_fincas } = useGetEspeciesByFincas();
  const { data: produccion_finca } = useGetProduccionGanaderaFinca();

  const especiesUnicas = Array.from(
    new Set(
      especies_fincas?.flatMap((finca: ResponseEspeciesByFinca) =>
        finca.especies.map((e: Especie) => e.especie),
      ) || [],
    ),
  );

  const barChartData =
    especies_fincas?.map((finca: ResponseEspeciesByFinca) => ({
      finca: finca.nombre_finca,
      ...finca.especies.reduce(
        (acc: { [key: string]: number }, especie: Especie) => {
          acc[especie.especie] = especie.cantidad;
          return acc;
        },
        {},
      ),
      total: finca.cantidad_total_especies,
    })) || [];

  const sexoData =
    animales_sexo?.map((item, index) => ({
      name: item.sexo,
      value: parseInt(item.total),
      color: COLORS[index % COLORS.length],
    })) || [];

  const mortalidadData = animales_muerte
    ? [
        {
          name: "Vivos",
          value: parseInt(animales_muerte.vivos),
          color: MORTALIDAD_COLORS[0],
        },
        {
          name: "Muertos",
          value: parseInt(animales_muerte.muertos),
          color: MORTALIDAD_COLORS[1],
        },
      ]
    : [];

  const origenData = comprados_nacidos
    ? [
        {
          name: "Nacidos",
          value: parseInt(comprados_nacidos.nacidos),
          color: ORIGEN_COLORS[1],
        },
        {
          name: "Comprados",
          value: parseInt(comprados_nacidos.comprados),
          color: ORIGEN_COLORS[0],
        },
      ]
    : [];

  const explotacionData =
    tipo_explotacion?.map((item, index) => ({
      name: item.tipo,
      value: parseInt(item.total),
      color: EXPLOTACION_COLORS[index % EXPLOTACION_COLORS.length],
    })) || [];

  const totalVivos = parseInt(animales_muerte?.vivos || "0");
  const totalMuertos = parseInt(animales_muerte?.muertos || "0");
  const totalGeneral = totalVivos + totalMuertos;
  const porcentajeVivos =
    totalGeneral > 0 ? (totalVivos / totalGeneral) * 100 : 0;
  const porcentajeMuertos =
    totalGeneral > 0 ? (totalMuertos / totalGeneral) * 100 : 0;

  const totalNacidos = parseInt(comprados_nacidos?.nacidos || "0");
  const totalComprados = parseInt(comprados_nacidos?.comprados || "0");
  const totalOrigen = totalNacidos + totalComprados;
  const porcentajeNacidos =
    totalOrigen > 0 ? (totalNacidos / totalOrigen) * 100 : 0;
  const porcentajeComprados =
    totalOrigen > 0 ? (totalComprados / totalOrigen) * 100 : 0;
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Producción Ganadera - Bovinos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CardProduccionFinca produccionData={produccion_finca || null} />
        </CardContent>
      </Card>

      <CardEspeciesByFinca
        barChartData={barChartData}
        especiesUnicas={especiesUnicas}
        ESPECIES_COLORS={ESPECIES_COLORS}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GananciaPesoAnimalMes />
        <GananciasPesoByFinca />

        <CardTipoExplotacion
          explotacionData={explotacionData}
          EXPLOTACION_COLORS={EXPLOTACION_COLORS}
        />

        <CardPastelEstados
          mortalidadData={mortalidadData}
          MORTALIDAD_COLORS={MORTALIDAD_COLORS}
          totalVivos={totalVivos}
          porcentajeVivos={porcentajeVivos}
          totalMuertos={totalMuertos}
          porcentajeMuertos={porcentajeMuertos}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CardOrigenAnimal
          origenData={origenData}
          ORIGEN_COLORS={ORIGEN_COLORS}
          totalComprados={totalComprados}
          porcentajeComprados={porcentajeComprados}
          totalNacidos={totalNacidos}
          porcentajeNacidos={porcentajeNacidos}
        />

        <CardSexo sexoData={sexoData} COLORS={COLORS} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CardDetalles
          titulo="Animales Vivos"
          total={totalVivos}
          porcentaje={porcentajeVivos}
          colorText="text-green-800"
          colorNumbers="text-green-600"
          bgColor="bg-green-50"
        />

        <CardDetalles
          titulo="Animales Muertos"
          total={totalMuertos}
          porcentaje={porcentajeMuertos}
          colorText="text-red-800"
          colorNumbers="text-red-600"
          bgColor="bg-red-50"
        />

        <CardDetalles
          titulo="Comprados"
          total={totalComprados}
          porcentaje={porcentajeComprados}
          colorText="text-purple-800"
          colorNumbers="text-purple-600"
          bgColor="bg-purple-50"
        />

        <CardDetalles
          titulo="Nacidos"
          total={totalNacidos}
          porcentaje={porcentajeNacidos}
          colorText="text-amber-800"
          colorNumbers="text-amber-600"
          bgColor="bg-amber-50"
        />
      </div>

      <CardTasaReproduccion
        porcentajeNacidos={porcentajeNacidos}
        totalNacidos={totalNacidos}
        totalOrigen={totalOrigen}
      />
    </div>
  );
};

export default ProduccionGanadera;
