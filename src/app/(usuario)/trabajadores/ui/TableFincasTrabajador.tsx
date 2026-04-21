import { ResposeFincasAsignadasTrabajador } from "@/api/fincas-trabajador/interface/response-fincas-trabajador.interface";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  MapPin,
  User,
  Building2,
  Trees,
  PiggyBank,
  Tractor,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { eliminarFincaTrabajador } from "@/api/fincas-trabajador/accions/eliminar-finca-trabajador";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { isAxiosError } from "axios";
import { getInitials } from "@/helpers/funciones/getInitials";

interface Props {
  fincas: ResposeFincasAsignadasTrabajador[] | undefined;
}

const TableFincasTrabajador = ({ fincas }: Props) => {
  const queryClient = useQueryClient();

  const onEliminarAsignacion = async (asignacionId: string) => {
    try {
      await eliminarFincaTrabajador(asignacionId);
      queryClient.invalidateQueries({
        queryKey: ["fincas-trabajador"],
      });
      queryClient.invalidateQueries({ queryKey: ["trabajadores"] });
      toast.success("Finca Desasignada del Trabajador");
    } catch (error) {
      if (isAxiosError(error)) {
        const messages = error.response?.data?.message;
        const errorMessage = Array.isArray(messages)
          ? messages[0]
          : typeof messages === "string"
            ? messages
            : "Hubo un error al desasignar la finca";

        toast.error(errorMessage);
      } else {
        toast.error("Error inesperado. Contacte al administrador");
      }
    }
  };

  if (!fincas || fincas.length === 0) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="flex flex-col items-center justify-center text-center">
            <Building2 className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              No hay fincas asignadas
            </h3>
            <p className="text-sm text-muted-foreground">
              Este trabajador aún no tiene fincas asignadas.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:hidden">
        {fincas.map((asignacion) => (
          <Card key={asignacion.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">
                  {asignacion.finca.nombre_finca}
                </CardTitle>
                <Badge variant="outline" className="text-xs">
                  {asignacion.finca.abreviatura}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {asignacion.finca.ubicacion}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Trees className="h-4 w-4 text-muted-foreground" />
                  <span>
                    {asignacion.finca.tamaño_total}{" "}
                    {asignacion.finca.medida_finca}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <PiggyBank className="h-4 w-4 text-muted-foreground" />
                  <span>{asignacion.finca.cantidad_animales} animales</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="h-3 w-3" />
                <span>Por: {asignacion.asignadoPor.nombre}</span>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={() => onEliminarAsignacion(asignacion.id)}
              >
                <XCircle className="h-4 w-4 mr-2" />
                Desasignar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="hidden md:block border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Finca</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Características</TableHead>
              <TableHead>Tipo Explotación</TableHead>

              <TableHead>Asignado Por</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fincas.map((asignacion) => (
              <TableRow key={asignacion.id}>
                <TableCell>
                  <div className="space-y-1">
                    <div className="font-medium">
                      {asignacion.finca.nombre_finca}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {asignacion.finca.abreviatura}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1 text-sm">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate max-w-[150px]">
                            {asignacion.finca.ubicacion}
                          </span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Coordenadas: {asignacion.finca.latitud?.toFixed(4)},{" "}
                          {asignacion.finca.longitud?.toFixed(4)}
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Trees className="h-3 w-3" />
                      <span>
                        {asignacion.finca.tamaño_total}{" "}
                        {asignacion.finca.medida_finca}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <PiggyBank className="h-3 w-3" />
                      <span>{asignacion.finca.cantidad_animales} animales</span>
                    </div>
                    {asignacion.finca.area_ganaderia && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Tractor className="h-3 w-3" />
                        <span>
                          Área ganadería: {asignacion.finca.area_ganaderia}{" "}
                          {asignacion.finca.medida_finca}
                        </span>
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  {asignacion.finca.especies_maneja &&
                    asignacion.finca.especies_maneja.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">
                        {asignacion.finca.especies_maneja.map((e, idx) => (
                          <span key={idx}>
                            {e.especie}: {e.cantidad}
                            {idx <
                              asignacion.finca.especies_maneja.length - 1 &&
                              ", "}
                          </span>
                        ))}
                      </div>
                    )}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarFallback className="text-xs">
                        {getInitials(asignacion.asignadoPor.nombre)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-medium">
                        {asignacion.asignadoPor.nombre}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {asignacion.asignadoPor.rol}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() =>
                              window.open(
                                `/fincas/${asignacion.finca.id}`,
                                "_blank",
                              )
                            }
                          >
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          Ver detalles de la finca
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => onEliminarAsignacion(asignacion.id)}
                          >
                            <XCircle className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Desasignar finca</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {fincas.length > 0 && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-lg">
              Resumen de Fincas Asignadas
            </CardTitle>
            <CardDescription>
              Estadísticas generales de las fincas asignadas al trabajador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{fincas.length}</div>
                <div className="text-sm text-muted-foreground">
                  Total Fincas
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {fincas.reduce(
                    (sum, f) => sum + f.finca.cantidad_animales,
                    0,
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  Total Animales
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {fincas.reduce(
                    (sum, f) => sum + parseFloat(f.finca.tamaño_total || "0"),
                    0,
                  )}
                  {fincas[0]?.finca.medida_finca}
                </div>
                <div className="text-sm text-muted-foreground">Total Área</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default TableFincasTrabajador;
