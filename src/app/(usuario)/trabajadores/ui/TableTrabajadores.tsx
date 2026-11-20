import { Trabajador } from "@/api/trabajadores/interface/response-trabajadores.interface";
import Modal from "@/components/generics/Modal";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Mail,
  MapPin,
  MoreVertical,
  Pencil,
  Phone,
  Plus,
  UserCheck,
  Users,
  UserX,
  ChevronRight,
  Building2,
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import ResumenPermiso from "./ResumenPermiso";
import TablePermisosCliente from "./TablePermisosCliente";
import TablePermisosAsignados from "./TablePermisosAsignados";
import useGetPermisosByCliente from "@/hooks/permisos/useGetPermisosByCliente";
import { toast } from "react-toastify";
import { EditarPermisoByCliente } from "@/api/permisos/accions/editar-permiso_by_cliente";
import { useQueryClient } from "@tanstack/react-query";
import { EliminarPermisoByCliente } from "@/api/permisos/accions/eliminar-permiso_by_cliente";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { CrearPermisoClienteInterface } from "@/api/permisos/interface/crear-permiso-cliente.interface";
import { CrearPermisoByCliente } from "@/api/permisos/accions/crear-permiso_by_cliente";
import { ActualizarVerificacion } from "@/api/cliente/accions/update-verified";
import useGetFincasByTrabajador from "@/hooks/fincas-trabajador/useGetFincasByTrabajador";
import TableFincasTrabajador from "./TableFincasTrabajador";
import FormAddAsignarFincas from "./FormAddAsignarFincas";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useRouter } from "next/navigation";
import { getInitials } from "@/helpers/funciones/getInitials";
import { Cliente } from "@/interfaces/auth/cliente";
import useGetPermisosByPaquete from "@/hooks/permisos/useGetPermisosByPaquete";
import VerifiedBadge from "./VerifiedBadge";

interface Props {
  filteredTrabajadores: Trabajador[] | undefined;
  handleEditTrabajador: (trabajdor: Trabajador) => void;
  isMobile: boolean;
  cliente: Cliente | undefined;
}

const TableTrabajadores = ({
  filteredTrabajadores,
  handleEditTrabajador,
  isMobile,
  cliente,
}: Props) => {
  const t = useTranslations("tableTrabajadores");
  const queryClient = useQueryClient();
  const router = useRouter();

  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>(
    [],
  );
  const paqueteId = cliente?.paqueteActivo?.paquete.id ?? "";
  const [clienteId, setClienteId] = useState<string>("");
  const [nombreTrabajador, setNombreTrabajador] = useState("");
  const [openModalPermisos, setOpenModalPermisos] = useState(false);
  const [openAddPermisos, setOpenAddPermisos] = useState(false);
  const [isOpenFinca, setIsOpenFinca] = useState(false);
  const [openVerified, setOpenVerified] = useState(false);
  const [verficiado, setVerficiado] = useState(false);
  const [openViewFincasTrabajador, setOpenViewFincasTrabajador] =
    useState(false);

  const { data: permisos_cliente } = useGetPermisosByCliente(clienteId);
  const { data: permisos_activos } = useGetPermisosByPaquete(paqueteId);

  const { data: fincas_trabajador } = useGetFincasByTrabajador(clienteId);

  const permisosDisponibles = permisos_activos?.filter(
    (permisoActivo) =>
      !permisos_cliente?.some(
        (permisoCliente) => permisoCliente.permiso.id === permisoActivo.id,
      ),
  );

  const handleViewClienteId = (clienteId: string) => {
    if (isMobile) {
      router.push(`/trabajadores/asignar-permisos/${clienteId}`);
    } else {
      setOpenModalPermisos(true);
      setClienteId(clienteId);
    }
  };

  const handleAgregarPermiso = () => {
    setOpenAddPermisos(true);
  };

  const handlePermisoChange = async (
    permisoId: string,
    campo: string,
    valor: boolean,
  ) => {
    try {
      const datosActualizacion = { [campo]: valor };
      await EditarPermisoByCliente(permisoId, datosActualizacion);

      queryClient.invalidateQueries({
        queryKey: ["permisos-clienteId", clienteId],
      });

      toast.success(t("messages.permissionUpdated"));
    } catch (error) {
      toast.error(t("errors.updatePermission"));
    }
  };

  const handleEliminarPermiso = async (permisoId: string) => {
    try {
      await EliminarPermisoByCliente(permisoId);

      queryClient.invalidateQueries({
        queryKey: ["permisos-clienteId", clienteId],
      });

      toast.success(t("messages.permissionDeleted"));
    } catch (error) {
      toast.error(t("errors.deletePermission"));
    }
  };

  const handleSeleccionarTodos = () => {
    if (permisosDisponibles && permisosDisponibles.length > 0) {
      const todosLosIds = permisosDisponibles.map((permiso) => permiso.id);
      setPermisosSeleccionados(todosLosIds);
    }
  };

  const handleDeseleccionarTodos = () => {
    setPermisosSeleccionados([]);
  };

  const handleSeleccionarPermiso = (permisoId: string) => {
    setPermisosSeleccionados((prev) => {
      if (prev.includes(permisoId)) {
        return prev.filter((id) => id !== permisoId);
      } else {
        return [...prev, permisoId];
      }
    });
  };

  const handleConfirmarAgregarPermiso = async () => {
    if (permisosSeleccionados.length === 0) {
      toast.error(t("errors.selectAtLeastOnePermission"));
      return;
    }

    try {
      const promesas = permisosSeleccionados.map((permisoId) => {
        const nuevoPermiso: CrearPermisoClienteInterface = {
          clienteId: clienteId,
          permisoId: permisoId,
          ver: true,
          crear: false,
          editar: false,
          eliminar: false,
        };
        return CrearPermisoByCliente(nuevoPermiso);
      });

      await Promise.all(promesas);

      queryClient.invalidateQueries({
        queryKey: ["permisos-clienteId", clienteId],
      });

      toast.success(
        t("messages.permissionsAdded", { count: permisosSeleccionados.length }),
      );

      setOpenAddPermisos(false);
      setPermisosSeleccionados([]);
    } catch (error) {
      toast.error(t("errors.addPermissions"));
    }
  };

  const updatedVerified = async (verified: boolean) => {
    if (!clienteId) {
      toast.error(t("errors.selectWorkerToUpdateVerification"));
      return;
    }

    try {
      await ActualizarVerificacion(clienteId, verified);

      toast.success(t("messages.workerVerificationUpdated"));

      queryClient.invalidateQueries({
        queryKey: ["permisos-clienteId", clienteId],
      });

      queryClient.invalidateQueries({
        queryKey: ["trabajadores"],
      });

      setClienteId("");
      setOpenVerified(false);
    } catch (error) {
      toast.error(t("errors.verifyWorker"));
    }
  };

  const handleEditarEstado = async (
    clienteId: string,
    verificacion: boolean,
  ) => {
    setOpenVerified(true);
    setClienteId(clienteId);
    setVerficiado(verificacion);
  };

  const handleOpenFincasTrabajador = (trabajadorId: string) => {
    setOpenViewFincasTrabajador(true);
    setClienteId(trabajadorId);
  };

  const handleAddFincas = (trabajadorId: string, nombre: string) => {
    setIsOpenFinca(true);
    setClienteId(trabajadorId);
    setNombreTrabajador(nombre);
  };

  if (isMobile) {
    return (
      <div className="space-y-3 p-2">
        {filteredTrabajadores && filteredTrabajadores.length > 0 ? (
          filteredTrabajadores.map((trabajador) => (
            <Card key={trabajador.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">
                        {getInitials(trabajador.nombre)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-base">
                        {trabajador.nombre}
                      </h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-xs">
                          {trabajador.rol}
                        </Badge>
                        <VerifiedBadge verified={trabajador.verified} />
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Button
                      onClick={() => handleEditTrabajador(trabajador)}
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      aria-label={t("actions.editWorker")}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          aria-label={t("actions.openMenu")}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          {t("actions.title")}
                        </DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={() => handleViewClienteId(trabajador.id)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          {t("actions.assignPermissions")}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            handleAddFincas(trabajador.id, trabajador.nombre)
                          }
                        >
                          <Users className="mr-2 h-4 w-4" />
                          {t("actions.assignFarm")}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {trabajador.verified ? (
                          <DropdownMenuItem
                            onClick={() =>
                              handleEditarEstado(
                                trabajador.id,
                                trabajador.verified,
                              )
                            }
                            className="text-red-600"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            {t("actions.invalidate")}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              handleEditarEstado(
                                trabajador.id,
                                trabajador.verified,
                              )
                            }
                            className="text-green-600"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            {t("actions.verify")}
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <Separator className="my-3" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {t("fields.identification")}
                    </span>
                    <span className="text-sm font-mono">
                      {trabajador.identificacion}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {t("fields.phone")}
                    </span>
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{trabajador.telefono}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {t("fields.email")}
                    </span>
                    <div className="flex items-center gap-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm truncate max-w-[180px]">
                        {trabajador.email || t("values.notRegistered")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {t("fields.location")}
                    </span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">
                        {trabajador.municipio?.nombre ||
                          t("values.notAvailable")}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator className="my-3" />

                <Button
                  onClick={() => handleOpenFincasTrabajador(trabajador.id)}
                  variant="outline"
                  className="w-full justify-between"
                  size="sm"
                >
                  <span className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {t("actions.viewAssignedFarms")}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">{t("empty.noWorkers")}</p>
            </CardContent>
          </Card>
        )}

        <Modal
          title={t("modals.workerPermissions.title")}
          description={t("modals.workerPermissions.description")}
          open={openModalPermisos}
          onOpenChange={setOpenModalPermisos}
          size="full"
          height="auto"
        >
          <div className="space-y-4 p-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
              <h3 className="text-lg font-semibold">
                {t("permissions.assignedTitle")}
              </h3>
              <Button
                onClick={handleAgregarPermiso}
                size="sm"
                className="flex items-center gap-2 w-full sm:w-auto"
                disabled={
                  !permisosDisponibles || permisosDisponibles.length === 0
                }
              >
                <Plus className="h-4 w-4" />
                {t("permissions.add")}
              </Button>
            </div>

            {permisos_cliente && permisos_cliente.length > 0 ? (
              <div className="border rounded-lg overflow-x-auto">
                <TablePermisosAsignados
                  permisos_cliente={permisos_cliente}
                  handlePermisoChange={handlePermisoChange}
                  handleEliminarPermiso={handleEliminarPermiso}
                />
              </div>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <p className="text-gray-500">
                  {t("permissions.emptyAssigned")}
                </p>
                <Button
                  onClick={handleAgregarPermiso}
                  variant="outline"
                  className="mt-4"
                  disabled={
                    !permisosDisponibles || permisosDisponibles.length === 0
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("permissions.addFirst")}
                </Button>
              </div>
            )}

            {permisos_cliente && permisos_cliente.length > 0 && (
              <ResumenPermiso permisos_cliente={permisos_cliente} />
            )}
          </div>
        </Modal>

        <Modal
          title={t("modals.addPermissions.title")}
          description={t("modals.addPermissions.description")}
          open={openAddPermisos}
          onOpenChange={setOpenAddPermisos}
          size="full"
          height="auto"
        >
          <div className="flex-1 overflow-y-auto space-y-4">
            {permisosDisponibles && permisosDisponibles.length > 0 ? (
              <>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sticky top-0 z-10 py-2 bg-white">
                  <span className="text-sm text-gray-600 font-medium">
                    {t("permissions.selectedCount", {
                      selected: permisosSeleccionados.length,
                      total: permisosDisponibles.length,
                    })}
                  </span>

                  <div className="flex gap-2 w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSeleccionarTodos}
                      className="flex-1"
                    >
                      {t("permissions.selectAll")}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDeseleccionarTodos}
                      className="flex-1"
                    >
                      {t("permissions.deselectAll")}
                    </Button>
                  </div>
                </div>

                <div className="border rounded-lg">
                  <div className="max-h-96 overflow-y-auto">
                    <TablePermisosCliente
                      permisosDisponibles={permisosDisponibles}
                      permisosSeleccionados={permisosSeleccionados}
                      handleSeleccionarPermiso={handleSeleccionarPermiso}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 border rounded-lg">
                <p className="text-gray-500">
                  {t("permissions.emptyAvailable")}
                </p>
              </div>
            )}

            {permisosSeleccionados.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg">
                <div className="p-4 border-b border-blue-200">
                  <h4 className="font-semibold text-blue-800">
                    {t("permissions.selectedTitle", {
                      count: permisosSeleccionados.length,
                    })}
                  </h4>
                </div>

                <div className="max-h-48 overflow-y-auto">
                  <div className="p-4 space-y-3">
                    {permisosSeleccionados.map((permisoId) => {
                      const permiso = permisosDisponibles?.find(
                        (p) => p.id === permisoId,
                      );

                      return permiso ? (
                        <div
                          key={permisoId}
                          className="flex justify-between items-start bg-white p-3 rounded-lg border border-blue-100"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-blue-700 font-medium truncate">
                              {permiso.modulo}
                            </p>
                            <p className="text-sm text-blue-600 line-clamp-2">
                              {permiso.descripcion}
                            </p>
                          </div>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSeleccionarPermiso(permisoId)}
                            className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                          >
                            {t("actions.remove")}
                          </Button>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>

          <AlertDialogFooter className="mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
            <AlertDialogCancel
              onClick={() => {
                setOpenAddPermisos(false);
                setPermisosSeleccionados([]);
              }}
            >
              {t("buttons.cancel")}
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleConfirmarAgregarPermiso}
              disabled={permisosSeleccionados.length === 0}
            >
              {t("permissions.addSelected", {
                count: permisosSeleccionados.length,
              })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </Modal>

        <Modal
          title={t("modals.addFarm.title")}
          description={t("modals.addFarm.description")}
          open={isOpenFinca}
          onOpenChange={setIsOpenFinca}
          size="full"
          height="auto"
        >
          <FormAddAsignarFincas
            trabajadorId={clienteId}
            setClienteId={setClienteId}
            setNombreTrabajador={setNombreTrabajador}
            nombre={nombreTrabajador}
            onSuccess={() => setIsOpenFinca(false)}
          />
        </Modal>

        <Modal
          title={t("modals.verification.title")}
          description={t("modals.verification.description")}
          open={openVerified}
          onOpenChange={setOpenVerified}
          size="sm"
          height="auto"
        >
          <div className="flex flex-col sm:flex-row justify-between gap-3">
            <AlertDialogAction onClick={() => updatedVerified(!verficiado)}>
              {t("buttons.update")}
            </AlertDialogAction>
            <AlertDialogCancel>{t("buttons.cancel")}</AlertDialogCancel>
          </div>
        </Modal>

        <Modal
          title={t("modals.assignedFarms.title")}
          description={t("modals.assignedFarms.description")}
          open={openViewFincasTrabajador}
          onOpenChange={setOpenViewFincasTrabajador}
          size="full"
          height="auto"
        >
          <TableFincasTrabajador fincas={fincas_trabajador} />
        </Modal>
      </div>
    );
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">{t("columns.worker")}</TableHead>
            <TableHead className="text-center">
              {t("columns.identification")}
            </TableHead>
            <TableHead className="text-center">
              {t("columns.contact")}
            </TableHead>
            <TableHead className="text-center">
              {t("columns.location")}
            </TableHead>
            <TableHead className="text-center">{t("columns.farms")}</TableHead>
            <TableHead className="text-right">{t("columns.actions")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredTrabajadores && filteredTrabajadores.length > 0 ? (
            filteredTrabajadores.map((trabajador) => (
              <TableRow key={trabajador.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(trabajador.nombre)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{trabajador.nombre}</div>
                      <div className="text-sm text-muted-foreground">
                        {trabajador.rol}
                      </div>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-center">
                  <div>
                    <div className="font-mono text-sm">
                      {trabajador.identificacion}
                    </div>
                    <VerifiedBadge verified={trabajador.verified} />
                  </div>
                </TableCell>

                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1 text-sm">
                      <Phone className="h-3 w-3" />
                      {trabajador.telefono}
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Mail className="h-3 w-3" />
                      {trabajador.email || t("values.notRegistered")}
                    </div>
                  </div>
                </TableCell>

                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {trabajador.municipio?.nombre ||
                            t("values.notAvailable")}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          {trabajador.departamento?.nombre},{" "}
                          {trabajador.pais?.nombre}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>

                <TableCell className="text-center">
                  <Button
                    id="id-ver-finca-trabajador"
                    onClick={() => handleOpenFincasTrabajador(trabajador.id)}
                    variant="ghost"
                    size="sm"
                  >
                    {t("actions.viewFarms")}
                  </Button>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      id="id-edit-trabajador"
                      onClick={() => handleEditTrabajador(trabajador)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      aria-label={t("actions.editWorker")}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <DropdownMenu>
                      <DropdownMenuTrigger id="id-options-trabajador" asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0"
                          aria-label={t("actions.openMenu")}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>
                          {t("actions.title")}
                        </DropdownMenuLabel>

                        <DropdownMenuItem
                          onClick={() => handleViewClienteId(trabajador.id)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          {t("actions.assignPermissions")}
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() =>
                            handleAddFincas(trabajador.id, trabajador.nombre)
                          }
                        >
                          <Users className="mr-2 h-4 w-4" />
                          {t("actions.assignFarm")}
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />

                        {trabajador.verified ? (
                          <DropdownMenuItem
                            onClick={() =>
                              handleEditarEstado(
                                trabajador.id,
                                trabajador.verified,
                              )
                            }
                            className="text-red-600"
                          >
                            <UserX className="mr-2 h-4 w-4" />
                            {t("actions.invalidate")}
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem
                            onClick={() =>
                              handleEditarEstado(
                                trabajador.id,
                                trabajador.verified,
                              )
                            }
                            className="text-green-600"
                          >
                            <UserCheck className="mr-2 h-4 w-4" />
                            {t("actions.verify")}
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
              <TableCell colSpan={6} className="text-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <Users className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    {t("empty.noWorkers")}
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        title={t("modals.workerPermissions.title")}
        description={t("modals.workerPermissions.description")}
        open={openModalPermisos}
        onOpenChange={setOpenModalPermisos}
        size="3xl"
        height="auto"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
              {t("permissions.assignedTitle")}
            </h3>
            <Button
              onClick={handleAgregarPermiso}
              size="sm"
              className="flex items-center gap-2"
              disabled={
                !permisosDisponibles || permisosDisponibles.length === 0
              }
            >
              <Plus className="h-4 w-4" />
              {t("permissions.add")}
            </Button>
          </div>

          {permisos_cliente && permisos_cliente.length > 0 ? (
            <div className="border rounded-lg">
              <TablePermisosAsignados
                permisos_cliente={permisos_cliente}
                handlePermisoChange={handlePermisoChange}
                handleEliminarPermiso={handleEliminarPermiso}
              />
            </div>
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-gray-500">{t("permissions.emptyAssigned")}</p>
              <Button
                onClick={handleAgregarPermiso}
                variant="outline"
                className="mt-4"
                disabled={
                  !permisosDisponibles || permisosDisponibles.length === 0
                }
              >
                <Plus className="h-4 w-4 mr-2" />
                {t("permissions.addFirst")}
              </Button>
            </div>
          )}

          {permisos_cliente && permisos_cliente.length > 0 && (
            <ResumenPermiso permisos_cliente={permisos_cliente} />
          )}
        </div>
      </Modal>

      <Modal
        title={t("modals.addPermissions.title")}
        description={t("modals.addPermissions.description")}
        open={openAddPermisos}
        onOpenChange={setOpenAddPermisos}
        size="2xl"
        height="auto"
      >
        <div className="flex-1 overflow-y-auto space-y-4">
          {permisosDisponibles && permisosDisponibles.length > 0 ? (
            <>
              <div className="flex justify-between items-center bg-white sticky top-0 z-10 py-2">
                <span className="text-sm text-gray-600 font-medium">
                  {t("permissions.selectedCount", {
                    selected: permisosSeleccionados.length,
                    total: permisosDisponibles.length,
                  })}
                </span>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSeleccionarTodos}
                  >
                    {t("permissions.selectAll")}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeseleccionarTodos}
                  >
                    {t("permissions.deselectAll")}
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg">
                <div className="max-h-64 overflow-y-auto">
                  <TablePermisosCliente
                    permisosDisponibles={permisosDisponibles}
                    permisosSeleccionados={permisosSeleccionados}
                    handleSeleccionarPermiso={handleSeleccionarPermiso}
                  />
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-8 border rounded-lg">
              <p className="text-gray-500">{t("permissions.emptyAvailable")}</p>
            </div>
          )}

          {permisosSeleccionados.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg">
              <div className="p-4 border-b border-blue-200">
                <h4 className="font-semibold text-blue-800">
                  {t("permissions.selectedTitle", {
                    count: permisosSeleccionados.length,
                  })}
                </h4>
              </div>

              <div className="max-h-48 overflow-y-auto">
                <div className="p-4 space-y-3">
                  {permisosSeleccionados.map((permisoId) => {
                    const permiso = permisosDisponibles?.find(
                      (p) => p.id === permisoId,
                    );

                    return permiso ? (
                      <div
                        key={permisoId}
                        className="flex justify-between items-start bg-white p-3 rounded-lg border border-blue-100"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-blue-700 font-medium truncate">
                            {permiso.modulo}
                          </p>
                          <p className="text-sm text-blue-600 line-clamp-2">
                            {permiso.descripcion}
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSeleccionarPermiso(permisoId)}
                          className="text-red-500 hover:text-red-700 ml-2 flex-shrink-0"
                        >
                          {t("actions.remove")}
                        </Button>
                      </div>
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        <AlertDialogFooter className="mt-4 pt-4 border-t border-gray-200 flex-shrink-0">
          <AlertDialogCancel
            onClick={() => {
              setOpenAddPermisos(false);
              setPermisosSeleccionados([]);
            }}
          >
            {t("buttons.cancel")}
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleConfirmarAgregarPermiso}
            disabled={permisosSeleccionados.length === 0}
          >
            {t("permissions.addSelected", {
              count: permisosSeleccionados.length,
            })}
          </AlertDialogAction>
        </AlertDialogFooter>
      </Modal>

      <Modal
        title={t("modals.addFarm.title")}
        description={t("modals.addFarm.description")}
        open={isOpenFinca}
        onOpenChange={setIsOpenFinca}
        size="xl"
        height="auto"
      >
        <FormAddAsignarFincas
          trabajadorId={clienteId}
          setClienteId={setClienteId}
          setNombreTrabajador={setNombreTrabajador}
          nombre={nombreTrabajador}
          onSuccess={() => setIsOpenFinca(false)}
        />
      </Modal>

      <Modal
        title={t("modals.verification.title")}
        description={t("modals.verification.description")}
        open={openVerified}
        onOpenChange={setOpenVerified}
      >
        <div className="flex justify-between">
          <AlertDialogAction onClick={() => updatedVerified(!verficiado)}>
            {t("buttons.update")}
          </AlertDialogAction>
          <AlertDialogCancel>{t("buttons.cancel")}</AlertDialogCancel>
        </div>
      </Modal>

      <Modal
        title={t("modals.assignedFarms.title")}
        description={t("modals.assignedFarms.description")}
        open={openViewFincasTrabajador}
        onOpenChange={setOpenViewFincasTrabajador}
        size="4xl"
        height="auto"
      >
        <TableFincasTrabajador fincas={fincas_trabajador} />
      </Modal>
    </>
  );
};

export default TableTrabajadores;
