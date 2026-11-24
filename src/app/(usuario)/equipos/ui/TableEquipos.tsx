import { Equipo } from "@/api/equipos-maquinaria/interface/response-equipos.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EstadoMaquinaria } from "@/interfaces/enums/maquinaria/maquinaria.enums";
import { Edit, Clock, DollarSign, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  equipos: Equipo[];
  handleEditEquipo: (equipo: Equipo) => void;
  moneda: string;
  isMobile: boolean;
}

const TableEquipos = ({
  equipos,
  handleEditEquipo,
  moneda,
  isMobile,
}: Props) => {
  const t = useTranslations("tableEquipos");

  const getEstadoLabel = (estado: EstadoMaquinaria) => {
    switch (estado) {
      case EstadoMaquinaria.ACTIVO:
        return t("statuses.active");
      case EstadoMaquinaria.MANTENIMIENTO:
        return t("statuses.maintenance");
      case EstadoMaquinaria.INCACTIVO:
        return t("statuses.inactive");
      default:
        return estado;
    }
  };

  const getEstadoVariant = (estado: EstadoMaquinaria) => {
    return estado === EstadoMaquinaria.ACTIVO
      ? "default"
      : estado === EstadoMaquinaria.MANTENIMIENTO
        ? "secondary"
        : "destructive";
  };

  const getEstadoClassName = (estado: EstadoMaquinaria) => {
    return estado === EstadoMaquinaria.ACTIVO
      ? "bg-green-500 hover:bg-green-600"
      : estado === EstadoMaquinaria.MANTENIMIENTO
        ? "bg-yellow-500 hover:bg-yellow-600 text-white"
        : "";
  };

  if (isMobile) {
    return (
      <div className="space-y-4">
        {equipos.map((eq) => (
          <Card key={eq.id} className="relative">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">{eq.nombre}</CardTitle>
                  <p className="text-xs font-mono text-muted-foreground mt-1">
                    {eq.codigoInterno || t("notAvailable")}
                  </p>
                </div>
                <Button
                  onClick={() => handleEditEquipo(eq)}
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  aria-label={t("actions.editEquipment")}
                  title={t("actions.editEquipment")}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t("fields.type")}
                </span>
                <Badge variant="outline" className="capitalize text-xs">
                  {eq.tipo}
                </Badge>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  {t("fields.brandModel")}
                </span>
                <span className="text-sm">
                  {eq.marca || t("notAvailable")}{" "}
                  {eq.modelo ? `/${eq.modelo}` : ""}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="h-3 w-3" /> {t("fields.cost")}
                </span>
                <span className="text-sm font-medium">
                  {moneda} {eq.costoCompra}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> {t("fields.farm")}
                </span>
                <span className="text-sm">
                  {eq.finca?.nombre_finca || t("unassigned")}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {t("fields.usageHours")}
                </span>
                <div className="text-right">
                  <span className="text-sm">
                    {Number(eq.horasUso).toFixed(1)} {t("units.hours")}
                  </span>
                  {eq.vidaUtilHoras && (
                    <p className="text-xs text-muted-foreground">
                      {t("fields.usefulLife")}: {Number(eq.vidaUtilHoras)}{" "}
                      {t("units.hours")}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex justify-between items-center pt-1">
                <span className="text-sm text-muted-foreground">
                  {t("fields.status")}
                </span>
                <Badge
                  variant={getEstadoVariant(eq.estado)}
                  className={getEstadoClassName(eq.estado)}
                >
                  {getEstadoLabel(eq.estado)}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>{t("columns.code")}</TableHead>
            <TableHead>{t("columns.name")}</TableHead>
            <TableHead>{t("columns.type")}</TableHead>
            <TableHead>{t("columns.brandModel")}</TableHead>
            <TableHead>{t("columns.cost")}</TableHead>
            <TableHead>{t("columns.farm")}</TableHead>
            <TableHead>{t("columns.usageHours")}</TableHead>
            <TableHead>{t("columns.status")}</TableHead>
            <TableHead>{t("columns.actions")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {equipos.map((eq) => (
            <TableRow key={eq.id}>
              <TableCell className="font-mono text-xs">
                {eq.codigoInterno || t("notAvailable")}
              </TableCell>
              <TableCell className="font-medium">{eq.nombre}</TableCell>
              <TableCell>
                <Badge variant="outline" className="capitalize">
                  {eq.tipo}
                </Badge>
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-sm">{eq.marca || t("notAvailable")}</p>
                  <p className="text-xs text-muted-foreground">
                    {eq.modelo || t("notAvailable")}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                {moneda} {eq.costoCompra}
              </TableCell>
              <TableCell>{eq.finca?.nombre_finca || t("unassigned")}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="text-sm">
                    {Number(eq.horasUso).toFixed(1)} {t("units.hours")}
                  </span>
                  {eq.vidaUtilHoras && (
                    <span className="text-xs text-muted-foreground">
                      {t("fields.usefulLife")}: {Number(eq.vidaUtilHoras)}{" "}
                      {t("units.hours")}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge
                  variant={getEstadoVariant(eq.estado)}
                  className={getEstadoClassName(eq.estado)}
                >
                  {getEstadoLabel(eq.estado)}
                </Badge>
              </TableCell>
              <TableCell>
                <Button
                  id="edit-equipo-btn"
                  onClick={() => handleEditEquipo(eq)}
                  variant="ghost"
                  aria-label={t("actions.editEquipment")}
                  title={t("actions.editEquipment")}
                >
                  <Edit />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableEquipos;
