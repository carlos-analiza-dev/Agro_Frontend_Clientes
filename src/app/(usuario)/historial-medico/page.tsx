"use client";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import useGetHistorialAnimal from "@/hooks/historial-clinico/useGetHistorialAnimal";
import { useAuthStore } from "@/providers/store/useAuthStore";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Search,
  Filter,
  FileText,
  Building,
  Beef,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import useGetAnimalesPropietario from "@/hooks/animales/useGetAnimalesPropietario";

import CardHistorialClinico from "./ui/CardHistorialClinico";
import CardHistorial from "@/components/generics/CardHistorial";

const HistorialMedicoAnimalPage = () => {
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

  const { data: historialData, isLoading } =
    useGetHistorialAnimal(parametrosConsulta);
  const { data: fincasData } = useFincasPropietarios(userId);
  const { data: animalesData } = useGetAnimalesPropietario();

  const historiales = historialData?.historial || [];
  const fincas = fincasData?.data?.fincas || [];
  const animales = animalesData || [];
  const totalHistoriales = historialData?.total || 0;

  const paginaActual = Math.floor(paginacion.offset / paginacion.limit) + 1;
  const totalPaginas = Math.ceil(totalHistoriales / paginacion.limit);
  const inicioItem = paginacion.offset + 1;
  const finItem = Math.min(
    paginacion.offset + paginacion.limit,
    totalHistoriales,
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
            Historial Médico Animal
          </h1>
          <p className="text-gray-600 mt-2">
            Gestiona y consulta el historial clínico de tus animales
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Filtros de Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Building className="h-4 w-4" />
                Buscar Finca
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Escribe el nombre de la finca..."
                  value={busquedaFinca}
                  onChange={(e) => setBusquedaFinca(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              {filtros.fincaNombre && (
                <div className="flex items-center justify-between p-2 bg-blue-50 rounded border border-blue-200">
                  <span className="text-sm text-blue-700">
                    {filtros.fincaNombre}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFiltroChange("fincaNombre", "")}
                    className="h-6 w-6 p-0 hover:bg-blue-100"
                  >
                    ×
                  </Button>
                </div>
              )}

              {busquedaFinca && fincasFiltradas.length > 0 && (
                <div className="absolute z-10 mt-1 w-full max-w-md bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {fincasFiltradas.map((finca) => (
                    <button
                      key={finca.id}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      onClick={() => handleSeleccionarFinca(finca.nombre_finca)}
                    >
                      <div className="font-medium">{finca.nombre_finca}</div>
                      <div className="text-sm text-gray-500">
                        {finca.ubicacion}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Beef className="h-4 w-4" />
                Buscar Animal
              </label>
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Escribe el identificador..."
                  value={busquedaAnimal}
                  onChange={(e) => setBusquedaAnimal(e.target.value)}
                  className="pr-10"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              {filtros.identificador && (
                <div className="flex items-center justify-between p-2 bg-green-50 rounded border border-green-200">
                  <span className="text-sm text-green-700">
                    {filtros.identificador}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFiltroChange("identificador", "")}
                    className="h-6 w-6 p-0 hover:bg-green-100"
                  >
                    ×
                  </Button>
                </div>
              )}

              {busquedaAnimal && animalesFiltrados.length > 0 && (
                <div className="absolute z-10 mt-1 w-full max-w-md bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                  {animalesFiltrados.map((animal) => (
                    <button
                      key={animal.id}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 focus:bg-gray-100 focus:outline-none"
                      onClick={() =>
                        handleSeleccionarAnimal(animal.identificador)
                      }
                    >
                      <div className="font-medium">{animal.identificador}</div>
                      <div className="text-sm text-gray-500">
                        {animal.especie?.nombre} - {animal.razas?.[0]?.nombre}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Fecha Inicio
              </label>
              <Input
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) =>
                  handleFiltroChange("fechaInicio", e.target.value)
                }
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Fecha Fin
              </label>
              <Input
                type="date"
                value={filtros.fechaFin}
                onChange={(e) => handleFiltroChange("fechaFin", e.target.value)}
                className="w-full"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
            <Button
              variant="outline"
              onClick={limpiarFiltros}
              className="flex items-center gap-2"
            >
              Limpiar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

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
            Mostrando {inicioItem}-{finItem} de {totalHistoriales} historiales
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <CardHistorial
          titulo="Total Historiales"
          total={totalHistoriales}
          colorIcon="text-blue-500"
        />
        <CardHistorial
          titulo="Fincas Atendidas"
          total={
            new Set(historiales.map((h) => h.cita?.finca?.nombre_finca)).size
          }
          colorIcon="text-green-500"
        />
        <CardHistorial
          titulo="Animales Atendidos"
          total={new Set(historiales.map((h) => h.animal?.identificador)).size}
          colorIcon="text-purple-500"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historiales Clínicos</CardTitle>
        </CardHeader>
        <CardContent>
          {historiales.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No se encontraron historiales con los filtros seleccionados</p>
            </div>
          ) : (
            <div className="space-y-6">
              {historiales.map((historial) => (
                <CardHistorialClinico
                  key={historial.id}
                  historial={historial}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {historiales.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-600">
            Mostrando {inicioItem}-{finItem} de {totalHistoriales} historiales
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

export default HistorialMedicoAnimalPage;
