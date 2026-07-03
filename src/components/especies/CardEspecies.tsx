import { ResponseEspecies } from "@/api/especies/interfaces/response-especies.interface";
import Link from "next/link";

interface Props {
  especie: ResponseEspecies;
  link_page: string;
}

const CardEspecies = ({ especie, link_page }: Props) => {
  return (
    <Link
      href={link_page}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-800">
            {especie.nombre}
          </h2>
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              especie.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {especie.isActive ? "Activo" : "Inactivo"}
          </span>
        </div>
        <p className="text-sm text-gray-500">
          ID: {especie.id.substring(0, 8)}...
        </p>
      </div>
    </Link>
  );
};

export default CardEspecies;
