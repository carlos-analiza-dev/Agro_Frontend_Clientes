import { Jornada } from "@/api/jornadas-trabajador/interface/response-jornadas.interface";
import Modal from "@/components/generics/Modal";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/helpers/funciones/formatDate";
import { getHorasExtras } from "@/helpers/funciones/getHorasExtras";
import {
  CalendarIcon,
  UserIcon,
  ClipboardListIcon,
  ClockIcon,
  MoonIcon,
  SunIcon,
  StarIcon,
  AlertCircleIcon,
  CheckCircle2Icon,
  XCircleIcon,
  PhoneIcon,
  MailIcon,
  MapPinIcon,
  IdCardIcon,
  BriefcaseIcon,
} from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface Props {
  openViewDetails: boolean;
  setOpenViewDetails: Dispatch<SetStateAction<boolean>>;
  selectedJornada: Jornada | null;
}

const ModalViewDetailsJornada = ({
  selectedJornada,
  openViewDetails,
  setOpenViewDetails,
}: Props) => {
  if (!selectedJornada) return null;

  const horasExtras = getHorasExtras(selectedJornada);

  return (
    <Modal
      open={openViewDetails}
      onOpenChange={setOpenViewDetails}
      title="Detalles de la Jornada"
      description="Información detallada de la jornada laboral del trabajador"
      size="3xl"
      height="auto"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              {selectedJornada.trabajo ? (
                <>
                  <CheckCircle2Icon className="h-5 w-5 text-green-500" />
                  <Badge className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300 hover:bg-green-100">
                    Trabajó
                  </Badge>
                </>
              ) : (
                <>
                  <XCircleIcon className="h-5 w-5 text-red-500" />
                  <Badge className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 hover:bg-red-100">
                    No Trabajó
                  </Badge>
                </>
              )}
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <UserIcon className="h-5 w-5 text-blue-500" />
              Información del Trabajador
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <UserIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Nombre Completo</p>
                  <p className="font-medium">
                    {selectedJornada.trabajador.nombre}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <IdCardIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Identificación</p>
                  <p className="font-medium">
                    {selectedJornada.trabajador.identificacion}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <PhoneIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-medium">
                    {selectedJornada.trabajador.telefono || "No registrado"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MailIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">
                    {selectedJornada.trabajador.email || "No registrado"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPinIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Ubicación</p>
                  <p className="font-medium">
                    {selectedJornada.trabajador.municipio?.nombre},{" "}
                    {selectedJornada.trabajador.departamento?.nombre},{" "}
                    {selectedJornada.trabajador.pais?.nombre}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BriefcaseIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Rol</p>
                  <p className="font-medium capitalize">
                    {selectedJornada.trabajador.rol}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-green-500" />
              Detalles de la Jornada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CalendarIcon className="h-4 w-4 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-500">Fecha</p>
                  <p className="font-medium">
                    {formatDate(selectedJornada.fecha)}
                  </p>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <ClipboardListIcon className="h-4 w-4 text-blue-500" />
                <h3 className="font-semibold">Labor Realizada</h3>
              </div>
              <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                <p className="text-sm whitespace-pre-wrap">
                  {selectedJornada.laborRealizada || "No especificada"}
                </p>
              </div>
            </div>

            {horasExtras.length > 0 && (
              <>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <ClockIcon className="h-4 w-4 text-orange-500" />
                    <h3 className="font-semibold">Horas Extras</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {horasExtras.map((hora, index) => (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-3 rounded-lg ${hora.bgColor}`}
                      >
                        <div className="flex items-center gap-2">
                          <hora.icon className={`h-4 w-4 ${hora.color}`} />
                          <span className="text-sm font-medium">
                            {hora.type}
                          </span>
                        </div>
                        <Badge variant="outline" className="font-mono">
                          {hora.value} horas
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {selectedJornada.observaciones && (
              <>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertCircleIcon className="h-4 w-4 text-yellow-500" />
                    <h3 className="font-semibold">Observaciones</h3>
                  </div>
                  <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-900">
                    <p className="text-sm whitespace-pre-wrap">
                      {selectedJornada.observaciones}
                    </p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </Modal>
  );
};

export default ModalViewDetailsJornada;
