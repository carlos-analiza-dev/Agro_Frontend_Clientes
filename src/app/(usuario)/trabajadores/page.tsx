"use client";
import useGetTrabajadores from "@/hooks/trabajadores/useGetTrabajadores";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { Search, UserCheck, Users, Plus, Filter, X } from "lucide-react";
import Paginacion from "@/components/generics/Paginacion";
import TableTrabajadores from "./ui/TableTrabajadores";
import SkeletonTable from "@/components/generics/SkeletonTable";
import CardTrabajadores from "./ui/CardTrabajadores";
import Modal from "@/components/generics/Modal";
import FormTrabajador from "./ui/FormTrabajador";
import { Trabajador } from "@/api/trabajadores/interface/response-trabajadores.interface";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

const TrabajadoresPage = () => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage] = useState(10);
  const [openAddTrabajador, setOpenAddTrabajador] = useState(false);
  const [trabajador, setTrabajador] = useState<Trabajador | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filterVerified, setFilterVerified] = useState<string>("todos");
  const isMobile = useMediaQuery("(max-width: 768px)");

  const {
    data: trabajadoresData,
    isLoading,
    refetch,
  } = useGetTrabajadores({
    offset: (currentPage - 1) * itemsPerPage,
    limit: itemsPerPage,
  });

  const filteredTrabajadores =
    trabajadoresData?.trabajadores?.filter((trabajador) => {
      const matchesSearch =
        trabajador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        trabajador.identificacion.includes(searchTerm) ||
        trabajador.telefono.includes(searchTerm);

      const matchesVerified =
        filterVerified === "todos" ||
        (filterVerified === "verificados" && trabajador.verified) ||
        (filterVerified === "no_verificados" && !trabajador.verified);

      return matchesSearch && matchesVerified;
    }) || [];

  const totalPages = Math.ceil((trabajadoresData?.total || 0) / itemsPerPage);
  const hasActiveFilters = searchTerm !== "" || filterVerified !== "todos";
  const totalFiltrados = filteredTrabajadores.length;

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);

    if (isMobile) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleEditTrabajador = (trabajador: Trabajador) => {
    if (isMobile) {
      router.push(`/trabajadores/${trabajador.id}`);
    } else {
      setOpenAddTrabajador(true);
      setTrabajador(trabajador);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setFilterVerified("todos");
    setShowFilters(false);
  };

  const handleAddTrabajador = () => {
    if (isMobile) {
      router.push("/trabajadores/crear-tranajador");
    } else {
      setOpenAddTrabajador(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-3 sm:p-4 md:p-6 space-y-4 md:space-y-6">
        <div className="flex flex-col space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Trabajadores
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Gestión de trabajadores asignados a fincas
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                onClick={() => setShowFilters(!showFilters)}
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Filter className="mr-2 h-4 w-4" />
                Filtros
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    Activo
                  </Badge>
                )}
              </Button>
              <Button
                onClick={() => handleAddTrabajador()}
                className="w-full sm:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Trabajador
              </Button>
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, identificación o teléfono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-9 w-full"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {showFilters && (
            <Card className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium">Filtros</h3>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    Limpiar todos
                  </Button>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Estado de verificación
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant={
                          filterVerified === "todos" ? "default" : "outline"
                        }
                        onClick={() => setFilterVerified("todos")}
                        className="flex-1"
                      >
                        Todos
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          filterVerified === "verificados"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => setFilterVerified("verificados")}
                        className="flex-1"
                      >
                        Verificados
                      </Button>
                      <Button
                        size="sm"
                        variant={
                          filterVerified === "no_verificados"
                            ? "default"
                            : "outline"
                        }
                        onClick={() => setFilterVerified("no_verificados")}
                        className="flex-1"
                      >
                        No verificados
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <CardTrabajadores
            title="Total Trabajadores"
            Icon={Users}
            total={trabajadoresData?.total || 0}
          />
          <CardTrabajadores
            title="Verificados"
            Icon={UserCheck}
            total={
              trabajadoresData?.trabajadores?.filter((t) => t.verified)
                .length || 0
            }
          />
        </div>

        <Card>
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">
              Lista de Trabajadores
            </CardTitle>
            <CardDescription>
              {trabajadoresData?.total || 0} trabajadores registrados en el
              sistema
              {hasActiveFilters && totalFiltrados > 0 && (
                <span className="block mt-1 text-primary">
                  Mostrando {totalFiltrados} de {trabajadoresData?.total || 0}{" "}
                  trabajadores con filtros aplicados
                </span>
              )}
              {hasActiveFilters && totalFiltrados === 0 && (
                <span className="block mt-1 text-destructive">
                  No hay resultados con los filtros aplicados
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            {isLoading ? (
              <div className="p-4">
                <SkeletonTable />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <TableTrabajadores
                    filteredTrabajadores={filteredTrabajadores}
                    handleEditTrabajador={handleEditTrabajador}
                    isMobile={isMobile}
                  />
                </div>

                {totalPages > 1 && totalFiltrados > 0 && (
                  <div className="mt-4 flex justify-center md:justify-end px-4 sm:px-0">
                    <Paginacion
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                )}

                {totalFiltrados > 0 && (
                  <div className="mt-4 text-xs sm:text-sm text-muted-foreground text-center px-4 sm:px-0">
                    Mostrando {totalFiltrados} de {trabajadoresData?.total || 0}{" "}
                    trabajadores
                    {currentPage > 1 &&
                      ` - Página ${currentPage} de ${totalPages}`}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Modal
        title={trabajador ? "Editar Trabajador" : "Nuevo Trabajador"}
        description={
          trabajador
            ? "Aquí podrás editar la información del trabajador"
            : "Aquí Podrás Ingresar un nuevo trabajador"
        }
        open={openAddTrabajador}
        onOpenChange={(open) => {
          setOpenAddTrabajador(open);
          if (!open) setTrabajador(null);
        }}
        size={isMobile ? "full" : "2xl"}
        height="auto"
      >
        <FormTrabajador
          onSuccess={() => {
            setOpenAddTrabajador(false);
            setTrabajador(null);
          }}
          trabajador={trabajador}
        />
      </Modal>
    </div>
  );
};

export default TrabajadoresPage;
