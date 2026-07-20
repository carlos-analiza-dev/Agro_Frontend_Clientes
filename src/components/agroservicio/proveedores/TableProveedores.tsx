import { ProveedoreAgro } from "@/api/agroservicio/proveedores/interface/response-agro-proveedores.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getTipoEscalaColor,
  getTipoPagoColor,
} from "@/helpers/funciones/agroservicio/proveedores/colors-tipo";
import { formatDateLocal } from "@/helpers/funciones/formatDateOnly";
import { Building2, Mail, MapPin, Pencil, Phone, User } from "lucide-react";

interface Props {
  isLoading: boolean;
  proveedores: ProveedoreAgro[];
  searchTerm: string;
  handleEditProveedor: (proveedor: ProveedoreAgro) => void;
}

const TableProveedores = ({
  isLoading,
  proveedores,
  searchTerm,
  handleEditProveedor,
}: Props) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[250px]">Información</TableHead>
          <TableHead>Contacto</TableHead>
          <TableHead>Ubicación</TableHead>
          <TableHead>Detalles</TableHead>
          <TableHead className="text-right">Fecha Registro</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          Array.from({ length: 5 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-[120px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-[150px]" />
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-[60px]" />
                  <Skeleton className="h-5 w-[60px]" />
                </div>
              </TableCell>
              <TableCell>
                <Skeleton className="h-3 w-[100px] ml-auto" />
              </TableCell>
            </TableRow>
          ))
        ) : proveedores.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-10">
              <div className="flex flex-col items-center gap-2">
                <Building2 className="h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {searchTerm
                    ? "No se encontraron proveedores con esta búsqueda"
                    : "No hay proveedores registrados"}
                </p>
              </div>
            </TableCell>
          </TableRow>
        ) : (
          proveedores.map((proveedor) => (
            <TableRow key={proveedor.id} className="hover:bg-muted/50">
              <TableCell>
                <div className="space-y-1">
                  <div className="font-medium">{proveedor.nombre_legal}</div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="font-mono">{proveedor.nit_rtn}</span>
                    {proveedor.nrc && (
                      <>
                        <span>•</span>
                        <span className="font-mono">NRC: {proveedor.nrc}</span>
                      </>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {proveedor.nombre_contacto && (
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-3 w-3 text-muted-foreground" />
                      <span>{proveedor.nombre_contacto}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-3 w-3 text-muted-foreground" />
                    <span>{proveedor.telefono}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span className="truncate max-w-[150px]">
                      {proveedor.correo}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-muted-foreground" />
                    <span>
                      {proveedor.municipio?.nombre},{" "}
                      {proveedor.departamento?.nombre}
                    </span>
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {proveedor.pais?.nombre} • {proveedor.complemento_direccion}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  <Badge
                    variant="secondary"
                    className={getTipoPagoColor(proveedor.tipo_pago_default)}
                  >
                    {proveedor.tipo_pago_default}
                  </Badge>
                  <Badge
                    variant="secondary"
                    className={getTipoEscalaColor(proveedor.tipo_escala)}
                  >
                    {proveedor.tipo_escala}
                  </Badge>
                  {proveedor.plazo && (
                    <Badge variant="outline">
                      Plazo: {proveedor.plazo} días
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                {formatDateLocal(proveedor.created_at)}
              </TableCell>
              <TableCell className="text-right text-sm text-muted-foreground">
                <Button
                  title="Editar Proveedor"
                  onClick={() => handleEditProveedor(proveedor)}
                  variant={"ghost"}
                >
                  <Pencil />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default TableProveedores;
