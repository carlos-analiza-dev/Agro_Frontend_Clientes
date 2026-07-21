import { AgroProducto } from "@/api/agroservicio/productos/interface/response-productos-agro.interface";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Package, Pencil, Image } from "lucide-react";
import { useState } from "react";
import { ProductImageUpload } from "./ProductImageUpload";
import { ProductImagesDialog } from "./ProductImagesDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Props {
  filteredProducts: AgroProducto[];
  hasActiveFilters: string | true;
  clearFilters: () => void;
  handleEditProducto: (producto: AgroProducto) => void;
  refetch?: () => void;
}

const TableAgroProductos = ({
  clearFilters,
  filteredProducts,
  hasActiveFilters,
  handleEditProducto,
  refetch,
}: Props) => {
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  const [imagesDialogOpen, setImagesDialogOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<AgroProducto | null>(
    null,
  );

  const handleViewImages = (producto: AgroProducto) => {
    setSelectedProducto(producto);
    setImagesDialogOpen(true);
  };

  const handleUploadImages = (producto: AgroProducto) => {
    setSelectedProducto(producto);
    setImageUploadOpen(true);
  };

  const handleSuccess = () => {
    refetch?.();
    setImagesDialogOpen(false);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>Producto</TableHead>
            <TableHead>Marca</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Proveedor</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-center">Disponible</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Package className="h-8 w-8" />
                  <p>No se encontraron productos</p>
                  {hasActiveFilters && (
                    <Button
                      variant="link"
                      onClick={clearFilters}
                      className="text-sm"
                    >
                      Limpiar filtros
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((producto) => (
              <TableRow key={producto.id}>
                <TableCell>
                  <Avatar
                    className="h-10 w-10 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => handleViewImages(producto)}
                  >
                    <AvatarImage
                      src={
                        producto.images && producto.images.length > 0
                          ? producto.images[0].url
                          : "/images/Image-not-found.png"
                      }
                      alt={producto.nombre}
                    />
                    <AvatarFallback className="text-xs">
                      {producto.nombre?.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  {producto.images && producto.images.length > 1 && (
                    <div className="flex justify-center mt-1">
                      <span className="text-[10px] text-muted-foreground">
                        +{producto.images.length - 1} más
                      </span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">{producto.nombre}</p>
                    {producto.codigo_barra && (
                      <p className="text-xs text-muted-foreground">
                        Código: {producto.codigo_barra}
                      </p>
                    )}
                  </div>
                </TableCell>
                <TableCell>{producto.marca?.nombre || "-"}</TableCell>
                <TableCell>
                  <Badge variant="outline">
                    {producto.categoria?.nombre || "-"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {producto.proveedor?.nombre_legal || "-"}
                  </span>
                </TableCell>
                <TableCell className="text-right font-medium">
                  {producto.pais?.simbolo_moneda || "L"}{" "}
                  {parseFloat(producto.precio).toFixed(2)}
                </TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={producto.disponible ? "default" : "destructive"}
                    className={
                      producto.disponible
                        ? "bg-green-500 hover:bg-green-600"
                        : ""
                    }
                  >
                    {producto.disponible ? "Disponible" : "No disponible"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => {}}
                      title="Ver Producto"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleEditProducto(producto)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Editar producto"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      onClick={() => handleUploadImages(producto)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title="Subir imágenes"
                    >
                      <Image className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ProductImageUpload
        open={imageUploadOpen}
        onOpenChange={setImageUploadOpen}
        productoId={selectedProducto?.id || ""}
        productoNombre={selectedProducto?.nombre || ""}
        onSuccess={handleSuccess}
      />

      <ProductImagesDialog
        open={imagesDialogOpen}
        onOpenChange={setImagesDialogOpen}
        producto={selectedProducto}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default TableAgroProductos;
