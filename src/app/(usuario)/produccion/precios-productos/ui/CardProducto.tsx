import { ResponseProductosVenta } from "@/api/productos-ganadero/interfaces/obtener-productos-precios.interface";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import FormPreciosProducto from "./FormPreciosProducto";

interface Props {
  producto: ResponseProductosVenta | undefined;
}

const CardProducto = ({ producto }: Props) => {
  const [openModal, setOpenModal] = useState(false);
  const [precioToEdit, setPrecioToEdit] = useState<
    ResponseProductosVenta["ventas"][0] | null
  >(null);

  if (!producto) return null;

  const handleAgregarClick = () => {
    setPrecioToEdit(null);
    setOpenModal(true);
  };

  const handleEditarClick = (precio: ResponseProductosVenta["ventas"][0]) => {
    setPrecioToEdit(precio);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setPrecioToEdit(null);
  };

  return (
    <div>
      <div className="w-full max-w-sm bg-neutral-primary-soft p-6 border border-default rounded-base shadow-xs">
        <div>
          <img
            className="rounded-base mb-6"
            src={`/images/tipos_de_${producto.categoria.toLowerCase()}.jpg`}
            alt="product image"
            onError={(e) => {
              e.currentTarget.src = "/images/tipos_de_default.jpg";
            }}
          />
        </div>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-xl text-heading font-semibold tracking-tight">
              {producto.nombre}
            </h5>
            <span className="text-sm font-medium text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
              {producto.categoria}
            </span>
          </div>

          <div className="mt-4 space-y-3">
            <h6 className="text-sm font-medium text-gray-500">
              Precios de venta:
            </h6>
            <div className="mt-2 mb-2">
              <Button variant="outline" onClick={handleAgregarClick}>
                Agregar Precio +
              </Button>
            </div>
            {producto.ventas.length > 0 ? (
              producto.ventas.map((venta) => (
                <div
                  key={venta.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group hover:border-gray-300 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-600">
                      {venta.unidadMedida}:
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-lg font-bold text-heading">
                      {venta.moneda} {parseFloat(venta.precio).toFixed(2)}
                    </span>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleEditarClick(venta)}
                      title="Editar precio"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-4 text-center bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-gray-500">No hay precios configurados</p>
                <p className="text-sm text-gray-400 mt-1">
                  Haz clic en "Agregar Precio +" para configurar uno
                </p>
              </div>
            )}
          </div>

          {producto.ventas && producto.ventas.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                *Precios por{" "}
                {producto.ventas
                  .map((v) => v.unidadMedida.toLowerCase())
                  .join(", ")}
              </p>
            </div>
          )}
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
              {precioToEdit ? "Editar Precio" : "Agregar Nuevo Precio"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {precioToEdit
                ? `Modifica el precio de venta para ${producto.nombre}`
                : `Configura un nuevo precio de venta para ${producto.nombre}`}
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="p-3">
            <FormPreciosProducto
              producto={producto}
              openModal={openModal}
              setOpenModal={setOpenModal}
              precioToEdit={precioToEdit}
              onSuccess={() => setPrecioToEdit(null)}
            />
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CardProducto;
