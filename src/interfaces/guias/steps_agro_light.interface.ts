import { TourStep } from "@/components/agroservicio/guia/TourGuide";

export const agroLightSteps: Record<string, TourStep[]> = {
  "/agro-propietario/agro-servicios": [
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
  "/agro-propietario/agro-perfil": [
    {
      target: "id-agro-perfil-header",
      title: "Mi Agroservicio",
      description:
        "Esta es la página principal de configuración de tu agroservicio. Aquí puedes gestionar toda la información de tu negocio.",
    },
    {
      target: "id-agro-perfil-edit-btn",
      title: "Editar Información",
      description:
        "Haz clic en este botón para comenzar a editar la información de tu agroservicio. Si es la primera vez, el botón dirá 'Crear Información'.",
    },
    {
      target: "id-agro-perfil-logo-section",
      title: "Logo del Agroservicio",
      description:
        "El logo es esencial para identificar tu agroservicio en el sistema. Debe ser una imagen PNG sin fondo y no mayor a 1MB.",
    },
    {
      target: "id-agro-perfil-logo-preview",
      title: "Vista Previa del Logo",
      description:
        "Aquí puedes ver cómo se verá el logo de tu agroservicio. Es importante que sea una imagen clara y representativa.",
    },
    {
      target: "id-agro-perfil-logo-upload",
      title: "Cargar Logo",
      description:
        "Selecciona una imagen PNG y haz clic en 'Subir Logo' para guardarla. El logo es requerido para acceder a los demás módulos.",
    },
    {
      target: "id-agro-perfil-logo-warning",
      title: "Logo Requerido",
      description:
        "Este mensaje te recuerda que necesitas subir un logo para poder usar todas las funcionalidades del sistema.",
    },
    {
      target: "id-agro-perfil-fields",
      title: "Información del Agroservicio",
      description:
        "Completa todos los campos con la información de tu agroservicio. Todos los campos son obligatorios.",
    },
    {
      target: "id-agro-perfil-field-nombre",
      title: "Nombre del Agroservicio",
      description:
        "Ingresa el nombre comercial de tu agroservicio. Debe ser un nombre único y fácil de recordar.",
    },
    {
      target: "id-agro-perfil-field-rtn",
      title: "RTN",
      description:
        "Registra tu Registro Tributario Nacional (RTN). Debe tener exactamente 14 dígitos numéricos.",
    },
    {
      target: "id-agro-perfil-field-correo",
      title: "Correo Electrónico",
      description:
        "Ingresa el correo electrónico principal de contacto de tu agroservicio. Debe ser un correo válido.",
    },
    {
      target: "id-agro-perfil-field-telefono",
      title: "Teléfono",
      description:
        "Registra el número de teléfono de tu agroservicio. El formato debe ser xxxx-xxxx.",
    },
    {
      target: "id-agro-perfil-field-direccion",
      title: "Dirección",
      description:
        "Ingresa la dirección completa de tu agroservicio. Debe tener al menos 10 caracteres.",
    },
    {
      target: "id-agro-perfil-actions",
      title: "Acciones de Guardado",
      description:
        "Usa 'Cancelar' para descartar los cambios o 'Guardar Cambios' para guardar la información actualizada.",
    },
    {
      target: "id-agro-perfil-dates",
      title: "Fechas del Registro",
      description:
        "Aquí puedes ver cuándo fue creado tu agroservicio y cuándo fue la última actualización.",
    },
    {
      target: "id-agro-perfil-propietario",
      title: "Información del Propietario",
      description:
        "Esta sección muestra los datos del propietario del agroservicio, incluyendo país, departamento y municipio.",
    },
  ],
  "/agro-propietario/agro-sucursales": [
    {
      target: "add-sucursal-btn",
      title: "Agregar sucursal",
      description:
        "Utiliza este botón para registrar una nueva sucursal de tu agroservicio.",
    },
    {
      target: "id-table-sucursales",
      title: "Sucursales registradas",
      description:
        "Aquí puedes consultar las sucursales que tienes registradas. También puedes editar la información de cada una.",
    },
    {
      target: "id-edit-sucursal",
      title: "Editar Sucursal",
      description:
        "Utiliza este botón para editar la sucursal de tu agroservicio.",
    },
  ],
  "/agro-propietario/agro-empleados": [
    {
      target: "id-empleados-header",
      title: "Control de Empleados",
      description:
        "Esta página te permite gestionar todos los empleados de tu agroservicio. Aquí puedes ver, agregar y administrar el personal.",
    },
    {
      target: "id-empleados-add-btn",
      title: "Agregar Empleado",
      description:
        "Haz clic en este botón para registrar un nuevo empleado en tu agroservicio. Se abrirá un formulario para completar sus datos.",
    },
    {
      target: "id-empleados-stats",
      title: "Estadísticas de Empleados",
      description:
        "Estas tarjetas te muestran un resumen rápido de la situación de tus empleados: total, activos, inactivos y porcentaje de activos.",
    },
    {
      target: "id-empleados-stat-total",
      title: "Total de Empleados",
      description:
        "Muestra el número total de empleados registrados en tu agroservicio, tanto activos como inactivos.",
    },
    {
      target: "id-empleados-stat-activos",
      title: "Empleados Activos",
      description:
        "Este indicador muestra cuántos empleados están actualmente activos y pueden acceder al sistema.",
    },
    {
      target: "id-empleados-stat-inactivos",
      title: "Empleados Inactivos",
      description:
        "Muestra la cantidad de empleados que están inactivos y no tienen acceso al sistema en este momento.",
    },
    {
      target: "id-empleados-stat-porcentaje",
      title: "Porcentaje de Activos",
      description:
        "Este porcentaje te da una visión general de la proporción de empleados activos respecto al total.",
    },

    {
      target: "id-empleados-table",
      title: "Tabla de Empleados",
      description:
        "En esta tabla puedes visualizar y gestionar la información de cada empleado. Haz clic en el ícono de edición para modificar sus datos.",
    },
    {
      target: "id-options-empleados",
      title: "Opciones Empleado",
      description:
        "Aqui podras observar opciones para editar y desactivar el empleado de tu agroservicio",
    },
  ],
  "/agro-propietario/agro-clientes": [
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
  "/agro-propietario/agro-compras-productos": [
    {
      target: "id-compras-header",
      title: "Compras de Productos",
      description:
        "Esta página te permite gestionar todas las compras de productos de tu agroservicio. Aquí puedes ver el historial de compras y registrar nuevas.",
    },
    {
      target: "id-compras-add-btn",
      title: "Agregar Compra",
      description:
        "Haz clic en este botón para registrar una nueva compra de productos. Se abrirá un formulario para completar los detalles de la compra.",
    },
    {
      target: "id-compras-filters",
      title: "Filtros de Compras",
      description:
        "Utiliza estos filtros para buscar compras específicas por proveedor, sucursal o tipo de pago.",
    },
    {
      target: "id-compras-filter-proveedor",
      title: "Filtrar por Proveedor",
      description:
        "Selecciona un proveedor para ver solo las compras realizadas a ese proveedor específico.",
    },
    {
      target: "id-compras-filter-sucursal",
      title: "Filtrar por Sucursal",
      description:
        "Filtra las compras por la sucursal donde se realizaron o donde se recibió la mercancía.",
    },
    {
      target: "id-compras-filter-tipo-pago",
      title: "Filtrar por Tipo de Pago",
      description:
        "Filtra las compras por el método de pago utilizado: Contado, Crédito, Cheque, Transferencia o Tarjeta.",
    },
    {
      target: "id-compras-filter-actions",
      title: "Limpiar Filtros",
      description:
        "Haz clic en este botón para resetear todos los filtros aplicados y ver todas las compras nuevamente.",
    },
    {
      target: "id-compras-table-section",
      title: "Lista de Compras",
      description:
        "Aquí puedes ver todas las compras registradas con su información principal.",
    },
    {
      target: "id-compras-table",
      title: "Tabla de Compras",
      description:
        "En esta tabla se muestran los detalles de cada compra: número de factura, proveedor, sucursal, fecha, tipo de pago, total y estado.",
    },
    {
      target: "id-detalles-compra-producto",
      title: "Detalles de Compra",
      description:
        "Aqui podras observar los detalles de la compra de productos de tu agroservicio.",
    },
  ],
  "/agro-propietario/agro-facturas": [
    {
      target: "modulo-facturas",
      title: "Módulo de Facturas",
      description:
        "Aquí podrás gestionar todas las facturas de tu agroservicio.",
    },

    {
      target: "filters-facturacion",
      title: "Filtros de Facturación",
      description:
        "Filtra las facturas por sucursal y rango de fechas para encontrar rápidamente lo que necesitas.",
    },
    {
      target: "sucusal-facturacion",
      title: "Filtro por Sucursal",
      description:
        "Selecciona una sucursal específica para ver solo las facturas generadas en ella.",
    },
    {
      target: "fechaIn-facturacion",
      title: "Filtro por Fecha de Inicio",
      description:
        "Establece una fecha de inicio para filtrar las facturas generadas a partir de ese día.",
    },
    {
      target: "fechaFin-facturacion",
      title: "Filtro por Fecha de Fin",
      description:
        "Establece una fecha de fin para filtrar las facturas generadas hasta ese día.",
    },
    {
      target: "tabla-facturas",
      title: "Tabla de Facturas",
      description:
        "Visualiza todas las facturas generadas con su información detallada: número, fecha, sucursal, monto y estado.",
    },
    {
      target: "acciones-facturas",
      title: "Acciones de Factura",
      description:
        "Aqui podras visualizar diferentes acciones que puedes aplicar a las facturas de tu agroservicio",
    },
  ],
  "/agro-propietario/agro-rangos-facturas": [
    {
      target: "modulo-rangos",
      title: "Control de Rangos",
      description:
        "Panel completo para administrar los rangos de facturación de tu agroservicio.",
    },
    {
      target: "add-rango",
      title: "Crear Rango",
      description:
        "Registra un nuevo rango de facturación con todos los datos necesarios.",
    },
    {
      target: "estadisticas-rangos",
      title: "Estadísticas de Rangos",
      description:
        "Visualiza métricas clave: total de rangos, rangos activos y rangos próximos a vencer.",
    },

    {
      target: "buscador-rangos",
      title: "Buscador de Rangos",
      description:
        "Este buscador sirve para realizar busquedas por CAI, prefijo o agroservicio",
    },
    {
      target: "lista-rangos",
      title: "Tabla de Rangos",
      description:
        "Listado completo de rangos con información de CAI, prefijo, fechas y estado.",
    },
    {
      target: "acciones-rango",
      title: "Acciones del Rango",
      description:
        "Aqui podras realizar acciones sobre el rango, como la visualizacion de detalles y edicion de rangos",
    },
  ],
  "/agro-propietario/agro-productos": [
    {
      target: "productos-page",
      title: "Módulo de Productos",
      description:
        "Gestiona el catálogo completo de productos agropecuarios de tu agroservicio.",
    },
    {
      target: "add-productos",
      title: "Agregar Productos",
      description:
        "Aqui podras ingresar los diversos productos para tu agroservicio",
    },
    {
      target: "filtros-productos",
      title: "Filtros de Productos",
      description:
        "Filtra productos por categoría, marca y proveedor para encontrar rápidamente lo que necesitas.",
    },
    {
      target: "tabla-productos-agro",
      title: "Tabla de Productos",
      description:
        "Listado completo de todos los productos con información detallada de inventario y precios.",
    },
    {
      target: "config-escalas-descuentos",
      title: "Configuración de Escalas y Descuentos",
      description:
        "Gestiona la configuración de escalas de precios y descuentos para el producto seleccionado.",
    },
    {
      target: "edit-producto",
      title: "Editar Producto",
      description: "Modifica la información del producto seleccionado.",
    },
    {
      target: "subir-imagen-producto",
      title: "Subir Imágenes del Producto",
      description: "Administra las imágenes y galería de fotos del producto.",
    },
  ],
  "/agro-propietario/agro-proveedores": [
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
  "/agro-propietario/agro-existencia": [
    {
      target: "existencia-productos-page",
      title: "Módulo de Existencia de Productos",
      description:
        "Visualiza la existencia actual de productos en todas las sucursales de tu agroservicio.",
    },
    {
      target: "filtros-existencia",
      title: "Filtros de Existencia",
      description:
        "Filtra la existencia por sucursal o por producto específico para un análisis detallado.",
    },
    {
      target: "buscador-existencia",
      title: "Buscador de Existencia",
      description:
        "Busca productos por nombre, código o sucursal para consultar su disponibilidad.",
    },

    {
      target: "tabla-existencia",
      title: "Tabla de Existencia",
      description:
        "Listado completo de productos con su existencia actual en cada sucursal.",
    },
  ],
  "/agro-propietario/agro-impuestos": [
    {
      target: "impuestos-page",
      title: "Módulo de Impuestos",
      description:
        "Gestiona los impuestos aplicables a los productos comercializados en tu agroservicio.",
    },
    {
      target: "add-impuesto",
      title: "Agregar Impuesto",
      description:
        "Registra un nuevo impuesto para aplicarlo a los productos de tu agroservicio.",
    },
    {
      target: "tabla-impuestos",
      title: "Listado de Impuestos",
      description:
        "Visualiza todos los impuestos registrados con su nombre, porcentaje y estado.",
    },

    {
      target: "edit-impuesto",
      title: "Editar Impuesto",
      description: "Modifica el nombre o porcentaje del impuesto seleccionado.",
    },
  ],
  "/agro-propietario/agro-descuentos": [
    {
      target: "descuentos-page",
      title: "Módulo de Descuentos",
      description:
        "Gestiona los descuentos disponibles para tus clientes en el agroservicio.",
    },
    {
      target: "add-descuento",
      title: "Agregar Descuento",
      description:
        "Registra un nuevo descuento para aplicarlo a los productos de tu agroservicio.",
    },
    {
      target: "tabla-descuentos",
      title: "Listado de Descuentos",
      description:
        "Visualiza todos los descuentos registrados con su nombre, porcentaje y estado.",
    },

    {
      target: "edit-descuento",
      title: "Editar Descuento",
      description:
        "Modifica el nombre o porcentaje del descuento seleccionado.",
    },
  ],
};
