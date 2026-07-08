import { Animal } from "@/api/animales/interfaces/response-animales.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ChevronDown, Search, User, X } from "lucide-react";
import { Dispatch, RefObject, SetStateAction } from "react";

interface Props {
  animalDropdownRef: RefObject<HTMLDivElement>;
  selectedAnimal: Animal | null;
  clearAnimalSelection: () => void;
  animalSearchTerm: string;
  setAnimalSearchTerm: Dispatch<SetStateAction<string>>;
  setIsAnimalDropdownOpen: Dispatch<SetStateAction<boolean>>;
  isAnimalDropdownOpen: boolean;
  animalesFiltrados: Animal[];
  cargando_animales: boolean;
  handleSelectAnimal: (animal: Animal) => void;
  borderColor?: string;
  bgColor?: string;
  textColor?: string;
  iconColor?: string;
  inputBorderColor?: string;
  inputFocusColor?: string;
  hoverBgColor?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  badgeBorderColor?: string;
}

const SearchAnimales = ({
  animalDropdownRef,
  selectedAnimal,
  clearAnimalSelection,
  animalSearchTerm,
  setAnimalSearchTerm,
  setIsAnimalDropdownOpen,
  isAnimalDropdownOpen,
  animalesFiltrados,
  cargando_animales,
  handleSelectAnimal,
  borderColor = "border-blue-200",
  bgColor = "bg-blue-50",
  textColor = "text-blue-700",
  iconColor = "text-blue-600",
  inputBorderColor = "border-blue-200",
  inputFocusColor = "focus:border-blue-400",
  hoverBgColor = "hover:bg-blue-50",
  badgeBgColor = "bg-blue-100",
  badgeTextColor = "text-blue-700",
  badgeBorderColor = "border-blue-200",
}: Props) => {
  return (
    <div className="relative" ref={animalDropdownRef}>
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center gap-2 p-3 sm:p-4 ${bgColor} rounded-lg border ${borderColor}`}
      >
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <User className={`h-4 w-4 ${iconColor} flex-shrink-0`} />
          <label className={`text-xs sm:text-sm font-medium ${textColor}`}>
            Buscar animal/galpon/lote:
          </label>
        </div>
        <div className="relative flex-1 w-full">
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 ${iconColor.replace("text-", "text-").replace("600", "400")}`}
            />
            <Input
              placeholder="Buscar por nombre o identificación..."
              value={animalSearchTerm}
              onChange={(e) => {
                setAnimalSearchTerm(e.target.value);
                setIsAnimalDropdownOpen(true);
                if (!e.target.value) {
                  clearAnimalSelection();
                }
              }}
              onFocus={() => setIsAnimalDropdownOpen(true)}
              className={`pl-9 pr-10 h-9 sm:h-10 text-sm bg-white border ${inputBorderColor} ${inputFocusColor}`}
            />
            {animalSearchTerm && (
              <button
                type="button"
                onClick={clearAnimalSelection}
                className="absolute right-9 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
            <ChevronDown
              className={cn(
                "absolute right-3 top-1/2 transform -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground transition-transform",
                isAnimalDropdownOpen && "rotate-180",
              )}
            />
          </div>

          {isAnimalDropdownOpen && animalSearchTerm && (
            <div className="absolute z-50 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {cargando_animales ? (
                <div className="p-4 text-center text-muted-foreground">
                  Cargando animales...
                </div>
              ) : animalesFiltrados.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  No se encontraron animales
                </div>
              ) : (
                <div>
                  {animalesFiltrados.map((animal) => (
                    <div
                      key={animal.id}
                      onClick={() => handleSelectAnimal(animal)}
                      className={`px-4 py-2 ${hoverBgColor} cursor-pointer border-b last:border-b-0 flex items-center justify-between`}
                    >
                      <div className="">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage
                              src={
                                animal.profileImages &&
                                animal.profileImages.length > 0
                                  ? animal.profileImages[0].url
                                  : "/images/Image-not-found.png"
                              }
                            />
                            <AvatarFallback>
                              {animal.identificador.slice(0, 5)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="font-medium text-sm">
                            {animal.nombre_animal || animal.identificador}
                          </div>
                          <div className="text-xs text-muted-foreground flex gap-2">
                            <span>ID: {animal.identificador}</span>
                            <span>•</span>
                            <span>
                              {animal.especie?.nombre || "Sin especie"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {animal.razas.length > 0
                          ? animal.razas[0].nombre
                          : "Sin raza"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
        {selectedAnimal && (
          <Badge
            className={`${badgeBgColor} ${badgeTextColor} border ${badgeBorderColor} whitespace-nowrap text-xs`}
          >
            <User className={`h-3 w-3 mr-1 ${iconColor}`} />
            {selectedAnimal.nombre_animal} ({selectedAnimal.identificador})
            <button
              type="button"
              onClick={clearAnimalSelection}
              className="ml-1 hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        )}
      </div>
    </div>
  );
};

export default SearchAnimales;
