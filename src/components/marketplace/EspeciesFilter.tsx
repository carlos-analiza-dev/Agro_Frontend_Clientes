import useGetEspecies from "@/hooks/especies/useGetEspecies";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface EspeciesFilterProps {
  onEspecieChange: (especieNombre: string | undefined) => void;
  initialEspecieNombre?: string;
}

const EspeciesFilter = ({
  onEspecieChange,
  initialEspecieNombre,
}: EspeciesFilterProps) => {
  const { data: especies, isLoading } = useGetEspecies();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEspecie, setSelectedEspecie] = useState<string | undefined>(
    initialEspecieNombre,
  );

  useEffect(() => {
    if (initialEspecieNombre) {
      setSelectedEspecie(initialEspecieNombre);
    }
  }, [initialEspecieNombre]);

  const handleSelect = (especieNombre: string) => {
    const newValue =
      selectedEspecie === especieNombre ? undefined : especieNombre;
    setSelectedEspecie(newValue);
    onEspecieChange(newValue);
    setIsOpen(false);
  };

  const handleClear = () => {
    setSelectedEspecie(undefined);
    onEspecieChange(undefined);
    setIsOpen(false);
  };

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
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2 px-3 py-2 text-sm rounded-md border
          transition-all duration-200 min-w-[120px] justify-between
          ${
            selectedEspecie
              ? "bg-primary/10 border-primary text-primary"
              : "bg-background border-input hover:bg-accent hover:text-accent-foreground"
          }
        `}
      >
        <span className="truncate">
          {selectedEspecie || "Todas las especies"}
        </span>
        <ChevronDown
          size={16}
          className={`transition-transform ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute left-0 mt-2 w-64 z-50 bg-background border rounded-lg shadow-lg p-2 max-h-60 overflow-y-auto">
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-xs font-medium text-muted-foreground">
                Especies
              </span>
              {selectedEspecie && (
                <button
                  onClick={handleClear}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Limpiar
                </button>
              )}
            </div>

            <div className="space-y-1">
              {especies?.data.map((especie) => (
                <button
                  key={especie.id}
                  onClick={() => handleSelect(especie.nombre)}
                  className={`
                    w-full text-left px-3 py-2 text-sm rounded-md
                    transition-colors flex items-center justify-between
                    ${
                      selectedEspecie === especie.nombre
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-accent"
                    }
                  `}
                >
                  <span>{especie.nombre}</span>
                  {selectedEspecie === especie.nombre && (
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </button>
              ))}

              {(!especies || especies.data.length === 0) && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay especies disponibles
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default EspeciesFilter;
