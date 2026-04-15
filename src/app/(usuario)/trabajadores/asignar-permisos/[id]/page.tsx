"use client";
import ButtonBack from "@/components/generics/ButtonBack";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import useGetPermisosByCliente from "@/hooks/permisos/useGetPermisosByCliente";
import { useParams, useRouter } from "next/navigation";
import TablePermisosAsignados from "../../ui/TablePermisosAsignados";
import { EditarPermisoByCliente } from "@/api/permisos/accions/editar-permiso_by_cliente";
import { EliminarPermisoByCliente } from "@/api/permisos/accions/eliminar-permiso_by_cliente";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import useGetPermisosPropietario from "@/hooks/permisos/useGetPermisosPropietario";
import Modal from "@/components/generics/Modal";
import TablePermisosCliente from "../../ui/TablePermisosCliente";
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { CrearPermisoClienteInterface } from "@/api/permisos/interface/crear-permiso-cliente.interface";
import { CrearPermisoByCliente } from "@/api/permisos/accions/crear-permiso_by_cliente";

const AsignarPermisosPage = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  const trabajadorId = params.id as string;
  const { data: permisos_cliente } = useGetPermisosByCliente(trabajadorId);
  const { data: permisos_activos } = useGetPermisosPropietario();
  const [openAddPermisos, setOpenAddPermisos] = useState(false);
  const [permisosSeleccionados, setPermisosSeleccionados] = useState<string[]>(
    [],
  );
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handlePermisoChange = async (
    permisoId: string,
    campo: string,
    valor: boolean,
  ) => {
    try {
      const datosActualizacion = { [campo]: valor };
      await EditarPermisoByCliente(permisoId, datosActualizacion);

      queryClient.invalidateQueries({
        queryKey: ["permisos-clienteId", trabajadorId],
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
        queryKey: ["permisos-clienteId", trabajadorId],
      });
      toast.success("Permiso eliminado correctamente");
    } catch (error) {
      toast.error("Error al eliminar el permiso");
    }
  };

  const handleAgregarPermiso = () => {
    setOpenAddPermisos(true);
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
          clienteId: trabajadorId,
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
        queryKey: ["permisos-clienteId", trabajadorId],
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

  const permisosDisponibles = permisos_activos?.filter(
    (permisoActivo) =>
      !permisos_cliente?.some(
        (permisoCliente) => permisoCliente.permiso.id === permisoActivo.id,
      ),
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
          <ButtonBack isMobil={isMobile} />
          <h1 className="text-xl sm:text-2xl font-bold leading-tight">
            Permisos Asignados
          </h1>
        </div>

        <Button
          onClick={handleAgregarPermiso}
          size="default"
          className="w-full sm:w-auto flex items-center justify-center gap-2 mb-4 sm:mb-0"
          disabled={!permisosDisponibles || permisosDisponibles.length === 0}
        >
          <Plus className="h-4 w-4" />
          Agregar Permiso
        </Button>

        <Card className="shadow-lg border-t-4 border-t-primary overflow-hidden mt-4 sm:mt-0">
          <CardHeader className="pb-2 sm:pb-4 px-4 sm:px-6">
            <CardTitle className="text-base sm:text-lg">
              Permisos del Trabajador
            </CardTitle>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Aquí podrás observar los permisos que tiene asignados el
              trabajador
            </p>
          </CardHeader>
          <CardContent className="p-0 sm:p-6 overflow-x-auto">
            <div className="min-w-full">
              <TablePermisosAsignados
                permisos_cliente={permisos_cliente ?? []}
                handlePermisoChange={handlePermisoChange}
                handleEliminarPermiso={handleEliminarPermiso}
              />
            </div>
          </CardContent>
        </Card>
      </div>
      <Modal
        title="Agregar Permisos al Trabajador"
        description="Selecciona uno o múltiples permisos para agregar al trabajador"
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
                  {permisosSeleccionados.length} de {permisosDisponibles.length}{" "}
                  seleccionados
                </span>
                <div className="flex gap-2 w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSeleccionarTodos}
                    className="flex-1"
                  >
                    Seleccionar Todos
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeseleccionarTodos}
                    className="flex-1"
                  >
                    Deseleccionar Todos
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
    </div>
  );
};

export default AsignarPermisosPage;
