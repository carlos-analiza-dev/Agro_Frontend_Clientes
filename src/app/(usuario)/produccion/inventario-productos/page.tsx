"use client";

import useGetInventarioProductos from "@/hooks/inventario-productos/useGetInventarioProductos";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import TableProductsInventario from "./ui/TableProductsInventario";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useFincasPropietarios } from "@/hooks/fincas/useFincasPropietarios";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SkeletonTable from "@/components/generics/SkeletonTable";
import Paginacion from "@/components/generics/Paginacion";
import Modal from "@/components/generics/Modal";
import FormProductosGanaderia from "./ui/FormProductosGanaderia";
import { useTranslations } from "next-intl";

const InventarioProductos = () => {
  const t = useTranslations("inventarioProductos");

  const { cliente } = useAuthStore();
  const clienteId = cliente?.id ?? "";
  const [limit, setLimit] = useState(10);
  const [offset, setOffset] = useState(0);
  const [fincaSelected, setFincaSelected] = useState("todas");
  const [onOpenModal, setOnOpenModal] = useState(false);

  const fincaId = fincaSelected === "todas" ? "" : fincaSelected;

  const { data: inventarioData, isLoading } = useGetInventarioProductos(
    limit,
    offset,
    fincaId,
  );

  const { data: fincas } = useFincasPropietarios(clienteId);

  const inventario = inventarioData?.data || [];
  const total = inventarioData?.total || 0;
  const totalPages = Math.ceil(total / limit);
  const currentPage = Math.floor(offset / limit) + 1;

  const handlePageChange = (page: number) => {
    setOffset((page - 1) * limit);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-8 w-8 text-green-600" />
            {t("title")}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{t("description")}</p>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4">
            <div className="w-full sm:w-72">
              <Select
                value={fincaSelected}
                onValueChange={(value) => {
                  setFincaSelected(value);
                  setOffset(0);
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={t("farmPlaceholder")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>{t("farms")}</SelectLabel>
                    <SelectItem value="todas">{t("allFarms")}</SelectItem>
                    {fincas?.data.fincas.map((finca) => (
                      <SelectItem value={finca.id} key={finca.id}>
                        {finca.nombre_finca}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Button className="w-full" onClick={() => setOnOpenModal(true)}>
                {t("buttons.add")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">{t("inventory.title")}</CardTitle>
          <CardDescription>
            {t("inventory.description", {
              count: inventario.length,
              showing: Math.min(limit, inventario.length),
              total,
            })}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {isLoading ? (
            <SkeletonTable />
          ) : inventario.length > 0 ? (
            <div className="overflow-x-auto">
              <TableProductsInventario inventario={inventario} />
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {t("empty.title")}
              </h3>
              <p className="text-gray-500 mb-4">{t("empty.description")}</p>
              <Button onClick={() => setOnOpenModal(true)}>
                {t("buttons.addProduct")}
              </Button>
            </div>
          )}
        </CardContent>

        {totalPages > 1 && (
          <CardFooter className="flex flex-col sm:flex-row justify-between items-center gap-4 border-t pt-6">
            <div className="text-sm text-gray-500">
              {t("pagination.description", {
                start: offset + 1,
                end: Math.min(offset + limit, total),
                total,
              })}
            </div>

            <Paginacion
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </CardFooter>
        )}
      </Card>

      <Modal
        open={onOpenModal}
        onOpenChange={setOnOpenModal}
        title={t("modal.title")}
        description={t("modal.description")}
        size="lg"
      >
        <FormProductosGanaderia onSuccess={() => setOnOpenModal(false)} />
      </Modal>
    </div>
  );
};

export default InventarioProductos;
