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
import { useTranslations } from "next-intl";

const ComprasProductosPage = () => {
  const t = useTranslations("comprasProductosPage");

  const { cliente } = useAuthStore();
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
    <div id="id-compras-container" className="container mx-auto py-6">
      <div
        id="id-compras-header"
        className="md:flex justify-between items-center gap-4"
      >
        <TitlePage
          Icon={ShoppingCart}
          title={t("title")}
          description={t("description")}
        />
        <ButtonAdd
          id="id-compras-add-btn"
          title={t("buttons.add")}
          Icon={ShoppingCart}
          action={() => setIsOpen(true)}
          className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
        />
      </div>

      <div id="id-compras-filters" className="mt-5 p-4 bg-muted/50 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div id="id-compras-filter-proveedor">
            <Select value={proveedor} onValueChange={setProveedor}>
              <SelectTrigger>
                <SelectValue placeholder={t("filters.provider")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.all")}</SelectItem>
                {proveedores && proveedores.length > 0 ? (
                  proveedores.map((prov) => (
                    <SelectItem value={prov.id} key={prov.id}>
                      {prov.nombre_legal} - {prov.nit_rtn}
                    </SelectItem>
                  ))
                ) : (
                  <p className="px-2 py-1.5 text-sm">
                    {t("filters.noProviders")}
                  </p>
                )}
              </SelectContent>
            </Select>
          </div>

          <div id="id-compras-filter-sucursal">
            <Select value={sucursal} onValueChange={setSucursal}>
              <SelectTrigger>
                <SelectValue placeholder={t("filters.branch")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.all")}</SelectItem>
                {sucursales && sucursales.length > 0 ? (
                  sucursales.map((suc) => (
                    <SelectItem value={suc.id} key={suc.id}>
                      {suc.nombre}
                    </SelectItem>
                  ))
                ) : (
                  <p className="px-2 py-1.5 text-sm">
                    {t("filters.noBranches")}
                  </p>
                )}
              </SelectContent>
            </Select>
          </div>

          <div id="id-compras-filter-tipo-pago">
            <Select value={tipoPago} onValueChange={setTipoPago}>
              <SelectTrigger>
                <SelectValue placeholder={t("filters.paymentType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("filters.all")}</SelectItem>
                {tiposPagos.map((tipo) => (
                  <SelectItem value={tipo.value} key={tipo.id}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div id="id-compras-filter-actions">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="w-full md:w-auto"
            >
              <Filter className="mr-2 h-4 w-4" />
              {t("buttons.clearFilters")}
            </Button>
          </div>
        </div>
      </div>

      <div id="id-compras-table-section" className="mt-5">
        <div id="id-compras-table" className="rounded-md border">
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
        title={t("modal.title")}
        description={t("modal.description")}
        size="5xl"
        height="auto"
      >
        <FormCompraProductos
          onSuccess={() => setIsOpen(false)}
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
