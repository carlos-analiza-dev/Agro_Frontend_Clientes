import { ResponsePermisosInterface } from "@/api/permisos/interface/response-permisos.interface";
import { Badge } from "@/components/ui/badge";
import React from "react";

interface Props {
  permisos_cliente: ResponsePermisosInterface[];
}

const ResumenPermiso = ({ permisos_cliente }: Props) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold mb-2">Resumen de Permisos</h4>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Badge variant="secondary" className="justify-center">
          Módulos: {permisos_cliente.length}
        </Badge>
        <Badge variant="secondary" className="justify-center">
          Ver: {permisos_cliente.filter((p) => p.ver).length}
        </Badge>
        <Badge variant="secondary" className="justify-center">
          Crear: {permisos_cliente.filter((p) => p.crear).length}
        </Badge>
        <Badge variant="secondary" className="justify-center">
          Editar: {permisos_cliente.filter((p) => p.editar).length}
        </Badge>
      </div>
    </div>
  );
};

export default ResumenPermiso;
