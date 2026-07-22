"use client";
import useGetAgroProductos from "@/hooks/agroservicios/productos/useGetAgroProductos";
import useGetAllProveedores from "@/hooks/agroservicios/proveedores/useGetAllProveedores";
import useGetCategorias from "@/hooks/categorias/useGetCategorias";
import useGetMarcasActivas from "@/hooks/marcas/useGetMarcasActivas";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag } from "lucide-react";
import Paginacion from "@/components/generics/Paginacion";
import TableAgroProductos from "@/components/agroservicio/productos/TableAgroProductos";
import SkeletonTable from "@/components/generics/SkeletonTable";
import CardFiltersAgroProductos from "@/components/agroservicio/productos/CardFiltersAgroProductos";
import TitlePage from "@/components/generics/TitlePage";
import ButtonAdd from "@/components/generics/ButtonAdd";
import Modal from "@/components/generics/Modal";
import FormAgroProductos from "@/components/agroservicio/productos/FormAgroProductos";
import { AgroProducto } from "@/api/agroservicio/productos/interface/response-productos-agro.interface";

const ITEMS_PER_PAGE = 10;

const AgroProductosPage = () => {
  const { cliente } = useAuthStore();
  const propietarioId = cliente?.id ?? "";
  const paisId = cliente?.pais.id ?? "";
  const [openModalProductos, setOpenModalProductos] = useState(false);
  const [selectedProducto, setSelectedProducto] = useState<AgroProducto | null>(
    null,
  );
  const [isEdit, setIsEdit] = useState(false);
  const [categoriaSelect, setCategoriaSelect] = useState("all");
  const [marcaSelect, setMarcaSelect] = useState("all");
  const [proveedorSelect, setProveedorSelect] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const { data: categorias } = useGetCategorias({
    is_market: false,
  });
  const { data: marcas } = useGetMarcasActivas();
  const { data: proveedores } = useGetAllProveedores(propietarioId);
  const { data: productosData, isLoading: loadingProductos } =
    useGetAgroProductos(propietarioId, {
      limit: ITEMS_PER_PAGE,
      offset: (currentPage - 1) * ITEMS_PER_PAGE,
      categoria: categoriaSelect === "all" ? "" : categoriaSelect,
      marca: marcaSelect === "all" ? "" : marcaSelect,
      proveedor: proveedorSelect === "all" ? "" : proveedorSelect,
    });

  const totalPages = useMemo(() => {
    if (!productosData?.total) return 1;
    return Math.ceil(productosData.total / ITEMS_PER_PAGE);
  }, [productosData?.total]);

  const filteredProducts = useMemo(() => {
    if (!productosData?.productos) return [];
    if (!searchTerm) return productosData.productos;

    const term = searchTerm.toLowerCase();
    return productosData.productos.filter(
      (producto) =>
        producto.nombre.toLowerCase().includes(term) ||
        producto.codigo_barra?.toLowerCase().includes(term) ||
        producto.marca?.nombre.toLowerCase().includes(term) ||
        producto.proveedor?.nombre_legal.toLowerCase().includes(term),
    );
  }, [productosData?.productos, searchTerm]);

  const clearFilters = () => {
    setCategoriaSelect("all");
    setMarcaSelect("all");
    setProveedorSelect("all");
    setSearchTerm("");
    setCurrentPage(1);
  };

  const handleEditProducto = (producto: AgroProducto) => {
    setOpenModalProductos(true);
    setIsEdit(true);
    setSelectedProducto(producto);
  };

  const hasActiveFilters =
    categoriaSelect !== "all" ||
    marcaSelect !== "all" ||
    proveedorSelect !== "all" ||
    searchTerm;

  if (loadingProductos) {
    return <SkeletonTable />;
  }

  return (
    <div className="container mx-auto p-4 md:p-6 space-y-6">
      <div className="md:flex justify-between items-center gap-4">
        <TitlePage
          Icon={ShoppingBag}
          title="Productos"
          description="Gestión de productos agropecuarios"
        />
        <ButtonAdd
          title="Agregar Producto"
          Icon={ShoppingBag}
          action={() => setOpenModalProductos(true)}
          className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
        />
      </div>

      <CardFiltersAgroProductos
        categorias={categorias}
        marcas={marcas}
        proveedores={proveedores}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        setCurrentPage={setCurrentPage}
        setCategoriaSelect={setCategoriaSelect}
        categoriaSelect={categoriaSelect}
        marcaSelect={marcaSelect}
        setMarcaSelect={setMarcaSelect}
        proveedorSelect={proveedorSelect}
        setProveedorSelect={setProveedorSelect}
        hasActiveFilters={hasActiveFilters}
        clearFilters={clearFilters}
      />

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <TableAgroProductos
              filteredProducts={filteredProducts}
              hasActiveFilters={hasActiveFilters}
              clearFilters={clearFilters}
              handleEditProducto={handleEditProducto}
              propietarioId={propietarioId}
            />
          </div>
        </CardContent>
      </Card>

      {filteredProducts.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{" "}
            {Math.min(currentPage * ITEMS_PER_PAGE, productosData?.total || 0)}{" "}
            de {productosData?.total || 0} productos
          </p>
          <Paginacion
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
      <Modal
        open={openModalProductos}
        onOpenChange={setOpenModalProductos}
        title={isEdit ? "Editar Producto" : "Agregar Nuevo Producto"}
        description={
          isEdit
            ? "Aquí podrás editar la información del producto."
            : "Aquí podrás ingresar nuevos productos al agroservicio."
        }
        height="auto"
        size="2xl"
        showCloseButton={isEdit ? false : true}
      >
        <FormAgroProductos
          isEmpleado={false}
          propietarioId={propietarioId}
          Success={() => {
            setOpenModalProductos(false);
            setSelectedProducto(null);
            setIsEdit(false);
          }}
          editProducto={selectedProducto}
          isEdit={isEdit}
          paisId={paisId}
        />
      </Modal>
    </div>
  );
};

export default AgroProductosPage;
