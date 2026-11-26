import { ProductoAnimal } from "@/api/market-animales/interfaces/response-market-animales.interface";
import { useMarketplaceGuardadosStore } from "@/providers/store/marketplaceGuardadosStore";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";

export const useMarketplaceGuardados = () => {
  const t = useTranslations("marketPlaceSavedMessages");

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
        toast.success(t("saved", { name: producto.nombre }));
      } else {
        toast.info(t("removed", { name: producto.nombre }));
      }
    }
  };

  const handleRemoverGuardado = (
    productoId: string,
    productoNombre: string,
  ) => {
    removerGuardado(productoId);
    toast.info(t("removed", { name: productoNombre }));
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
