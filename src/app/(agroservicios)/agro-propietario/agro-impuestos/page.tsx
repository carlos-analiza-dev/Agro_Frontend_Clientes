"use client";

import { useState } from "react";
import { Receipt } from "lucide-react";

import TitlePage from "@/components/generics/TitlePage";
import ButtonAdd from "@/components/generics/ButtonAdd";

import { useAuthStore } from "@/providers/store/useAuthStore";
import useGetImpuestosByAgroservicio from "@/hooks/agroservicios/impuestos/useGetImpuestosByAgroservicio";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Modal from "@/components/generics/Modal";
import FormImpuestos from "@/components/agroservicio/impuestos/FormImpuestos";
import TableImpuestosProductos from "@/components/agroservicio/impuestos/TableImpuestosProductos";
import { ImpuestosAgroProductosInterface } from "@/api/agroservicio/impuestos/interface/response-impuestos-agroservicio.interface";

const AgroImpuestosPage = () => {
  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
  const [openModalImpuesto, setOpenModalImpuesto] = useState(false);
  const [editImpuesto, setEditImpuesto] =
    useState<ImpuestosAgroProductosInterface | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const { data: impuestos = [], isLoading } =
    useGetImpuestosByAgroservicio(propietarioId);

  const handleEditImpuesto = (impuesto: ImpuestosAgroProductosInterface) => {
    setOpenModalImpuesto(true);
    setIsEdit(true);
    setEditImpuesto(impuesto);
  };

  return (
    <div id="impuestos-page" className="container mx-auto space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <TitlePage Icon={Receipt} title="Control de Impuestos" />

        <ButtonAdd
          title="Agregar Impuesto"
          Icon={Receipt}
          action={() => setOpenModalImpuesto(true)}
          className="w-full bg-green-600 hover:bg-green-700 md:w-auto"
          id="add-impuesto"
        />
      </div>

      <Card id="tabla-impuestos">
        <CardHeader>
          <CardTitle>Impuestos registrados</CardTitle>
          <CardDescription>
            Administra los impuestos disponibles para tu agroservicio.
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0">
          <TableImpuestosProductos
            isLoading={isLoading}
            impuestos={impuestos}
            handleEditImpuesto={handleEditImpuesto}
          />
        </CardContent>
      </Card>
      <Modal
        open={openModalImpuesto}
        onOpenChange={setOpenModalImpuesto}
        title={isEdit ? "Editar Impuesto" : "Nuevo Impuesto"}
        description={
          isEdit
            ? "Actualiza el nombre o porcentaje del impuesto."
            : "Crea un impuesto para aplicarlo a los productos comercializados en tu agroservicio."
        }
        size="xl"
        height="auto"
        showCloseButton={false}
      >
        <FormImpuestos
          editImpuesto={editImpuesto}
          isEdit={isEdit}
          isPropietario={true}
          onSuccess={() => {
            setOpenModalImpuesto(false);
            setIsEdit(false);
            setEditImpuesto(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default AgroImpuestosPage;
