"use client";
import useGetConfigTrabajadores from "@/hooks/config-trabajadores/useGetConfigTrabajadores";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Plus,
  DollarSign,
  Clock,
  BadgeCheck,
  ChevronDown,
  Filter,
  Users,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Paginacion from "@/components/generics/Paginacion";
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { useAuthStore } from "@/providers/store/useAuthStore";
import ModalConfig from "./ui/ModalConfig";
import { Configuraciones } from "@/api/configuraciones-trabajadores/interface/response-config-trabajadores.interface";
import TableConfigTrabajadores from "./ui/TableConfigTrabajadores";
import Modal from "@/components/generics/Modal";
import FormConfigTrabajadores from "./ui/FormConfigTrabajadores";
import { StatCard } from "@/components/generics/StatCard";
import SkeletonJornadas from "@/components/generics/SkeletonJornadas";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { useRouter } from "next/navigation";

const ConfiguracionTrabajadoresPage = () => {
  const { cliente } = useAuthStore();
  const moneda = cliente?.pais.simbolo_moneda ?? "$";
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [openAddConfig, setOpenAddConfig] = useState(false);
  const [selectedTrabajador, setSelectedTrabajador] =
    useState<Configuraciones | null>(null);
  const [selectedConfig, setSelectedConfig] = useState<Configuraciones | null>(
    null,
  );
  const [filterActivo, setFilterActivo] = useState<boolean | null>(null);
  const limit = 10;
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { data: configuraciones, isLoading } = useGetConfigTrabajadores(
    limit,
    (currentPage - 1) * limit,
  );

  const configs = configuraciones?.configuraciones || [];

  const total = configuraciones?.total || 0;
  const totalPages = Math.ceil(total / limit);

  const filteredConfigs = configs.filter((config) => {
    const matchesSearch =
      config.trabajador.nombre
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      config.trabajador.identificacion.includes(searchTerm) ||
      config.cargo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesActivo =
      filterActivo === null ? true : config.activo === filterActivo;
    return matchesSearch && matchesActivo;
  });

  const handleEditConfig = (config: Configuraciones) => {
    if (isMobile) {
      router.push(`/configuracion-trabajador/${config.id}`);
    } else {
      setOpenAddConfig(true);
      setSelectedConfig(config);
    }
  };

  if (isLoading) {
    return <SkeletonJornadas isMobile={isMobile} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-gray-100 dark:to-gray-400 bg-clip-text text-transparent">
              Configuración de Trabajadores
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Gestiona los salarios, cargos y configuraciones de tus empleados
            </p>
          </div>
          <Button onClick={() => setOpenAddConfig(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Trabajador
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard
            title="Total Trabajadores"
            value={total}
            icon={Users}
            gradientFrom="from-blue-50"
            gradientTo="to-blue-100 dark:from-blue-950/30 dark:to-blue-900/30"
            iconColor="text-blue-600 dark:text-blue-400"
            textColor="text-blue-600 dark:text-blue-400"
          />

          <StatCard
            title="Salario Promedio Diario"
            value={formatCurrency(
              configs.reduce((acc, c) => acc + Number(c.salarioDiario), 0) /
                (configs.length || 1),
              moneda,
            )}
            icon={DollarSign}
            gradientFrom="from-green-50"
            gradientTo="to-green-100 dark:from-green-950/30 dark:to-green-900/30"
            iconColor="text-green-600 dark:text-green-400"
            textColor="text-green-600 dark:text-green-400"
          />

          <StatCard
            title="Trabajadores Activos"
            value={configs.filter((c) => c.activo).length}
            icon={BadgeCheck}
            gradientFrom="from-purple-50"
            gradientTo="to-purple-100 dark:from-purple-950/30 dark:to-purple-900/30"
            iconColor="text-purple-600 dark:text-purple-400"
            textColor="text-purple-600 dark:text-purple-400"
          />
        </div>

        <Card className="shadow-md">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por nombre, identificación o cargo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {filterActivo === null
                      ? "Todos"
                      : filterActivo
                        ? "Activos"
                        : "Inactivos"}
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterActivo(null)}>
                    Todos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterActivo(true)}>
                    Activos
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterActivo(false)}>
                    Inactivos
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <TableConfigTrabajadores
                filteredConfigs={filteredConfigs}
                setSelectedTrabajador={setSelectedTrabajador}
                moneda={moneda}
                handleEditConfig={handleEditConfig}
              />
            </div>

            {filteredConfigs.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500">No se encontraron trabajadores</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="border-t p-4">
                <Paginacion
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  className="justify-end"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      <ModalConfig
        selectedTrabajador={selectedTrabajador}
        setSelectedTrabajador={setSelectedTrabajador}
        moneda={moneda}
      />

      <Modal
        open={openAddConfig}
        onOpenChange={setOpenAddConfig}
        title={
          selectedConfig
            ? "Editar Configuracion a Trabajadores"
            : "Agregar Configuracion a Trabajadores"
        }
        description={
          selectedConfig
            ? "Aqui podras editar las configuraciones salariales a tus trabajadores"
            : "Aqui podras agregar configuraciones salariales a tus trabajadores"
        }
        size="3xl"
        showCloseButton={false}
        height="auto"
      >
        <FormConfigTrabajadores
          moneda={moneda}
          onSuccess={() => setOpenAddConfig(false)}
          configuracion={selectedConfig}
          setSelectedConfig={setSelectedConfig}
        />
      </Modal>
    </div>
  );
};

export default ConfiguracionTrabajadoresPage;
