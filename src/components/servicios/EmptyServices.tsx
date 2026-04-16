"use client";

interface EmptyServicesProps {
  onRefresh: () => Promise<void> | void;
  countryName?: string;
}

export const EmptyServices = ({
  onRefresh,
  countryName,
}: EmptyServicesProps) => {
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
            d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 13h6"
          />
        </svg>
      </div>

      <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
        No hay servicios disponibles
      </h3>

      <p className="text-sm md:text-base text-muted-foreground text-center max-w-md mb-6">
        {countryName
          ? `No encontramos servicios disponibles en ${countryName} en este momento.`
          : "No encontramos servicios disponibles en tu país en este momento."}
        Por favor, intenta nuevamente más tarde.
      </p>

      {onRefresh && (
        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-lg hover:from-primary/90 hover:to-primary/70 transition-all duration-200 shadow-md hover:shadow-lg"
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
