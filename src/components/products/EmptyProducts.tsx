interface Props {
  onRefresh: () => Promise<void>;
}

export const EmptyProducts = ({ onRefresh }: Props) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 md:py-16 px-4">
      <div className="w-24 h-24 md:w-32 md:h-32 mb-6 text-muted-foreground">
        <svg
          className="w-full h-full"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 13v-1a1 1 0 011-1h4a1 1 0 011 1v1"
          />
        </svg>
      </div>

      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
        No hay productos disponibles
      </h3>

      <p className="text-sm md:text-base text-muted-foreground text-center max-w-md mb-6">
        En este momento no tenemos productos para mostrar. Por favor, intenta
        nuevamente más tarde.
      </p>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
          Reintentar
        </button>
      )}
    </div>
  );
};
