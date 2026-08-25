import { Historial } from "@/api/historial-clinico/interface/response-historial-veterinario.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/helpers/funciones/formatDate";
import { Clock, Download } from "lucide-react";

interface Props {
  historial: Historial;
}

const CardHistorialClinico = ({ historial }: Props) => {
  const descargarDocumento = (url: string, nombre: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = nombre;
    link.target = "_blank";
    link.click();
  };
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="pt-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary">
                {historial.animal?.identificador}
              </Badge>
              <Badge>{historial.animal?.especie?.nombre}</Badge>
              <Badge variant="outline">
                {historial.animal?.razas?.[0]?.nombre}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg">
              {historial.cita?.subServicio?.nombre}
            </h3>
            <p className="text-sm text-gray-600">
              {historial.cita?.finca?.nombre_finca}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(historial.createdAt)}
            </p>
            <p className="text-xs text-gray-400">
              Por: {historial.veterinario?.name}
            </p>
          </div>
        </div>

        {historial.resumen && (
          <div className="mb-4">
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">
              {historial.resumen}
            </p>
          </div>
        )}

        <div className="space-y-3">
          {historial.detalles?.map((detalle, index) => (
            <div key={detalle.id} className="border-l-4 border-blue-500 pl-4">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">
                  {detalle.subServicio?.nombre || `Procedimiento ${index + 1}`}
                </h4>
                <Badge variant="outline" className="text-xs">
                  {formatDate(detalle.createdAt)}
                </Badge>
              </div>

              {detalle.diagnostico && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    Diagnóstico:
                  </p>
                  <p className="text-sm text-gray-600">{detalle.diagnostico}</p>
                </div>
              )}

              {detalle.tratamiento && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    Tratamiento:
                  </p>
                  <p className="text-sm text-gray-600">{detalle.tratamiento}</p>
                </div>
              )}

              {detalle.observaciones && (
                <div className="mb-2">
                  <p className="text-sm font-medium text-gray-700">
                    Observaciones:
                  </p>
                  <p className="text-sm text-gray-600">
                    {detalle.observaciones}
                  </p>
                </div>
              )}

              {detalle.documentos && detalle.documentos.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-700 mb-1">
                    Documentos:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {detalle.documentos.map((doc) => (
                      <Button
                        id="btn-download-historial"
                        key={doc.id}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => descargarDocumento(doc.url, doc.nombre)}
                      >
                        <Download className="h-3 w-3" />
                        {doc.nombre}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p>
              <strong>Veterinario:</strong> {historial.veterinario?.name}
            </p>
            <p>
              <strong>Email:</strong> {historial.veterinario?.email}
            </p>
          </div>
          <div>
            <p>
              <strong>Teléfono:</strong> {historial.veterinario?.telefono}
            </p>
            <p>
              <strong>Cita:</strong> {historial.cita?.codigo}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CardHistorialClinico;
