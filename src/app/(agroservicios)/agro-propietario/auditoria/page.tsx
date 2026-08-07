"use client";
import useGetAuditoriaProveedores from "@/hooks/agroservicios/auditoria/useGetAuditoriaProveedores";
import useGetAuditoriaProductos from "@/hooks/agroservicios/auditoria/useGetAuditoriaProductos";
import useGetAuditoriaCompras from "@/hooks/agroservicios/auditoria/useGetAuditoriaCompras";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Truck,
  ShieldEllipsis,
  ShoppingBag,
  ShoppingCart,
  ArrowRightLeft,
  Users,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import TitlePage from "@/components/generics/TitlePage";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { AuditoriaProductosContent } from "@/components/agroservicio/auditorias/AuditoriaProductosContent";
import { AuditoriaComprasContent } from "@/components/agroservicio/auditorias/AuditoriaComprasContent";
import { AuditoriaProveedoresContent } from "@/components/agroservicio/auditorias/AuditoriaProveedoresContent";
import { AuditoriaMovimientosLoteContent } from "@/components/agroservicio/auditorias/AuditoriaMovimientosLoteContent";
import { AuditoriaEmpleadosContent } from "@/components/agroservicio/auditorias/AuditoriaEmpleadosContent";
import useGetAuditoriaMovimientosLote from "@/hooks/agroservicios/auditoria/useGetAuditoriaMovimientosLote";
import useGetAuditoriaEmpleados from "@/hooks/agroservicios/auditoria/useGetAuditoriaEmpleados";

const AuditoriaPage = () => {
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const [currentPageProveedores, setCurrentPageProveedores] = useState(1);
  const [currentPageProductos, setCurrentPageProductos] = useState(1);
  const [currentPageCompras, setCurrentPageCompras] = useState(1);
  const [currentPageMovimientosLote, setCurrentPageMovimientosLote] =
    useState(1);
  const [currentPageEmpleados, setCurrentPageEmpleados] = useState(1);
  const limit = 10;

  const { data: audit_movimientos_lote, isLoading: isLoadingMovimientosLote } =
    useGetAuditoriaMovimientosLote({
      limit: limit,
      offset: (currentPageMovimientosLote - 1) * limit,
    });

  const { data: audit_proveedores, isLoading: isLoadingProveedores } =
    useGetAuditoriaProveedores({
      limit: limit,
      offset: (currentPageProveedores - 1) * limit,
    });

  const { data: audit_productos, isLoading: isLoadingProductos } =
    useGetAuditoriaProductos({
      limit: limit,
      offset: (currentPageProductos - 1) * limit,
    });

  const { data: audit_compras, isLoading: isLoadingCompras } =
    useGetAuditoriaCompras({
      limit: limit,
      offset: (currentPageCompras - 1) * limit,
    });

  const { data: audit_empleados, isLoading: isLoadingAuditEmpleados } =
    useGetAuditoriaEmpleados({
      limit: limit,
      offset: (currentPageEmpleados - 1) * limit,
    });

  const totalPagesProveedores = audit_proveedores
    ? Math.ceil(audit_proveedores.total / limit)
    : 0;
  const totalPagesProductos = audit_productos
    ? Math.ceil(audit_productos.total / limit)
    : 0;
  const totalPagesCompras = audit_compras
    ? Math.ceil(audit_compras.total / limit)
    : 0;
  const totalPagesMovimientosLote = audit_movimientos_lote
    ? Math.ceil(audit_movimientos_lote.total / limit)
    : 0;
  const totalPagesEmpleados = audit_empleados
    ? Math.ceil(audit_empleados.total / limit)
    : 0;

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <TitlePage Icon={ShieldEllipsis} title="Auditorías" />
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="flex items-center gap-1">
            <Truck className="h-3 w-3" />
            {audit_proveedores?.total || 0}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <ShoppingBag className="h-3 w-3" />
            {audit_productos?.total || 0}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <ShoppingCart className="h-3 w-3" />
            {audit_compras?.total || 0}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <ArrowRightLeft className="h-3 w-3" />
            {audit_movimientos_lote?.total || 0}
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {audit_empleados?.total || 0}
          </Badge>
        </div>
      </div>

      <Separator />

      <Tabs defaultValue="proveedores" className="w-full">
        <TabsList className="grid w-full max-w-5xl grid-cols-5">
          <TabsTrigger value="proveedores" className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            Proveedores
          </TabsTrigger>
          <TabsTrigger value="productos" className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4" />
            Productos
          </TabsTrigger>
          <TabsTrigger value="compras" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Compras
          </TabsTrigger>
          <TabsTrigger
            value="movimientos-lote"
            className="flex items-center gap-2"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Movimientos Lote
          </TabsTrigger>
          <TabsTrigger value="empleados" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Empleados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="proveedores" className="mt-6">
          <AuditoriaProveedoresContent
            isLoadingProveedores={isLoadingProveedores}
            audit_proveedores={audit_proveedores}
            totalPagesProveedores={totalPagesProveedores}
            currentPageProveedores={currentPageProveedores}
            setCurrentPageProveedores={setCurrentPageProveedores}
          />
        </TabsContent>

        <TabsContent value="productos" className="mt-6">
          <AuditoriaProductosContent
            isLoadingProductos={isLoadingProductos}
            audit_productos={audit_productos}
            totalPagesProductos={totalPagesProductos}
            currentPageProductos={currentPageProductos}
            setCurrentPageProductos={setCurrentPageProductos}
          />
        </TabsContent>

        <TabsContent value="compras" className="mt-6">
          <AuditoriaComprasContent
            isLoadingCompras={isLoadingCompras}
            audit_compras={audit_compras}
            totalPagesCompras={totalPagesCompras}
            currentPageCompras={currentPageCompras}
            setCurrentPageCompras={setCurrentPageCompras}
            moneda={moneda}
          />
        </TabsContent>

        <TabsContent value="movimientos-lote" className="mt-6">
          <AuditoriaMovimientosLoteContent
            isLoadingMovimientosLote={isLoadingMovimientosLote}
            audit_movimientos_lote={audit_movimientos_lote}
            totalPagesMovimientosLote={totalPagesMovimientosLote}
            currentPageMovimientosLote={currentPageMovimientosLote}
            setCurrentPageMovimientosLote={setCurrentPageMovimientosLote}
          />
        </TabsContent>

        <TabsContent value="empleados" className="mt-6">
          <AuditoriaEmpleadosContent
            isLoadingEmpleados={isLoadingAuditEmpleados}
            audit_empleados={audit_empleados}
            totalPagesEmpleados={totalPagesEmpleados}
            currentPageEmpleados={currentPageEmpleados}
            setCurrentPageEmpleados={setCurrentPageEmpleados}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AuditoriaPage;
