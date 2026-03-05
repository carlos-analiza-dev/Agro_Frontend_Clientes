import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface BuscadorProps {
  title: string;
  setSearchTerm: (term: string) => void;
  searchTerm: string;
  className?: string;
  onFocus?: () => void;
}

export const Buscador = ({
  title,
  setSearchTerm,
  searchTerm,
  className,
  onFocus,
}: BuscadorProps) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={title}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={onFocus}
        className="pl-10"
      />
    </div>
  );
};
