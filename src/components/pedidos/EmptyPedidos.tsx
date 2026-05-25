import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface Props {
  url: string;
}

const EmptyPedidos = ({ url }: Props) => {
  return (
    <div className="h-[70vh] flex flex-col items-center justify-center min-h-96 text-center">
      <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />

      <h2 className="text-2xl font-bold text-gray-900 mb-2">No hay pedidos</h2>

      <p className="text-gray-600">Aún no has realizado ningún pedido.</p>

      <Link
        href={url}
        className="mt-3 text-blue-600 hover:underline hover:text-blue-500"
      >
        Crear nuevo pedido
      </Link>
    </div>
  );
};

export default EmptyPedidos;
