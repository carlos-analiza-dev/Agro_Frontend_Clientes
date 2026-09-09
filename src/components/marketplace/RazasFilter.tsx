import useGetRazasByEspecie from "@/hooks/razas/useGetRazasByEspecie";
import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface RazasFilterProps {
  especieNombre: string | undefined;
  onRazaChange: (razaId: string | undefined) => void;
  initialRazaId?: string;
}

const RazasFilter = ({
  especieNombre,
  onRazaChange,
  initialRazaId,
}: RazasFilterProps) => {
  const { data: especies } = useGetEspecies();

  const especieId = especies?.data?.find((e) => e.nombre === especieNombre)?.id;

  const { data: razas, isLoading } = useGetRazasByEspecie(especieId || "");

  const [isOpen, setIsOpen] = useState(false);
  const [selectedRaza, setSelectedRaza] = useState<string | undefined>(
    initialRazaId,
  );

  useEffect(() => {
    if (initialRazaId) {
      setSelectedRaza(initialRazaId);
    }
  }, [initialRazaId]);

  useEffect(() => {
    if (!especieNombre || !especieId) {
      setSelectedRaza(undefined);
      onRazaChange(undefined);
    }
  }, [especieNombre, especieId, onRazaChange]);

  const handleSelect = (razaId: string) => {
    const newValue = selectedRaza === razaId ? undefined : razaId;
    setSelectedRaza(newValue);
    onRazaChange(newValue);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedRaza(undefined);
    onRazaChange(undefined);
    setIsOpen(false);
  };

  const selectedRazaName = razas?.data?.find(
    (r) => r.id === selectedRaza,
  )?.nombre;

  const isDisabled = !especieNombre || !especieId || isLoading;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-sm rounded-md border bg-background border-input">
        <div className="w-20 h-4 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => !isDisabled && setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 text-sm rounded-md border
          transition-all duration-200 min-w-[120px] justify-between
          ${
            isDisabled
              ? "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
              : selectedRaza
                ? "bg-primary/10 border-primary text-primary"
                : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
          }
        `}
        disabled={isDisabled}
      >
        <span className="truncate">
          {isDisabled
            ? "Selecciona una especie"
            : selectedRazaName || "Todas las razas"}
        </span>
        {!isDisabled && (
          <ChevronDown
            size={16}
            className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        )}
      </button>

      {isOpen && !isDisabled && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute left-0 mt-2 w-64 z-50 bg-background border rounded-lg shadow-lg p-2 max-h-60 overflow-y-auto">
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-xs font-medium text-muted-foreground">
                Razas
              </span>
              {selectedRaza && (
                <button
                  onClick={handleClear}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="space-y-1">
              {razas?.data?.map((raza) => (
                <button
                  key={raza.id}
                  onClick={() => handleSelect(raza.id)}
                  className={`
                    w-full text-left px-3 py-2 text-sm rounded-md
                    transition-colors flex items-center justify-between
                    ${
                      selectedRaza === raza.id
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-accent"
                    }
                  `}
                >
                  <span>{raza.nombre}</span>
                  {selectedRaza === raza.id && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}

              {(!razas || razas.data?.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  {especieNombre && especieId
                    ? "No hay razas disponibles para esta especie"
                    : "Selecciona una especie primero"}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RazasFilter;
