"use client";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetTratamientosAnimales from "@/hooks/historial-clinico/useGetTratamientosAnimales";
import { useAuthStore } from "@/providers/store/useAuthStore";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  Building,
  Beef,
  Calendar as CalendarIcon,
  Download,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Pill,
  CheckCircle,
} from "lucide-react";
import CardHistorial from "@/components/generics/CardHistorial";
import CardTratamientos from "./ui/CardTratamientos";
import { FiltrosBusqueda } from "@/components/generics/FiltrosBusqueda";

const TratamientosPage = () => {
  const { cliente } = useAuthStore();
  const userId = cliente?.id || "";

  const [paginacion, setPaginacion] = useState({
    limit: 10,
    offset: 0,
  });

  const [filtros, setFiltros] = useState({
    fincaNombre: "",
    identificador: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [busquedaFinca, setBusquedaFinca] = useState("");
  const [busquedaAnimal, setBusquedaAnimal] = useState("");

  const parametrosConsulta = {
    ...filtros,
    limit: paginacion.limit,
    offset: paginacion.offset,
  };

  const { data: tratamientosData, isLoading } =
    useGetTratamientosAnimales(parametrosConsulta);
  const { data: fincasData } = useFincasPropietarios(userId);
  const { data: animalesData } = useGetAnimalesPropietario(userId);

  const tratamientos = tratamientosData?.tratamientos || [];
  const fincas = fincasData?.data?.fincas || [];
  const animales = animalesData?.data || [];
  const totalTratamientos = tratamientosData?.total || 0;

  const paginaActual = Math.floor(paginacion.offset / paginacion.limit) + 1;
  const totalPaginas = Math.ceil(totalTratamientos / paginacion.limit);
  const inicioItem = paginacion.offset + 1;
  const finItem = Math.min(
    paginacion.offset + paginacion.limit,
    totalTratamientos,
  );

  const fincasFiltradas = fincas.filter((finca) =>
    finca.nombre_finca.toLowerCase().includes(busquedaFinca.toLowerCase()),
  );

  const animalesFiltrados = animales.filter((animal) =>
    animal.identificador.toLowerCase().includes(busquedaAnimal.toLowerCase()),
  );

  const handleFiltroChange = (key: string, value: string) => {
    setFiltros((prev) => ({
      ...prev,
      [key]: value,
    }));

    setPaginacion((prev) => ({ ...prev, offset: 0 }));
  };

  const handleSeleccionarFinca = (fincaNombre: string) => {
    setFiltros((prev) => ({
      ...prev,
      fincaNombre,
    }));
    setBusquedaFinca("");
    setPaginacion((prev) => ({ ...prev, offset: 0 }));
  };

  const handleSeleccionarAnimal = (identificador: string) => {
    setFiltros((prev) => ({
      ...prev,
      identificador,
    }));
    setBusquedaAnimal("");
    setPaginacion((prev) => ({ ...prev, offset: 0 }));
  };

  const irAPagina = (pagina: number) => {
    const nuevoOffset = (pagina - 1) * paginacion.limit;
    setPaginacion((prev) => ({ ...prev, offset: nuevoOffset }));
  };

  const paginaAnterior = () => {
    if (paginaActual > 1) {
      irAPagina(paginaActual - 1);
    }
  };

  const paginaSiguiente = () => {
    if (paginaActual < totalPaginas) {
      irAPagina(paginaActual + 1);
    }
  };

  const primeraPagina = () => {
    irAPagina(1);
  };

  const ultimaPagina = () => {
    irAPagina(totalPaginas);
  };

  const cambiarLimite = (nuevoLimite: number) => {
    setPaginacion({
      limit: nuevoLimite,
      offset: 0,
    });
  };

  const limpiarFiltros = () => {
    setFiltros({
      fincaNombre: "",
      identificador: "",
      fechaInicio: "",
      fechaFin: "",
    });
    setBusquedaFinca("");
    setBusquedaAnimal("");
    setPaginacion((prev) => ({ ...prev, offset: 0 }));
  };

  const generarNumerosPagina = () => {
    const paginas = [];
    const paginasAMostrar = 5;

    let inicio = Math.max(1, paginaActual - Math.floor(paginasAMostrar / 2));
    let fin = Math.min(totalPaginas, inicio + paginasAMostrar - 1);

    if (fin - inicio + 1 < paginasAMostrar) {
      inicio = Math.max(1, fin - paginasAMostrar + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }

    return paginas;
  };

  const getEstadoTratamiento = (fechaCreacion: string) => {
    const fechaTratamiento = new Date(fechaCreacion);
    const hoy = new Date();
    const diferenciaDias = Math.floor(
      (hoy.getTime() - fechaTratamiento.getTime()) / (1000 * 60 * 60 * 24),
    );

    if (diferenciaDias <= 7) {
      return {
        texto: "Reciente",
        color: "bg-green-100 text-green-800",
        icono: CheckCircle,
      };
    } else if (diferenciaDias <= 30) {
      return {
        texto: "En seguimiento",
        color: "bg-blue-100 text-blue-800",
        icono: Clock,
      };
    } else {
      return {
        texto: "Completado",
        color: "bg-gray-100 text-gray-800",
        icono: CheckCircle,
      };
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Tratamientos Animales
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona y consulta los tratamientos aplicados a tus animales
          </p>
        </div>
      </div>

      <FiltrosBusqueda
        filtros={filtros}
        fincasFiltradas={fincasFiltradas}
        animalesFiltrados={animalesFiltrados}
        handleFiltroChange={handleFiltroChange}
        handleSeleccionarFinca={handleSeleccionarFinca}
        handleSeleccionarAnimal={handleSeleccionarAnimal}
        limpiarFiltros={limpiarFiltros}
      />

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Mostrar:</span>
            <select
              value={paginacion.limit}
              onChange={(e) => cambiarLimite(Number(e.target.value))}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span className="text-sm text-gray-600">por página</span>
          </div>

          <span className="text-sm text-gray-600">
            Mostrando {inicioItem}-{finItem} de {totalTratamientos} tratamientos
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={primeraPagina}
            disabled={paginaActual === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={paginaAnterior}
            disabled={paginaActual === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          {generarNumerosPagina().map((pagina) => (
            <Button
              key={pagina}
              variant={pagina === paginaActual ? "default" : "outline"}
              size="sm"
              onClick={() => irAPagina(pagina)}
              className="h-8 w-8 p-0"
            >
              {pagina}
            </Button>
          ))}

          <Button
            variant="outline"
            size="sm"
            onClick={paginaSiguiente}
            disabled={paginaActual === totalPaginas}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={ultimaPagina}
            disabled={paginaActual === totalPaginas}
            className="h-8 w-8 p-0"
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <CardHistorial
          titulo="Total Tratamientos"
          total={totalTratamientos}
          colorIcon="text-blue-500"
        />
        <CardHistorial
          titulo="Con Documentos"
          total={
            tratamientos.filter((t) => t.documentos && t.documentos.length > 0)
              .length
          }
          colorIcon="text-green-500"
        />
        <CardHistorial
          titulo=" Servicios Diferentes"
          total={new Set(tratamientos.map((t) => t.subServicio?.nombre)).size}
          colorIcon="text-purple-500"
        />

        <CardHistorial
          titulo="    Tratamientos Recientes"
          total={
            tratamientos.filter((t) => {
              const fecha = new Date(t.createdAt);
              const hoy = new Date();
              const diferenciaDias = Math.floor(
                (hoy.getTime() - fecha.getTime()) / (1000 * 60 * 60 * 24),
              );
              return diferenciaDias <= 7;
            }).length
          }
          colorIcon="text-orange-500"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tratamientos Aplicados</CardTitle>
        </CardHeader>
        <CardContent>
          {tratamientos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Pill className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>
                No se encontraron tratamientos con los filtros seleccionados
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {tratamientos.map((tratamiento) => {
                const estado = getEstadoTratamiento(tratamiento.createdAt);
                const IconoEstado = estado.icono;

                return (
                  <CardTratamientos
                    key={tratamiento.id}
                    estado={estado}
                    tratamiento={tratamiento}
                    IconoEstado={IconoEstado}
                  />
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {tratamientos.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">
            Mostrando {inicioItem}-{finItem} de {totalTratamientos} tratamientos
          </span>

          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={primeraPagina}
              disabled={paginaActual === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={paginaAnterior}
              disabled={paginaActual === 1}
              className="h-8 w-8 p-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {generarNumerosPagina().map((pagina) => (
              <Button
                key={pagina}
                variant={pagina === paginaActual ? "default" : "outline"}
                size="sm"
                onClick={() => irAPagina(pagina)}
                className="h-8 w-8 p-0"
              >
                {pagina}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={paginaSiguiente}
              disabled={paginaActual === totalPaginas}
              className="h-8 w-8 p-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={ultimaPagina}
              disabled={paginaActual === totalPaginas}
              className="h-8 w-8 p-0"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TratamientosPage;
