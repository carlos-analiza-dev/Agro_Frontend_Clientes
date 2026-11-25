"use client";

import { useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import ButtonAdd from "@/components/generics/ButtonAdd";
import TitlePage from "@/components/generics/TitlePage";
import useGetAgroInsumos from "@/hooks/agroservicios/insumos/useGetAgroInsumos";
import useGetAllProveedores from "@/hooks/agroservicios/proveedores/useGetAllProveedores";
import { FlaskConical, Filter } from "lucide-react";
import Paginacion from "@/components/generics/Paginacion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import SkeletonPage from "@/components/generics/SkeletonPage";
import TableAgroInsumos from "@/components/agroservicio/insumos/TableAgroInsumos";
import { AgroInsumo } from "@/api/agroservicio/insumos/interfaces/response-agro-insumos.interface";
import Modal from "@/components/generics/Modal";
import FormAgroInsumos from "@/components/agroservicio/insumos/FormAgroInsumos";
import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";

const ALL_PROVEEDORES = "all";

const AgroInsumosPage = () => {
  const t = useTranslations("agroInsumosPage");

  const { empleado } = useAuthEmpleadoStore();
  const propietarioId = empleado?.agroservicio.propietario.id ?? "";
  const moneda = empleado?.pais.simbolo_moneda ?? "$";

  const [isEdit, setIsEdit] = useState(false);
  const [selectInsumo, setSelectInsumo] = useState<AgroInsumo | null>(null);
  const [openModalForm, setOpenModalForm] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);
  const [filterProveedor, setFilterProveedor] = useState(ALL_PROVEEDORES);

  const { data: proveedores } = useGetAllProveedores(propietarioId);

  const params = useMemo(() => {
    const p: any = {
      limit,
      offset: (currentPage - 1) * limit,
    };

    if (filterProveedor !== ALL_PROVEEDORES) {
      p.proveedor = filterProveedor;
    }

    return p;
  }, [limit, currentPage, filterProveedor]);

  const { data: insumosData, isLoading } = useGetAgroInsumos(
    propietarioId,
    params,
  );

  const totalPages = useMemo(() => {
    if (!insumosData?.total) return 1;
    return Math.ceil(insumosData.total / limit);
  }, [insumosData?.total, limit]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleProveedorChange = (value: string) => {
    setFilterProveedor(value);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilterProveedor("");
    setCurrentPage(1);
  };

  const handleEditInsumo = (insumo: AgroInsumo) => {
    setIsEdit(true);
    setOpenModalForm(true);
    setSelectInsumo(insumo);
  };

  if (isLoading) {
    return <SkeletonPage />;
  }

  return (
    <div id="insumos-page" className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="md:flex justify-between items-start gap-4">
        <TitlePage
          Icon={FlaskConical}
          title={t("title")}
          description={t("description")}
        />

        <ButtonAdd
          id="add-insumos"
          title={t("buttons.add")}
          Icon={FlaskConical}
          action={() => setOpenModalForm(true)}
          className="bg-green-600 hover:bg-green-700 w-full md:w-auto mt-4 md:mt-0"
        />
      </div>

      <Card id="filtros-insumos">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={filterProveedor}
              onValueChange={handleProveedorChange}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("filters.allProviders")} />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value={ALL_PROVEEDORES}>
                  {t("filters.allProviders")}
                </SelectItem>

                {proveedores?.map((proveedor) => (
                  <SelectItem key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre_legal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => clearFilters()}>
              {t("filters.clear")}
              <Filter />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card id="tabla-insumos-agro">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>{t("list.title")}</CardTitle>
              <CardDescription>
                {t("list.total", { total: insumosData?.total || 0 })}
              </CardDescription>
            </div>

            <Badge variant="outline" className="text-sm">
              {t("list.displayed", {
                count: insumosData?.insumos?.length || 0,
              })}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <TableAgroInsumos
              insumosData={insumosData}
              handleEditInsumo={handleEditInsumo}
              moneda={moneda}
              propietarioId={propietarioId}
            />
          </div>

          {insumosData?.insumos && insumosData.insumos.length > 0 && (
            <div className="mt-6 flex justify-center">
              <Paginacion
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardContent>
      </Card>

      <Modal
        open={openModalForm}
        onOpenChange={setOpenModalForm}
        title={isEdit ? t("modal.editTitle") : t("modal.addTitle")}
        description={
          isEdit ? t("modal.editDescription") : t("modal.addDescription")
        }
        height="auto"
        size="xl"
        showCloseButton={isEdit ? false : true}
      >
        <FormAgroInsumos
          isEmpleado={true}
          propietarioId={propietarioId}
          Success={() => {
            setOpenModalForm(false);
            setSelectInsumo(null);
            setIsEdit(false);
          }}
          editInsumo={selectInsumo}
          isEdit={isEdit}
        />
      </Modal>
    </div>
  );
};

export default AgroInsumosPage;
