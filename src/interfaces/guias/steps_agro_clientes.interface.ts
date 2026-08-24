import { TourStep } from "@/components/agroservicio/guia/TourGuide";

export const agroClientesSteps: Record<string, TourStep[]> = {
  "/panel": [
    {
      target: "id-dashboard-clientes",
      title: "Dashboard General",
      description:
        "Aquí podrás ver métricas de diferentes secciones de tu agroservicio.",
    },
    {
      target: "id-dashboard-header",
      title: "Título del Dashboard",
      description:
        "Visualiza el título del panel y el nombre de la sección actual.",
    },
    {
      target: "id-dashboard-totales",
      title: "Métricas Principales",
      description:
        "Observa las estadísticas clave: total de animales, fincas y citas completadas.",
    },

    {
      target: "id-dashboard-tabs-list",
      title: "Pestañas de Navegación",
      description:
        "Selecciona entre Ganadería, Agrícola o Producción para ver detalles específicos.",
    },
    {
      target: "id-tab-ganaderia",
      title: "Sección Ganadería",
      description:
        "Visualiza la información relacionada con la producción ganadera.",
    },
    {
      target: "id-tab-agricola",
      title: "Sección Agrícola",
      description: "Accede a los datos y métricas agrícolas de tus cultivos.",
    },
    {
      target: "id-tab-produccion",
      title: "Sección Producción",
      description: "Revisa los indicadores de producción y rendimiento.",
    },
    {
      target: "id-tab-content-ganaderia",
      title: "Contenido Ganadero",
      description: "Detalles completos sobre la producción ganadera.",
    },
  ],
  "/fincas": [
    {
      target: "fincas-container",
      title: "Mis Fincas",
      description:
        "Aquí puedes ver todas tus fincas registradas en el sistema.",
    },
    {
      target: "buscador-principal",
      title: "Buscador de Fincas",
      description: "Busca tus fincas por nombre para encontrarlas rápidamente.",
    },
    {
      target: "titulo-mis-fincas",
      title: "Listado de Fincas",
      description:
        "Visualiza el listado completo de todas tus fincas disponibles.",
    },
    {
      target: "scroll-area-fincas",
      title: "Desplazamiento de Fincas",
      description:
        "Desplázate verticalmente para ver todas tus fincas registradas.",
    },
    {
      target: "fab-crear-finca",
      title: "Crear Nueva Finca",
      description:
        "Presiona este botón para registrar una nueva finca en el sistema.",
    },
  ],
  "/cultivos": [
    {
      target: "id-cultivo-container",
      title: "Gestión de Cultivos",
      description:
        "Aquí puedes administrar todos los cultivos registrados en tus fincas.",
    },
    {
      target: "id-cultivo-header",
      title: "Encabezado de Cultivos",
      description:
        "Visualiza el título y la descripción de la sección de cultivos.",
    },
    {
      target: "id-cultivo-add-button",
      title: "Agregar Nuevo Cultivo",
      description:
        "Presiona este botón para registrar un nuevo cultivo en tu finca.",
    },
    {
      target: "id-cultivo-filters",
      title: "Filtros de Cultivos",
      description:
        "Filtra los cultivos por finca para encontrar rápidamente lo que buscas.",
    },
    {
      target: "id-cultivo-select-trigger",
      title: "Selector de Fincas",
      description:
        "Selecciona una finca específica para ver solo sus cultivos.",
    },
    {
      target: "id-cultivo-clear-filters",
      title: "Limpiar Filtros",
      description:
        "Elimina los filtros aplicados y muestra todos los cultivos nuevamente.",
    },
    {
      target: "id-cultivo-card",
      title: "Detalles del Cultivo",
      description:
        "Haz clic en una tarjeta para ver o editar la información completa del cultivo.",
    },
    {
      target: "id-edit-cultivo",
      title: "Editar Cultivo",
      description: "Presiona este botón para editar un cultivo en tu finca.",
    },
    {
      target: "id-detalles-cultivo",
      title: "Detalles Cultivos",
      description: "Presiona este botón para ver los detalles del cultivo",
    },
    {
      target: "id-finalizar-cultivo",
      title: "Finalizar Cultivo",
      description:
        "Presiona este botón para finalizar el cultivo si este ya fue cosechado.",
    },
  ],
  "/produccion": [
    {
      target: "id-produccion-container",
      title: "Gestión de Producciones",
      description:
        "Aquí puedes administrar todas las producciones registradas en tus fincas.",
    },
    {
      target: "id-produccion-header",
      title: "Encabezado de Producciones",
      description:
        "En esta sección puedes visualizar el título y acceder al control de productos.",
    },
    {
      target: "id-produccion-control-productos",
      title: "Control de Productos",
      description:
        "Desde aquí puedes administrar los productos y consultar el inventario de tus producciones.",
    },
    {
      target: "id-produccion-productos",
      title: "Productos",
      description:
        "Accede a la sección donde puedes administrar los productos y establecer sus precios.",
    },
    {
      target: "id-produccion-inventario",
      title: "Inventario",
      description:
        "Consulta y administra el inventario disponible de tus productos.",
    },
    {
      target: "id-produccion-list",
      title: "Mis Producciones",
      description:
        "Aquí se muestran todas las producciones que tienes registradas.",
    },
    {
      target: "id-produccion-card",
      title: "Detalle de Producción",
      description:
        "Cada tarjeta representa una producción registrada y permite consultar sus principales datos.",
    },
    {
      target: "id-add-produccion",
      title: "Agregar Producción",
      description: "Presiona este botón para registrar una nueva producción.",
    },
  ],
  "/trabajadores": [
    {
      target: "id-trabajadores-container",
      title: "Gestión de Trabajadores",
      description:
        "Aquí puedes administrar los trabajadores asignados a tus fincas.",
    },
    {
      target: "id-trabajadores-header",
      title: "Encabezado de Trabajadores",
      description:
        "Desde aquí puedes identificar la sección y acceder a las principales acciones.",
    },
    {
      target: "id-trabajadores-add-button",
      title: "Nuevo Trabajador",
      description: "Presiona este botón para registrar un nuevo trabajador.",
    },
    {
      target: "id-trabajadores-search",
      title: "Buscar Trabajadores",
      description:
        "Utiliza este campo para buscar rápidamente un trabajador por nombre, identificación o teléfono.",
    },
    {
      target: "id-trabajadores-filters-button",
      title: "Filtros",
      description:
        "Utiliza esta opción para filtrar los trabajadores según su estado de verificación.",
    },
    {
      target: "id-trabajadores-filters",
      title: "Filtros de Trabajadores",
      description:
        "Aquí puedes seleccionar si deseas visualizar todos los trabajadores, los verificados o los no verificados.",
    },
    {
      target: "id-trabajadores-filter-verified",
      title: "Estado de Verificación",
      description:
        "Filtra la lista según el estado de verificación de los trabajadores.",
    },
    {
      target: "id-trabajadores-clear-filters",
      title: "Limpiar Filtros",
      description:
        "Presiona este botón para eliminar todos los filtros aplicados.",
    },
    {
      target: "id-trabajadores-stats",
      title: "Resumen de Trabajadores",
      description:
        "Aquí puedes consultar rápidamente el total de trabajadores y cuántos están verificados.",
    },
    {
      target: "id-trabajadores-list",
      title: "Lista de Trabajadores",
      description:
        "Aquí puedes visualizar todos los trabajadores registrados y administrar su información.",
    },
    {
      target: "id-ver-finca-trabajador",
      title: "Fincas Asignadas",
      description:
        "Presiona este botón para ver las fincas que tiene asignadas el trabajador.",
    },
    {
      target: "id-edit-trabajador",
      title: "Editar Trabajador",
      description:
        "Presiona este botón para editar la información del trabajador.",
    },
    {
      target: "id-options-trabajador",
      title: "Más Opciones",
      description:
        "Desde este menú puedes realizar diferentes acciones sobre el trabajador.",
    },
    {
      target: "id-trabajadores-pagination",
      title: "Paginación",
      description:
        "Utiliza estos controles para navegar entre las diferentes páginas de trabajadores.",
    },
  ],
  "/animales": [
    {
      target: "id-animales-container",
      title: "Gestión de Animales",
      description:
        "Aquí puedes administrar todos los animales registrados en tus fincas.",
    },
    {
      target: "id-animales-header",
      title: "Mis Animales",
      description:
        "En esta sección puedes consultar y administrar los animales registrados.",
    },
    {
      target: "id-animales-actions",
      title: "Acciones de Animales",
      description:
        "Desde aquí puedes acceder a las principales herramientas relacionadas con tus animales.",
    },
    {
      target: "id-carga-masiva",
      title: "Carga Masiva",
      description:
        "Utiliza esta opción para registrar varios animales de forma rápida mediante una carga masiva.",
    },
    {
      target: "id-control-peso",
      title: "Control de Peso",
      description:
        "Desde aquí puedes acceder a las herramientas para registrar y consultar el peso de tus animales.",
    },
    {
      target: "id-alimentacion-animal",
      title: "Alimentación",
      description:
        "Accede a la sección donde puedes consultar y administrar la alimentación de tus animales.",
    },
    {
      target: "id-animales-filters",
      title: "Filtros de Animales",
      description:
        "Utiliza estas opciones para encontrar rápidamente los animales que necesitas consultar.",
    },
    {
      target: "id-buscador-animal",
      title: "Buscar Animal",
      description: "Busca un animal utilizando su identificador o nombre.",
    },
    {
      target: "id-select-finca-animal",
      title: "Filtrar por Finca",
      description:
        "Selecciona una finca para mostrar únicamente los animales registrados en ella.",
    },
    {
      target: "id-animales-active-filters",
      title: "Filtros Activos",
      description:
        "Aquí puedes visualizar los filtros que están aplicados actualmente.",
    },
    {
      target: "id-animales-clear-filters",
      title: "Limpiar Filtros",
      description:
        "Presiona este botón para eliminar todos los filtros aplicados y mostrar nuevamente todos los animales.",
    },
    {
      target: "id-animales-list",
      title: "Lista de Animales",
      description:
        "Aquí se muestran las tarjetas con los animales registrados en tus fincas.",
    },
    {
      target: "id-animal-card",
      title: "Información del Animal",
      description:
        "Cada tarjeta contiene la información principal del animal y las acciones disponibles para administrarlo.",
    },
    {
      target: "id-animales-load-more",
      title: "Cargar Más Animales",
      description:
        "Utiliza esta opción para cargar más animales cuando existen registros adicionales.",
    },
    {
      target: "id-add-animal",
      title: "Agregar Animal",
      description: "Presiona este botón para registrar un nuevo animal.",
    },
  ],
  "/servicios": [
    {
      target: "id-servicios-container",
      title: "Gestión de Servicios",
      description:
        "Aquí puedes visualizar y seleccionar todos los servicios disponibles para agendar citas.",
    },
    {
      target: "id-servicios-header",
      title: "Encabezado de Servicios",
      description:
        "Desde aquí puedes identificar la sección y ver el título principal.",
    },
    {
      target: "id-servicios-title",
      title: "Título de la Sección",
      description: "Título principal de la sección de servicios.",
    },
    {
      target: "id-servicios-list",
      title: "Lista de Servicios",
      description:
        "Aquí puedes visualizar todos los servicios activos disponibles.",
    },
    {
      target: "id-servicios-empty-container",
      title: "Estado Vacío",
      description:
        "Este mensaje se muestra cuando no hay servicios disponibles.",
    },
    {
      target: "id-servicios-empty-component",
      title: "Componente de Estado Vacío",
      description: "Muestra información cuando no hay servicios activos.",
    },
    {
      target: "id-add-cita",
      title: "Agendar Cita",
      description:
        "Aqui podras agendar una nueva cita sobre el servicio seleccionado",
    },
  ],
  "/productos": [
    {
      target: "id-container-productos",
      title: "Gestión de Productos",
      description: "Aquí puedes consultar todos los productos disponibles.",
    },
    {
      target: "id-productos-header",
      title: "Productos Disponibles",
      description:
        "En esta sección puedes explorar los productos disponibles en el sistema.",
    },
    {
      target: "id-categorias-productos",
      title: "Categorías",
      description:
        "Utiliza las categorías para filtrar los productos y encontrar rápidamente lo que buscas.",
    },
    {
      target: "id-categoria-todos",
      title: "Todos los Productos",
      description:
        "Selecciona esta opción para mostrar productos de todas las categorías.",
    },
    {
      target: "id-list-productos",
      title: "Lista de Productos",
      description:
        "Aquí se muestran todos los productos disponibles organizados en tarjetas.",
    },
    {
      target: "id-producto-card",
      title: "Producto",
      description:
        "Selecciona un producto para consultar su información y conocer más detalles.",
    },
    {
      target: "id-empty-productos",
      title: "Sin Productos",
      description:
        "No se encontraron productos para mostrar actualmente en el agroservicio.",
    },
    {
      target: "add-btn-favorite-product",
      title: "Productos Favoritos",
      description:
        "Al darle click al boton puedes agregar tús productos favoritos.",
    },
    {
      target: "id-btn-detalles-productos",
      title: "Detalles del Producto",
      description:
        "Al darle click al boton puedes ver mas detalles del productos seleccionado.",
    },
  ],
  "/citas": [
    {
      target: "id-citas-container",
      title: "Gestión de Citas",
      description:
        "Aquí puedes visualizar y administrar todas tus citas agendadas.",
    },
    {
      target: "id-citas-header",
      title: "Encabezado de Citas",
      description:
        "Desde aquí puedes identificar la sección y acceder a las principales acciones.",
    },
    {
      target: "id-citas-title",
      title: "Título de la Sección",
      description: "Título principal de la sección de historial de citas.",
    },
    {
      target: "id-citas-refresh",
      title: "Actualizar Citas",
      description: "Presiona este botón para actualizar la lista de citas.",
    },
    {
      target: "id-citas-scroll-area",
      title: "Lista de Citas",
      description:
        "Aquí puedes visualizar todas tus citas en formato de tarjetas.",
    },
    {
      target: "id-citas-list",
      title: "Contenedor de Citas",
      description: "Lista completa de todas tus citas agendadas.",
    },
    {
      target: "id-citas-card-wrapper",
      title: "Tarjeta de Cita",
      description:
        "Cada tarjeta muestra la información de una cita. Presiona para ver más detalles.",
    },
    {
      target: "id-citas-empty-container",
      title: "Estado Vacío",
      description: "Este mensaje se muestra cuando no hay citas registradas.",
    },
    {
      target: "id-citas-empty-alert",
      title: "Alerta de Estado Vacío",
      description: "Muestra información cuando no hay citas disponibles.",
    },
    {
      target: "id-citas-empty-title",
      title: "Título de Estado Vacío",
      description: "Título que indica que no hay citas encontradas.",
    },
    {
      target: "id-citas-empty-description",
      title: "Descripción de Estado Vacío",
      description: "Descripción que explica que no hay citas disponibles.",
    },
    {
      target: "id-citas-empty-retry",
      title: "Reintentar",
      description:
        "Presiona este botón para intentar cargar las citas nuevamente.",
    },
    {
      target: "id-citas-load-more",
      title: "Cargar Más Citas",
      description: "Presiona este botón para cargar más citas en la lista.",
    },
    {
      target: "id-citas-fab",
      title: "Agregar Cita",
      description: "Botón flotante para agendar una nueva cita rápidamente.",
    },
  ],
};
