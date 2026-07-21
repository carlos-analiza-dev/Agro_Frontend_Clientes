import { ProveedoreAgro } from "@/api/agroservicio/proveedores/interface/response-agro-proveedores.interface";
import { Categoria } from "@/api/categorias/interfaces/response-categorias";
import { Marca } from "@/api/marcas/interface/response-marcas.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Building2, Search, Store, Tag, X } from "lucide-react";
import React, { Dispatch, SetStateAction } from "react";

interface Props {
  categorias: Categoria[] | undefined;
  marcas: Marca[] | undefined;
  proveedores: ProveedoreAgro[] | undefined;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  setCategoriaSelect: Dispatch<SetStateAction<string>>;
  categoriaSelect: string;
  marcaSelect: string;
  setMarcaSelect: Dispatch<SetStateAction<string>>;
  proveedorSelect: string;
  setProveedorSelect: Dispatch<SetStateAction<string>>;
  hasActiveFilters: string | true;
  clearFilters: () => void;
}

const CardFiltersAgroProductos = ({
  categorias,
  marcas,
  proveedores,
  searchTerm,
  setCurrentPage,
  setSearchTerm,
  categoriaSelect,
  setCategoriaSelect,
  marcaSelect,
  setMarcaSelect,
  proveedorSelect,
  setProveedorSelect,
  hasActiveFilters,
  clearFilters,
}: Props) => {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="pl-9"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Select
              value={categoriaSelect}
              onValueChange={(value) => {
                setCategoriaSelect(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categorias?.map((categoria) => (
                  <SelectItem key={categoria.id} value={categoria.id}>
                    {categoria.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={marcaSelect}
              onValueChange={(value) => {
                setMarcaSelect(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Marca" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las marcas</SelectItem>
                {marcas?.map((marca) => (
                  <SelectItem key={marca.id} value={marca.id}>
                    {marca.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={proveedorSelect}
              onValueChange={(value) => {
                setProveedorSelect(value);
                setCurrentPage(1);
              }}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los proveedores</SelectItem>
                {proveedores?.map((proveedor) => (
                  <SelectItem key={proveedor.id} value={proveedor.id}>
                    {proveedor.nombre_legal}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFilters}
                className="h-10 w-10"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 mt-4">
            {searchTerm && (
              <Badge variant="secondary" className="gap-1">
                Búsqueda: {searchTerm}
                <X
                  className="h-3 w-3 cursor-pointer ml-1"
                  onClick={() => setSearchTerm("")}
                />
              </Badge>
            )}
            {categoriaSelect !== "all" && (
              <Badge variant="secondary" className="gap-1">
                <Tag className="h-3 w-3" />
                {categorias?.find((c) => c.id === categoriaSelect)?.nombre}
                <X
                  className="h-3 w-3 cursor-pointer ml-1"
                  onClick={() => setCategoriaSelect("all")}
                />
              </Badge>
            )}
            {marcaSelect !== "all" && (
              <Badge variant="secondary" className="gap-1">
                <Store className="h-3 w-3" />
                {marcas?.find((m) => m.id === marcaSelect)?.nombre}
                <X
                  className="h-3 w-3 cursor-pointer ml-1"
                  onClick={() => setMarcaSelect("all")}
                />
              </Badge>
            )}
            {proveedorSelect !== "all" && (
              <Badge variant="secondary" className="gap-1">
                <Building2 className="h-3 w-3" />
                {
                  proveedores?.find((p) => p.id === proveedorSelect)
                    ?.nombre_legal
                }
                <X
                  className="h-3 w-3 cursor-pointer ml-1"
                  onClick={() => setProveedorSelect("all")}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CardFiltersAgroProductos;
