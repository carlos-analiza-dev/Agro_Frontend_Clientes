"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/helpers/funciones/getInitials";
import { Calendar, Download, Eye, Sun, Moon, Star, Edit } from "lucide-react";
import getTrabajoBadge from "./getTrabajoBadge";
import getHoraExtraIcon from "./getHoraExtraIcon";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Jornada } from "@/api/jornadas-trabajador/interface/response-jornadas.interface";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";
import { formatDate } from "@/helpers/funciones/formatDate";
import { toast } from "react-toastify";
import { exportJornadasWithSummary } from "@/helpers/funciones/exportJornadaToExcel";
import { useState } from "react";
import ExportButton from "./ExportButton";
import ModalViewDetailsJornada from "./ModalViewDetailsJornada";

interface Props {
  jornadasFiltradas: Jornada[];
  handleEditJornada: (jornada: Jornada) => void;
}

const TableJornadaTrabajadores = ({
  jornadasFiltradas,
  handleEditJornada,
}: Props) => {
  const [openViewDetails, setOpenViewDetails] = useState(false);
  const [selectedJornada, setSelectedJornada] = useState<Jornada | null>(null);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const isTablet = useMediaQuery("(min-width: 769px) and (max-width: 1024px)");

  const getHorasExtrasTotales = (jornada: Jornada) => {
    return (
      Number(jornada.horasExtrasDiurnas || 0) +
      Number(jornada.horasExtrasNocturnas || 0) +
      Number(jornada.horasExtrasFestivas || 0)
    );
  };

  const getHoraExtraDetails = (jornada: Jornada) => {
    const horas = [];
    if (Number(jornada.horasExtrasDiurnas) > 0) {
      horas.push({
        tipo: "Diurnas",
        valor: jornada.horasExtrasDiurnas,
        icon: Sun,
      });
    }
    if (Number(jornada.horasExtrasNocturnas) > 0) {
      horas.push({
        tipo: "Nocturnas",
        valor: jornada.horasExtrasNocturnas,
        icon: Moon,
      });
    }
    if (Number(jornada.horasExtrasFestivas) > 0) {
      horas.push({
        tipo: "Festivas",
        valor: jornada.horasExtrasFestivas,
        icon: Star,
      });
    }
    return horas;
  };

  const handleExportToExcel = () => {
    if (jornadasFiltradas.length === 0) {
      toast.warning("No hay datos para exportar");
      return;
    }

    try {
      exportJornadasWithSummary(jornadasFiltradas, "jornadas_trabajadores");
      toast.success(
        `Exportadas ${jornadasFiltradas.length} jornadas exitosamente`,
      );
    } catch (error) {
      toast.error("Error al exportar los datos");
    }
  };

  const handleViewDetails = (jornada: Jornada) => {
    setOpenViewDetails(true);
    setSelectedJornada(jornada);
  };

  if (isMobile) {
    return (
      <div className="space-y-4 p-2">
        <div className="flex justify-end mb-4">
          <ExportButton
            handleExportToExcel={handleExportToExcel}
            isMobile={isMobile}
          />
        </div>

        {jornadasFiltradas.map((jornada) => {
          const horasExtras = getHoraExtraDetails(jornada);
          const totalHorasExtras = getHorasExtrasTotales(jornada);

          return (
            <Card key={jornada.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                        {getInitials(jornada.trabajador.nombre)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-gray-900 dark:text-gray-100">
                        {jornada.trabajador.nombre}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {jornada.trabajador.identificacion}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                      onClick={() => handleViewDetails(jornada)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleEditJornada(jornada)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Fecha</p>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-sm font-medium">
                        {formatDate(jornada.fecha)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-500">Estado</p>
                    <div>{getTrabajoBadge(jornada.trabajo)}</div>
                  </div>
                </div>

                {totalHorasExtras > 0 ? (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-2">Horas Extras</p>
                    <div className="flex flex-wrap gap-2">
                      {horasExtras.map((hora, idx) => (
                        <Badge key={idx} variant="outline" className="gap-1">
                          <hora.icon className="h-3 w-3" />
                          {hora.tipo}: {hora.valor}h
                        </Badge>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 mb-1">Horas Extras</p>
                    <p className="text-sm text-gray-400">Sin horas extras</p>
                  </div>
                )}

                {jornada.laborRealizada && (
                  <div className="mb-2">
                    <p className="text-xs text-gray-500 mb-1">
                      Labor realizada
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {jornada.laborRealizada}
                    </p>
                  </div>
                )}

                {jornada.observaciones && (
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Observaciones</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                      {jornada.observaciones}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
        <ModalViewDetailsJornada
          openViewDetails={openViewDetails}
          setOpenViewDetails={setOpenViewDetails}
          selectedJornada={selectedJornada}
        />
      </div>
    );
  }

  if (isTablet) {
    return (
      <div className="overflow-x-auto">
        <div className="flex justify-end mb-4 p-2">
          <ExportButton handleExportToExcel={handleExportToExcel} />
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50 dark:bg-gray-800/50">
              <TableHead className="font-semibold">Trabajador</TableHead>
              <TableHead className="font-semibold">Fecha</TableHead>
              <TableHead className="font-semibold">Estado</TableHead>
              <TableHead className="font-semibold">Horas Extras</TableHead>
              <TableHead className="font-semibold text-right">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {jornadasFiltradas.map((jornada) => {
              const totalHorasExtras = getHorasExtrasTotales(jornada);

              return (
                <TableRow
                  key={jornada.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-xs">
                          {getInitials(jornada.trabajador.nombre)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">
                          {jornada.trabajador.nombre}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {jornada.trabajador.identificacion}
                        </p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-gray-400" />
                      <span className="text-sm">
                        {formatDate(jornada.fecha)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{getTrabajoBadge(jornada.trabajo)}</TableCell>
                  <TableCell>
                    {totalHorasExtras > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {Number(jornada.horasExtrasDiurnas) > 0 && (
                          <Badge variant="outline" className="text-xs">
                            D: {jornada.horasExtrasDiurnas}h
                          </Badge>
                        )}
                        {Number(jornada.horasExtrasNocturnas) > 0 && (
                          <Badge variant="outline" className="text-xs">
                            N: {jornada.horasExtrasNocturnas}h
                          </Badge>
                        )}
                        {Number(jornada.horasExtrasFestivas) > 0 && (
                          <Badge variant="outline" className="text-xs">
                            F: {jornada.horasExtrasFestivas}h
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        onClick={() => handleViewDetails(jornada)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleEditJornada(jornada)}
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <ModalViewDetailsJornada
          openViewDetails={openViewDetails}
          setOpenViewDetails={setOpenViewDetails}
          selectedJornada={selectedJornada}
        />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <div className="flex justify-end mb-4 p-2">
        <ExportButton handleExportToExcel={handleExportToExcel} />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 dark:bg-gray-800/50">
            <TableHead className="font-semibold">Trabajador</TableHead>
            <TableHead className="font-semibold">Fecha</TableHead>
            <TableHead className="font-semibold">Estado</TableHead>
            <TableHead className="font-semibold text-center">
              Horas Extras
            </TableHead>
            <TableHead className="font-semibold">Labor Realizada</TableHead>
            <TableHead className="font-semibold text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jornadasFiltradas.map((jornada) => (
            <TableRow
              key={jornada.id}
              className="hover:bg-gray-50 dark:hover:bg-gray-800/30 transition-colors"
            >
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                      {getInitials(jornada.trabajador.nombre)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {jornada.trabajador.nombre}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {jornada.trabajador.identificacion}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="font-medium">
                    {formatDate(jornada.fecha)}
                  </span>
                </div>
              </TableCell>
              <TableCell>{getTrabajoBadge(jornada.trabajo)}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  {Number(jornada.horasExtrasDiurnas) > 0 && (
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        {getHoraExtraIcon("diurnas")}
                        <span className="text-gray-600">Diurnas:</span>
                      </div>
                      <span className="font-medium">
                        {jornada.horasExtrasDiurnas}h
                      </span>
                    </div>
                  )}
                  {Number(jornada.horasExtrasNocturnas) > 0 && (
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        {getHoraExtraIcon("nocturnas")}
                        <span className="text-gray-600">Nocturnas:</span>
                      </div>
                      <span className="font-medium">
                        {jornada.horasExtrasNocturnas}h
                      </span>
                    </div>
                  )}
                  {Number(jornada.horasExtrasFestivas) > 0 && (
                    <div className="flex items-center justify-between gap-2 text-sm">
                      <div className="flex items-center gap-1">
                        {getHoraExtraIcon("festivas")}
                        <span className="text-gray-600">Festivas:</span>
                      </div>
                      <span className="font-medium">
                        {jornada.horasExtrasFestivas}h
                      </span>
                    </div>
                  )}
                  {getHorasExtrasTotales(jornada) === 0 && (
                    <span className="text-gray-400 text-sm">
                      Sin horas extras
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <p className="text-sm text-gray-700 dark:text-gray-300 max-w-xs truncate">
                        {jornada.laborRealizada || "No especificada"}
                      </p>
                    </TooltipTrigger>
                    {jornada.laborRealizada && (
                      <TooltipContent>
                        <p className="max-w-md">{jornada.laborRealizada}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-blue-100 dark:hover:bg-blue-900/30"
                    onClick={() => handleViewDetails(jornada)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={() => handleEditJornada(jornada)}
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ModalViewDetailsJornada
        openViewDetails={openViewDetails}
        setOpenViewDetails={setOpenViewDetails}
        selectedJornada={selectedJornada}
      />
    </div>
  );
};

export default TableJornadaTrabajadores;
