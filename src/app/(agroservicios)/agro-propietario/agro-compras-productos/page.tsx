"use client";
import { Button } from "@/components/ui/button";
import { Filter, ShoppingCart } from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Paginacion from "@/components/generics/Paginacion";
import { useAuthStore } from "@/providers/store/useAuthStore";
import useGetAllProveedores from "@/hooks/agroservicios/proveedores/useGetAllProveedores";
import useGetCompras from "@/hooks/agroservicios/compras/useGetCompras";
import TitlePage from "@/components/generics/TitlePage";
import ButtonAdd from "@/components/generics/ButtonAdd";
import { tiposPagos } from "@/helpers/data/compras/tiposPagos";
import Modal from "@/components/generics/Modal";
import TableComprasProductos from "@/components/agroservicio/compras/TableComprasProductos";
import FormCompraProductos from "@/components/agroservicio/compras/FormCompraProductos";
import useGetAllSucursales from "@/hooks/agroservicios/sucursales/useGetAllSucursales";

const ComprasProductosPage = () => {
  const { cliente } = useAuthStore();
  const paisId = cliente?.pais.id || "";
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const propietarioId = cliente?.id ?? "";
  const [isOpen, setIsOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [proveedor, setProveedor] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [tipoPago, setTipoPago] = useState("");
  const { data: proveedores } = useGetAllProveedores(propietarioId);
  const { data: sucursales } = useGetAllSucursales();

  const proveedorId = proveedor === "all" ? "" : proveedor;
  const sucursalId = sucursal === "all" ? "" : sucursal;
  const todosPagos = tipoPago === "all" ? "" : tipoPago;

  const { data: comprasData, isLoading } = useGetCompras(
    propietarioId,
    limit,
    offset,
    proveedorId,
    sucursalId,
    todosPagos,
  );

  const totalPages = comprasData ? Math.ceil(comprasData.total / limit) : 1;
  const currentPage = Math.floor(offset / limit) + 1;

  const handlePageChange = (page: number) => {
    setOffset((page - 1) * limit);
  };

  const clearFilters = () => {
    setProveedor("");
    setSucursal("");
    setTipoPago("");
    setOffset(0);
  };
  return (
    <div className="container mx-auto py-6">
      <div className="md:flex justify-between items-center gap-4">
        <TitlePage
          Icon={ShoppingCart}
          title="Compras"
          description="Gestión de compras agropecuarios"
        />
        <ButtonAdd
          title="Agregar Compra"
          Icon={ShoppingCart}
          action={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
        />
      </div>

      <div className="mt-5 p-4 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Select value={proveedor} onValueChange={setProveedor}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {proveedores && proveedores.length > 0 ? (
                  proveedores.map((prov) => (
                    <SelectItem value={prov.id} key={prov.id}>
                      {prov.nombre_legal} - {prov.nit_rtn}
                    </SelectItem>
                  ))
                ) : (
                  <p>No se encontraron proveedores</p>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={sucursal} onValueChange={setSucursal}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por sucursal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {sucursales && sucursales.length > 0 ? (
                  sucursales.map((suc) => (
                    <SelectItem value={suc.id} key={suc.id}>
                      {suc.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <p>No se encontraron sucursales</p>
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select value={tipoPago} onValueChange={setTipoPago}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por tipo de pago" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {tiposPagos.map((tipo) => (
                  <SelectItem value={tipo.value} key={tipo.id}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={clearFilters}>
            <Filter className="mr-2 h-4 w-4" /> Limpiar
          </Button>
        </div>
      </div>

      <div className="mt-5">
        <div className="rounded-md border">
          <TableComprasProductos
            comprasData={comprasData}
            isLoading={isLoading}
            moneda={moneda}
          />
        </div>

        {comprasData && comprasData.total > limit && (
          <div className="mt-4 flex justify-center">
            <Paginacion
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
      <Modal
        open={isOpen}
        onOpenChange={setIsOpen}
        title="Agregar Nueva Compra"
        description="En esta sección ingresarás las compras de productos"
        size="5xl"
        height="auto"
      >
        <FormCompraProductos
          onSuccess={() => setIsOpen(false)}
          paisId={paisId}
          propietarioId={propietarioId}
          sucursalId=""
          isPropietario={true}
          moneda={moneda}
        />
      </Modal>
    </div>
  );
};

export default ComprasProductosPage;
