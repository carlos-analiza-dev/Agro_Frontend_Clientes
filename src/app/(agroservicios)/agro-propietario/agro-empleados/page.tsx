"use client";
import ButtonAdd from "@/components/generics/ButtonAdd";
import TitlePage from "@/components/generics/TitlePage";
import Paginacion from "@/components/generics/Paginacion";
import useGetEmpleadosAgro from "@/hooks/agroservicios/empleados/useGetEmpleadosAgro";
import { Users, User, UserCheck, UserX } from "lucide-react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import TableEmpleadosAgro from "./ui/TableEmpleadosAgro";
import SkeletonTable from "@/components/generics/SkeletonTable";
import { StatCard } from "@/components/generics/StatCard";
import Modal from "@/components/generics/Modal";
import FormEmpleadosAgro from "./ui/FormEmpleadosAgro";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { EmpleadoAgro } from "@/api/agroservicio/empleados/interface/response-empleados-agro.interface";

const EmpleadosAgroPage = () => {
  const { cliente } = useAuthStore();
  const paisId = cliente?.pais.id ?? "";
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmpleado, setSelectedEmpleado] = useState<EmpleadoAgro | null>(
    null,
  );
  const [isEdit, setIsEdit] = useState(false);
  const [limit] = useState(10);
  const [openModalForm, setOpenModalForm] = useState(false);
  const { data, isLoading } = useGetEmpleadosAgro({
    limit: limit,
    offset: (currentPage - 1) * limit,
  });

  const empleados = data?.empleados || [];
  const total = data?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleEditEmpleado = (empleado: EmpleadoAgro) => {
    setOpenModalForm(true);
    setSelectedEmpleado(empleado);
    setIsEdit(true);
  };

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="md:flex justify-between items-center gap-4">
        <TitlePage Icon={Users} title="Control de Empleados" />
        <ButtonAdd
          title="Agregar Empleado"
          Icon={Users}
          action={() => setOpenModalForm(true)}
          className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Empleados"
          value={total}
          icon={Users}
          gradientFrom="from-blue-500"
          gradientTo="to-blue-600"
          iconColor="text-white"
          textColor="text-white"
        />

        <StatCard
          title="Activos"
          value={empleados.filter((e) => e.isActive).length}
          icon={UserCheck}
          gradientFrom="from-green-500"
          gradientTo="to-green-600"
          iconColor="text-white"
          textColor="text-white"
        />

        <StatCard
          title="Inactivos"
          value={empleados.filter((e) => !e.isActive).length}
          icon={UserX}
          gradientFrom="from-red-500"
          gradientTo="to-red-600"
          iconColor="text-white"
          textColor="text-white"
        />

        <StatCard
          title="Porcentaje Activos"
          value={`${total > 0 ? Math.round((empleados.filter((e) => e.isActive).length / total) * 100) : 0}%`}
          icon={User}
          gradientFrom="from-purple-500"
          gradientTo="to-purple-600"
          iconColor="text-white"
          textColor="text-white"
        />
      </div>

      {isLoading ? (
        <div className="mt-10 mb-10">
          <SkeletonTable />
        </div>
      ) : empleados.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600">
              No hay empleados registrados
            </h3>
            <p className="text-gray-400 mt-2">
              Haz clic en "Agregar Empleado" para registrar uno nuevo
            </p>
          </CardContent>
        </Card>
      ) : (
        <TableEmpleadosAgro
          currentData={empleados}
          isLoading={isLoading}
          limit={limit}
          offset={(currentPage - 1) * limit}
          handleEditEmpleado={handleEditEmpleado}
        />
      )}

      {totalPages > 1 && (
        <div className="flex justify-center pt-4">
          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      )}

      <Modal
        open={openModalForm}
        onOpenChange={setOpenModalForm}
        title="Agregar Empleado"
        description="Aqui podras agregar los empleados para tu agroservicio"
        size="2xl"
        height="auto"
        showCloseButton={false}
      >
        <FormEmpleadosAgro
          paisId={paisId}
          onSuccess={() => {
            setOpenModalForm(false);
            setSelectedEmpleado(null);
            setIsEdit(false);
          }}
          editEmpleado={selectedEmpleado}
          isEdit={isEdit}
        />
      </Modal>
    </div>
  );
};

export default EmpleadosAgroPage;
