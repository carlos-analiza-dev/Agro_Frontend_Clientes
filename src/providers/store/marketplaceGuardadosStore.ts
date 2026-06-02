import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductoAnimal } from "@/api/market-animales/interfaces/response-market-animales.interface";

interface MarketplaceGuardadosState {
  guardados: ProductoAnimal[];
  agregarGuardado: (producto: ProductoAnimal) => void;
  removerGuardado: (productoId: string) => void;
  toggleGuardado: (producto: ProductoAnimal) => void;
  esGuardado: (productoId: string) => boolean;
  obtenerGuardadosCount: () => number;
  limpiarGuardados: () => void;
  sincronizarGuardados: (
    guardadosIds: string[],
    productos: ProductoAnimal[],
  ) => void;
}

export const useMarketplaceGuardadosStore = create<MarketplaceGuardadosState>()(
  persist(
    (set, get) => ({
      guardados: [],

      agregarGuardado: (producto) => {
        set((state) => {
          if (state.guardados.some((guardado) => guardado.id === producto.id)) {
            return state;
          }
          return { guardados: [...state.guardados, producto] };
        });
      },

      removerGuardado: (productoId) => {
        set((state) => ({
          guardados: state.guardados.filter(
            (guardado) => guardado.id !== productoId,
          ),
        }));
      },

      toggleGuardado: (producto) => {
        const { esGuardado, agregarGuardado, removerGuardado } = get();
        if (esGuardado(producto.id)) {
          removerGuardado(producto.id);
        } else {
          agregarGuardado(producto);
        }
      },

      esGuardado: (productoId) => {
        return get().guardados.some((guardado) => guardado.id === productoId);
      },

      obtenerGuardadosCount: () => {
        return get().guardados.length;
      },

      limpiarGuardados: () => {
        set({ guardados: [] });
      },

      sincronizarGuardados: (guardadosIds, productos) => {
        const guardadosSincronizados = productos.filter((producto) =>
          guardadosIds.includes(producto.id),
        );
        set({ guardados: guardadosSincronizados });
      },
    }),
    {
      name: "marketplace-guardados-storage",
      partialize: (state) => ({
        guardados: state.guardados.map((guardado) => ({
          id: guardado.id,
          nombre: guardado.nombre,
          descripcion: guardado.descripcion,
          ubicacion: guardado.ubicacion,
          precio: guardado.precio,
          moneda: guardado.moneda,
          imagenes: guardado.imagenes,
          direccion: guardado.direccion,
          disponible: guardado.disponible,
          vendedor: guardado.vendedor,
          created_at: guardado.created_at,
        })),
      }),
    },
  ),
);
