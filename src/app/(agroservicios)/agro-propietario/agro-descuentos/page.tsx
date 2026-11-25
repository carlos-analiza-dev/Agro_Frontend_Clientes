"use client";

import ButtonAdd from "@/components/generics/ButtonAdd";
import TitlePage from "@/components/generics/TitlePage";
import useGetDescuentosByAgroservicio from "@/hooks/agroservicios/descuentos/useGetDescuentosByAgroservicio";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useTranslations } from "next-intl";
import { BadgePercent, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TableDescuentosAgro from "@/components/agroservicio/descuentos/TableDescuentosAgro";
import SkeletonTable from "@/components/generics/SkeletonTable";
import { useState } from "react";
import { ResponseDescuentosAgroInterface } from "@/api/agroservicio/descuentos/interface/response-descuentos-agro.interface";
import Modal from "@/components/generics/Modal";
import FormDescuentosAgro from "@/components/agroservicio/descuentos/FormDescuentosAgro";

const DsescuentosAgroPage = () => {
  const t = useTranslations("agroDescuentosPage");
  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
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
    <div
      id="descuentos-page"
      className="container mx-auto space-y-6 p-4 md:p-6"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <TitlePage
          Icon={BadgePercent}
          title={t("title")}
          description={t("description")}
        />

        <ButtonAdd
          id="add-descuento"
          title={t("buttons.add")}
          Icon={BadgePercent}
          action={handleAdd}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 md:w-auto"
        />
      </div>

      <Card
        id="tabla-descuentos"
        className="border-0 shadow-xl bg-white/80 backdrop-blur-sm"
      >
        <CardHeader className="border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white rounded-t-xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-gray-800">
              {t("list.title")}
              {descuentos && descuentos.length > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-3 bg-blue-100 text-blue-700"
                >
                  {descuentos.length}{" "}
                  {descuentos.length === 1
                    ? t("list.discount")
                    : t("list.discounts")}
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
              <AlertTitle>{t("error.title")}</AlertTitle>
              <AlertDescription>{t("error.description")}</AlertDescription>
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
                {t("empty.title")}
              </h3>

              <p className="text-gray-500 mb-6">{t("empty.description")}</p>

              <Button
                onClick={handleAdd}
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
              >
                <BadgePercent className="h-4 w-4 mr-2" />
                {t("buttons.add")}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-xs text-gray-500 text-center border-t border-gray-200 pt-4">
        <p>{t("footer")}</p>
      </div>

      <Modal
        open={openModalForm}
        onOpenChange={setOpenModalForm}
        title={isEdit ? t("modal.editTitle") : t("modal.createTitle")}
        description={
          isEdit ? t("modal.editDescription") : t("modal.createDescription")
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
          isPropietario={true}
        />
      </Modal>
    </div>
  );
};

export default DsescuentosAgroPage;
