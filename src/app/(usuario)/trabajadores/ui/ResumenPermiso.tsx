import { ResponsePermisosInterface } from "@/api/permisos/interface/response-permisos.interface";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { useTranslations } from "next-intl";

interface Props {
  permisos_cliente: ResponsePermisosInterface[];
}

const ResumenPermiso = ({ permisos_cliente }: Props) => {
  const t = useTranslations("resumenPermiso");

  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold mb-2">{t("title")}</h4>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <Badge variant="secondary" className="justify-center">
          {t("modules")}: {permisos_cliente.length}
        </Badge>

        <Badge variant="secondary" className="justify-center">
          {t("view")}: {permisos_cliente.filter((p) => p.ver).length}
        </Badge>

        <Badge variant="secondary" className="justify-center">
          {t("create")}: {permisos_cliente.filter((p) => p.crear).length}
        </Badge>

        <Badge variant="secondary" className="justify-center">
          {t("edit")}: {permisos_cliente.filter((p) => p.editar).length}
        </Badge>
      </div>
    </div>
  );
};

export default ResumenPermiso;
