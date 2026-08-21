"use client";

import ButtonAdd from "@/components/generics/ButtonAdd";
import TitlePage from "@/components/generics/TitlePage";
import Paginacion from "@/components/generics/Paginacion";
import useGetClientesAgro from "@/hooks/agroservicios/clientes/useGetClientesAgro";
import useGetDeptosActivesByPais from "@/hooks/departamentos/useGetDeptosActivesByPais";
import { useAuthStore } from "@/providers/store/useAuthStore";
import {
  IdCardLanyard,
  Filter,
  User,
  MapPin,
  RefreshCw,
  ChevronDown,
  Users,
  Search,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useGetMunicipiosActivosByDepto from "@/hooks/municipios/useGetMunicipiosActivosByDepto";
import { StatCard } from "@/components/generics/StatCard";
import TableAgroClientes from "@/components/agroservicio/clientes/TableAgroClientes";
import SkeletonTable from "@/components/generics/SkeletonTable";
import { MessageError } from "@/components/generics/MessageError";
import { ClienteAgro } from "@/api/agroservicio/clientes/interfaces/response-clientes-ago.interface";
import Modal from "@/components/generics/Modal";
import FormClientesAgro from "@/components/agroservicio/clientes/FormClientesAgro";

const ClientesAgroServicioPage = () => {
  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
  const paisId = cliente?.pais.id ?? "";
  const simbolo = cliente?.pais.simbolo_moneda ?? "$";
  const [selectedCliente, setSelectedCliente] = useState<ClienteAgro | null>(
    null,
  );
  const [isEdit, setIsEdit] = useState(false);
  const [openModalForm, setOpenModalForm] = useState(false);
  const [selectedDepto, setSelectedDepto] = useState("all");
  const [selectedMunicipio, setSelectedMunicipio] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const limit = 10;

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm]);

  const { data: departamentos } = useGetDeptosActivesByPais(paisId);
  const { data: municipios } = useGetMunicipiosActivosByDepto(
    selectedDepto !== "all" ? selectedDepto : "",
  );
  const { data: clientesData, isLoading: loadingClientes } = useGetClientesAgro(
    propietarioId,
    {
      limit,
      offset: (currentPage - 1) * limit,
      departamento: selectedDepto !== "all" ? selectedDepto : "",
      municipio: selectedMunicipio !== "all" ? selectedMunicipio : "",
      search: debouncedSearchTerm,
    },
  );

  const clientes = clientesData?.clientes || [];
  const total = clientesData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  useEffect(() => {
    setSelectedMunicipio("all");
  }, [selectedDepto]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedDepto, selectedMunicipio]);

  const clearFilters = () => {
    setSelectedDepto("all");
    setSelectedMunicipio("all");
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const clearSearch = () => {
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setCurrentPage(1);
  };

  const handleAdd = () => {
    setOpenModalForm(true);
  };

  const handleEditCliente = (cliente: ClienteAgro) => {
    setOpenModalForm(true);
    setIsEdit(true);
    setSelectedCliente(cliente);
  };

  const hasData = clientes.length > 0 || total > 0;

  return (
    <div
      id="id-clientes-container"
      className="container mx-auto p-4 md:p-6 space-y-6"
    >
      <div
        id="id-clientes-header"
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <TitlePage
          Icon={IdCardLanyard}
          title="Control de Clientes"
          description="Gestiona los clientes registrados en tu agroservicio"
        />

        <ButtonAdd
          id="id-clientes-add-btn"
          title="Agregar Cliente"
          Icon={IdCardLanyard}
          action={handleAdd}
          className="w-full md:w-auto bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-lg hover:shadow-xl transition-all duration-300"
        />
      </div>

      {hasData && (
        <div
          id="id-clientes-stats"
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          <StatCard
            id="id-clientes-stat-total"
            title="Total Clientes"
            value={total}
            icon={Users}
            gradientFrom="from-blue-50"
            gradientTo="to-blue-100/50"
            iconColor="text-blue-600"
            textColor="text-blue-700"
          />

          <StatCard
            id="id-clientes-stat-activos"
            title="Activos"
            value={clientes.filter((c) => c.isActive).length}
            icon={User}
            gradientFrom="from-green-50"
            gradientTo="to-green-100/50"
            iconColor="text-green-600"
            textColor="text-green-700"
          />

          <StatCard
            id="id-clientes-stat-departamentos"
            title="Departamentos"
            value={new Set(clientes.map((c) => c.departamento?.nombre)).size}
            icon={MapPin}
            gradientFrom="from-purple-50"
            gradientTo="to-purple-100/50"
            iconColor="text-purple-600"
            textColor="text-purple-700"
          />

          <StatCard
            id="id-clientes-stat-municipios"
            title="Municipios"
            value={new Set(clientes.map((c) => c.municipio?.nombre)).size}
            icon={MapPin}
            gradientFrom="from-orange-50"
            gradientTo="to-orange-100/50"
            iconColor="text-orange-600"
            textColor="text-orange-700"
          />
        </div>
      )}

      {(hasData || loadingClientes) && (
        <Card id="id-clientes-filters" className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-500" />
                Filtros de búsqueda
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${showFilters ? "rotate-180" : ""}`}
                />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div
              className={`space-y-4 ${!showFilters ? "hidden md:block" : ""}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div
                  id="id-clientes-filter-search"
                  className="space-y-2 md:col-span-1"
                >
                  <Label className="text-sm font-medium text-gray-700">
                    Buscar Cliente
                  </Label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Nombre o identificación..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-10"
                    />
                    {searchTerm && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
                        onClick={clearSearch}
                      >
                        <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                      </Button>
                    )}
                  </div>
                  {debouncedSearchTerm && (
                    <p className="text-xs text-blue-600">
                      Buscando: "{debouncedSearchTerm}"
                    </p>
                  )}
                </div>

                <div id="id-clientes-filter-departamento" className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Departamento
                  </Label>
                  <Select
                    value={selectedDepto}
                    onValueChange={setSelectedDepto}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Todos los departamentos" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {departamentos?.data.map((depto) => (
                        <SelectItem key={depto.id} value={depto.id}>
                          {depto.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div id="id-clientes-filter-municipio" className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Municipio
                  </Label>
                  <Select
                    value={selectedMunicipio}
                    onValueChange={setSelectedMunicipio}
                    disabled={selectedDepto === "all"}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          selectedDepto === "all"
                            ? "Seleccione departamento"
                            : "Todos los municipios"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      {municipios?.data.map((municipio) => (
                        <SelectItem key={municipio.id} value={municipio.id}>
                          {municipio.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div id="id-clientes-filter-actions" className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Acciones
                  </Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={clearFilters}
                      className="flex-1"
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Limpiar todo
                    </Button>
                  </div>
                </div>
              </div>

              {(selectedDepto !== "all" ||
                selectedMunicipio !== "all" ||
                debouncedSearchTerm) && (
                <div
                  id="id-clientes-active-filters"
                  className="flex flex-wrap items-center gap-2 pt-2 border-t border-gray-100"
                >
                  <span className="text-sm text-gray-500">
                    Filtros activos:
                  </span>
                  {debouncedSearchTerm && (
                    <Badge
                      variant="secondary"
                      className="bg-blue-100 text-blue-700"
                    >
                      <Search className="h-3 w-3 mr-1" />
                      {debouncedSearchTerm}
                      <button
                        onClick={clearSearch}
                        className="ml-1 hover:text-blue-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedDepto !== "all" && (
                    <Badge
                      variant="secondary"
                      className="bg-purple-100 text-purple-700"
                    >
                      {
                        departamentos?.data.find((d) => d.id === selectedDepto)
                          ?.nombre
                      }
                      <button
                        onClick={() => setSelectedDepto("all")}
                        className="ml-1 hover:text-purple-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {selectedMunicipio !== "all" && (
                    <Badge
                      variant="secondary"
                      className="bg-orange-100 text-orange-700"
                    >
                      {
                        municipios?.data.find((m) => m.id === selectedMunicipio)
                          ?.nombre
                      }
                      <button
                        onClick={() => setSelectedMunicipio("all")}
                        className="ml-1 hover:text-orange-900"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  )}
                  {(selectedDepto !== "all" ||
                    selectedMunicipio !== "all" ||
                    debouncedSearchTerm) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="text-xs text-red-500 hover:text-red-700"
                    >
                      Limpiar todos
                    </Button>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Card
        id="id-clientes-table-container"
        className="border-0 shadow-xl bg-white/95 backdrop-blur-sm"
      >
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Users className="h-5 w-5 text-gray-500" />
              Lista de Clientes
              {total > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-blue-100 text-blue-700"
                >
                  {total} {total === 1 ? "cliente" : "clientes"}
                </Badge>
              )}
            </CardTitle>
            <div className="flex items-center gap-3">
              {debouncedSearchTerm && (
                <Badge variant="outline" className="bg-blue-50">
                  <Search className="h-3 w-3 mr-1" />
                  {debouncedSearchTerm}
                </Badge>
              )}
              {!loadingClientes && total > 0 && (
                <span className="text-sm text-gray-500">
                  Mostrando {(currentPage - 1) * limit + 1} -{" "}
                  {Math.min(currentPage * limit, total)} de {total}
                </span>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loadingClientes && <SkeletonTable />}

          {!loadingClientes && clientes.length > 0 && (
            <div id="id-clientes-table" className="overflow-x-auto">
              <TableAgroClientes
                clientes={clientes}
                handleEditCliente={handleEditCliente}
                simbolo={simbolo}
              />
            </div>
          )}

          {!loadingClientes && clientes.length === 0 && (
            <div>
              <MessageError
                titulo="No hay clientes registrados"
                descripcion={
                  selectedDepto !== "all" ||
                  selectedMunicipio !== "all" ||
                  debouncedSearchTerm
                    ? "No se encontraron clientes con los filtros aplicados"
                    : "Comienza agregando tu primer cliente"
                }
              />
            </div>
          )}

          {!loadingClientes && totalPages > 1 && (
            <div className="mt-6 flex justify-center">
              <Paginacion
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={openModalForm}
        onOpenChange={setOpenModalForm}
        title={isEdit ? "Editar Cliente" : "Nuevo Cliente"}
        description={
          isEdit
            ? "Actualiza los datos de los clientes."
            : "Crea un cliente para tu agroservicio."
        }
        size="2xl"
        height="auto"
        showCloseButton={false}
      >
        <FormClientesAgro
          paisId={paisId}
          isPropietario={true}
          editCliente={selectedCliente}
          isEdit={isEdit}
          onSuccess={() => {
            setSelectedCliente(null);
            setIsEdit(false);
            setOpenModalForm(false);
          }}
        />
      </Modal>
    </div>
  );
};

export default ClientesAgroServicioPage;
