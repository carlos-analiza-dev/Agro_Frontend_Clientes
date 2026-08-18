"use client";
import ButtonAdd from "@/components/generics/ButtonAdd";
import TitlePage from "@/components/generics/TitlePage";
import Paginacion from "@/components/generics/Paginacion";
import useGetNotaCreditos from "@/hooks/agroservicios/nota-credito/useGetNotaCreditos";
import useGetAllSucursalesByPropietario from "@/hooks/agroservicios/sucursales/useGetAllSucursalesByPropietario";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { FileMinus, Calendar, X } from "lucide-react";
import { useState, useMemo } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format, subMonths } from "date-fns";
import { SucursaleAgro } from "@/api/agroservicio/agro-sucursales/interface/response-sucursales-agro.interface";
import TableNotaCredito from "@/components/agroservicio/notas-credito/TableNotaCredito";
import Modal from "@/components/generics/Modal";
import FormCrearNotaCredito from "@/components/agroservicio/notas-credito/FormCrearNotaCredito";
import { formatDate } from "@/helpers/funciones/formatDate";
import SkeletonPage from "@/components/generics/SkeletonPage";

const NotasCreditoPage = () => {
  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const [openFormNota, setOpenFormNota] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  const fechaHaceUnMes = useMemo(() => {
    const fecha = subMonths(new Date(), 1);
    return format(fecha, "yyyy-MM-dd");
  }, []);

  const [filtros, setFiltros] = useState({
    sucursal: "all",
    fechaInicio: fechaHaceUnMes,
    fechaFin: format(new Date(), "yyyy-MM-dd"),
  });

  const offset = useMemo(() => (currentPage - 1) * limit, [currentPage, limit]);

  const { data: sucursales } = useGetAllSucursalesByPropietario(propietarioId);
  const { data: notasData, isLoading } = useGetNotaCreditos(propietarioId, {
    limit,
    offset,
    sucursal: filtros.sucursal === "all" ? "" : filtros.sucursal,
    fechaInicio: filtros.fechaInicio,
    fechaFin: filtros.fechaFin,
  });

  const notas = notasData?.notas || [];
  const total = notasData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handleFiltroChange = (key: string, value: string) => {
    setFiltros((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const limpiarFiltros = () => {
    setFiltros({
      sucursal: "all",
      fechaInicio: fechaHaceUnMes,
      fechaFin: format(new Date(), "yyyy-MM-dd"),
    });
    setCurrentPage(1);
  };

  const hayFiltrosActivos = useMemo(() => {
    const { sucursal, ...otrosFiltros } = filtros;

    const fechaInicioDefault = fechaHaceUnMes;
    const fechaFinDefault = format(new Date(), "yyyy-MM-dd");

    return (
      Object.values(otrosFiltros).some(
        (valor) =>
          valor !== "" &&
          valor !== fechaInicioDefault &&
          valor !== fechaFinDefault,
      ) || sucursal !== "all"
    );
  }, [filtros, fechaHaceUnMes]);

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="md:flex justify-between items-start gap-4">
        <TitlePage
          Icon={FileMinus}
          title="Notas de Crédito"
          description="Gestión completa de notas de crédito"
        />
        <ButtonAdd
          title="Agregar Nota"
          Icon={FileMinus}
          action={() => setOpenFormNota(true)}
          className="bg-green-600 hover:bg-green-700 w-full md:w-auto mt-4 md:mt-0"
        />
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select
              value={filtros.sucursal}
              onValueChange={(value) => handleFiltroChange("sucursal", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Todas las sucursales" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las sucursales</SelectItem>
                {sucursales?.map((sucursal: SucursaleAgro) => (
                  <SelectItem key={sucursal.id} value={sucursal.id}>
                    {sucursal.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={filtros.fechaInicio}
                onChange={(e) =>
                  handleFiltroChange("fechaInicio", e.target.value)
                }
                className="pl-9"
              />
            </div>

            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="date"
                value={filtros.fechaFin}
                onChange={(e) => handleFiltroChange("fechaFin", e.target.value)}
                className="pl-9"
              />
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFiltros({
                    sucursal: "all",
                    fechaInicio: fechaHaceUnMes,
                    fechaFin: format(new Date(), "yyyy-MM-dd"),
                  });
                  setCurrentPage(1);
                }}
                className="w-full"
              >
                <Calendar className="h-4 w-4 mr-2" />
                Último mes
              </Button>
            </div>
          </div>

          <div className="flex justify-between items-center mt-4 gap-2">
            <p className="text-xs text-muted-foreground">
              Mostrando notas del {formatDate(filtros.fechaInicio)} al{" "}
              {formatDate(filtros.fechaFin)}
            </p>
            {hayFiltrosActivos && (
              <Button
                variant="outline"
                size="sm"
                onClick={limpiarFiltros}
                className="text-red-600 hover:text-red-700"
              >
                <X className="h-4 w-4 mr-1" />
                Limpiar filtros
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              Mostrando {notas.length} de {total} notas de crédito
            </p>
            {isLoading && (
              <span className="text-sm text-muted-foreground">Cargando...</span>
            )}
          </div>

          {isLoading ? (
            <SkeletonPage />
          ) : notas.length === 0 ? (
            <div className="text-center py-8">
              <FileMinus className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-muted-foreground">
                No se encontraron notas de crédito
              </p>
              <p className="text-sm text-muted-foreground">
                Ajusta los filtros o crea una nueva nota
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <TableNotaCredito
                notas={notas}
                moneda={moneda}
                propietarioId={propietarioId}
              />
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Paginacion
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={openFormNota}
        onOpenChange={setOpenFormNota}
        title="Ingresar Nota de Credito"
        description="Aqui podras ingresar notas de credito para el agroservicio"
        size="2xl"
        height="auto"
      >
        <FormCrearNotaCredito
          isPropietario={true}
          propietarioId={propietarioId}
          simbolo={moneda}
          onSucces={() => setOpenFormNota(false)}
        />
      </Modal>
    </div>
  );
};

export default NotasCreditoPage;
