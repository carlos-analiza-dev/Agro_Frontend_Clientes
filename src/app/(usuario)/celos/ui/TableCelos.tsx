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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, Calendar, MapPin, Tag, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { Dispatch, SetStateAction } from "react";
import RenderIntensidadBadge from "./RenderIntensidadBadge";
import {
  Celo,
  ResponseCelosAnimalInterface,
} from "@/api/reproduccion/interfaces/response-celos-animal,interface";
import Modal from "@/components/generics/Modal";
import DetailsCelo from "./DetailsCelo";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";

interface Props {
  data: ResponseCelosAnimalInterface | undefined;
  setSelectedCelo: Dispatch<SetStateAction<Celo | null>>;
  setDetalleOpen: Dispatch<SetStateAction<boolean>>;
  detalleOpen: boolean;
  selectedCelo: Celo | null;
}

const TableCelos = ({
  data,
  setSelectedCelo,
  setDetalleOpen,
  detalleOpen,
  selectedCelo,
}: Props) => {
  const isExtraSmall = useMediaQuery("(max-width: 400px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const isTablet = useMediaQuery("(min-width: 641px) and (max-width: 1024px)");

  const MobileView = () => (
    <div className="space-y-3 p-4">
      {data?.celos?.map((celo) => (
        <Card key={celo.id} className="overflow-hidden">
          <CardHeader className="p-4 pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-base flex items-center gap-2">
                  {celo.animal.identificador}
                  <Badge variant="outline" className="text-xs">
                    N° {celo.numeroCelo}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-xs mt-1">
                  {celo.animal.especie.nombre} •{" "}
                  {celo.animal.finca.nombre_finca}
                </CardDescription>
              </div>
              <RenderIntensidadBadge intensidad={celo.intensidad} />
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2 pb-2">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs">Inicio</span>
                </div>
                <p className="text-xs font-medium">
                  {format(new Date(celo.fechaInicio), "dd/MM/yy HH:mm")}
                </p>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Calendar className="h-3 w-3" />
                  <span className="text-xs">Fin</span>
                </div>
                {celo.fechaFin ? (
                  <p className="text-xs font-medium">
                    {format(new Date(celo.fechaFin), "dd/MM/yy HH:mm")}
                  </p>
                ) : (
                  <Badge variant="secondary" className="text-xs">
                    Activo
                  </Badge>
                )}
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {celo.metodo_deteccion}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  setSelectedCelo(celo);
                  setDetalleOpen(true);
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const TabletView = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Animal</TableHead>
            <TableHead>Especie/Finca</TableHead>
            <TableHead>Periodo</TableHead>
            <TableHead>N°</TableHead>
            <TableHead>Intensidad</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.celos?.map((celo) => (
            <TableRow key={celo.id}>
              <TableCell className="font-medium">
                {celo.animal.identificador}
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{celo.animal.especie.nombre}</div>
                  <div className="text-xs text-muted-foreground">
                    {celo.animal.finca.nombre_finca}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-sm">
                  <div>{format(new Date(celo.fechaInicio), "dd/MM HH:mm")}</div>
                  <div className="text-xs text-muted-foreground">
                    {celo.fechaFin ? (
                      format(new Date(celo.fechaFin), "dd/MM HH:mm")
                    ) : (
                      <Badge variant="secondary" className="text-xs">
                        Activo
                      </Badge>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell>{celo.numeroCelo}</TableCell>
              <TableCell>
                <RenderIntensidadBadge intensidad={celo.intensidad} />
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCelo(celo);
                    setDetalleOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const DesktopView = () => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Animal</TableHead>
            <TableHead>Especie</TableHead>
            <TableHead>Finca</TableHead>
            <TableHead>Inicio</TableHead>
            <TableHead>Fin</TableHead>
            <TableHead>N° Celo</TableHead>
            <TableHead>Intensidad</TableHead>
            <TableHead>Método</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.celos?.map((celo) => (
            <TableRow key={celo.id}>
              <TableCell className="font-medium whitespace-nowrap">
                {celo.animal.identificador}
              </TableCell>
              <TableCell>{celo.animal.especie.nombre}</TableCell>
              <TableCell className="whitespace-nowrap">
                {celo.animal.finca.nombre_finca}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {format(new Date(celo.fechaInicio), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {celo.fechaFin ? (
                  format(new Date(celo.fechaFin), "dd/MM/yyyy HH:mm")
                ) : (
                  <Badge variant="secondary">Activo</Badge>
                )}
              </TableCell>
              <TableCell>{celo.numeroCelo}</TableCell>
              <TableCell>
                <RenderIntensidadBadge intensidad={celo.intensidad} />
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {celo.metodo_deteccion}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedCelo(celo);
                    setDetalleOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );

  const ExtraSmallMobileView = () => (
    <div className="space-y-2 p-2">
      {data?.celos?.map((celo) => (
        <div
          key={celo.id}
          className="bg-card border rounded-lg p-3"
          onClick={() => {
            setSelectedCelo(celo);
            setDetalleOpen(true);
          }}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2">
              <div className="font-medium text-sm">
                {celo.animal.identificador}
              </div>
              <Badge variant="outline" className="text-[10px] px-1">
                #{celo.numeroCelo}
              </Badge>
            </div>
            <RenderIntensidadBadge intensidad={celo.intensidad} />
          </div>

          <div className="grid grid-cols-2 gap-1 text-xs text-muted-foreground mb-1">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span className="truncate">{celo.animal.finca.nombre_finca}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              <span className="truncate">{celo.animal.especie.nombre}</span>
            </div>
          </div>

          <div className="flex justify-between items-center text-xs">
            <div className="flex items-center gap-2">
              <span>{format(new Date(celo.fechaInicio), "dd/MM")}</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground" />
              <span>
                {celo.fechaFin
                  ? format(new Date(celo.fechaFin), "dd/MM")
                  : "Actual"}
              </span>
            </div>
            <Badge variant="secondary" className="text-[10px]">
              {celo.metodo_deteccion}
            </Badge>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <>
      {isExtraSmall ? (
        <ExtraSmallMobileView />
      ) : isMobile ? (
        <MobileView />
      ) : isTablet ? (
        <TabletView />
      ) : (
        <DesktopView />
      )}

      <Modal
        open={detalleOpen}
        onOpenChange={setDetalleOpen}
        title="Detalles del Celo"
        description="Información completa del registro de celo"
        size={isMobile ? "full" : "lg"}
        className={isMobile ? "p-4" : ""}
      >
        {selectedCelo && <DetailsCelo selectedCelo={selectedCelo} />}
      </Modal>
    </>
  );
};

export default TableCelos;
