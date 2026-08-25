import { Tratamiento } from "@/api/historial-clinico/interface/response-tratamientos-animal.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/helpers/funciones/formatDate";
import { Clock, Download, LucideProps } from "lucide-react";
import React from "react";

interface Props {
  estado: {
    texto: string;
    color: string;
    icono: React.ForwardRefExoticComponent<
      Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
    >;
  };
  tratamiento: Tratamiento;
  IconoEstado: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

const CardTratamientos = ({ estado, tratamiento, IconoEstado }: Props) => {
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
              <Badge className={estado.color}>
                <IconoEstado className="h-3 w-3 mr-1" />
                {estado.texto}
              </Badge>
              <Badge variant="secondary">
                {tratamiento.subServicio?.nombre}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg">
              {tratamiento.subServicio?.codigo}
            </h3>
            <p className="text-sm text-gray-600">
              {tratamiento.subServicio?.descripcion}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDate(tratamiento.createdAt)}
            </p>
            <p className="text-xs text-gray-400">
              Actualizado: {formatDate(tratamiento.updatedAt)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {tratamiento.diagnostico && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Diagnóstico:
              </p>
              <p className="text-sm text-gray-600 bg-red-50 p-3 rounded-lg">
                {tratamiento.diagnostico}
              </p>
            </div>
          )}

          {tratamiento.tratamiento && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">
                Tratamiento Aplicado:
              </p>
              <p className="text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                {tratamiento.tratamiento}
              </p>
            </div>
          )}
        </div>

        {tratamiento.observaciones && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Observaciones:
            </p>
            <p className="text-sm text-gray-600 bg-yellow-50 p-3 rounded-lg">
              {tratamiento.observaciones}
            </p>
          </div>
        )}

        {tratamiento.documentos && tratamiento.documentos.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Documentos Adjuntos:
            </p>
            <div className="flex flex-wrap gap-2">
              {tratamiento.documentos.map((doc) => (
                <Button
                  id="btn-download-doc-tratamiento"
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
      </CardContent>
    </Card>
  );
};

export default CardTratamientos;
