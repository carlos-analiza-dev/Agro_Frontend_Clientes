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
} from "lucide-react";
import { useState } from "react";
import ResumenPermiso from "./ResumenPermiso";
import TablePermisosCliente from "./TablePermisosCliente";
import TablePermisosAsignados from "./TablePermisosAsignados";
import useGetPermisosByCliente from "@/hooks/permisos/useGetPermisosByCliente";
import useGetPermisosPropietario from "@/hooks/permisos/useGetPermisosPropietario";
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
import VerifiedBadge from "./VerifiedBadge";
import { ActualizarVerificacion } from "@/api/cliente/accions/update-verified";
import useGetFincasByTrabajador from "@/hooks/fincas-trabajador/useGetFincasByTrabajador";
import TableFincasTrabajador from "./TableFincasTrabajador";
import FormAddAsignarFincas from "./FormAddAsignarFincas";

interface Props {
  filteredTrabajadores: Trabajador[] | undefined;
  handleEditTrabajador: (trabajdor: Trabajador) => void;
}

const TableTrabajadores = ({
  filteredTrabajadores,
  handleEditTrabajador,
}: Props) => {
  const queryClient = useQueryClient();
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>(
    [],
  );
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
  const { data: permisos_activos } = useGetPermisosPropietario();
  const { data: fincas_trabajador, isLoading: cargando } =
    useGetFincasByTrabajador(clienteId);
  const permisosDisponibles = permisos_activos?.filter(
    (permisoActivo) =>
      !permisos_cliente?.some(
        (permisoCliente) => permisoCliente.permiso.id === permisoActivo.id,
      ),
  );

  const getInitials = (nombre: string) => {
    return nombre
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const handleViewClienteId = (clienteId: string) => {
    setOpenModalPermisos(true);
    setClienteId(clienteId);
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
      toast.success("Permiso actualizado correctamente");
    } catch (error) {
      toast.error("Error al actualizar el permiso");
    }
  };

  const handleEliminarPermiso = async (permisoId: string) => {
    try {
      await EliminarPermisoByCliente(permisoId);

      queryClient.invalidateQueries({
        queryKey: ["permisos-clienteId", clienteId],
      });
      toast.success("Permiso eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar el permiso");
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
      toast.error("Por favor selecciona al menos un permiso");
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
        `${permisosSeleccionados.length} permiso(s) agregado(s) correctamente`,
      );
      setOpenAddPermisos(false);
      setPermisosSeleccionados([]);
    } catch (error) {
      toast.error("Error al agregar los permisos");
    }
  };

  const updatedVerified = async (verified: boolean) => {
    if (!clienteId) {
      toast.error(
        "Debes seleccionar un trabajador para poder actualizar su estado de verificacion",
      );
      return;
    }
    try {
      await ActualizarVerificacion(clienteId, verified);
      toast.success("Estado del Trabajador Actualizado exitosamente");
      queryClient.invalidateQueries({
        queryKey: ["permisos-clienteId", clienteId],
      });
      queryClient.invalidateQueries({
        queryKey: ["trabajadores"],
      });
      setClienteId("");
      setOpenVerified(false);
    } catch (error) {
      toast.error("Ocurrio un error al verificar el trabajador");
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

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Trabajador</TableHead>
            <TableHead className="text-center">Identificación</TableHead>
            <TableHead className="text-center">Contacto</TableHead>
            <TableHead className="text-center">Ubicación</TableHead>
            <TableHead className="text-center">Fincas</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
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
                <TableCell className="flex justify-center">
                  <div>
                    <div className="font-mono text-sm">
                      {trabajador.identificacion}
                    </div>
                    {VerifiedBadge(trabajador.verified)}
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
                      {trabajador.email || "No registrado"}
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          {trabajador.municipio?.nombre || "N/A"}
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
                <TableCell className="flex justify-center">
                  <Button
                    onClick={() => handleOpenFincasTrabajador(trabajador.id)}
                    variant={"ghost"}
                  >
                    Ver Fincas
                  </Button>
                </TableCell>

                <TableCell className="text-right">
                  <div>
                    <Button
                      onClick={() => handleEditTrabajador(trabajador)}
                      variant={"ghost"}
                    >
                      <Pencil />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => handleViewClienteId(trabajador.id)}
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Asignar permisos
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleAddFincas(trabajador.id, trabajador.nombre)
                          }
                        >
                          <Users className="mr-2 h-4 w-4" />
                          Asignar a finca
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
                            Invalidar
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
                            Verificar
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
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <Users className="h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">
                    No se encontraron trabajadores
                  </p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Modal
        title="Permisos del Trabajador"
        description="Aquí puedes observar y gestionar los permisos a los cuales tiene acceso el trabajador"
        open={openModalPermisos}
        onOpenChange={setOpenModalPermisos}
        size="3xl"
        height="auto"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Permisos Asignados</h3>
            <Button
              onClick={handleAgregarPermiso}
              size="sm"
              className="flex items-center gap-2"
              disabled={
                !permisosDisponibles || permisosDisponibles.length === 0
              }
            >
              <Plus className="h-4 w-4" />
              Agregar Permiso
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
              <p className="text-gray-500">
                No hay permisos asignados para este cliente
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
                Agregar Primer Permiso
              </Button>
            </div>
          )}

          {permisos_cliente && permisos_cliente.length > 0 && (
            <ResumenPermiso permisos_cliente={permisos_cliente} />
          )}
        </div>
      </Modal>

      <Modal
        title="Agregar Permisos al Trabajador"
        description="Selecciona uno o múltiples permisos para agregar al trabajador"
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
                  {permisosSeleccionados.length} de {permisosDisponibles.length}{" "}
                  seleccionados
                </span>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSeleccionarTodos}
                  >
                    Seleccionar Todos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeseleccionarTodos}
                  >
                    Deseleccionar Todos
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
              <p className="text-gray-500">
                No hay permisos disponibles para agregar
              </p>
            </div>
          )}

          {permisosSeleccionados.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg">
              <div className="p-4 border-b border-blue-200">
                <h4 className="font-semibold text-blue-800">
                  Permisos Seleccionados ({permisosSeleccionados.length})
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
                          Quitar
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
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmarAgregarPermiso}
            disabled={permisosSeleccionados.length === 0}
          >
            Agregar {permisosSeleccionados.length} Permiso(s)
          </AlertDialogAction>
        </AlertDialogFooter>
      </Modal>

      <Modal
        title="Agregar Finca"
        description="Aqui podras agregar las fincas que tendra asignadas este trabajador"
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
        title="Modificar Verificacion"
        description="Aqui podras verificar o invalidar un usuario"
        open={openVerified}
        onOpenChange={setOpenVerified}
      >
        <div className="flex justify-between">
          <AlertDialogAction onClick={() => updatedVerified(!verficiado)}>
            Actualizar
          </AlertDialogAction>
          <AlertDialogCancel>Cancerlar</AlertDialogCancel>
        </div>
      </Modal>
      <Modal
        title="Fincas Asignadas Al Trabajador"
        description="Aqui se observan las fincas que tiene asignadas este trabajador"
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
