"use client";
import ButtonAdd from "@/components/generics/ButtonAdd";
import Modal from "@/components/generics/Modal";
import { tiposServiciosSanidadData } from "@/helpers/data/sanidad/tipos_servicios_sanidad";
import {
  ShieldPlus,
  FileText,
  CheckCircle,
  Calendar,
  DollarSign,
  AlertCircle,
  Syringe,
  Pill,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Layers,
  X,
} from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState, useMemo, useEffect, useRef } from "react";
import FormSanidad from "../../ui/FormSanidad";
import useGetSanidadAnimal from "@/hooks/sanidad-animal/useGetSanidadAnimal";
import CardSanidad from "../../ui/CardSanidad";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Paginacion from "@/components/generics/Paginacion";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { differenceInCalendarDays, format } from "date-fns";
import { es } from "date-fns/locale";
import TableResumenSanidad from "../../ui/TableResumenSanidad";
import { parseLocalDate } from "@/helpers/funciones/formatDateOnly";
import useGetCostosMensualesSanidad from "@/hooks/sanidad-animal/useGetCostosMensualesSanidad";
import { Label } from "@/components/ui/label";
import { Sanidad } from "@/api/sanidad-animal/interface/response-sanidad-animal.interface";
import { StatCard } from "@/components/generics/StatCard";
import EvolucionMensual from "@/components/reportes/sanidad-animal/EvolucionMensual";
import DistribucionServicio from "@/components/reportes/sanidad-animal/DistribucionServicio";
import ResumenPorServicio from "@/components/reportes/sanidad-animal/ResumenPorServicio";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { Button } from "@/components/ui/button";
import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import SearchAnimales from "../../ui/SearchAnimales";
import { ESPECIE_COLORS } from "@/helpers/data/colors/colors-espcies";
import ProximosEventosAlerta from "@/components/sanidad-animal/eventos/ProximosEventosAlerta";
import TitlePage from "@/components/generics/TitlePage";
import { useTranslations } from "next-intl";

const SanidadByEspeciePage = () => {
  const t = useTranslations("SanidadByEspeciePage");
  const tServices = useTranslations("SanidadServices");
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { especie } = useParams();
  const router = useRouter();
  const especie_animal = especie as string;
  const colors = ESPECIE_COLORS[especie_animal] || ESPECIE_COLORS.bovino;
  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(isMobile ? 5 : 10);
  const [selectedSanidad, setSelectedSanidad] = useState<Sanidad | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterTipo, setFilterTipo] = useState("todos");
  const [selectedServicioGrafico, setSelectedServicioGrafico] =
    useState<string>("todos");
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const [animalSearchTerm, setAnimalSearchTerm] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [isAnimalDropdownOpen, setIsAnimalDropdownOpen] = useState(false);
  const animalDropdownRef = useRef<HTMLDivElement>(null);
  const animalId = selectedAnimal?.id || "";
  const tipos_servicio = filterTipo === "todos" ? "" : filterTipo;

  const { data: animales, isLoading: cargando_animales } =
    useGetAnimalesPropietario({ especie: especie_animal });
  const { data: sanidadResponse, isLoading } = useGetSanidadAnimal({
    especie: especie_animal,
    tipo_servicio: tipos_servicio,
    animalId,
  });
  const { data: costos_mensuales, isLoading: cargando_costos } =
    useGetCostosMensualesSanidad({
      especie: especie_animal,
      animalId: animalId,
    });

  const sanidadData = sanidadResponse?.sanidad || [];

  const animalesFiltrados = useMemo(() => {
    if (!animales) return [];
    if (!animalSearchTerm.trim()) return animales.slice(0, 10);

    const term = animalSearchTerm.toLowerCase().trim();
    return animales
      .filter((animal) => {
        const nombre = animal.nombre_animal?.toLowerCase() || "";
        const identificador = animal.identificador?.toLowerCase() || "";
        const especie = animal.especie?.nombre?.toLowerCase() || "";
        return (
          nombre.includes(term) ||
          identificador.includes(term) ||
          especie.includes(term)
        );
      })
      .slice(0, 10);
  }, [animales, animalSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        animalDropdownRef.current &&
        !animalDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAnimalDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleEditSanidad = (sanidad: Sanidad) => {
    setSelectedSanidad(sanidad);
    setOpenModal(true);
  };

  const handleSelectAnimal = (animal: Animal) => {
    setSelectedAnimal(animal);
    setAnimalSearchTerm(animal.nombre_animal || animal.identificador || "");
    setIsAnimalDropdownOpen(false);
    setCurrentPage(1);
  };

  const clearAnimalSelection = () => {
    setSelectedAnimal(null);
    setAnimalSearchTerm("");
    setIsAnimalDropdownOpen(false);
    setCurrentPage(1);
  };

  const filteredData = useMemo(() => {
    let filtered = sanidadData;

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (item) =>
          item.tipo_servicio?.toLowerCase().includes(term) ||
          item.responsable?.toLowerCase().includes(term) ||
          item.animal?.nombre_animal?.toLowerCase().includes(term) ||
          item.animal?.identificador?.toLowerCase().includes(term) ||
          item.observaciones?.toLowerCase().includes(term),
      );
    }

    return filtered;
  }, [sanidadData, searchTerm]);

  const datosCostosProcesados = useMemo(() => {
    if (!costos_mensuales || costos_mensuales.length === 0) {
      return {
        datosPorMes: [],
        datosPorServicio: [],
        totalGeneral: 0,
        serviciosUnicos: [],
        promedioMensual: 0,
        mesConMayorCosto: null,
        mesConMenorCosto: null,
        servicioConMayorCosto: null,
        datosEvolucion: [],
      };
    }

    const meses = Array.from(
      new Set(costos_mensuales.map((item) => item.mes)),
    ).sort();

    const datosPorMes = meses.map((mes) => {
      const itemsDelMes = costos_mensuales.filter((item) => item.mes === mes);
      const totalMes = itemsDelMes.reduce(
        (acc, item) => acc + (item.total_costo || 0),
        0,
      );
      const cantidadTotal = itemsDelMes.reduce(
        (acc, item) => acc + (item.cantidad || 0),
        0,
      );

      const [year, month] = mes.split("-");
      const fecha = new Date(parseInt(year), parseInt(month) - 1);
      const nombreMes = format(fecha, "MMM yyyy", { locale: es });

      return {
        mes,
        nombreMes,
        total: totalMes,
        cantidad: cantidadTotal,
        servicios: itemsDelMes,
      };
    });

    const serviciosMap = new Map();
    costos_mensuales.forEach((item) => {
      const key = item.tipo_servicio;
      if (!serviciosMap.has(key)) {
        serviciosMap.set(key, {
          nombre: key,
          total: 0,
          cantidad: 0,
          meses: [],
        });
      }
      const servicio = serviciosMap.get(key);
      servicio.total += item.total_costo || 0;
      servicio.cantidad += item.cantidad || 0;
      servicio.meses.push({
        mes: item.mes,
        costo: item.total_costo || 0,
        cantidad: item.cantidad || 0,
      });
    });

    const datosPorServicio = Array.from(serviciosMap.values()).sort(
      (a, b) => b.total - a.total,
    );

    const datosEvolucion = meses.map((mes) => {
      const itemsDelMes = costos_mensuales.filter((item) => item.mes === mes);
      const totalMes = itemsDelMes.reduce(
        (acc, item) => acc + (item.total_costo || 0),
        0,
      );
      const [year, month] = mes.split("-");
      const fecha = new Date(parseInt(year), parseInt(month) - 1);

      return {
        mes,
        nombreMes: format(fecha, "MMM yyyy", { locale: es }),
        total: totalMes,
        items: itemsDelMes,
      };
    });

    const totalGeneral = datosPorMes.reduce((acc, mes) => acc + mes.total, 0);
    const promedioMensual =
      datosPorMes.length > 0 ? totalGeneral / datosPorMes.length : 0;

    const mesConMayorCosto =
      datosPorMes.length > 0
        ? datosPorMes.reduce((max, mes) => (mes.total > max.total ? mes : max))
        : null;

    const mesConMenorCosto =
      datosPorMes.length > 0
        ? datosPorMes.reduce((min, mes) => (mes.total < min.total ? mes : min))
        : null;

    const servicioConMayorCosto =
      datosPorServicio.length > 0 ? datosPorServicio[0] : null;

    return {
      datosPorMes,
      datosPorServicio,
      totalGeneral,
      serviciosUnicos: Array.from(serviciosMap.keys()),
      promedioMensual,
      mesConMayorCosto,
      mesConMenorCosto,
      servicioConMayorCosto,
      datosEvolucion,
    };
  }, [costos_mensuales]);

  const datosEvolucionFiltrados = useMemo(() => {
    if (selectedServicioGrafico === "todos") {
      return datosCostosProcesados.datosEvolucion;
    }

    return datosCostosProcesados.datosEvolucion.map((mes) => {
      const itemsFiltrados = mes.items.filter(
        (item) => item.tipo_servicio === selectedServicioGrafico,
      );
      const totalFiltrado = itemsFiltrados.reduce(
        (acc, item) => acc + (item.total_costo || 0),
        0,
      );

      return {
        ...mes,
        total: totalFiltrado,
        items: itemsFiltrados,
      };
    });
  }, [datosCostosProcesados.datosEvolucion, selectedServicioGrafico]);

  const totalPages = Math.ceil(filteredData.length / pageSize);
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData.slice(start, end);
  }, [filteredData, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterTipo]);

  const estadisticas = useMemo(() => {
    if (!sanidadData || sanidadData.length === 0) {
      return {
        estadoSanitario: t("stats.noRecords"),
        descripcionEstado: t("stats.noRecordsDesc"),
        parrafoEstado: t("stats.noRecordsHint"),
        ultimoEvento: t("common.notAvailable"),
        descripcionUltimo: t("common.notAvailable"),
        parrafoUltimo: t("stats.noEvents"),
        proximoEvento: t("common.notAvailable"),
        descripcionProximo: t("common.notAvailable"),
        parrafoProximo: t("stats.noScheduledEvents"),
        costoSanitario: 0,
        costoSanitarioStr: `${moneda}0`,
        descripcionCosto: t("stats.noCosts"),
        parrafoCosto: t("stats.avgPerAnimal"),
        tieneEventosPendientes: false,
        eventosPendientes: 0,
        totalEventos: 0,
        promedioPorEvento: 0,
      };
    }

    const sortedData = [...sanidadData].sort(
      (a, b) =>
        new Date(b.fecha_evento).getTime() - new Date(a.fecha_evento).getTime(),
    );

    const ultimo = sortedData[0];
    const ultimoEvento = ultimo?.tipo_servicio || t("common.notAvailable");
    const fechaEvento = parseLocalDate(ultimo.fecha_evento);

    let diasDesdeUltimo = t("common.notAvailable");

    if (ultimo?.fecha_evento) {
      const diffDays = differenceInCalendarDays(new Date(), fechaEvento);

      if (diffDays <= 0) {
        diasDesdeUltimo = t("time.today");
      } else if (diffDays === 1) {
        diasDesdeUltimo = t("time.oneDayAgo");
      } else {
        diasDesdeUltimo = t("time.daysAgo", { count: diffDays });
      }
    }

    const eventosConProxima = sortedData.filter(
      (item) =>
        item.proxima_fecha_evento &&
        new Date(item.proxima_fecha_evento) >= new Date(),
    );

    let proximoEvento = t("stats.unscheduled");
    let fechaProximo = t("common.notAvailable");
    let diasHastaProximo = t("common.notAvailable");

    if (eventosConProxima.length > 0) {
      const proximo = eventosConProxima.sort(
        (a, b) =>
          new Date(a.proxima_fecha_evento!).getTime() -
          new Date(b.proxima_fecha_evento!).getTime(),
      )[0];

      proximoEvento = proximo.tipo_servicio || t("stats.unscheduled");
      fechaProximo = proximo.proxima_fecha_evento
        ? format(new Date(proximo.proxima_fecha_evento), "dd/MM/yyyy", {
            locale: es,
          })
        : t("common.notAvailable");

      if (proximo.proxima_fecha_evento) {
        const diffTime = Math.abs(
          new Date(proximo.proxima_fecha_evento).getTime() -
            new Date().getTime(),
        );
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        diasHastaProximo =
          diffDays === 0
            ? t("time.today")
            : t("time.days", { count: diffDays });
      }
    }

    const costoTotal = sanidadData.reduce((acc, item) => {
      const costo = parseFloat(item.costo_real) || 0;
      return acc + costo;
    }, 0);

    const eventosPendientes = eventosConProxima.filter((item) => {
      if (!item.proxima_fecha_evento) return false;
      const diffTime =
        new Date(item.proxima_fecha_evento).getTime() - new Date().getTime();
      const diffDays = diffTime / (1000 * 60 * 60 * 24);
      return diffDays <= 7 && diffDays >= 0;
    });

    const tienePendientes = eventosPendientes.length > 0;

    let estadoSanitario = t("stats.upToDate");
    let descripcionEstado = t("stats.allInOrder");
    let parrafoEstado = t("stats.noPendingEvents");

    if (eventosPendientes.length > 0) {
      const serviciosPendientes = eventosPendientes
        .map((e) => e.tipo_servicio)
        .join(", ");
      estadoSanitario =
        eventosPendientes.length === 1
          ? t("stats.onePending")
          : t("stats.nPending", { count: eventosPendientes.length });
      descripcionEstado = t("stats.next", { services: serviciosPendientes });
      parrafoEstado = t("stats.requiresAttention");
    }

    const promedioPorEvento =
      sanidadData.length > 0 ? costoTotal / sanidadData.length : 0;

    return {
      estadoSanitario,
      descripcionEstado,
      parrafoEstado,
      ultimoEvento,
      descripcionUltimo: fechaEvento,
      parrafoUltimo: diasDesdeUltimo,
      proximoEvento:
        diasHastaProximo !== t("common.notAvailable")
          ? diasHastaProximo
          : t("stats.unscheduled"),
      descripcionProximo: fechaProximo,
      parrafoProximo:
        proximoEvento !== t("stats.unscheduled")
          ? t("stats.nextPrefix", { event: proximoEvento })
          : t("stats.noScheduledEvents"),
      costoSanitario: costoTotal,
      costoSanitarioStr: `${moneda}${costoTotal.toFixed(2)}`,
      descripcionCosto:
        sanidadData.length === 1
          ? t("stats.oneEvent")
          : t("stats.nEvents", { count: sanidadData.length }),
      parrafoCosto: t("stats.avgPerAnimal"),
      tieneEventosPendientes: tienePendientes,
      eventosPendientes: eventosPendientes.length,
      totalEventos: sanidadData.length,
      promedioPorEvento: promedioPorEvento,
    };
  }, [sanidadData, moneda, t]);

  const getEstadoIcon = () => {
    if (estadisticas.tieneEventosPendientes) {
      return AlertCircle;
    }
    return CheckCircle;
  };

  const opciones_servicios_especie = tiposServiciosSanidadData
    .filter((data) => {
      if (data.especies.includes("todas")) {
        return especie_animal !== "peces";
      }
      return data.especies.includes(especie_animal);
    })
    .map((data) => ({
      ...data,
      label: tServices(data.value),
    }));

  const handleAddSanidad = () => {
    if (isMobile) {
      router.push(`/sanidad-animal/crear-sanidad?especie=${especie_animal}`);
    } else {
      setOpenModal(true);
    }
  };
  return (
    <div className="container mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6">
      <div className={`pl-4 ${colors.border}`}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4">
          <TitlePage
            title={t("header.title", { species: especie_animal })}
            description={t("header.description")}
            Icon={ShieldPlus}
          />

          <ButtonAdd
            title={t("header.addButton", { species: especie_animal })}
            Icon={ShieldPlus}
            action={handleAddSanidad}
            className={`${colors.button} text-white shadow-sm hover:shadow-md transition-all duration-300`}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <SearchAnimales
          animalDropdownRef={animalDropdownRef}
          selectedAnimal={selectedAnimal}
          clearAnimalSelection={clearAnimalSelection}
          animalSearchTerm={animalSearchTerm}
          setAnimalSearchTerm={setAnimalSearchTerm}
          setIsAnimalDropdownOpen={setIsAnimalDropdownOpen}
          isAnimalDropdownOpen={isAnimalDropdownOpen}
          animalesFiltrados={animalesFiltrados}
          cargando_animales={cargando_animales}
          handleSelectAnimal={handleSelectAnimal}
          borderColor={colors.border
            .replace("border-l-4 border-l-", "")
            .replace("-500", "-200")}
          bgColor={colors.tag.replace("bg-", "bg-").replace(" text-", "/50")}
          textColor={colors.title}
          iconColor={colors.icon}
          inputBorderColor={colors.border
            .replace("border-l-4 border-l-", "")
            .replace("-500", "-200")}
          inputFocusColor={`focus:border-${colors.icon.split("-")[1]}-400`}
          hoverBgColor={`hover:bg-${colors.icon.split("-")[1]}-50`}
          badgeBgColor={`bg-${colors.icon.split("-")[1]}-100`}
          badgeTextColor={`text-${colors.icon.split("-")[1]}-700`}
          badgeBorderColor={`border-${colors.icon.split("-")[1]}-200`}
        />
      </div>

      <div className="mt-3 sm:mt-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <CardSanidad
            title={t("cards.healthStatus.title")}
            description={estadisticas.estadoSanitario}
            parrafo={estadisticas.parrafoEstado}
            Icon={getEstadoIcon()}
            className={colors.border}
            iconClassName={colors.icon}
            iconBgClassName={`bg-${colors.icon.split("-")[1]}-50`}
            titleClassName="text-slate-900 dark:text-white"
            descriptionClassName="text-slate-500 dark:text-slate-400"
            parrafoClassName="text-slate-600 dark:text-slate-300"
          />
          <CardSanidad
            title={t("cards.lastEvent.title")}
            description={estadisticas.ultimoEvento}
            parrafo={estadisticas.parrafoUltimo}
            Icon={
              estadisticas.ultimoEvento === "Vacunacion"
                ? Syringe
                : estadisticas.ultimoEvento === "Desparasitacion"
                  ? Pill
                  : FileText
            }
            className={colors.border}
            iconClassName={colors.icon}
            iconBgClassName={`bg-${colors.icon.split("-")[1]}-50`}
            titleClassName="text-slate-900 dark:text-white"
            descriptionClassName="text-slate-500 dark:text-slate-400"
            parrafoClassName="text-slate-600 dark:text-slate-300"
          />
          <CardSanidad
            title={t("cards.nextEvent.title")}
            description={estadisticas.proximoEvento}
            parrafo={estadisticas.parrafoProximo}
            Icon={Calendar}
            className={colors.border}
            iconClassName={colors.icon}
            iconBgClassName={`bg-${colors.icon.split("-")[1]}-50`}
            titleClassName="text-slate-900 dark:text-white"
            descriptionClassName="text-slate-500 dark:text-slate-400"
            parrafoClassName="text-slate-600 dark:text-slate-300"
          />
          <CardSanidad
            title={t("cards.monthlyCost.title")}
            description={estadisticas.costoSanitarioStr}
            parrafo={`Promedio: ${moneda}${estadisticas.promedioPorEvento.toFixed(2)} por evento`}
            Icon={DollarSign}
            className={colors.border}
            iconClassName={colors.icon}
            iconBgClassName={`bg-${colors.icon.split("-")[1]}-50`}
            titleClassName="text-slate-900 dark:text-white"
            descriptionClassName="text-slate-500 dark:text-slate-400"
            parrafoClassName="text-slate-600 dark:text-slate-300"
          />
        </div>

        <ProximosEventosAlerta
          eventos={sanidadData}
          borderColor={colors.alertBorder}
          bgColor={colors.alertBg}
          textColor={colors.alertText}
          iconColor={colors.icon}
        />

        <div className="mt-2 text-xs sm:text-sm text-muted-foreground">
          {sanidadData.length > 0 ? (
            <p>{t("stats.totalRecords", { count: filteredData.length })}</p>
          ) : (
            <p className="text-yellow-600">{t("stats.noRecordsForSpecies")}</p>
          )}
        </div>
      </div>

      <div className="mt-4 sm:mt-5">
        <Tabs defaultValue="resumen" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger
              className={`text-xs sm:text-sm data-[state=active]:border-b-2 data-[state=active]:${colors.border.split(" ")[1]}`}
              value="resumen"
            >
              {t("tabs.summary")}
            </TabsTrigger>
            <TabsTrigger
              className={`text-xs sm:text-sm data-[state=active]:border-b-2 data-[state=active]:${colors.border.split(" ")[1]}`}
              value="costos"
            >
              {t("tabs.monthlyCosts")}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="resumen" className="mt-3 sm:mt-4">
            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-base sm:text-lg">
                  {t("summary.title")}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {t("summary.description")}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                <div className="flex flex-col gap-3 mb-4">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder={
                          isMobile
                            ? t("summary.searchPlaceholderMobile")
                            : t("summary.searchPlaceholder")
                        }
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`pl-9 text-sm h-9 sm:h-10 focus-visible:ring-1 focus-visible:ring-${colors.icon.split("-")[1]}-500`}
                      />
                    </div>
                    <div className="flex gap-2">
                      {isMobile && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                          className="h-9"
                        >
                          {isFiltersVisible ? (
                            <X className="h-4 w-4" />
                          ) : (
                            <Filter className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                      <Select value={filterTipo} onValueChange={setFilterTipo}>
                        <SelectTrigger
                          className={`${isMobile && !isFiltersVisible ? "hidden" : "w-[150px] sm:w-[180px]"} h-9 sm:h-10`}
                        >
                          <Filter className="h-4 w-4 mr-2 hidden sm:inline" />
                          <SelectValue
                            placeholder={t("summary.filterPlaceholder")}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">
                            {t("summary.allTypes")}
                          </SelectItem>
                          {opciones_servicios_especie.map((tipo) => (
                            <SelectItem key={tipo.id} value={tipo.value}>
                              {tipo.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {isMobile && isFiltersVisible && (
                    <div className="flex flex-wrap gap-2 p-2 bg-gray-50 rounded-lg">
                      {opciones_servicios_especie.map((tipo) => (
                        <Button
                          key={tipo.id}
                          variant={
                            filterTipo === tipo.value ? "default" : "outline"
                          }
                          size="sm"
                          className="text-xs"
                          onClick={() => setFilterTipo(tipo.value)}
                        >
                          {tipo.label}
                        </Button>
                      ))}
                      {filterTipo !== "todos" && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-xs"
                          onClick={() => setFilterTipo("todos")}
                        >
                          {t("summary.clearFilter")}
                        </Button>
                      )}
                    </div>
                  )}
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <div
                      className={`animate-spin rounded-full h-8 w-8 border-b-2 ${colors.icon}`}
                    ></div>
                  </div>
                ) : paginatedData.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    {t("summary.emptyState")}
                  </div>
                ) : (
                  <div className="rounded-md border overflow-x-auto">
                    <TableResumenSanidad
                      paginatedData={paginatedData}
                      moneda={moneda}
                      handleEditSanidad={handleEditSanidad}
                      acciones={true}
                      isMobile={isMobile}
                    />
                  </div>
                )}

                {filteredData.length > 0 && (
                  <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <p className="text-xs sm:text-sm text-muted-foreground text-center sm:text-left">
                      {t("pagination.showing", {
                        from: (currentPage - 1) * pageSize + 1,
                        to: Math.min(
                          currentPage * pageSize,
                          filteredData.length,
                        ),
                        total: filteredData.length,
                      })}
                    </p>
                    <Paginacion
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={setCurrentPage}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="costos" className="mt-3 sm:mt-4">
            <Card>
              <CardHeader className="p-3 sm:p-6">
                <div>
                  <CardTitle className="text-base sm:text-lg">
                    {t("costs.title")}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm">
                    {t("costs.description")}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0 sm:pt-0">
                {cargando_costos ? (
                  <div className="flex justify-center py-12">
                    <div
                      className={`animate-spin rounded-full h-8 w-8 border-b-2 ${colors.icon}`}
                    ></div>
                  </div>
                ) : datosCostosProcesados.totalGeneral === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                    <p>{t("costs.emptyTitle")}</p>
                    <p className="text-sm mt-1">
                      {t("costs.emptyDescription")}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6 sm:space-y-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
                      <StatCard
                        title={t("costs.totalSpent")}
                        value={formatCurrency(
                          datosCostosProcesados.totalGeneral,
                          moneda,
                        )}
                        icon={DollarSign}
                        gradientFrom="from-green-50"
                        gradientTo="to-green-100"
                        iconColor="text-green-600"
                        textColor="text-green-800"
                      />

                      <StatCard
                        title={t("costs.monthlyAverage")}
                        value={formatCurrency(
                          datosCostosProcesados.promedioMensual,
                          moneda,
                        )}
                        icon={Calendar}
                        gradientFrom="from-blue-50"
                        gradientTo="to-blue-100"
                        iconColor="text-blue-600"
                        textColor="text-blue-800"
                      />

                      <StatCard
                        title={t("costs.registeredServices")}
                        value={datosCostosProcesados.serviciosUnicos.length}
                        icon={Layers}
                        gradientFrom="from-purple-50"
                        gradientTo="to-purple-100"
                        iconColor="text-purple-600"
                        textColor="text-purple-800"
                      />

                      <StatCard
                        title={t("costs.highestExpense")}
                        value={
                          datosCostosProcesados.servicioConMayorCosto?.nombre ||
                          "N/A"
                        }
                        icon={TrendingUp}
                        gradientFrom="from-orange-50"
                        gradientTo="to-orange-100"
                        iconColor="text-orange-600"
                        textColor="text-orange-800"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                      <Label className="text-sm font-medium">
                        {t("costs.filterByService")}
                      </Label>
                      <Select
                        value={selectedServicioGrafico}
                        onValueChange={setSelectedServicioGrafico}
                      >
                        <SelectTrigger className="w-full sm:w-[200px]">
                          <SelectValue placeholder={t("costs.allServices")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="todos">
                            {t("costs.allServices")}
                          </SelectItem>
                          {datosCostosProcesados.serviciosUnicos.map(
                            (servicio) => (
                              <SelectItem key={servicio} value={servicio}>
                                {servicio}
                              </SelectItem>
                            ),
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="overflow-x-auto -mx-3 sm:mx-0">
                      <EvolucionMensual
                        datosEvolucionFiltrados={datosEvolucionFiltrados}
                        selectedServicioGrafico={selectedServicioGrafico}
                        moneda={moneda}
                      />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                      <DistribucionServicio
                        datosCostosProcesados={
                          datosCostosProcesados.datosPorServicio
                        }
                        moneda={moneda}
                      />

                      <ResumenPorServicio
                        datosPorServicio={
                          datosCostosProcesados.datosPorServicio
                        }
                        moneda={moneda}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      {datosCostosProcesados.mesConMayorCosto && (
                        <CardSanidad
                          title={t("costs.highestMonth")}
                          description={
                            datosCostosProcesados.mesConMayorCosto.nombreMes
                          }
                          parrafo={t("costs.monthDescription", {
                            amount: formatCurrency(
                              datosCostosProcesados.mesConMayorCosto.total,
                              moneda,
                            ),
                            count:
                              datosCostosProcesados.mesConMayorCosto.cantidad,
                          })}
                          Icon={TrendingUp}
                          className={colors.border}
                          iconClassName={colors.icon}
                          iconBgClassName={`bg-${colors.icon.split("-")[1]}-50`}
                          titleClassName="text-slate-900 dark:text-white"
                          descriptionClassName="text-slate-500 dark:text-slate-400"
                          parrafoClassName="text-slate-600 dark:text-slate-300"
                        />
                      )}

                      {datosCostosProcesados.mesConMenorCosto && (
                        <CardSanidad
                          title={t("costs.lowestMonth")}
                          description={
                            datosCostosProcesados.mesConMenorCosto.nombreMes
                          }
                          parrafo={t("costs.monthDescription", {
                            amount: formatCurrency(
                              datosCostosProcesados.mesConMenorCosto.total,
                              moneda,
                            ),
                            count:
                              datosCostosProcesados.mesConMenorCosto.cantidad,
                          })}
                          Icon={TrendingDown}
                          className={colors.border}
                          iconClassName={colors.icon}
                          iconBgClassName={`bg-${colors.icon.split("-")[1]}-50`}
                          titleClassName="text-slate-900 dark:text-white"
                          descriptionClassName="text-slate-500 dark:text-slate-400"
                          parrafoClassName="text-slate-600 dark:text-slate-300"
                        />
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title={
          selectedSanidad
            ? t("modal.editTitle", { species: especie_animal })
            : t("modal.addTitle", { species: especie_animal })
        }
        description={
          selectedSanidad
            ? t("modal.editDescription")
            : t("modal.addDescription")
        }
        height="auto"
        size={isMobile ? "full" : "2xl"}
        showCloseButton={false}
        color_title={colors.title}
      >
        <FormSanidad
          opciones_especie={opciones_servicios_especie}
          setOpenModal={setOpenModal}
          onSuccess={() => {
            setOpenModal(false);
            setSelectedSanidad(null);
          }}
          especie_animal={especie_animal}
          sanidad={selectedSanidad}
          borderColor={colors.border
            .replace("border-l-4 border-l-", "")
            .replace("-500", "-200")}
          bgColor={colors.tag.replace("bg-", "bg-").replace(" text-", "/50")}
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
      </Modal>
    </div>
  );
};

export default SanidadByEspeciePage;
