import { ResponseRatingProductos } from "@/api/rating-producto/interfaces/response-rating-producto.interface";

interface Props {
  rating: ResponseRatingProductos | undefined;
}

const CardRatingResumen = ({ rating }: Props) => {
  if (!rating) return null;

  const total = rating.total_opiniones ?? 0;
  const promedio = Number(rating.promedio) || 0;

  const porcentaje = (cantidad: number) =>
    total > 0 ? Math.round((cantidad / total) * 100) : 0;

  const renderStars = (score: number) => {
    const stars = [];
    const fullStars = Math.floor(score);
    const hasHalfStar = score % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          className="w-6 h-6 text-yellow-400"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half-star" className="relative w-6 h-6">
          <svg
            className="absolute w-6 h-6 text-gray-300"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
          </svg>
          <svg
            className="absolute w-6 h-6 text-yellow-400"
            fill="currentColor"
            viewBox="0 0 20 20"
            style={{ clipPath: "inset(0 50% 0 0)" }}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
          </svg>
        </div>
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          className="w-6 h-6 text-gray-300"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.38 2.455a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.54 1.118l-3.38-2.455a1 1 0 00-1.176 0l-3.38 2.455c-.784.57-1.838-.197-1.539-1.118l1.286-3.97a1 1 0 00-.364-1.118L2.045 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
        </svg>
      );
    }

    return stars;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-2">Opiniones de clientes</h2>

      <div className="flex items-center gap-4 mb-2">
        <span className="text-4xl font-bold">{promedio.toFixed(1)}</span>
        <div className="flex">{renderStars(promedio)}</div>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        {promedio.toFixed(1)} de 5 • {total.toLocaleString()} calificaciones
      </p>

      <div className="space-y-1">
        {[5, 4, 3, 2, 1].map((num) => (
          <div key={num} className="flex items-center gap-2">
            <span className="w-auto text-sm">{num} estrellas</span>
            <div className="flex-1 h-3 bg-gray-200 rounded overflow-hidden">
              <div
                className="h-3 bg-yellow-400"
                style={{
                  width: `${porcentaje(rating[`estrellas_${num}` as keyof ResponseRatingProductos] as number)}%`,
                }}
              />
            </div>
            <span className="w-8 text-sm text-right">
              {porcentaje(
                rating[
                  `estrellas_${num}` as keyof ResponseRatingProductos
                ] as number
              )}
              %
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardRatingResumen;
