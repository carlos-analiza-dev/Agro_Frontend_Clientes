"use client";
import useGetProveedoresAgro from "@/hooks/agroservicios/proveedores/useGetProveedoresAgro";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Buscador } from "@/components/generics/Buscador";
import Paginacion from "@/components/generics/Paginacion";
import TableProveedores from "@/components/agroservicio/proveedores/TableProveedores";
import TitlePage from "@/components/generics/TitlePage";
import ButtonAdd from "@/components/generics/ButtonAdd";
import { Truck } from "lucide-react";
import Modal from "@/components/generics/Modal";
import FormProveedores from "@/components/agroservicio/proveedores/FormProveedores";
import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";
import { ProveedoreAgro } from "@/api/agroservicio/proveedores/interface/response-agro-proveedores.interface";

const AgroProveedoresPage = () => {
  const { empleado } = useAuthEmpleadoStore();
  const propietarioId = empleado?.agroservicio.propietario.id ?? "";
  const paisId = empleado?.pais.id ?? "";
  const [openModalProveedor, setOpenModalProveedor] = useState(false);
  const [selectedProveedor, setSelectedProveedor] =
    useState<ProveedoreAgro | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const limit = 10;

  const { data: proveedoresData, isLoading } = useGetProveedoresAgro(
    propietarioId,
    {
      limit,
      offset: (currentPage - 1) * limit,
      search: searchTerm,
    },
  );

  const proveedores = proveedoresData?.proveedores || [];
  const total = proveedoresData?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleEditProveedor = (proveedor: ProveedoreAgro) => {
    setOpenModalProveedor(true);
    setIsEdit(true);
    setSelectedProveedor(proveedor);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="md:flex justify-between items-center gap-4">
        <TitlePage
          Icon={Truck}
          title="Control de Proveedores"
          description="Gestiona tus proveedores agroservicios"
        />
        <ButtonAdd
          title="Agregar Proveedor"
          Icon={Truck}
          action={() => setOpenModalProveedor(true)}
          className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
        />
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <Buscador
          title="Buscar proveedor por nombre, NIT o NRC..."
          setSearchTerm={handleSearch}
          searchTerm={searchTerm}
          className="w-full sm:w-96"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <TableProveedores
            isLoading={isLoading}
            proveedores={proveedores}
            searchTerm={searchTerm}
            handleEditProveedor={handleEditProveedor}
          />
        </CardContent>
      </Card>

      {total > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
          <p className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * limit + 1} -{" "}
            {Math.min(currentPage * limit, total)} de {total} proveedores
          </p>
          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <Modal
        open={openModalProveedor}
        onOpenChange={setOpenModalProveedor}
        title={
          isEdit
            ? `Editando el proveedor - ${selectedProveedor?.nombre_legal}`
            : "Agregar nuevo proveedor"
        }
        description={
          isEdit
            ? "Aquí podrás actualizar la información del proveedor seleccionado para tu agroservicio."
            : "Aquí podrás registrar un nuevo proveedor para tu agroservicio."
        }
        size="2xl"
        height="auto"
        showCloseButton={false}
      >
        <FormProveedores
          isEmpleado={true}
          onSuccess={() => {
            setOpenModalProveedor(false);
            setSelectedProveedor(null);
            setIsEdit(false);
          }}
          editProveedor={selectedProveedor}
          isEdit={isEdit}
          paisId={paisId}
        />
      </Modal>
    </div>
  );
};

export default AgroProveedoresPage;
