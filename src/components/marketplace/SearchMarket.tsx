import {
  Dispatch,
  SetStateAction,
  KeyboardEvent,
  useState,
  useRef,
  useEffect,
} from "react";
import { Skeleton } from "../ui/skeleton";
import { useRouter } from "next/navigation";
import { ResponseSearchInterface } from "@/api/market-animales/interfaces/response-search.interface";
import { Search, Store, X } from "lucide-react";
import { useMediaQuery } from "@/hooks/media_query/useMediaQuery";

interface Props {
  nombre: string;
  setNombre: Dispatch<SetStateAction<string>>;
  buscando: ResponseSearchInterface[] | undefined;
  cargando: boolean;
  onSearch?: (termino: string) => void;
}

const SearchMarket = ({
  buscando,
  nombre,
  setNombre,
  cargando,
  onSearch,
}: Props) => {
  const router = useRouter();
  const [mostrarSugerencias, setMostrarSugerencias] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setMostrarSugerencias(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && nombre.trim()) {
      e.preventDefault();
      setMostrarSugerencias(false);
      if (onSearch) {
        onSearch(nombre.trim());
      } else {
        router.push(
          `/marketplace/busqueda?q=${encodeURIComponent(nombre.trim())}`,
        );
      }
    }
  };

  const handleVerTodos = () => {
    setMostrarSugerencias(false);
    if (onSearch) {
      onSearch(nombre);
    } else {
      router.push(`/marketplace/busqueda?q=${encodeURIComponent(nombre)}`);
    }
  };

  const handleSuggestionClick = (itemNombre: string) => {
    setMostrarSugerencias(false);
    setNombre(itemNombre);
    router.push(`/marketplace/busqueda?q=${encodeURIComponent(itemNombre)}`);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNombre(e.target.value);
    setMostrarSugerencias(true);
  };

  const handleInputFocus = () => {
    if (nombre.trim()) {
      setMostrarSugerencias(true);
    }
  };

  const closeMobileSuggestions = () => {
    setMostrarSugerencias(false);
  };

  return (
    <div className="mb-0 lg:mb-4 px-2 relative">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          placeholder={
            isMobile
              ? "Buscar en AgroMarket..."
              : "Buscar en AgroMarket... (Presiona Enter)"
          }
          value={nombre}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          className="
            w-full
            h-12
            px-4
            pl-11
            pr-10
            text-base
            border
            border-gray-200
            rounded-xl
            focus:outline-none
            focus:ring-2
            focus:ring-green-500
            focus:border-transparent
          "
        />
        <div className="absolute left-3 top-3 h-4 w-4 text-gray-400">
          <Search size={20} />
        </div>
        {nombre && (
          <button
            onClick={() => {
              setNombre("");
              setMostrarSugerencias(true);
              inputRef.current?.focus();
            }}
            className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {nombre && mostrarSugerencias && (
        <>
          {isMobile && (
            <div
              className="fixed inset-0 bg-black/50 z-[9998]"
              onClick={closeMobileSuggestions}
            />
          )}

          <div
            ref={suggestionsRef}
            className={`
        ${
          isMobile
            ? `absolute 
             left-0 
             right-0 
             top-full 
             mt-1
             z-[9999] 
             rounded-xl 
             shadow-xl
             max-h-[60vh]
             overflow-hidden`
            : `absolute 
             top-full 
             left-0 
             right-0 
             mt-2 
             rounded-xl 
             shadow-xl 
             z-[999] 
             max-h-[400px]`
        }
        bg-white
        border
        border-gray-200
        flex
        flex-col
      `}
            style={
              isMobile
                ? {
                    position: "absolute",
                    maxHeight: "60vh",
                    left: "-8px",
                    right: "-8px",
                    width: "calc(100% + 38px)",
                  }
                : {}
            }
          >
            {isMobile && (
              <div className="sticky top-0 bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center">
                <h3 className="text-sm font-medium text-gray-700">
                  Resultados de búsqueda
                </h3>
                <button
                  onClick={closeMobileSuggestions}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            )}

            <div className="overflow-y-auto flex-1">
              {cargando ? (
                <div className="p-3 space-y-2">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : buscando && buscando.length > 0 ? (
                <div className="py-1">
                  {buscando.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSuggestionClick(item.nombre)}
                      className="
                        flex
                        items-center
                        gap-3
                        px-4
                        py-3
                        hover:bg-gray-50
                        active:bg-gray-100
                        transition-colors
                        group
                        cursor-pointer
                      "
                    >
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center group-hover:bg-green-200 transition-colors flex-shrink-0">
                        <Store className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 group-hover:text-green-700 line-clamp-2 break-words">
                          {item.nombre}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-sm text-gray-500">
                  No se encontraron resultados para "{nombre}"
                </div>
              )}
            </div>

            {buscando && buscando.length > 0 && (
              <div className="sticky bottom-0 bg-white border-t border-gray-100">
                <button
                  onClick={handleVerTodos}
                  className="
                    w-full
                    text-left
                    px-4
                    py-3
                    text-sm
                    text-green-600
                    hover:bg-green-50
                    active:bg-green-100
                    font-medium
                    transition-colors
                  "
                >
                  Ver todos los resultados para "{nombre}"
                </button>
              </div>
            )}

            {(!buscando || buscando.length === 0) && !cargando && (
              <div className="sticky bottom-0 bg-white border-t border-gray-100">
                <button
                  onClick={handleVerTodos}
                  className="
                    w-full
                    text-left
                    px-4
                    py-3
                    text-sm
                    text-green-600
                    hover:bg-green-50
                    active:bg-green-100
                    font-medium
                    transition-colors
                  "
                >
                  Buscar "{nombre}" →
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {nombre &&
        !cargando &&
        buscando &&
        buscando.length > 0 &&
        mostrarSugerencias &&
        !isMobile && (
          <div className="mt-2 text-xs text-green-600 font-medium">
            {buscando.length} resultado{buscando.length !== 1 ? "s" : ""}{" "}
            encontrado{buscando.length !== 1 ? "s" : ""} • Presiona Enter para
            buscar
          </div>
        )}
    </div>
  );
};

export default SearchMarket;
