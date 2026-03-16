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
import ButtonBack from "@/components/generics/ButtonBack";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";

const PreciosProductosPage = () => {
  const { data: productos, isLoading } = useGetProductoVenta();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [openModal, setOpenModal] = useState(false);
  const [productoToEdit, setProductoToEdit] =
    useState<ResponseProductosVenta | null>(null);

  const handleAgregarClick = () => {
    setProductoToEdit(null);
    setOpenModal(true);
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
      <ButtonBack isMobil={isMobile} />
      <div className="block md:flex md:justify-between">
        <h1 className="text-xl text-center md:text-3xl font-bold">
          Productos de Venta
        </h1>
        <div className="flex justify-center">
          <Button className="w-full" onClick={handleAgregarClick}>
            Agregar Producto +
          </Button>
        </div>
      </div>

      <div className="mt-5 mb-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {productos?.map((producto) => (
            <div key={producto.id}>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEditarClick(producto)}
                className="bg-white shadow-sm hover:bg-gray-100 mt-2 mb-2"
              >
                ✏️ Editar Producto
              </Button>

              <CardProducto producto={producto} />
            </div>
          ))}
        </div>
      </div>

      <AlertDialog open={openModal} onOpenChange={handleCloseModal}>
        <AlertDialogContent className="sm:max-w-md">
          <div className="flex justify-end">
            <AlertDialogCancel className="border-none hover:bg-gray-100">
              ✕
            </AlertDialogCancel>
          </div>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {productoToEdit ? "Editar Producto" : "Agregar Nuevo Producto"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {productoToEdit
                ? `Modifica los datos del producto: ${productoToEdit.nombre}`
                : "Completa los campos para agregar un nuevo producto"}
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
