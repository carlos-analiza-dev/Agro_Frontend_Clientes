import { Opinione } from "@/api/opiniones/interfaces/response-opiniones.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  opinion: Opinione;
}

const CardOpinionesProducto = ({ opinion }: Props) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 border rounded-lg bg-white shadow-sm">
      <Avatar className="h-12 w-12 flex-shrink-0">
        {opinion.cliente.profileImage ? (
          <AvatarImage
            src={opinion.cliente.profileImage.url}
            alt={opinion.cliente.nombre}
          />
        ) : (
          <AvatarFallback>
            {opinion.cliente.nombre[0].toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>

      <div className="flex-1 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
          <p className="font-semibold">{opinion.cliente.nombre}</p>

          <div className="flex gap-1 text-yellow-400 mt-1 sm:mt-0">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill={i < opinion.rating ? "currentColor" : "none"}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.946a1 1 0 00.95.69h4.148c.969 0 1.371 1.24.588 1.81l-3.36 2.44a1 1 0 00-.364 1.118l1.286 3.945c.3.921-.755 1.688-1.54 1.118l-3.361-2.44a1 1 0 00-1.175 0l-3.36 2.44c-.784.57-1.838-.197-1.539-1.118l1.285-3.945a1 1 0 00-.364-1.118L2.027 9.373c-.783-.57-.38-1.81.588-1.81h4.148a1 1 0 00.95-.69l1.286-3.946z"
                />
              </svg>
            ))}
          </div>
        </div>

        <h2 className="font-semibold mt-2 text-base sm:text-lg">
          {opinion.titulo}
        </h2>

        <p className="text-sm text-gray-600 mt-1 break-words">
          {opinion.comentario}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          {new Date(opinion.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
};

export default CardOpinionesProducto;
