import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";

interface Props {
  url: string;
  id?: string;
}

const EmptyPedidos = ({ url, id }: Props) => {
  const t = useTranslations("emptyPedidos");

  return (
    <div
      id={id}
      className="h-[70vh] flex flex-col items-center justify-center min-h-96 text-center"
    >
      <ShoppingCart className="h-12 w-12 text-gray-400 mb-4" />

      <h2 className="text-2xl font-bold text-gray-900 mb-2">{t("title")}</h2>

      <p className="text-gray-600">{t("description")}</p>

      <Link
        id="id-nuevo-pedido"
        href={url}
        className="mt-3 text-blue-600 hover:underline hover:text-blue-500"
      >
        {t("createOrder")}
      </Link>
    </div>
  );
};

export default EmptyPedidos;
