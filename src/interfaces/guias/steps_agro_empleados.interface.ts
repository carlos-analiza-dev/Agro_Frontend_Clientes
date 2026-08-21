import { TourStep } from "@/components/agroservicio/guia/TourGuide";

export const agroGestionStepsEmpleados: Record<string, TourStep[]> = {
  "/agro-empleados/agro-servicios": [
    {
      target: "id-filters-dashboard",
      title: "Filtros del Dashboard",
      description:
        "Utiliza estos filtros para consultar las métricas según un rango de fechas y una sucursal específica.",
    },
    {
      target: "id-resumen-dashboard",
      title: "Resumen del Dashboard",
      description:
        "Aquí puedes consultar un resumen de las principales métricas, como cantidad de facturas, ventas totales, ticket promedio e impuestos.",
    },
    {
      target: "id-metrica-ventas",
      title: "Análisis de Ventas",
      description:
        "Este gráfico permite comparar las ventas totales con el subtotal correspondiente al período seleccionado.",
    },
    {
      target: "id-metrica-impuestos",
      title: "Distribución de Impuestos",
      description:
        "Aquí puedes visualizar cómo se distribuyen los impuestos generados durante el período seleccionado.",
    },
    {
      target: "id-metrica-descuentos",
      title: "Descuentos y Cargos Extra",
      description:
        "Este gráfico muestra los descuentos aplicados y los cargos adicionales registrados en las facturas.",
    },
    {
      target: "id-metrica-indicadores",
      title: "Resumen de Indicadores",
      description:
        "Aquí puedes consultar indicadores relacionados con la cantidad de facturas y el ticket promedio.",
    },
    {
      target: "id-detalles-financieros",
      title: "Detalles Financieros",
      description:
        "En esta sección puedes consultar el desglose financiero, incluyendo subtotal, ISV del 15%, ISV del 18% y descuentos.",
    },
    {
      target: "id-top-sucursales",
      title: "Top Sucursales",
      description:
        "Aquí puedes consultar el ranking de las sucursales que han generado mayores ventas durante el período seleccionado.",
    },
    {
      target: "id-top-clientes",
      title: "Top Clientes",
      description:
        "Esta sección muestra los clientes que tienen mayor participación en las ventas del período seleccionado.",
    },
    {
      target: "id-top-productos",
      title: "Productos Más Vendidos",
      description:
        "Aquí puedes consultar los productos que han registrado la mayor cantidad de ventas durante el período seleccionado.",
    },
    {
      target: "id-estados-facturas",
      title: "Estados de Facturas",
      description:
        "Esta sección permite visualizar la distribución de las facturas según su estado.",
    },
  ],
  "/agro-empleados/agro-clientes": [
    {
      target: "id-clientes-header",
      title: "Control de Clientes",
      description:
        "Gestiona todos los clientes de tu agroservicio. Aquí puedes ver, agregar y administrar clientes.",
    },
    {
      target: "id-clientes-add-btn",
      title: "Agregar Cliente",
      description:
        "Haz clic aquí para registrar un nuevo cliente en tu agroservicio.",
    },
    {
      target: "id-clientes-stats",
      title: "Estadísticas de Clientes",
      description:
        "Visualiza un resumen rápido de tus clientes: total, activos, departamentos y municipios.",
    },
    {
      target: "id-clientes-filters",
      title: "Filtros de Búsqueda",
      description:
        "Utiliza estos filtros para buscar clientes por nombre, departamento o municipio.",
    },
    {
      target: "id-clientes-filter-search",
      title: "Búsqueda por Nombre",
      description:
        "Escribe el nombre o identificación del cliente para encontrarlo rápidamente.",
    },
    {
      target: "id-clientes-filter-departamento",
      title: "Filtro por Departamento",
      description:
        "Selecciona un departamento para ver solo los clientes de esa región.",
    },
    {
      target: "id-clientes-filter-municipio",
      title: "Filtro por Municipio",
      description:
        "Filtra los clientes por municipio. Necesitas seleccionar un departamento primero.",
    },
    {
      target: "id-clientes-filter-actions",
      title: "Acciones de Filtros",
      description:
        "Usa 'Limpiar todo' para resetear todos los filtros aplicados.",
    },
    {
      target: "id-clientes-table-container",
      title: "Lista de Clientes",
      description:
        "Aquí puedes ver todos los clientes registrados con su información principal.",
    },
    {
      target: "id-clientes-table",
      title: "Tabla de Clientes",
      description:
        "Visualiza y gestiona la información de cada cliente. Haz clic en el ícono de edición para modificar sus datos.",
    },
    {
      target: "id-edit-cliente",
      title: "Editar Cliente",
      description: "Aqui podras editar los clientes de tu agroservicio",
    },
    {
      target: "id-ver-productos",
      title: "Productos Frecuentes",
      description:
        "Aqui podras observar los productos que el cliente compra frecuentemente",
    },
  ],
  "/agro-empleados/agro-compras-productos": [
    {
      target: "id-compras-header",
      title: "Compras de Productos",
      description:
        "Aquí puedes consultar las compras de productos realizadas en el agroservicio y registrar nuevas compras.",
    },
    {
      target: "id-compras-add-btn",
      title: "Agregar Compra",
      description:
        "Haz clic aquí para registrar una nueva compra de productos.",
    },
    {
      target: "id-compras-filters",
      title: "Filtros de Compras",
      description:
        "Utiliza estos filtros para buscar compras por proveedor, sucursal o tipo de pago.",
    },
    {
      target: "id-compras-filter-proveedor",
      title: "Filtrar por Proveedor",
      description:
        "Selecciona un proveedor para consultar únicamente sus compras.",
    },

    {
      target: "id-compras-filter-tipo-pago",
      title: "Filtrar por Tipo de Pago",
      description: "Filtra las compras según el método de pago utilizado.",
    },
    {
      target: "id-compras-filter-actions",
      title: "Limpiar Filtros",
      description: "Utiliza esta opción para eliminar los filtros aplicados.",
    },
    {
      target: "id-compras-table-section",
      title: "Lista de Compras",
      description: "Aquí puedes consultar todas las compras registradas.",
    },
    {
      target: "id-compras-table",
      title: "Tabla de Compras",
      description:
        "En esta tabla puedes consultar la información detallada de cada compra.",
    },
    {
      target: "id-detalles-compra-producto",
      title: "Detalles de Compra",
      description:
        "Aquí puedes consultar el detalle de los productos incluidos en una compra.",
    },
  ],

  "/agro-empleados/agro-compras-insumos": [
    {
      target: "id-compras-header",
      title: "Compras de Insumos",
      description:
        "Aquí puedes consultar las compras de insumos realizadas en el agroservicio.",
    },
    {
      target: "add-compra-insumo",
      title: "Agregar Compra",
      description:
        "Utiliza este botón para registrar una nueva compra de insumos.",
    },
    {
      target: "id-filters-compra-insumo",
      title: "Filtros de Búsqueda",
      description:
        "Utiliza estos filtros para buscar compras de insumos según diferentes criterios.",
    },
    {
      target: "compra-prov-insumo",
      title: "Filtrar por Proveedor",
      description:
        "Selecciona un proveedor para consultar sus compras de insumos.",
    },
    {
      target: "compra-tipo-insumo",
      title: "Filtrar por Tipo de Pago",
      description: "Selecciona un tipo de pago para filtrar las compras.",
    },
    {
      target: "table-compra-insumos",
      title: "Tabla de Compras",
      description:
        "Aquí puedes consultar el resumen de todas las compras de insumos realizadas.",
    },
  ],

  "/agro-empleados/agro-facturas": [
    {
      target: "modulo-facturas",
      title: "Módulo de Facturas",
      description:
        "Aquí puedes gestionar y consultar las facturas de tu agroservicio.",
    },
    {
      target: "add-factura-btn",
      title: "Ingresar Factura",
      description:
        "Aqui podras ingresar facturas relacionadas a las ventas de tu agroservicio",
    },
    {
      target: "filters-facturacion",
      title: "Filtros de Facturación",
      description: "Filtra las facturas por sucursal y rango de fechas.",
    },

    {
      target: "fechaIn-facturacion",
      title: "Fecha de Inicio",
      description:
        "Establece la fecha desde la cual deseas consultar las facturas.",
    },
    {
      target: "fechaFin-facturacion",
      title: "Fecha de Fin",
      description:
        "Establece la fecha hasta la cual deseas consultar las facturas.",
    },
    {
      target: "tabla-facturas",
      title: "Tabla de Facturas",
      description:
        "Aquí puedes consultar todas las facturas con su información principal.",
    },
    {
      target: "acciones-facturas",
      title: "Acciones de Factura",
      description:
        "Aquí puedes realizar las acciones disponibles sobre las facturas.",
    },
  ],

  "/agro-empleados/agro-notas-credito": [
    {
      target: "notas-credito-page",
      title: "Notas de Crédito",
      description:
        "Aquí puedes consultar y gestionar las notas de crédito del agroservicio.",
    },
    {
      target: "add-crear-nota",
      title: "Nueva Nota de Crédito",
      description: "Utiliza esta opción para crear una nueva nota de crédito.",
    },
    {
      target: "filtros-notas-credito",
      title: "Filtros de Búsqueda",
      description:
        "Filtra las notas de crédito por sucursal y período de fechas.",
    },
    {
      target: "tabla-notas-credito",
      title: "Listado de Notas",
      description:
        "Aquí puedes consultar todas las notas de crédito registradas.",
    },
    {
      target: "acciones-nota",
      title: "Acciones",
      description:
        "Aquí puedes realizar las acciones disponibles sobre las notas de crédito.",
    },
  ],

  "/agro-empleados/agro-rangos-facturas": [
    {
      target: "modulo-rangos",
      title: "Control de Rangos",
      description:
        "Aquí puedes consultar y administrar los rangos de facturación disponibles.",
    },
    {
      target: "add-rango",
      title: "Crear Rango",
      description:
        "Utiliza esta opción para registrar un nuevo rango de facturación.",
    },
    {
      target: "estadisticas-rangos",
      title: "Estadísticas de Rangos",
      description:
        "Consulta las principales métricas relacionadas con los rangos de facturación.",
    },
    {
      target: "buscador-rangos",
      title: "Buscador de Rangos",
      description: "Busca rangos por CAI, prefijo o agroservicio.",
    },
    {
      target: "lista-rangos",
      title: "Tabla de Rangos",
      description: "Aquí puedes consultar todos los rangos registrados.",
    },
    {
      target: "acciones-rango",
      title: "Acciones del Rango",
      description:
        "Aquí puedes realizar las acciones disponibles sobre los rangos.",
    },
  ],

  "/agro-empleados/agro-lotes": [
    {
      target: "lotes-page",
      title: "Gestión de Lotes",
      description:
        "Aquí puedes consultar el inventario de productos por sucursal.",
    },
    {
      target: "estadisticas-lotes",
      title: "Resumen de Inventario",
      description: "Consulta el resumen general del inventario.",
    },
    {
      target: "card-total-productos",
      title: "Total de Productos",
      description:
        "Muestra la cantidad total de productos diferentes en el inventario.",
    },
    {
      target: "card-unidades-totales",
      title: "Unidades Totales",
      description: "Muestra la cantidad total de unidades disponibles.",
    },
    {
      target: "card-costo-total",
      title: "Costo Total",
      description: "Muestra el valor total del inventario.",
    },
    {
      target: "card-valor-promedio",
      title: "Valor Promedio",
      description: "Muestra el costo promedio por unidad.",
    },
    {
      target: "filtro-sucursal-lotes",
      title: "Selección de Sucursal",
      description: "Selecciona una sucursal para consultar su inventario.",
    },
    {
      target: "buscador-lotes",
      title: "Búsqueda de Productos",
      description: "Busca productos por nombre o código.",
    },
    {
      target: "tabla-lotes",
      title: "Listado de Productos",
      description:
        "Aquí puedes consultar los productos disponibles en el inventario.",
    },
    {
      target: "acciones-lotes",
      title: "Acciones del Lote",
      description:
        "Aquí puedes realizar las acciones disponibles sobre los lotes.",
    },
  ],

  "/agro-empleados/agro-traslados": [
    {
      target: "traslados-page",
      title: "Traslados de Inventario",
      description:
        "Aquí puedes consultar los traslados de productos entre sucursales.",
    },
    {
      target: "buscador-traslados",
      title: "Búsqueda de Traslados",
      description: "Busca traslados por nombre o código de producto.",
    },

    {
      target: "metricas-traslados",
      title: "Métricas de Traslados",
      description: "Consulta las estadísticas relacionadas con los traslados.",
    },
    {
      target: "historial-traslados",
      title: "Historial de Traslados",
      description:
        "Aquí puedes consultar el historial de movimientos de inventario.",
    },
  ],

  "/agro-empleados/agro-movimientos-lotes": [
    {
      target: "movimientos-lotes-page",
      title: "Movimientos de Lotes",
      description:
        "Aquí puedes consultar y rastrear los movimientos de inventario.",
    },
    {
      target: "filtros-movimientos-lotes",
      title: "Filtros de Movimientos",
      description:
        "Filtra los movimientos por sucursal, tipo y rango de fechas.",
    },
    {
      target: "buscador-movimientos",
      title: "Buscador de Movimientos",
      description: "Busca movimientos por producto, factura o compra.",
    },
    {
      target: "tabla-movimientos-lotes",
      title: "Tabla de Movimientos",
      description:
        "Aquí puedes consultar todos los movimientos de lotes registrados.",
    },
    {
      target: "resultados-movimientos",
      title: "Resultados",
      description:
        "Muestra los resultados según los filtros y búsqueda aplicados.",
    },
  ],

  "/agro-empleados/agro-productos": [
    {
      target: "productos-page",
      title: "Módulo de Productos",
      description:
        "Aquí puedes gestionar el catálogo de productos agropecuarios.",
    },
    {
      target: "add-productos",
      title: "Agregar Productos",
      description: "Utiliza esta opción para registrar nuevos productos.",
    },
    {
      target: "filtros-productos",
      title: "Filtros de Productos",
      description: "Filtra productos por categoría, marca y proveedor.",
    },
    {
      target: "tabla-productos-agro",
      title: "Tabla de Productos",
      description: "Aquí puedes consultar el listado completo de productos.",
    },
    {
      target: "config-escalas-descuentos",
      title: "Escalas y Descuentos",
      description:
        "Configura las escalas de precios y descuentos del producto.",
    },
    {
      target: "edit-producto",
      title: "Editar Producto",
      description: "Modifica la información del producto seleccionado.",
    },
    {
      target: "subir-imagen-producto",
      title: "Imágenes del Producto",
      description: "Administra las imágenes del producto.",
    },
  ],

  "/agro-empleados/agro-insumos": [
    {
      target: "insumos-page",
      title: "Módulo de Insumos",
      description:
        "Aquí puedes gestionar el catálogo de insumos agropecuarios.",
    },
    {
      target: "add-insumos",
      title: "Agregar Insumos",
      description: "Utiliza esta opción para registrar nuevos insumos.",
    },
    {
      target: "filtros-insumos",
      title: "Filtros de Insumos",
      description: "Filtra los insumos por proveedor.",
    },
    {
      target: "tabla-insumos-agro",
      title: "Listado de Insumos",
      description:
        "Aquí puedes consultar los insumos registrados con sus precios y existencias.",
    },
    {
      target: "config-escalas-descuentos-insumos",
      title: "Escalas y Descuentos",
      description: "Configura las escalas de precios y descuentos por insumo.",
    },
    {
      target: "edit-insumo",
      title: "Editar Insumo",
      description: "Modifica la información del insumo seleccionado.",
    },
  ],

  "/agro-empleados/agro-proveedores": [
    {
      target: "proveedores-page",
      title: "Módulo de Proveedores",
      description:
        "Gestiona el catálogo completo de proveedores agropecuarios de tu agroservicio.",
    },
    {
      target: "add-proveedor",
      title: "Agregar Proveedor",
      description: "Agregar nuevo proveedor para tu agroservicio.",
    },
    {
      target: "buscador-proveedores",
      title: "Buscador de Proveedores",
      description: "Busca proveedores por nombre, NIT o NRC.",
    },
    {
      target: "tabla-proveedores",
      title: "Listado de Proveedores",
      description:
        "Tabla completa de proveedores con información de contacto y documentos.",
    },
    {
      target: "edit-proveedor",
      title: "Editar Proveedor",
      description: "Modifica la información del proveedor seleccionado.",
    },
  ],

  "/agro-empleados/agro-consumo-insumos": [
    {
      target: "consumo-insumos-page",
      title: "Módulo de Consumo de Insumos",
      description:
        "Aquí puedes gestionar el consumo de insumos y registrar sus salidas.",
    },
    {
      target: "add-consumo-insumo",
      title: "Agregar Consumo",
      description:
        "Utiliza esta opción para registrar un nuevo consumo de insumo.",
    },
    {
      target: "tabla-consumo-insumos",
      title: "Listado de Consumos",
      description:
        "Aquí puedes consultar todos los registros de consumo de insumos.",
    },
  ],

  "/agro-empleados/agro-existencia": [
    {
      target: "existencia-productos-page",
      title: "Módulo de Existencia",
      description:
        "Aquí puedes consultar la existencia actual de productos en las sucursales.",
    },
    {
      target: "filtros-existencia",
      title: "Filtros de Existencia",
      description: "Filtra la existencia por sucursal o producto.",
    },
    {
      target: "buscador-existencia",
      title: "Buscador de Existencia",
      description: "Busca productos por nombre, código o sucursal.",
    },
    {
      target: "tabla-existencia",
      title: "Tabla de Existencia",
      description:
        "Aquí puedes consultar la existencia actual de cada producto.",
    },
  ],

  "/agro-empleados/agro-impuestos": [
    {
      target: "impuestos-page",
      title: "Módulo de Impuestos",
      description:
        "Aquí puedes consultar los impuestos aplicables a los productos.",
    },
    {
      target: "add-impuesto",
      title: "Agregar Impuesto",
      description: "Utiliza esta opción para registrar un nuevo impuesto.",
    },
    {
      target: "tabla-impuestos",
      title: "Listado de Impuestos",
      description: "Aquí puedes consultar los impuestos registrados.",
    },
    {
      target: "edit-impuesto",
      title: "Editar Impuesto",
      description: "Modifica la información del impuesto seleccionado.",
    },
  ],

  "/agro-empleados/agro-descuentos": [
    {
      target: "descuentos-page",
      title: "Módulo de Descuentos",
      description:
        "Aquí puedes consultar y gestionar los descuentos disponibles.",
    },
    {
      target: "add-descuento",
      title: "Agregar Descuento",
      description: "Utiliza esta opción para registrar un nuevo descuento.",
    },
    {
      target: "tabla-descuentos",
      title: "Listado de Descuentos",
      description: "Aquí puedes consultar todos los descuentos registrados.",
    },
    {
      target: "edit-descuento",
      title: "Editar Descuento",
      description: "Modifica la información del descuento seleccionado.",
    },
  ],
};
