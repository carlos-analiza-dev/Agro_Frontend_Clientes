import { ProductoAnimal } from "@/api/market-animales/interfaces/response-market-animales.interface";
import { useMarketplaceGuardadosStore } from "@/providers/store/marketplaceGuardadosStore";
import { toast } from "react-toastify";

export const useMarketplaceGuardados = () => {
  const {
    guardados,
    agregarGuardado,
    removerGuardado,
    toggleGuardado,
    esGuardado,
    obtenerGuardadosCount,
    limpiarGuardados,
    sincronizarGuardados,
  } = useMarketplaceGuardadosStore();

  const handleToggleGuardado = (producto: ProductoAnimal, showToast = true) => {
    const isSaved = esGuardado(producto.id);
    toggleGuardado(producto);

    if (showToast) {
      if (!isSaved) {
        toast.success(`${producto.nombre} guardado en tus publicaciones`);
      } else {
        toast.info(`${producto.nombre} eliminado de tus guardados`);
      }
    }
  };

  const handleRemoverGuardado = (
    productoId: string,
    productoNombre: string,
  ) => {
    removerGuardado(productoId);
    toast.info(`${productoNombre} eliminado de tus guardados`);
  };

  return {
    guardados,
    guardadosCount: obtenerGuardadosCount(),
    agregarGuardado,
    removerGuardado: handleRemoverGuardado,
    toggleGuardado: handleToggleGuardado,
    esGuardado,
    limpiarGuardados,
    sincronizarGuardados,
  };
};
