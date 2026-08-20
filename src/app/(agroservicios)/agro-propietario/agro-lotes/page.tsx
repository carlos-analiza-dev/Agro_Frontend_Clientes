"use client";
import { useState } from "react";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AlertCircle,
  Search,
  Package,
  TrendingUp,
  DollarSign,
  Building,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Paginacion from "@/components/generics/Paginacion";
import { Lote } from "@/api/agroservicio/lotes/interfaces/response-lotes-sucursal.interface";
import useGetLotesBySucursal from "@/hooks/agroservicios/lotes/useGetLotesBySucursal";
import useGetAllSucursales from "@/hooks/agroservicios/sucursales/useGetAllSucursales";
import CardDetails from "@/components/agroservicio/lotes-movimientos/CardDetails";
import TableLotes from "@/components/agroservicio/lotes-movimientos/TableLotes";
import Modal from "@/components/generics/Modal";
import FormTransferirProducto from "@/components/agroservicio/lotes-movimientos/FormTransferirProducto";
import TitlePage from "@/components/generics/TitlePage";

const LotesPage = () => {
  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;
  const [openModal, setOpenModal] = useState(false);
  const [selectedSucursal, setSelectedSucursal] = useState("");
  const [selectedLote, setSelectedLote] = useState<Lote | null>(null);

  const handleTransferir = (lote: Lote) => {
    setSelectedLote(lote);
    setOpenModal(true);
  };

  const { data: sucursales, isLoading: cargandoSucursales } =
    useGetAllSucursales();

  const offset = (currentPage - 1) * itemsPerPage;

  const { data: lotesData, isLoading } = useGetLotesBySucursal(
    selectedSucursal,
    propietarioId,
    {
      limit: itemsPerPage,
      offset: offset,
    },
  );

  const lotes = lotesData?.lotes || [];
  const totalItems = lotesData?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const filteredLotes = searchTerm
    ? lotes.filter(
        (lote) =>
          lote.nombre_producto
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          lote.codigo_producto
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()),
      )
    : lotes;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  const handleSucursalChange = (value: string) => {
    setSelectedSucursal(value);
    setCurrentPage(1);
  };

  const totalProductos = filteredLotes.length;
  const totalCantidad = filteredLotes.reduce(
    (sum, lote) => sum + lote.cantidad,
    0,
  );
  const totalCosto = filteredLotes.reduce((sum, lote) => sum + lote.costo, 0);

  if (!selectedSucursal && sucursales && sucursales.length > 0) {
    setSelectedSucursal(sucursales[0].id);
  }

  return (
    <div id="lotes-page" className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="md:flex justify-between items-center gap-4">
        <TitlePage
          Icon={Package}
          title=" Gestión de Lotes"
          description=" Administra el inventario de productos por sucursal"
        />
      </div>

      <div
        id="estadisticas-lotes"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <div id="card-total-productos">
          <CardDetails
            title="Total Productos"
            total={totalProductos}
            Icon={Package}
            color="blue"
          />
        </div>

        <div id="card-unidades-totales">
          <CardDetails
            title="Unidades Totales"
            total={totalCantidad}
            Icon={TrendingUp}
            color="green"
          />
        </div>

        <div id="card-costo-total">
          <CardDetails
            title="Costo Total"
            total={totalCosto.toFixed(2)}
            Icon={DollarSign}
            color="yellow"
          />
        </div>

        <div id="card-valor-promedio">
          <CardDetails
            title="Valor Promedio"
            total={
              totalCantidad > 0
                ? (totalCosto / totalCantidad).toFixed(2)
                : "0.00"
            }
            Icon={Building}
            color="purple"
          />
        </div>
      </div>

      <Card id="filtro-sucursal-lotes">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Label className="text-sm font-semibold mb-2 block">
                Sucursal
              </Label>
              {cargandoSucursales ? (
                <Skeleton className="h-10 w-full" />
              ) : (
                <Select
                  value={selectedSucursal}
                  onValueChange={handleSucursalChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sucursal" />
                  </SelectTrigger>
                  <SelectContent>
                    {sucursales?.map((sucursal) => (
                      <SelectItem key={sucursal.id} value={sucursal.id}>
                        {sucursal.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div className="flex-1">
              <Label className="text-sm font-semibold mb-2 block">
                Buscar producto
              </Label>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div id="buscador-lotes" className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nombre o código del producto..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Button type="submit" variant="secondary">
                  <Search className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card id="tabla-lotes">
        <CardHeader>
          <CardTitle className="text-xl">Inventario de Productos</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton key={index} className="h-16 w-full" />
              ))}
            </div>
          ) : filteredLotes.length === 0 ? (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No se encontraron lotes en esta sucursal.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="overflow-x-auto">
              <TableLotes
                filteredLotes={filteredLotes}
                moneda={moneda}
                handleTransferir={handleTransferir}
              />
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-6">
              <Paginacion
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center text-sm text-gray-500">
        Mostrando {filteredLotes.length} de {totalItems} productos
      </div>

      <Modal
        open={openModal}
        onOpenChange={setOpenModal}
        title="Transferir Producto"
        description="Aqui podras transferir productos a otra sucursal"
        size="2xl"
        height="auto"
      >
        <FormTransferirProducto
          onSucces={() => {
            setOpenModal(false);
            setSelectedLote(null);
          }}
          lote={selectedLote}
          isPropietario={true}
          sucursales={sucursales}
          cargandoSucursales={cargandoSucursales}
        />
      </Modal>
    </div>
  );
};

export default LotesPage;
