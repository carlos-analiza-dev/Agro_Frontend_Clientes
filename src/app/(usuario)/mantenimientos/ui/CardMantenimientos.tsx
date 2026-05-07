import { Mantenimiento } from "@/api/mantenimientos/interface/response-mantenimientos.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTimeLocal } from "@/helpers/funciones/formatDateOnly";

import {
  CalendarIcon,
  ClockIcon,
  DollarSignIcon,
  Edit,
  HomeIcon,
} from "lucide-react";

interface Props {
  mantenimiento: Mantenimiento;
  moneda: string;
  handleEditMantenimiento: (mantenimiento: Mantenimiento) => void;
}

const CardMantenimientos = ({
  mantenimiento,
  moneda,
  handleEditMantenimiento,
}: Props) => {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">
            {mantenimiento.equipo.nombre}
          </CardTitle>
          <div className="flex items-center">
            <Badge
              variant={
                mantenimiento.tipo === "PREVENTIVO" ? "default" : "destructive"
              }
              className="capitalize"
            >
              {mantenimiento.tipo.toLowerCase()}
            </Badge>
            <Button
              onClick={() => handleEditMantenimiento(mantenimiento)}
              variant={"ghost"}
            >
              <Edit />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {mantenimiento.descripcion}
        </p>

        <div className="space-y-2 text-sm border-t pt-3">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CalendarIcon className="h-4 w-4" />
            <span>
              Inicio: {formatDateTimeLocal(mantenimiento.fecha_inicio)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <ClockIcon className="h-4 w-4" />
            <span>Final: {formatDateTimeLocal(mantenimiento.fecha_final)}</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <DollarSignIcon className="h-4 w-4" />
            <span className="font-medium text-foreground">
              {moneda} {mantenimiento.costo?.toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <HomeIcon className="h-4 w-4" />
            <span>
              {mantenimiento.finca.nombre || mantenimiento.finca?.nombre}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardMantenimientos;
