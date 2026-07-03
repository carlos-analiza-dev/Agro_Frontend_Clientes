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
} from "lucide-react";
import { useParams } from "next/navigation";
import { useState, useMemo } from "react";
import FormSanidad from "../../ui/FormSanidad";
import useGetSanidadAnimal from "@/hooks/sanidad-animal/useGetSanidadAnimal";
import CardSanidad from "../../ui/CardSanidad";
import { useAuthStore } from "@/providers/store/useAuthStore";

const SanidadByEspeciePage = () => {
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const { especie } = useParams();
  const especie_animal = especie as string;
  const [openModal, setOpenModal] = useState(false);
  const {
    data: sanidadResponse,
    isLoading,
    refetch,
  } = useGetSanidadAnimal({
    especie: especie_animal,
  });

  const sanidadData = sanidadResponse?.sanidad || [];
  const total = sanidadResponse?.total || 0;

  const estadisticas = useMemo(() => {
    if (!sanidadData || sanidadData.length === 0) {
      return {
        estadoSanitario: "Sin registros",
        descripcionEstado: "No hay registros de sanidad",
        parrafoEstado: "Inicia registrando un evento sanitario",
        ultimoEvento: "N/A",
        descripcionUltimo: "N/A",
        parrafoUltimo: "Sin eventos registrados",
        proximoEvento: "N/A",
        descripcionProximo: "N/A",
        parrafoProximo: "Sin eventos programados",
        costoSanitario: 0,
        costoSanitarioStr: `${moneda}0`,
        descripcionCosto: "Sin costos registrados",
        parrafoCosto: "Promedio por animal/lote",
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
    const ultimoEvento = ultimo?.tipo_servicio || "N/A";
    const fechaUltimo = ultimo?.fecha_evento
      ? new Date(ultimo.fecha_evento).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
      : "N/A";

    let diasDesdeUltimo = "N/A";
    if (ultimo?.fecha_evento) {
      const diffTime = Math.abs(
        new Date().getTime() - new Date(ultimo.fecha_evento).getTime(),
      );
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      diasDesdeUltimo = diffDays === 0 ? "Hoy" : `Hace ${diffDays} días`;
    }

    const eventosConProxima = sortedData.filter(
      (item) =>
        item.proxima_fecha_evento &&
        new Date(item.proxima_fecha_evento) >= new Date(),
    );

    let proximoEvento = "Sin programar";
    let fechaProximo = "N/A";
    let diasHastaProximo = "N/A";

    if (eventosConProxima.length > 0) {
      const proximo = eventosConProxima.sort(
        (a, b) =>
          new Date(a.proxima_fecha_evento).getTime() -
          new Date(b.proxima_fecha_evento).getTime(),
      )[0];

      proximoEvento = proximo.tipo_servicio || "Sin programar";
      fechaProximo = proximo.proxima_fecha_evento
        ? new Date(proximo.proxima_fecha_evento).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
        : "N/A";

      if (proximo.proxima_fecha_evento) {
        const diffTime = Math.abs(
          new Date(proximo.proxima_fecha_evento).getTime() -
            new Date().getTime(),
        );
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        diasHastaProximo = diffDays === 0 ? "Hoy" : `${diffDays} días`;
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

    let estadoSanitario = "Al día";
    let descripcionEstado = "Todo en orden";
    let parrafoEstado = "Sin eventos pendientes";

    if (eventosPendientes.length > 0) {
      const serviciosPendientes = eventosPendientes
        .map((e) => e.tipo_servicio)
        .join(", ");
      estadoSanitario = `${eventosPendientes.length} pendiente${eventosPendientes.length > 1 ? "s" : ""}`;
      descripcionEstado = `Próximo: ${serviciosPendientes}`;
      parrafoEstado = `Requiere atención en los próximos 7 días`;
    }

    const promedioPorEvento =
      sanidadData.length > 0 ? costoTotal / sanidadData.length : 0;

    return {
      estadoSanitario,
      descripcionEstado,
      parrafoEstado,
      ultimoEvento,
      descripcionUltimo: fechaUltimo,
      parrafoUltimo: diasDesdeUltimo,
      proximoEvento:
        diasHastaProximo !== "N/A" ? diasHastaProximo : "Sin programar",
      descripcionProximo: fechaProximo,
      parrafoProximo:
        proximoEvento !== "Sin programar"
          ? `Próximo: ${proximoEvento}`
          : "Sin eventos programados",
      costoSanitario: costoTotal,
      costoSanitarioStr: `${moneda}${costoTotal.toFixed(2)}`,
      descripcionCosto: `${sanidadData.length} evento${sanidadData.length > 1 ? "s" : ""}`,
      parrafoCosto: `Promedio por animal/lote`,
      tieneEventosPendientes: tienePendientes,
      eventosPendientes: eventosPendientes.length,
      totalEventos: sanidadData.length,
      promedioPorEvento: promedioPorEvento,
    };
  }, [sanidadData]);

  const getEstadoIcon = () => {
    if (estadisticas.tieneEventosPendientes) {
      return AlertCircle;
    }
    return CheckCircle;
  };

  const opciones_especie = tiposServiciosSanidadData.filter((data) => {
    if (data.especies.includes("todas")) {
      return especie_animal !== "peces";
    }
    return data.especies.includes(especie_animal);
  });

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="md:flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight flex items-center gap-2 capitalize">
            <ShieldPlus className="h-7 w-7 text-green-600" />
            Sanidad - {especie_animal}
          </h1>
          <p className="text-sm md:text-base text-muted-foreground mt-1">
            Registra y monitorea la sanidad de tus animales por especie
          </p>
        </div>
        <ButtonAdd
          title={`Ingresar sanidad ${especie_animal}`}
          Icon={ShieldPlus}
          action={() => setOpenModal(true)}
        />
      </div>

      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <CardSanidad
            title="Estado sanitario"
            description={estadisticas.estadoSanitario}
            parrafo={estadisticas.parrafoEstado}
            Icon={getEstadoIcon()}
          />
          <CardSanidad
            title="Último evento"
            description={estadisticas.ultimoEvento}
            parrafo={estadisticas.parrafoUltimo}
            Icon={
              estadisticas.ultimoEvento === "Vacunación"
                ? Syringe
                : estadisticas.ultimoEvento === "Desparasitación"
                  ? Pill
                  : FileText
            }
          />
          <CardSanidad
            title="Próximo evento"
            description={estadisticas.proximoEvento}
            parrafo={estadisticas.parrafoProximo}
            Icon={Calendar}
          />
          <CardSanidad
            title="Costo sanitario mes"
            description={estadisticas.costoSanitarioStr}
            parrafo={`Promedio: ${moneda}${estadisticas.promedioPorEvento.toFixed(2)} por evento`}
            Icon={DollarSign}
          />
        </div>

        {estadisticas.tieneEventosPendientes && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-500" />
            <p className="text-sm text-yellow-700">
              <strong>
                {estadisticas.eventosPendientes} evento(s) pendiente(s)
              </strong>{" "}
              - Requieren atención en los próximos 7 días
            </p>
          </div>
        )}

        <div className="mt-2 text-sm text-muted-foreground">
          {sanidadData.length > 0 ? (
            <p>Total de registros: {sanidadData.length}</p>
          ) : (
            <p className="text-yellow-600">
              No hay registros de sanidad para esta especie
            </p>
          )}
        </div>
      </div>

      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title="Ingresar Sanidad"
        description="Aqui podras ingresar datos de sanidad dependiendo de la especie"
        height="auto"
        size="2xl"
      >
        <FormSanidad
          opciones_especie={opciones_especie}
          setOpenModal={setOpenModal}
          onSuccess={() => refetch()}
        />
      </Modal>
    </div>
  );
};

export default SanidadByEspeciePage;
