"use client";

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
import {
  Package,
  Pencil,
  Image,
  Cog,
  Layers3,
  BadgePercent,
} from "lucide-react";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { ProductImageUpload } from "./ProductImageUpload";
import { ProductImagesDialog } from "./ProductImagesDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Modal from "@/components/generics/Modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TableEscalasProducto from "../escalas/TableEscalasProducto";
import TableDescuentoProductos from "../descuentos-productos/TableDescuentoProductos";
import LotesByProducto from "./LotesByProducto";

interface Props {
  filteredProducts: AgroProducto[];
  hasActiveFilters: string | true;
  clearFilters: () => void;
  handleEditProducto: (producto: AgroProducto) => void;
  refetch?: () => void;
  propietarioId: string;
  moneda: string;
}

const TableAgroProductos = ({
  clearFilters,
  filteredProducts,
  hasActiveFilters,
  handleEditProducto,
  refetch,
  propietarioId,
  moneda,
}: Props) => {
  const t = useTranslations("tableAgroProductos");

  const [openModalLotes, setOpenModalLotes] = useState(false);
  const [imageUploadOpen, setImageUploadOpen] = useState(false);
  const [imagesDialogOpen, setImagesDialogOpen] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<AgroProducto | null>(
    null,
  );
  const [openModalEcalasDescuentos, setOpenModalEcalasDescuentos] =
    useState(false);
  const [productoId, setProductoId] = useState("");

  const handleViewImages = (producto: AgroProducto) => {
    setSelectedProducto(producto);
    setImagesDialogOpen(true);
  };

  const handleViewEscalas = (producto: AgroProducto) => {
    setOpenModalEcalasDescuentos(true);
    setSelectedProducto(producto);
  };

  const handleUploadImages = (producto: AgroProducto) => {
    setSelectedProducto(producto);
    setImageUploadOpen(true);
  };

  const handleSuccess = () => {
    refetch?.();
    setImagesDialogOpen(false);
  };

  const handleViewLotes = (productoId: string) => {
    setOpenModalLotes(true);
    setProductoId(productoId);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>{t("columns.product")}</TableHead>
            <TableHead>{t("columns.brand")}</TableHead>
            <TableHead>{t("columns.category")}</TableHead>
            <TableHead>{t("columns.supplier")}</TableHead>
            <TableHead className="text-right">{t("columns.price")}</TableHead>
            <TableHead className="text-center">
              {t("columns.availability")}
            </TableHead>
            <TableHead className="text-center">{t("columns.lots")}</TableHead>
            <TableHead className="text-right">{t("columns.actions")}</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Package className="h-8 w-8" />
                  <p>{t("empty.products")}</p>
                  {hasActiveFilters && (
                    <Button
                      variant="link"
                      onClick={clearFilters}
                      className="text-sm"
                    >
                      {t("buttons.clearFilters")}
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
                        {t("images.more", {
                          count: producto.images.length - 1,
                        })}
                      </span>
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  <div>
                    <p className="font-medium">{producto.nombre}</p>
                    {producto.codigo_barra && (
                      <p className="text-xs text-muted-foreground">
                        {t("labels.code")}: {producto.codigo_barra}
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
                    {producto.disponible
                      ? t("availability.available")
                      : t("availability.unavailable")}
                  </Badge>
                </TableCell>

                <TableCell className="text-center font-medium">
                  <Button
                    onClick={() => handleViewLotes(producto.id)}
                    variant={"ghost"}
                  >
                    {t("buttons.viewLots")}
                  </Button>
                </TableCell>

                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      onClick={() => handleViewEscalas(producto)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={t("actions.configuration")}
                      id="config-escalas-descuentos"
                    >
                      <Cog className="h-4 w-4" />
                    </Button>

                    <Button
                      onClick={() => handleEditProducto(producto)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={t("actions.editProduct")}
                      id="edit-producto"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button
                      onClick={() => handleUploadImages(producto)}
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      title={t("actions.uploadImages")}
                      id="subir-imagen-producto"
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

      <Modal
        open={openModalEcalasDescuentos}
        onOpenChange={setOpenModalEcalasDescuentos}
        title={t("configuration.title")}
        height="auto"
        size="6xl"
      >
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold">
              {selectedProducto?.nombre}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("configuration.description")}
            </p>
          </div>

          <Tabs defaultValue="escalas" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="escalas" className="gap-2">
                <Layers3 className="h-4 w-4" />
                {t("tabs.scales")}
              </TabsTrigger>

              <TabsTrigger value="descuentos" className="gap-2">
                <BadgePercent className="h-4 w-4" />
                {t("tabs.discounts")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="escalas" className="mt-6">
              <TableEscalasProducto
                moneda={selectedProducto?.pais.simbolo_moneda ?? "$"}
                paisId={selectedProducto?.pais.id ?? ""}
                selectedProducto={selectedProducto}
                propietarioId={propietarioId}
              />
            </TabsContent>

            <TabsContent value="descuentos" className="mt-6">
              <TableDescuentoProductos
                paisId={selectedProducto?.pais.id ?? ""}
                selectedProducto={selectedProducto}
                propietarioId={propietarioId}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Modal>

      <Modal
        open={openModalLotes}
        onOpenChange={setOpenModalLotes}
        title={t("lots.title")}
        description={t("lots.description")}
        size="4xl"
        height="auto"
      >
        <div className="flex-1">
          <LotesByProducto productoId={productoId} moneda={moneda} />
        </div>
      </Modal>
    </div>
  );
};

export default TableAgroProductos;
