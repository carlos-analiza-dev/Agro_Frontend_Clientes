import { Parto } from "@/api/reproduccion/interfaces/response-partos.interface";
import { MessageError } from "@/components/generics/MessageError";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getEstadoBadge } from "@/helpers/funciones/obtenerEstadoParto";
import { getTipoPartoLabel } from "@/helpers/funciones/tipoParto";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Droplets, Scissors, Syringe } from "lucide-react";

interface Props {
  partosFiltrados: Parto[] | undefined;
  isLoading: boolean;
  handleRefresh: () => Promise<void>;
  isMobile: boolean;
}

const InfoPartoAnimal = ({
  partosFiltrados,
  isLoading,
  handleRefresh,
}: Props) => {
  const formatearFecha = (fecha: string | Date) => {
    const fechaObj = new Date(fecha);
    return format(fechaObj, "dd/MM/yyyy", { locale: es });
  };
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Animal</TableHead>
          <TableHead>Finca</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Tipo</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Crías</TableHead>
          <TableHead>Gestación</TableHead>
          <TableHead>Veterinario</TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {isLoading && (
          <TableRow>
            <TableCell colSpan={8} className="text-center py-8">
              <div className="flex justify-center items-center gap-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                <span>Cargando partos...</span>
              </div>
            </TableCell>
          </TableRow>
        )}

        {!isLoading && (!partosFiltrados || partosFiltrados.length === 0) && (
          <TableRow>
            <TableCell
              colSpan={8}
              className="text-center py-8 text-muted-foreground"
            >
              <MessageError
                titulo="No se encontraron partos disponibles en este momento"
                descripcion="En este momento no cuentas con partos disponibles de tus animales, por favor ingresa un parto"
                onPress={() => handleRefresh()}
              />
            </TableCell>
          </TableRow>
        )}

        {partosFiltrados?.map((parto) => {
          const estadoBadge = getEstadoBadge(parto.estado);
          return (
            <TableRow key={parto.id} className="hover:bg-gray-50">
              <TableCell className="font-medium">
                <div>
                  <span>{parto.hembra.identificador}</span>
                </div>
              </TableCell>

              <TableCell>{parto.hembra.finca.nombre_finca}</TableCell>

              <TableCell>{formatearFecha(parto.fecha_parto)}</TableCell>

              <TableCell>
                <Badge variant="outline">
                  {getTipoPartoLabel(parto.tipo_parto)}
                </Badge>
              </TableCell>

              <TableCell>
                <Badge variant={estadoBadge.variant}>{estadoBadge.label}</Badge>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1">
                  <Droplets className="h-3 w-3 text-green-600" />
                  <span className="font-medium">
                    {parto.numero_crias_vivas}
                  </span>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-red-500">
                    {parto.numero_crias_muertas}
                  </span>
                  <span className="text-xs text-muted-foreground ml-1">
                    ({parto.numero_crias} total)
                  </span>
                </div>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1">
                  <Scissors className="h-3 w-3 text-gray-500" />
                  <span>{parto.dias_gestacion} días</span>
                </div>
              </TableCell>

              <TableCell>
                {parto.veterinario_responsable ? (
                  <div className="flex items-center gap-1">
                    <Syringe className="h-3 w-3 text-gray-500" />
                    <span className="text-sm">
                      {parto.veterinario_responsable}
                    </span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default InfoPartoAnimal;
