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
import useGetAllProveedores from "@/hooks/agroservicios/proveedores/useGetAllProveedores";
import useGetCompras from "@/hooks/agroservicios/compras/useGetCompras";
import TitlePage from "@/components/generics/TitlePage";
import ButtonAdd from "@/components/generics/ButtonAdd";
import { tiposPagos } from "@/helpers/data/compras/tiposPagos";
import Modal from "@/components/generics/Modal";
import TableComprasProductos from "@/components/agroservicio/compras/TableComprasProductos";
import FormCompraProductos from "@/components/agroservicio/compras/FormCompraProductos";
import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";
import useGetSucursalByEmpleado from "@/hooks/agroservicios/sucursales/useGetSucursalByEmpleado";

const ComprasProductosPage = () => {
  const { empleado } = useAuthEmpleadoStore();
  const paisId = empleado?.pais.id || "";
  const moneda = empleado?.pais.simbolo_moneda ?? "$";
  const propietarioId = empleado?.agroservicio.propietario.id ?? "";
  const [isOpen, setIsOpen] = useState(false);
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [proveedor, setProveedor] = useState("");
  const [tipoPago, setTipoPago] = useState("");
  const { data: proveedores } = useGetAllProveedores(propietarioId);
  const { data: sucursalEmpleado } = useGetSucursalByEmpleado(
    empleado?.id ?? "",
  );

  const sucursalId = sucursalEmpleado?.id ?? "";

  const proveedorId = proveedor === "all" ? "" : proveedor;
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          sucursalId={sucursalEmpleado?.id ?? ""}
          isPropietario={false}
          moneda={moneda}
        />
      </Modal>
    </div>
  );
};

export default ComprasProductosPage;
