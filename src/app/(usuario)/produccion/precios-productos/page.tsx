"use client";

import { Button } from "@/components/ui/button";
import CardProducto from "./ui/CardProducto";
import useGetProductoVenta from "@/hooks/productos-venta-ganadero/useGetProductoVenta";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import FormAddProducto from "./ui/FormAddProducto";
import { ResponseProductosVenta } from "@/api/productos-ganadero/interfaces/obtener-productos-precios.interface";
import SkeletonCard from "@/components/generics/SkeletonCard";
import { MessageError } from "@/components/generics/MessageError";
import { useTranslations } from "next-intl";

const PreciosProductosPage = () => {
  const t = useTranslations("preciosProductosPage");

  const { data: productos, isLoading, refetch } = useGetProductoVenta();
  const [openModal, setOpenModal] = useState(false);
  const [productoToEdit, setProductoToEdit] =
    useState<ResponseProductosVenta | null>(null);

  const handleAgregarClick = () => {
    setProductoToEdit(null);
    setOpenModal(true);
  };

  const onPress = async () => {
    await refetch();
  };

  const handleEditarClick = (producto: ResponseProductosVenta) => {
    setProductoToEdit(producto);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setProductoToEdit(null);
  };

  if (isLoading) {
    return <SkeletonCard />;
  }

  return (
    <div className="container p-4">
      <div className="block md:flex md:justify-between">
        <h1 className="text-xl text-center md:text-3xl font-bold">
          {t("title")}
        </h1>

        <div className="flex justify-center">
          <Button className="w-full" onClick={handleAgregarClick}>
            {t("buttons.add")}
          </Button>
        </div>
      </div>

      <div className="mt-5 mb-5">
        {productos && productos.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {productos.map((producto) => (
              <div key={producto.id}>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleEditarClick(producto)}
                  className="bg-white shadow-sm hover:bg-gray-100 mt-2 mb-2"
                >
                  ✏️ {t("buttons.edit")}
                </Button>

                <CardProducto producto={producto} />
              </div>
            ))}
          </div>
        ) : (
          <MessageError
            titulo={t("empty.title")}
            descripcion={t("empty.description")}
            onPress={onPress}
          />
        )}
      </div>

      <AlertDialog open={openModal} onOpenChange={handleCloseModal}>
        <AlertDialogContent className="sm:max-w-md">
          <div className="flex justify-end">
            <AlertDialogCancel
              className="border-none hover:bg-gray-100"
              aria-label={t("buttons.close")}
            >
              ✕
            </AlertDialogCancel>
          </div>

          <AlertDialogHeader>
            <AlertDialogTitle>
              {productoToEdit ? t("modal.editTitle") : t("modal.addTitle")}
            </AlertDialogTitle>

            <AlertDialogDescription>
              {productoToEdit
                ? t("modal.editDescription", {
                    name: productoToEdit.nombre,
                  })
                : t("modal.addDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="p-3">
            <FormAddProducto
              openModal={openModal}
              setOpenModal={setOpenModal}
              productoToEdit={productoToEdit}
              onSuccess={() => setProductoToEdit(null)}
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PreciosProductosPage;
