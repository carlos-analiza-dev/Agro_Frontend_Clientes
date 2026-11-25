import { EmpleadoAgro } from "@/api/agroservicio/empleados/interface/response-empleados-agro.interface";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDateOnly } from "@/helpers/funciones/formatDateOnly";
import {
  Edit2,
  Mail,
  Phone,
  Building2,
  MapPin,
  Users,
  CircleX,
  CheckCircle,
  MoreVertical,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { useState } from "react";
import { editarStatusAgroEmpleado } from "@/api/agroservicio/empleados/accions/editar-empleado";
import Modal from "@/components/generics/Modal";
import { useTranslations } from "next-intl";

interface Props {
  isLoading: boolean;
  limit: number;
  currentData: EmpleadoAgro[];
  offset: number;
  handleEditEmpleado: (empleado: EmpleadoAgro) => void;
}

const TableEmpleadosAgro = ({
  currentData,
  isLoading,
  limit,
  offset,
  handleEditEmpleado,
}: Props) => {
  const t = useTranslations("agroEmpleadosPage");
  const queryClient = useQueryClient();

  const [empleadoSeleccionado, setEmpleadoSeleccionado] =
    useState<EmpleadoAgro | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [accionDialog, setAccionDialog] = useState<"activar" | "desactivar">(
    "desactivar",
  );

  const getRoleColor = (roleName: string) => {
    const roleMap: Record<string, string> = {
      "Gerente Sucursal": "bg-purple-100 text-purple-800 hover:bg-purple-100",
      Supervisor: "bg-blue-100 text-blue-800 hover:bg-blue-100",
      Vendedor: "bg-green-100 text-green-800 hover:bg-green-100",
      Asistente: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    };
    return roleMap[roleName] || "bg-gray-100 text-gray-800 hover:bg-gray-100";
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 hover:bg-green-100"
      : "bg-red-100 text-red-800 hover:bg-red-100";
  };

  const mutationStatus = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      editarStatusAgroEmpleado(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["empleados-agro"] });

      const mensaje =
        accionDialog === "activar"
          ? t("table.messages.activated")
          : t("table.messages.deactivated");

      toast.success(mensaje);
      setOpenDialog(false);
      setEmpleadoSeleccionado(null);
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : t(
                accionDialog === "activar"
                  ? "table.messages.activateError"
                  : "table.messages.deactivateError",
              );

        toast.error(errorMessage);
      } else {
        toast.error(
          t(
            accionDialog === "activar"
              ? "table.messages.activateUnexpectedError"
              : "table.messages.deactivateUnexpectedError",
          ),
        );
      }
    },
  });

  const handleToggleStatus = (empleado: EmpleadoAgro) => {
    setEmpleadoSeleccionado(empleado);
    setAccionDialog(empleado.isActive ? "desactivar" : "activar");
    setOpenDialog(true);
  };

  const confirmToggleStatus = () => {
    if (empleadoSeleccionado) {
      const nuevoEstado = accionDialog === "activar";
      mutationStatus.mutate({
        id: empleadoSeleccionado.id,
        isActive: nuevoEstado,
      });
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead className="font-semibold">#</TableHead>
            <TableHead className="font-semibold">
              {t("table.headers.employee")}
            </TableHead>
            <TableHead className="font-semibold hidden md:table-cell">
              {t("table.headers.contact")}
            </TableHead>
            <TableHead className="font-semibold hidden lg:table-cell">
              {t("table.headers.location")}
            </TableHead>
            <TableHead className="font-semibold hidden sm:table-cell">
              {t("table.headers.role")}
            </TableHead>
            <TableHead className="font-semibold hidden xl:table-cell">
              {t("table.headers.branch")}
            </TableHead>
            <TableHead className="font-semibold hidden 2xl:table-cell">
              {t("table.headers.status")}
            </TableHead>
            <TableHead className="font-semibold hidden 2xl:table-cell">
              {t("table.headers.createdAt")}
            </TableHead>
            <TableHead className="font-semibold text-center">
              {t("table.headers.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            Array.from({ length: limit }).map((_, index) => (
              <TableRow key={index}>
                <TableCell>
                  <Skeleton className="h-4 w-8" />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24 mt-1" />
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <Skeleton className="h-4 w-40" />
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Skeleton className="h-4 w-48" />
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Skeleton className="h-5 w-20" />
                </TableCell>
                <TableCell className="hidden xl:table-cell">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell className="hidden 2xl:table-cell">
                  <Skeleton className="h-5 w-16" />
                </TableCell>
                <TableCell className="hidden 2xl:table-cell">
                  <Skeleton className="h-4 w-32" />
                </TableCell>
                <TableCell>
                  <div className="flex justify-center gap-2">
                    <Skeleton className="h-8 w-8" />
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : currentData.length > 0 ? (
            currentData.map((empleado, index) => (
              <TableRow
                key={empleado.id}
                className={`hover:bg-slate-50 ${!empleado.isActive ? "opacity-60" : ""}`}
              >
                <TableCell className="font-medium">
                  {offset + index + 1}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-semibold ${
                        empleado.isActive
                          ? "bg-gradient-to-r from-blue-500 to-blue-600"
                          : "bg-gradient-to-r from-gray-400 to-gray-500"
                      }`}
                    >
                      {empleado.nombre
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>

                    <div>
                      <div
                        className={`font-medium ${!empleado.isActive ? "text-gray-400 line-through" : ""}`}
                      >
                        {empleado.nombre}
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <Badge variant="outline" className="text-xs">
                          ID: {empleado.identificacion}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Mail className="h-3 w-3 text-gray-400" />
                      <span
                        className={`truncate max-w-[120px] ${!empleado.isActive ? "text-gray-400" : ""}`}
                      >
                        {empleado.email}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3 text-gray-400" />
                      <span
                        className={!empleado.isActive ? "text-gray-400" : ""}
                      >
                        {empleado.telefono}
                      </span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-1 text-sm">
                    <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                    <span
                      className={`truncate max-w-[150px] ${!empleado.isActive ? "text-gray-400" : ""}`}
                    >
                      {empleado.municipio?.nombre},{" "}
                      {empleado.departamento?.nombre}
                    </span>
                    <Badge variant="outline" className="ml-1 text-xs">
                      {empleado.pais?.nombre}
                    </Badge>
                  </div>
                </TableCell>

                <TableCell className="hidden sm:table-cell">
                  <Badge className={getRoleColor(empleado.role.name)}>
                    {empleado.role.name}
                  </Badge>
                </TableCell>

                <TableCell className="hidden xl:table-cell">
                  {empleado.sucursal ? (
                    <div className="flex items-center gap-1 text-sm">
                      <Building2 className="h-3 w-3 text-gray-400" />
                      <span
                        className={`truncate max-w-[120px] ${!empleado.isActive ? "text-gray-400" : ""}`}
                      >
                        {empleado.sucursal.nombre}
                      </span>
                    </div>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      {t("table.unassigned")}
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="hidden 2xl:table-cell">
                  <Badge className={getStatusColor(empleado.isActive)}>
                    {empleado.isActive
                      ? t("table.status.active")
                      : t("table.status.inactive")}
                  </Badge>
                </TableCell>

                <TableCell className="hidden 2xl:table-cell">
                  <span
                    className={`text-sm ${!empleado.isActive ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {formatDateOnly(empleado.createdAt)}
                  </span>
                </TableCell>

                <TableCell>
                  <div
                    id="id-options-empleados"
                    className="flex justify-center gap-1"
                  >
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          aria-label={t("table.actions.openMenu")}
                          title={t("table.actions.openMenu")}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          {t("table.headers.actions")}
                        </DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={() => handleEditEmpleado(empleado)}
                        >
                          <Edit2 className="mr-2 h-4 w-4" />
                          {t("table.actions.edit")}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {empleado.isActive ? (
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(empleado)}
                            className="text-red-600"
                          >
                            <CircleX className="mr-2 h-4 w-4" />
                            {t("table.actions.deactivate")}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() => handleToggleStatus(empleado)}
                            className="text-green-600"
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            {t("table.actions.activate")}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Users className="h-12 w-12 text-gray-300" />
                  <p>{t("table.empty")}</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        open={openDialog}
        onOpenChange={setOpenDialog}
        title={
          accionDialog === "activar"
            ? t("table.confirmation.activateTitle")
            : t("table.confirmation.deactivateTitle")
        }
        description={t(
          accionDialog === "activar"
            ? "table.confirmation.activateDescription"
            : "table.confirmation.deactivateDescription",
          { name: empleadoSeleccionado?.nombre ?? "" },
        )}
        size="xl"
        height="auto"
      >
        <div className="p-6 flex justify-between">
          <Button variant="outline" onClick={() => setOpenDialog(false)}>
            {t("table.confirmation.cancel")}
          </Button>

          <Button
            onClick={confirmToggleStatus}
            className={
              accionDialog === "activar"
                ? "bg-green-600 hover:bg-green-700"
                : "bg-red-600 hover:bg-red-700"
            }
            disabled={mutationStatus.isPending}
          >
            {mutationStatus.isPending
              ? t("table.confirmation.processing")
              : accionDialog === "activar"
                ? t("table.confirmation.activate")
                : t("table.confirmation.deactivate")}
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default TableEmpleadosAgro;
