"use client";
import useGetTotalAnimales from "@/hooks/dashboard/useGetTotalAnimales";
import useGetTotalFincas from "@/hooks/dashboard/useGetTotalFincas";
import CardTotales from "./ui/CardTotales";
import useGetTotalCitasCompletadas from "@/hooks/dashboard/useGetTotalCitasCompletadas";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProduccionGanadera from "./ui/ProduccionGanadera";
import { useState } from "react";
import useGetResumenCultivos from "@/hooks/dashboard/cultivos/useGetResumenCultivos";
import ResumenCultivos from "./ui/ResumenCultivos";
import { useAuthStore } from "@/providers/store/useAuthStore";
import useGetCultivosPorTipo from "@/hooks/dashboard/cultivos/useGetCultivosPorTipo";
import useGetAreaCultivoByFinca from "@/hooks/dashboard/cultivos/useGetAreaCultivoByFinca";
import CultivosPorTipo from "./ui/CultivosPorTipo";
import AreaCultivoByFinca from "./ui/AreaCultivoByFinca";
import DescartesMortalidadDashboard from "./ui/produccion/DescartesMortalidadDashboard";
import useGetDescartesEspcies from "@/hooks/dashboard/produccion/useGetDescartesEspcies";
import { format } from "date-fns";
import useGetMortalidadEspcies from "@/hooks/dashboard/produccion/useGetMortalidadEspcies";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import { Finca } from "@/api/fincas/interfaces/response-fincasByPropietario.interface";

const PanelPageGanadero = () => {
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const { data: total_animales } = useGetTotalAnimales();
  const { data: total_fincas } = useGetTotalFincas();
  const { data: citas_completadas } = useGetTotalCitasCompletadas();
  const { data: resumen_cultivos, isLoading: isLoadingCultivos } =
    useGetResumenCultivos();
  const { data: cultivos_tipo, isLoading: isLoadingCultivosTipo } =
    useGetCultivosPorTipo();
  const { data: area_finca_cultivos, isLoading: isLoadingAreaFinca } =
    useGetAreaCultivoByFinca();
  const [nombreSeccion, setNombreSeccion] = useState<string>("Ganadero");
  const [selectedMonth, setSelectedMonth] = useState<string>(
    format(new Date(), "yyyy-MM"),
  );
  const [selectedMonthMortalidad, setSelectedMonthMortalidad] =
    useState<string>(format(new Date(), "yyyy-MM"));
  const [selectedFincas, setSelectedFincas] = useState<Finca | null>(null);
  const [selectedFincasMortalidad, setSelectedFincasMortalidad] =
    useState<Finca | null>(null);
  const { data: fincas } = useFincasPropietarios(cliente?.id ?? "");

  const { data: descartes, isLoading: cargando_descartes } =
    useGetDescartesEspcies({ mes: selectedMonth, fincaId: selectedFincas?.id });
  const { data: mortalidad, isLoading: cargando_mortalidad } =
    useGetMortalidadEspcies({
      mes: selectedMonthMortalidad,
      fincaId: selectedFincasMortalidad?.id,
    });

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Panel de {nombreSeccion}
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <CardTotales
          titulo="Total de Animales Registrados"
          total={total_animales || 0}
          sub_titulo="Animales en total"
        />
        <CardTotales
          titulo="Total de Fincas"
          total={total_fincas || 0}
          sub_titulo="Fincas en total"
        />
        <CardTotales
          titulo="Total de Citas Completadas"
          total={citas_completadas || 0}
          sub_titulo="Citas en total"
        />
      </div>

      <div className="w-full">
        <Tabs defaultValue="ganaderia" className="w-full">
          <TabsList className="grid grid-cols-1 sm:grid-cols-3 w-full gap-2 mb-20 md:mb-8">
            <TabsTrigger
              onClick={() => setNombreSeccion("Ganaderia")}
              value="ganaderia"
              className="text-sm sm:text-base"
            >
              Ganadería
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setNombreSeccion("Agricultura")}
              value="agricola"
              className="text-sm sm:text-base"
            >
              Agrícola
            </TabsTrigger>
            <TabsTrigger
              onClick={() => setNombreSeccion("Produccion")}
              value="produccion"
              className="text-sm sm:text-base"
            >
              Producción
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ganaderia">
            <ProduccionGanadera />
          </TabsContent>

          <TabsContent value="agricola">
            <ResumenCultivos
              data={resumen_cultivos}
              isLoading={isLoadingCultivos}
              moneda={moneda}
            />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2 md:mt-5">
              <CultivosPorTipo
                data={cultivos_tipo}
                isLoading={isLoadingCultivosTipo}
              />
              <AreaCultivoByFinca
                data={area_finca_cultivos}
                isLoading={isLoadingAreaFinca}
              />
            </div>
          </TabsContent>

          <TabsContent value="produccion">
            <div>
              <DescartesMortalidadDashboard
                descartes_mortalidad={descartes}
                setSelectedMonth={setSelectedMonth}
                selectedMonth={selectedMonth}
                cargando={cargando_descartes}
                sub_title="descartes"
                title="descartados"
                isDescarte={true}
                fincas={fincas?.data.fincas}
                setSelectedFincas={setSelectedFincas}
                selectedFincas={selectedFincas}
                showFincaFilter={true}
              />
              <DescartesMortalidadDashboard
                descartes_mortalidad={mortalidad}
                setSelectedMonth={setSelectedMonthMortalidad}
                selectedMonth={selectedMonthMortalidad}
                cargando={cargando_mortalidad}
                sub_title="mortalidad"
                title="mortalidad"
                isDescarte={false}
                fincas={fincas?.data.fincas}
                setSelectedFincas={setSelectedFincasMortalidad}
                selectedFincas={selectedFincasMortalidad}
                showFincaFilter={true}
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PanelPageGanadero;
