"use client";
import FormCompraInsumos from "@/components/agroservicio/compra-insumos/FormCompraInsumos";
import ButtonAdd from "@/components/generics/ButtonAdd";
import Modal from "@/components/generics/Modal";
import TitlePage from "@/components/generics/TitlePage";
import Paginacion from "@/components/generics/Paginacion";
import useGetComprasAgroInsumos from "@/hooks/agroservicios/compras-insumos/useGetComprasInsumos";
import useGetAllProveedores from "@/hooks/agroservicios/proveedores/useGetAllProveedores";
import useGetAllSucursalesByPropietario from "@/hooks/agroservicios/sucursales/useGetAllSucursalesByPropietario";
import { tiposPagos } from "@/helpers/data/compras/tiposPagos";
import {
  FlaskConical,
  Package,
  Calendar,
  Store,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import SkeletonPage from "@/components/generics/SkeletonPage";
import ExpandedDetailsCompraInsumo from "@/components/agroservicio/compra-insumos/ExpandedDetailsCompraInsumo";
import { getTipoPagoLabel } from "@/components/agroservicio/compra-insumos/geTipoPagoLabel";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";
import useGetSucursalByEmpleado from "@/hooks/agroservicios/sucursales/useGetSucursalByEmpleado";

const ComprasInsumoInterface = () => {
  const { empleado } = useAuthEmpleadoStore();
  const propietarioId = empleado?.agroservicio.propietario.id ?? "";
  const moneda = empleado?.pais.simbolo_moneda ?? "$";
  const [openModalForm, setOpenModalForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filtroProveedor, setFiltroProveedor] = useState("");
  const [filtroTipoPago, setFiltroTipoPago] = useState("");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const limit = 10;
  const { data: sucursal } = useGetSucursalByEmpleado();
  const proveedor = filtroProveedor === "todos" ? "" : filtroProveedor;
  const tipo = filtroTipoPago === "todos" ? "" : filtroTipoPago;
  const sucursalId = sucursal?.id ?? "";

  const { data: proveedores } = useGetAllProveedores(propietarioId);

  const { data: comprasData, isLoading } = useGetComprasAgroInsumos(
    propietarioId,
    {
      limit: limit,
      offset: (currentPage - 1) * limit,
      proveedor: proveedor,
      sucursal: sucursalId,
      tipoPago: tipo,
    },
  );

  const compras = comprasData?.compras || [];
  const total = comprasData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <TitlePage
          Icon={FlaskConical}
          title="Compra de Insumos"
          description="Gestiona la compra de insumos en tu agroservicio"
        />

        <ButtonAdd
          title="Agregar Compra"
          Icon={FlaskConical}
          action={() => setOpenModalForm(true)}
          className="w-full md:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300"
        />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Filtros de búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Proveedor</Label>
              <Select
                value={filtroProveedor}
                onValueChange={setFiltroProveedor}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Todos los proveedores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Proveedores</SelectLabel>
                    <SelectItem value="todos">Todos</SelectItem>
                    {proveedores?.map((prov) => (
                      <SelectItem value={prov.id} key={prov.id}>
                        {prov.nombre_legal}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Tipo de Pago</Label>
              <Select value={filtroTipoPago} onValueChange={setFiltroTipoPago}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos los tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Tipos de Pago</SelectLabel>
                    <SelectItem value="todos">Todos</SelectItem>
                    {tiposPagos.map((tipo) => (
                      <SelectItem value={tipo.value} key={tipo.id}>
                        {tipo.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center justify-between">
            <span>Lista de Compras</span>
            <Badge variant="outline" className="text-sm">
              {total} compras
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonPage />
          ) : compras.length === 0 ? (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-600">
                No hay compras registradas
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Comienza agregando una nueva compra
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {compras.map((compra) => {
                const isExpanded = expandedRows.has(compra.id);
                const primerDetalle = compra.detalles?.[0];
                const totalDetalles = compra.detalles?.length || 0;

                return (
                  <Card
                    key={compra.id}
                    className={`transition-all duration-200 ${
                      isExpanded
                        ? "border-primary shadow-md"
                        : "hover:shadow-sm"
                    }`}
                  >
                    <CardContent className="p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="text-lg font-semibold truncate">
                              {compra.proveedor?.nombre_legal || "Proveedor"}
                            </h3>
                            <Badge variant="outline" className="shrink-0">
                              #{compra.numero_factura}
                            </Badge>
                            <Badge
                              variant={
                                compra.tipo_pago === "CONTADO"
                                  ? "default"
                                  : "secondary"
                              }
                              className="shrink-0"
                            >
                              {getTipoPagoLabel(compra.tipo_pago)}
                            </Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {formatDateOnly(compra.fecha)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Store className="h-3.5 w-3.5" />
                              {compra.sucursal?.nombre || "Sucursal"}
                            </span>
                            {primerDetalle && (
                              <span className="flex items-center gap-1">
                                <Package className="h-3.5 w-3.5" />
                                {totalDetalles}{" "}
                                {totalDetalles === 1 ? "insumo" : "insumos"}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <div className="text-right">
                            <p className="text-sm text-muted-foreground">
                              Total
                            </p>
                            <p className="text-xl font-bold text-green-600">
                              {formatCurrency(compra.total, moneda)}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleRow(compra.id)}
                            className="shrink-0"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      {isExpanded && (
                        <ExpandedDetailsCompraInsumo
                          compra={compra}
                          moneda={moneda}
                        />
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {totalPages > 1 && (
                <div className="flex justify-center pt-4">
                  <Paginacion
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={openModalForm}
        onOpenChange={setOpenModalForm}
        title="Agregar Nueva Compra"
        description="En esta sección ingresarás las compras de insumos"
        size="6xl"
        height="auto"
      >
        <div className="p-4">
          <FormCompraInsumos
            isPropietario={false}
            moneda={moneda}
            propietarioId={propietarioId}
            onSuccess={() => setOpenModalForm(false)}
            sucursalId={sucursalId}
          />
        </div>
      </Modal>
    </div>
  );
};

export default ComprasInsumoInterface;
