"use client";
import { Configuraciones } from "@/api/configuraciones-trabajadores/interface/response-config-trabajadores.interface";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import { formatCurrency } from "@/helpers/funciones/formatCurrency";
import { getInitials } from "@/helpers/funciones/getInitials";
import {
  Briefcase,
  Clock,
  Edit,
  Eye,
  CalendarDays,
  DollarSign,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";

interface Props {
  filteredConfigs: Configuraciones[];
  setSelectedTrabajador: Dispatch<SetStateAction<Configuraciones | null>>;
  moneda: string;
  handleEditConfig: (config: Configuraciones) => void;
}

const TableConfigTrabajadores = ({
  filteredConfigs,
  moneda,
  setSelectedTrabajador,
  handleEditConfig,
}: Props) => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

  if (isMobile) {
    return (
      <div className="space-y-4 p-2">
        {filteredConfigs.map((config) => (
          <Card key={config.id} className="overflow-hidden">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      {getInitials(config.trabajador.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      {config.trabajador.nombre}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {config.trabajador.identificacion}
                    </p>
                    <Badge
                      variant={config.activo ? "default" : "secondary"}
                      className="mt-1 text-xs"
                    >
                      {config.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    onClick={() => setSelectedTrabajador(config)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                    onClick={() => handleEditConfig(config)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Cargo:</span>
                  </div>
                  <span className="text-sm font-medium">
                    {config.cargo || "No especificado"}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      Salario Diario:
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-green-600">
                    {formatCurrency(config.salarioDiario, moneda)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Jornada:</span>
                  </div>
                  <span className="text-sm">
                    {config.horasJornadaSemanal} horas/semana
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">Días/Semana:</span>
                  </div>
                  <span className="text-sm">
                    {config.diasTrabajadosSemanal || 5} días
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bonificaciones:</span>
                  {config.bonificacionesFijas?.length > 0 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="secondary" className="cursor-help">
                            +{config.bonificacionesFijas.length}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            {config.bonificacionesFijas.map((b, i) => (
                              <p key={i}>
                                {b.concepto}:{" "}
                                {formatCurrency(b.montoMensual, moneda)}
                              </p>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Deducciones:</span>
                  {config.deduccionesFijas?.length > 0 ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Badge variant="destructive" className="cursor-help">
                            -{config.deduccionesFijas.length}
                          </Badge>
                        </TooltipTrigger>
                        <TooltipContent>
                          <div className="space-y-1">
                            {config.deduccionesFijas.map((d, i) => (
                              <p key={i}>
                                {d.concepto}:{" "}
                                {formatCurrency(d.montoMensual, moneda)}
                              </p>
                            ))}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
              <TableHead className="font-semibold">Trabajador</TableHead>
              <TableHead className="font-semibold">Cargo</TableHead>
              <TableHead className="font-semibold">Salario</TableHead>
              <TableHead className="font-semibold">Jornada</TableHead>
              <TableHead className="font-semibold text-center">
                Bonif/Ded
              </TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredConfigs.map((config) => (
              <TableRow
                key={config.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                        {getInitials(config.trabajador.nombre)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                        {config.trabajador.nombre}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {config.trabajador.identificacion}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">{config.cargo || "-"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm font-semibold text-green-600">
                    {formatCurrency(config.salarioDiario, moneda)}
                  </p>
                  <p className="text-xs text-gray-500">/día</p>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-sm">
                      {config.horasJornadaSemanal}h
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {config.bonificacionesFijas?.length > 0 && (
                      <Badge variant="secondary" className="text-xs">
                        +{config.bonificacionesFijas.length}
                      </Badge>
                    )}
                    {config.deduccionesFijas?.length > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        -{config.deduccionesFijas.length}
                      </Badge>
                    )}
                    {config.bonificacionesFijas?.length === 0 &&
                      config.deduccionesFijas?.length === 0 && (
                        <span className="text-xs text-gray-400">-</span>
                      )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={config.activo ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {config.activo ? "Activo" : "Inactivo"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setSelectedTrabajador(config)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleEditConfig(config)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800/50">
            <TableHead className="font-semibold">Trabajador</TableHead>
            <TableHead className="font-semibold">Cargo</TableHead>
            <TableHead className="font-semibold">Salario Diario</TableHead>
            <TableHead className="font-semibold">Jornada</TableHead>
            <TableHead className="font-semibold">Bonificaciones</TableHead>
            <TableHead className="font-semibold">Deducciones</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredConfigs.map((config) => (
            <TableRow
              key={config.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      {getInitials(config.trabajador.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {config.trabajador.nombre}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {config.trabajador.identificacion}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                  <span>{config.cargo || "-"}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="font-semibold text-green-600 dark:text-green-400">
                    {formatCurrency(config.salarioDiario, moneda)}
                  </p>
                  <p className="text-xs text-gray-500">/día</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{config.horasJornadaSemanal} horas/semana</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <CalendarDays className="h-3 w-3" />
                    <span>{config.diasTrabajadosSemanal || 5} días/semana</span>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {config.bonificacionesFijas?.length > 0 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="secondary" className="cursor-help">
                          +{config.bonificacionesFijas.length}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          {config.bonificacionesFijas.map((b, i) => (
                            <p key={i}>
                              {b.concepto}:{" "}
                              {formatCurrency(b.montoMensual, moneda)}
                            </p>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                {config.deduccionesFijas?.length > 0 ? (
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Badge variant="destructive" className="cursor-help">
                          -{config.deduccionesFijas.length}
                        </Badge>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="space-y-1">
                          {config.deduccionesFijas.map((d, i) => (
                            <p key={i}>
                              {d.concepto}:{" "}
                              {formatCurrency(d.montoMensual, moneda)}
                            </p>
                          ))}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ) : (
                  <span className="text-gray-400 text-sm">-</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={config.activo ? "default" : "secondary"}
                  className="gap-1"
                >
                  {config.activo ? "Activo" : "Inactivo"}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTrabajador(config)}
                    className="hover:bg-blue-100 dark:hover:bg-blue-900/30"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-yellow-100 dark:hover:bg-yellow-900/30"
                    onClick={() => handleEditConfig(config)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default TableConfigTrabajadores;
