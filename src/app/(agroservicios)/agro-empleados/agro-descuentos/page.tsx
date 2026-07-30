"use client";

import ButtonAdd from "@/components/generics/ButtonAdd";
import TitlePage from "@/components/generics/TitlePage";
import useGetDescuentosByAgroservicio from "@/hooks/agroservicios/descuentos/useGetDescuentosByAgroservicio";
import { BadgePercent } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import TableDescuentosAgro from "@/components/agroservicio/descuentos/TableDescuentosAgro";
import SkeletonTable from "@/components/generics/SkeletonTable";
import { useState } from "react";
import { ResponseDescuentosAgroInterface } from "@/api/agroservicio/descuentos/interface/response-descuentos-agro.interface";
import Modal from "@/components/generics/Modal";
import FormDescuentosAgro from "@/components/agroservicio/descuentos/FormDescuentosAgro";
import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";

const DsescuentosAgroPage = () => {
  const { empleado } = useAuthEmpleadoStore();
  const propietarioId = empleado?.agroservicio.propietario.id ?? "";
  const [openModalForm, setOpenModalForm] = useState(false);
  const [selectedDescuento, setSelectedDescuento] =
    useState<ResponseDescuentosAgroInterface | null>(null);
  const [isEdit, setIsEdit] = useState(false);
  const {
    data: descuentos,
    isLoading,
    error,
  } = useGetDescuentosByAgroservicio(propietarioId);

  const handleEdit = (descuento: ResponseDescuentosAgroInterface) => {
    setSelectedDescuento(descuento);
    setIsEdit(true);
    setOpenModalForm(true);
  };

  const handleAdd = () => {
    setOpenModalForm(true);
  };

  return (
    <div className="container mx-auto space-y-6 p-4 md:p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <TitlePage
          Icon={BadgePercent}
          title="Control de Descuentos para Clientes"
          description="Gestiona los descuentos disponibles para tus clientes"
        />

        <ButtonAdd
          title="Agregar Descuento"
          Icon={BadgePercent}
          action={handleAdd}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 md:w-auto"
        />
      </div>

      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-sm">
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800">
              Lista de Descuentos
              {descuentos && descuentos.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-3 bg-blue-100 text-blue-700"
                >
                  {descuentos.length}{" "}
                  {descuentos.length === 1 ? "descuento" : "descuentos"}
                </Badge>
              )}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading && <SkeletonTable />}

          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                No se pudieron cargar los descuentos. Por favor, intenta de
                nuevo.
              </AlertDescription>
            </Alert>
          )}

          {!isLoading && !error && descuentos && descuentos.length > 0 && (
            <div className="overflow-x-auto">
              <TableDescuentosAgro
                descuentos={descuentos}
                handleEdit={handleEdit}
              />
            </div>
          )}

          {!isLoading && !error && descuentos && descuentos.length === 0 && (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 rounded-full p-4">
                  <BadgePercent className="h-12 w-12 text-gray-400" />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No hay descuentos registrados
              </h3>
              <p className="text-gray-500 mb-6">
                Comienza agregando tu primer descuento para tus clientes.
              </p>
              <Button
                onClick={handleAdd}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                <BadgePercent className="h-4 w-4 mr-2" />
                Agregar Descuento
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-gray-500 text-center border-t border-gray-200 pt-4">
        <p>
          Los descuentos se aplican automáticamente a los clientes según las
          reglas configuradas.
        </p>
      </div>

      <Modal
        open={openModalForm}
        onOpenChange={setOpenModalForm}
        title={isEdit ? "Editar Descuento" : "Nuevo Descuento"}
        description={
          isEdit
            ? "Actualiza el nombre o porcentaje del descuento."
            : "Crea un descuento para aplicarlo a los productos comercializados en tu agroservicio."
        }
        size="xl"
        height="auto"
        showCloseButton={false}
      >
        <FormDescuentosAgro
          editDescuento={selectedDescuento}
          isEdit={isEdit}
          onSuccess={() => {
            setOpenModalForm(false);
            setSelectedDescuento(null);
            setIsEdit(false);
          }}
          isPropietario={false}
        />
      </Modal>
    </div>
  );
};

export default DsescuentosAgroPage;
