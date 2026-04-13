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
import { Search, UserCheck, Users } from "lucide-react";
import Paginacion from "@/components/generics/Paginacion";
import TableTrabajadores from "./ui/TableTrabajadores";
import SkeletonTable from "@/components/generics/SkeletonTable";
import CardTrabajadores from "./ui/CardTrabajadores";
import Modal from "@/components/generics/Modal";
import FormTrabajador from "./ui/FormTrabajador";
import { Trabajador } from "@/api/trabajadores/interface/response-trabajadores.interface";

const TrabajadoresPage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [itemsPerPage] = useState(10);
  const [openAddTrabajador, setOpenAddTrabajador] = useState(false);
  const [Trabajador, setTrabajador] = useState<Trabajador | null>(null);

  const {
    data: trabajadoresData,
    isLoading,
    refetch,
  } = useGetTrabajadores({
    offset: (currentPage - 1) * itemsPerPage,
    limit: itemsPerPage,
  });

  const filteredTrabajadores = trabajadoresData?.trabajadores?.filter(
    (trabajador) =>
      trabajador.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trabajador.identificacion.includes(searchTerm) ||
      trabajador.telefono.includes(searchTerm),
  );

  const totalPages = Math.ceil((trabajadoresData?.total || 0) / itemsPerPage);

  useEffect(() => {
    refetch();
  }, [currentPage, refetch]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditTrabajador = (trabajdor: Trabajador) => {
    setOpenAddTrabajador(true);
    setTrabajador(trabajdor);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Trabajadores</h1>
          <p className="text-muted-foreground mt-1">
            Gestión de trabajadores asignados a fincas
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar trabajador..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 w-full md:w-[300px]"
            />
          </div>
          <Button onClick={() => setOpenAddTrabajador(true)}>
            <Users className="mr-2 h-4 w-4" />
            Nuevo Trabajador
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <CardTrabajadores
          title="Total Trabajadores"
          Icon={Users}
          total={trabajadoresData?.total || 0}
        />

        <CardTrabajadores
          title="Verificados"
          Icon={UserCheck}
          total={
            trabajadoresData?.trabajadores?.filter((t) => t.verified).length ||
            0
          }
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Trabajadores</CardTitle>
          <CardDescription>
            {trabajadoresData?.total || 0} trabajadores registrados en el
            sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <SkeletonTable />
          ) : (
            <>
              <div className="rounded-md border">
                <TableTrabajadores
                  filteredTrabajadores={filteredTrabajadores}
                  handleEditTrabajador={handleEditTrabajador}
                />
              </div>

              {totalPages > 1 && (
                <div className="mt-4 flex justify-end">
                  <Paginacion
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}

              <div className="mt-4 text-sm text-muted-foreground text-center">
                Mostrando {filteredTrabajadores?.length || 0} de{" "}
                {trabajadoresData?.total || 0} trabajadores
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Modal
        title={Trabajador ? "Editar Trabajador" : "Nuevo Trabajador"}
        description={
          Trabajador
            ? "Aquí podrás editar la información del trabajador"
            : "Aquí Podrás Ingresar un nuevo trabajador"
        }
        open={openAddTrabajador}
        onOpenChange={(open) => {
          setOpenAddTrabajador(open);
          if (!open) setTrabajador(null);
        }}
        size="2xl"
        height="auto"
      >
        <FormTrabajador
          onSuccess={() => {
            setOpenAddTrabajador(false);
            setTrabajador(null);
          }}
          trabajador={Trabajador}
        />
      </Modal>
    </div>
  );
};

export default TrabajadoresPage;
