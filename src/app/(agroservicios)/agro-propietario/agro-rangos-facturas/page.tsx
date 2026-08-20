"use client";
import ButtonAdd from "@/components/generics/ButtonAdd";
import TitlePage from "@/components/generics/TitlePage";
import Paginacion from "@/components/generics/Paginacion";
import useGetAgroRangosFactura from "@/hooks/agroservicios/facturacion/useGetAgroRangosFactura";
import { useAuthStore } from "@/providers/store/useAuthStore";
import {
  FileText,
  Search,
  Loader2,
  CheckCircle,
  CalendarDays,
} from "lucide-react";
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Rangos } from "@/api/agroservicio/facturacion/interface/response-agro-rangos-factura.interface";
import Modal from "@/components/generics/Modal";
import {
  calcularUso,
  getUsoColor,
} from "@/helpers/funciones/agroservicio/facturacion/rangos_factura";
import TableRangosFactura from "@/components/agroservicio/facturacion/TableRangosFactura";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import FormAgroRangosFactura from "@/components/agroservicio/facturacion/FormAgroRangosFactura";

const AgroRangosFacturaPage = () => {
  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRango, setSelectedRango] = useState<Rangos | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [openFormRango, setOpenFormRango] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const limit = 10;

  const { data: rangosData, isLoading } = useGetAgroRangosFactura(
    propietarioId,
    {
      limit: limit,
      offset: (currentPage - 1) * limit,
    },
  );

  const rangos = rangosData?.data || [];
  const total = rangosData?.total || 0;
  const totalPages = rangosData?.totalPages || 1;

  const filteredRangos = useMemo(() => {
    if (!searchTerm.trim()) return rangos;

    const searchLower = searchTerm.toLowerCase();
    return rangos.filter(
      (rango) =>
        rango.cai.toLowerCase().includes(searchLower) ||
        rango.prefijo.toLowerCase().includes(searchLower) ||
        rango.agroservicio?.nombre_agroservicio
          .toLowerCase()
          .includes(searchLower),
    );
  }, [rangos, searchTerm]);

  const stats = useMemo(() => {
    const activos = rangos.filter((r) => r.is_active).length;
    const proximosVencer = rangos.filter((r) => {
      const fechaLimite = new Date(r.fecha_limite_emision);
      const hoy = new Date();
      const diffDays = Math.ceil(
        (fechaLimite.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24),
      );
      return diffDays <= 30 && diffDays > 0;
    }).length;

    return { activos, proximosVencer };
  }, [rangos]);

  const handleEditRango = (rango: Rangos) => {
    setOpenFormRango(true);
    setSelectedRango(rango);
    setIsEdit(true);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-green-600" />
          <p className="text-gray-500">Cargando rangos de factura...</p>
        </div>
      </div>
    );
  }

  return (
    <div id="modulo-rangos" className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="md:flex justify-between items-center gap-4">
        <TitlePage
          Icon={FileText}
          title="Control de Rangos de Facturas"
          description="Gestiona los rangos de facturación del agroservicio"
        />
        <ButtonAdd
          title="Agregar Rango"
          Icon={FileText}
          action={() => setOpenFormRango(true)}
          className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
          id="add-rango"
        />
      </div>

      <div
        id="estadisticas-rangos"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Rangos</CardTitle>
            <FileText className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-gray-500">Rangos configurados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rangos Activos
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activos}</div>
            <p className="text-xs text-gray-500">
              {rangos.length > 0
                ? `${Math.round((stats.activos / rangos.length) * 100)}% del total`
                : "Sin rangos"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Próximos a Vencer
            </CardTitle>
            <CalendarDays className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.proximosVencer}</div>
            <p className="text-xs text-gray-500">
              Menos de 30 días para vencer
            </p>
          </CardContent>
        </Card>
      </div>

      <div id="buscador-rangos" className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Buscar por CAI, prefijo o agroservicio..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 max-w-md"
        />
      </div>

      <Card id="lista-rangos">
        <CardHeader>
          <CardTitle>Lista de Rangos</CardTitle>
          <CardDescription>
            {filteredRangos.length} rangos encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredRangos.length > 0 ? (
            <div className="overflow-x-auto">
              <TableRangosFactura
                filteredRangos={filteredRangos}
                setSelectedRango={setSelectedRango}
                setIsViewDialogOpen={setIsViewDialogOpen}
                handleEditRango={handleEditRango}
              />
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 mx-auto text-gray-300" />
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {searchTerm
                  ? "No se encontraron resultados"
                  : "No hay rangos configurados"}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {searchTerm
                  ? "Intenta con otros términos de búsqueda"
                  : "Comienza agregando tu primer rango de facturación."}
              </p>
              {!searchTerm && (
                <ButtonAdd
                  title="Agregar Rango"
                  Icon={FileText}
                  action={() => {}}
                  className="mt-4 bg-green-600 hover:bg-green-700"
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center">
          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

      <Modal
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        title="Detalles del Rango"
        description="Información completa del rango de facturación"
        size="3xl"
        height="auto"
      >
        {selectedRango && (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-gray-500">CAI</Label>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded mt-1 break-all">
                  {selectedRango.cai}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Prefijo</Label>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded mt-1">
                  {selectedRango.prefijo}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Rango Inicial</Label>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded mt-1">
                  {selectedRango.rango_inicial}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Rango Final</Label>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded mt-1">
                  {selectedRango.rango_final}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">
                  Correlativo Actual
                </Label>
                <p className="font-mono text-sm bg-gray-50 p-2 rounded mt-1">
                  {selectedRango.correlativo_actual}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Estado</Label>
                <div className="mt-1">
                  <Badge
                    variant={selectedRango.is_active ? "default" : "secondary"}
                    className={
                      selectedRango.is_active
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }
                  >
                    {selectedRango.is_active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Fecha Recepción</Label>
                <p className="text-sm bg-gray-50 p-2 rounded mt-1">
                  {selectedRango.fecha_recepcion}
                </p>
              </div>
              <div>
                <Label className="text-xs text-gray-500">Fecha Límite</Label>
                <p className="text-sm bg-gray-50 p-2 rounded mt-1">
                  {selectedRango.fecha_limite_emision}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="text-xs text-gray-500">Agroservicio</Label>
              <div className="bg-gray-50 p-3 rounded mt-1">
                <p className="text-sm font-medium">
                  {selectedRango.agroservicio?.nombre_agroservicio}
                </p>
                <p className="text-xs text-gray-400">
                  RTN: {selectedRango.agroservicio?.rtn}
                </p>
                <p className="text-xs text-gray-400">
                  {selectedRango.agroservicio?.correo}
                </p>
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="text-xs text-gray-500">Uso del Rango</Label>
              <div className="mt-2">
                <div className="flex items-center gap-4">
                  <div className="flex-1 bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${getUsoColor(calcularUso(selectedRango))}`}
                      style={{
                        width: `${Math.min(calcularUso(selectedRango), 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium">
                    {calcularUso(selectedRango)}%
                  </span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{selectedRango.rango_inicial}</span>
                  <span>{selectedRango.rango_final}</span>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <Label className="text-xs text-gray-500">
                Información de Auditoría
              </Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div>
                  <p className="text-xs text-gray-400">Creado</p>
                  <p className="text-xs">
                    {formatDateOnly(selectedRango.created_at)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Actualizado</p>
                  <p className="text-xs">
                    {formatDateOnly(selectedRango.updated_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-5 flex justify-end">
          <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
            Cerrar
          </Button>
        </div>
      </Modal>

      <Modal
        open={openFormRango}
        onOpenChange={setOpenFormRango}
        title={isEdit ? "Editar Rango" : "Agregar Nuevo Rango"}
        showCloseButton={false}
        size="2xl"
        height="auto"
      >
        <FormAgroRangosFactura
          isPropietario={true}
          editRango={selectedRango}
          isEdit={isEdit}
          onSuccess={() => {
            setOpenFormRango(false);
            setIsEdit(false);
            setSelectedRango(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default AgroRangosFacturaPage;
