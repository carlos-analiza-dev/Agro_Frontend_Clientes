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
      target: "message-error-empty",
      title: "Sin Fincas",
      description:
        "Aquí se mostrará un mensaje cuando no tengas fincas registradas o no se encuentren resultados.",
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
      target: "add-animal-btn",
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
  "/pedidos": [
    {
      target: "id-container-pedidos",
      title: "Gestión de Pedidos",
      description:
        "Aquí puedes visualizar y consultar todos tus pedidos realizados.",
    },
    {
      target: "id-cards-pedidos",
      title: "Lista de Pedidos",
      description: "Aquí se muestran tus pedidos en formato de tarjetas.",
    },

    {
      target: "id-pedidos-empty-container",
      title: "Sin Pedidos",
      description:
        "Esta sección se muestra cuando no existen pedidos disponibles para consultar.",
    },
    {
      target: "id-nuevo-pedido",
      title: "Crear Nuevo Pedido",
      description:
        "Esta sección se muestra para que puedas crear un nuevo pedido.",
    },
    {
      target: "id-cancel-pedido",
      title: "Cancelar Pedido",
      description: "Al dar click en el boton cancelaras el pedido realizado.",
    },
    {
      target: "btn-impuestos-pedidos",
      title: "Impuestos del Pedido",
      description:
        "Al dar click en el boton podras ver u ocultar los impuestos asociados al pedido.",
    },
  ],
  "/pedidos-procesados": [
    {
      target: "id-container-pedidos",
      title: "Gestión de Pedidos",
      description:
        "Aquí puedes visualizar y consultar todos tus pedidos realizados.",
    },
    {
      target: "id-cards-pedidos",
      title: "Lista de Pedidos",
      description: "Aquí se muestran tus pedidos en formato de tarjetas.",
    },

    {
      target: "id-pedidos-empty-container",
      title: "Sin Pedidos",
      description:
        "Esta sección se muestra cuando no existen pedidos disponibles para consultar.",
    },
    {
      target: "id-nuevo-pedido",
      title: "Crear Nuevo Pedido",
      description:
        "Esta sección se muestra para que puedas crear un nuevo pedido.",
    },
    {
      target: "id-cancel-pedido",
      title: "Cancelar Pedido",
      description: "Al dar click en el boton cancelaras el pedido realizado.",
    },
    {
      target: "btn-impuestos-pedidos",
      title: "Impuestos del Pedido",
      description:
        "Al dar click en el boton podras ver u ocultar los impuestos asociados al pedido.",
    },
  ],
  "/pedidos-facturados": [
    {
      target: "id-container-pedidos",
      title: "Gestión de Pedidos",
      description:
        "Aquí puedes visualizar y consultar todos tus pedidos realizados.",
    },
    {
      target: "id-cards-pedidos",
      title: "Lista de Pedidos",
      description: "Aquí se muestran tus pedidos en formato de tarjetas.",
    },

    {
      target: "id-pedidos-empty-container",
      title: "Sin Pedidos",
      description:
        "Esta sección se muestra cuando no existen pedidos disponibles para consultar.",
    },
    {
      target: "id-nuevo-pedido",
      title: "Crear Nuevo Pedido",
      description:
        "Esta sección se muestra para que puedas crear un nuevo pedido.",
    },
    {
      target: "id-cancel-pedido",
      title: "Cancelar Pedido",
      description: "Al dar click en el boton cancelaras el pedido realizado.",
    },
    {
      target: "btn-impuestos-pedidos",
      title: "Impuestos del Pedido",
      description:
        "Al dar click en el boton podras ver u ocultar los impuestos asociados al pedido.",
    },
  ],
  "/pedidos-cancelados": [
    {
      target: "id-container-pedidos",
      title: "Gestión de Pedidos",
      description:
        "Aquí puedes visualizar y consultar todos tus pedidos realizados.",
    },
    {
      target: "id-cards-pedidos",
      title: "Lista de Pedidos",
      description: "Aquí se muestran tus pedidos en formato de tarjetas.",
    },

    {
      target: "id-pedidos-empty-container",
      title: "Sin Pedidos",
      description:
        "Esta sección se muestra cuando no existen pedidos disponibles para consultar.",
    },
    {
      target: "id-nuevo-pedido",
      title: "Crear Nuevo Pedido",
      description:
        "Esta sección se muestra para que puedas crear un nuevo pedido.",
    },
    {
      target: "id-cancel-pedido",
      title: "Cancelar Pedido",
      description: "Al dar click en el boton cancelaras el pedido realizado.",
    },
    {
      target: "btn-impuestos-pedidos",
      title: "Impuestos del Pedido",
      description:
        "Al dar click en el boton podras ver u ocultar los impuestos asociados al pedido.",
    },
  ],
  "/gastos": [
    {
      target: "gastos-page-title",
      title: "Control de Gastos",
      description:
        "Desde esta sección puedes registrar, consultar y monitorear los gastos de tus fincas.",
    },
    {
      target: "gastos-filters-btn",
      title: "Filtros",
      description:
        "Utiliza los filtros para buscar gastos por finca, especie, categoría, método de pago o rango de fechas.",
    },
    {
      target: "add-gasto-btn",
      title: "Nuevo Gasto",
      description:
        "Haz clic aquí para registrar un nuevo gasto. En dispositivos móviles se abrirá la pantalla correspondiente.",
    },
    {
      target: "gastos-table",
      title: "Listado de Gastos",
      description:
        "Aquí puedes consultar los gastos registrados y acceder a las opciones disponibles para cada uno.",
    },
    {
      target: "btn-edit-gasto",
      title: "Editar Gasto",
      description:
        "Haz clic aquí para editar un gasto. En dispositivos móviles se abrirá la pantalla correspondiente.",
    },
    {
      target: "gastos-pagination",
      title: "Paginación",
      description:
        "Utiliza estos controles para navegar entre las diferentes páginas de gastos.",
    },
    {
      target: "gastos-summary",
      title: "Resumen de Gastos",
      description:
        "Aquí puedes consultar el total de gastos y la cantidad de registros que se están mostrando.",
    },
  ],
  "/ingresos": [
    {
      target: "ingresos-page-title",
      title: "Control de Ingresos",
      description:
        "Desde esta sección puedes registrar, consultar y monitorear los ingresos de tus fincas.",
    },
    {
      target: "ingresos-filters-btn",
      title: "Filtros",
      description:
        "Utiliza los filtros para buscar ingresos por finca, especie, categoría, método de pago o rango de fechas.",
    },
    {
      target: "add-ingreso-btn",
      title: "Nuevo Ingreso",
      description: "Haz clic aquí para registrar un nuevo ingreso.",
    },
    {
      target: "ingresos-table",
      title: "Listado de Ingresos",
      description:
        "Aquí puedes consultar los ingresos registrados y acceder a las acciones disponibles.",
    },
    {
      target: "edit-ingreso-btn",
      title: "Editar Ingreso",
      description: "Haz clic aquí para editar un ingreso.",
    },
    {
      target: "ingresos-pagination",
      title: "Paginación",
      description:
        "Utiliza estos controles para navegar entre las diferentes páginas de ingresos.",
    },
    {
      target: "ingresos-summary",
      title: "Resumen de Ingresos",
      description:
        "Aquí puedes consultar el total de ingresos y la cantidad de registros que se están mostrando.",
    },
  ],
  "/rentabilidad": [
    {
      target: "rentabilidad-page-title",
      title: "Dashboard de Rentabilidad",
      description:
        "Desde este dashboard puedes analizar la rentabilidad y el comportamiento financiero de tu negocio ganadero.",
    },
    {
      target: "rentabilidad-filters",
      title: "Filtros",
      description:
        "Utiliza los filtros para consultar la rentabilidad según finca, especie y el período que deseas analizar.",
    },
    {
      target: "rentabilidad-metrics",
      title: "Indicadores principales",
      description:
        "Aquí puedes consultar los principales indicadores financieros: ingresos, gastos, rentabilidad neta y margen de rentabilidad.",
    },
    {
      target: "rentabilidad-indicators",
      title: "ROI y Beneficio/Costo",
      description:
        "Estos indicadores te permiten conocer el retorno de inversión y cuánto ingreso generas por cada unidad monetaria gastada.",
    },
    {
      target: "rentabilidad-tabs",
      title: "Análisis de rentabilidad",
      description:
        "Utiliza estas pestañas para analizar la evolución, las categorías y el rendimiento de tus fincas.",
    },
    {
      target: "rentabilidad-evolucion",
      title: "Evolución",
      description:
        "Consulta cómo ha evolucionado la rentabilidad a través del tiempo y compara los mejores y peores períodos.",
    },
    {
      target: "rentabilidad-categorias",
      title: "Categorías",
      description:
        "Analiza cómo se distribuyen tus ingresos y gastos según las diferentes categorías.",
    },
    {
      target: "rentabilidad-fincas",
      title: "Fincas",
      description:
        "Compara la rentabilidad de tus diferentes fincas para identificar cuáles tienen mejor desempeño.",
    },
  ],
  "/configuracion-trabajador": [
    {
      target: "config-trabajadores-page-title",
      title: "Configuración de Trabajadores",
      description:
        "Desde esta sección puedes gestionar los salarios, cargos y configuraciones de tus trabajadores.",
    },
    {
      target: "add-config-trabajador-btn",
      title: "Nuevo Trabajador",
      description:
        "Haz clic aquí para agregar la configuración de un nuevo trabajador.",
    },
    {
      target: "config-trabajadores-stats",
      title: "Resumen de Trabajadores",
      description:
        "Aquí puedes consultar el total de trabajadores, el salario promedio diario y la cantidad de trabajadores activos.",
    },
    {
      target: "config-trabajadores-filters",
      title: "Búsqueda y filtros",
      description:
        "Utiliza estas opciones para encontrar rápidamente trabajadores y filtrar la lista según su estado.",
    },
    {
      target: "config-trabajadores-table",
      title: "Listado de Trabajadores",
      description:
        "Aquí puedes consultar las configuraciones de tus trabajadores y acceder a las acciones disponibles.",
    },
    {
      target: "detalles-config-trabajador-btn",
      title: "Detalles del Trabajador",
      description:
        "Haz clic aquí para ver los detalles de la configuracion del trabajador.",
    },
    {
      target: "edit-config-trabajador-btn",
      title: "Editar Trabajador",
      description: "Haz clic aquí para editar la configuración del trabajador.",
    },
    {
      target: "config-trabajadores-pagination",
      title: "Paginación",
      description:
        "Utiliza estos controles para navegar entre las diferentes páginas de trabajadores.",
    },
  ],
  "/jornadas": [
    {
      target: "jornadas-trabajadores-page-title",
      title: "Jornadas de Trabajadores",
      description:
        "Desde esta sección puedes registrar y consultar las jornadas laborales y horas extras de tus trabajadores.",
    },
    {
      target: "add-jornada-trabajador-btn",
      title: "Registrar Jornada",
      description:
        "Haz clic aquí para registrar la jornada diaria de un trabajador.",
    },
    {
      target: "jornadas-trabajadores-stats",
      title: "Resumen de Jornadas",
      description:
        "Aquí puedes consultar el total de registros, los días trabajados y las horas extras acumuladas.",
    },
    {
      target: "jornadas-trabajadores-filters",
      title: "Filtros de búsqueda",
      description:
        "Utiliza estos filtros para buscar jornadas por trabajador, rango de fechas, mes o estado de trabajo.",
    },
    {
      target: "jornadas-trabajadores-table",
      title: "Listado de Jornadas",
      description:
        "Aquí puedes consultar las jornadas registradas y acceder a las opciones disponibles para editarlas.",
    },
    {
      target: "id-export-excel-jornada",
      title: "Exportar Excel de las Jornadas",
      description:
        "Aquí puedes generar un excel el cual mostrara un resumen de las jornadas por trabajador.",
    },
    {
      target: "detalles-jornada-trabajador-btn",
      title: "Detalles de la Jornada",
      description:
        "Haz clic aquí para ver los detalles de la jornada del trabajador.",
    },
    {
      target: "edit-jornada-trabajador-btn",
      title: "Editar Jornada",
      description: "Haz clic aquí para editar la jornada del trabajador.",
    },
    {
      target: "jornadas-trabajadores-pagination",
      title: "Paginación",
      description:
        "Utiliza estos controles para navegar entre las diferentes páginas de jornadas.",
    },
  ],
  "/planillas": [
    {
      target: "id-planillas-header",
      title: "Planillas de trabajadores",
      description:
        "Desde esta sección puedes gestionar las nóminas y pagos de tus trabajadores.",
    },
    {
      target: "add-planilla-btn",
      title: "Nueva planilla",
      description:
        "Utiliza este botón para crear una nueva planilla de trabajadores.",
    },
    {
      target: "id-resumen-planillas",
      title: "Resumen de planillas",
      description:
        "Aquí puedes consultar rápidamente el total de planillas, las pagadas, el total neto y las que están en proceso.",
    },
    {
      target: "id-filters-planillas",
      title: "Filtros",
      description:
        "Utiliza los filtros para consultar las planillas por rango de fechas, mes o estado.",
    },
    {
      target: "id-table-planillas",
      title: "Listado de planillas",
      description:
        "Aquí encontrarás el listado de planillas y podrás consultar o editar cada registro.",
    },
    {
      target: "id-acciones-planilla",
      title: "Acciones de Planilla",
      description:
        "Aquí podras observar las diferentes acciones que se pueden ejecutar sobre una planilla.",
    },
    {
      target: "id-detalle-planilla",
      title: "Detalles de Planilla",
      description:
        "Aquí podras observar los detalles relacionados a la planilla y edicion de la misma.",
    },
  ],
  "/reportes-planillas": [
    {
      target: "id-filtros-reportes-planillas",
      title: "Filtros de reportes",
      description:
        "Utiliza estos filtros para consultar los pagos de trabajadores por período y método de pago.",
    },
    {
      target: "id-total-pagado-planillas",
      title: "Total pagado",
      description:
        "Aquí puedes consultar el total pagado a los trabajadores según los filtros seleccionados.",
    },
    {
      target: "id-resumen-estados-planillas",
      title: "Estados de las planillas",
      description:
        "Consulta un resumen de las planillas agrupadas según su estado.",
    },
    {
      target: "id-resumen-horas-extras-planillas",
      title: "Horas extras",
      description:
        "Visualiza el resumen de horas extras generadas por los trabajadores.",
    },
    {
      target: "id-resumen-metodos-pago-planillas",
      title: "Métodos de pago",
      description:
        "Consulta cómo se distribuyen los pagos realizados según el método utilizado.",
    },
  ],
  "/actividades": [
    {
      target: "id-title-actividades",
      title: "Actividades diarias",
      description:
        "Desde esta sección puedes gestionar y dar seguimiento a las actividades realizadas por tus trabajadores.",
    },
    {
      target: "add-actividad-btn",
      title: "Agregar actividad",
      description:
        "Utiliza este botón para registrar una nueva actividad de un trabajador.",
    },
    {
      target: "id-filtros-actividades",
      title: "Filtros de búsqueda",
      description:
        "Puedes utilizar los filtros para encontrar actividades específicas por trabajador, finca, fechas u otros criterios.",
    },
    {
      target: "id-estados-actividades",
      title: "Filtrar por estado",
      description:
        "Utiliza estas pestañas para consultar rápidamente las actividades según su estado.",
    },
    {
      target: "id-grid-actividades",
      title: "Actividades registradas",
      description:
        "Aquí se muestran las actividades registradas y su información correspondiente.",
    },
    {
      target: "id-options-actividades",
      title: "Acciones de actividades",
      description:
        "Aquí se muestran las acciones que se pueden realizar sobre una actividad como ser: 'Ver detalles', 'Cancelar', 'Eliminar'",
    },
    {
      target: "id-paginacion-actividades",
      title: "Paginación",
      description:
        "Utiliza la paginación para navegar entre las diferentes páginas de actividades.",
    },
  ],
  "/equipos": [
    {
      target: "id-title-equipos",
      title: "Equipos y maquinaria",
      description:
        "En esta sección puedes consultar, registrar y monitorear los equipos y maquinaria utilizados en tus fincas.",
    },
    {
      target: "add-equipo-btn",
      title: "Agregar equipo",
      description:
        "Utiliza este botón para registrar un nuevo equipo o maquinaria y asignarlo a una finca.",
    },
    {
      target: "id-resumen-equipos",
      title: "Resumen de equipos",
      description:
        "Aquí puedes consultar rápidamente la cantidad de equipos registrados, activos, en mantenimiento e inactivos.",
    },
    {
      target: "id-filters-equipos",
      title: "Filtros de equipos",
      description:
        "Utiliza los filtros para buscar equipos por finca, estado u otros criterios disponibles.",
    },
    {
      target: "id-table-equipos",
      title: "Listado de equipos",
      description:
        "Aquí se muestra el listado de equipos y maquinaria registrados en el sistema.",
    },
    {
      target: "id-list-equipos",
      title: "Equipos registrados",
      description:
        "Desde este listado puedes consultar la información de cada equipo y acceder a sus acciones disponibles.",
    },
    {
      target: "edit-equipo-btn",
      title: "Editar equipo",
      description:
        "Utiliza este botón para editar el equipo o maquinaria y asignarlo a una finca.",
    },
    {
      target: "id-pagination-equipos",
      title: "Paginación",
      description:
        "Utiliza la paginación para navegar entre las diferentes páginas de equipos registrados.",
    },
  ],
  "/mantenimientos": [
    {
      target: "id-add-mantenimiento",
      title: "Ingresar mantenimiento",
      description:
        "Utiliza este botón para registrar un nuevo mantenimiento de tus equipos o maquinaria.",
    },
    {
      target: "id-filters-mantenimientos",
      title: "Filtros de mantenimientos",
      description:
        "Utiliza estos filtros para buscar mantenimientos por tipo, fechas o finca.",
    },
    {
      target: "id-resumen-mantenimientos",
      title: "Resumen de mantenimientos",
      description:
        "Aquí puedes ver la cantidad de mantenimientos mostrados y el total de mantenimientos registrados.",
    },
    {
      target: "id-container-mantenimientos",
      title: "Mantenimientos registrados",
      description:
        "En esta sección se muestran los mantenimientos registrados de tus equipos y maquinaria.",
    },
    {
      target: "id-edit-mantenimiento",
      title: "Editar mantenimiento",
      description:
        "Utiliza este botón para editar el mantenimiento de tus equipos o maquinaria.",
    },
    {
      target: "id-paginacion-mantenimientos",
      title: "Paginación",
      description:
        "Utiliza la paginación para navegar entre las diferentes páginas de mantenimientos.",
    },
  ],
  "/uso-equipos": [
    {
      target: "id-add-uso-equipos",
      title: "Registrar uso de equipo",
      description:
        "Utiliza este botón para registrar un nuevo uso de un equipo o maquinaria por parte de un operador.",
    },
    {
      target: "id-filters-uso-equipos",
      title: "Filtros de búsqueda",
      description:
        "Utiliza estos filtros para buscar registros de uso por equipo u operador.",
    },
    {
      target: "id-resumen-uso-equipos",
      title: "Resumen de registros",
      description:
        "Aquí puedes visualizar la cantidad de registros mostrados y el total de registros de uso disponibles.",
    },
    {
      target: "id-table-uso-equipos",
      title: "Registros de uso",
      description:
        "En esta sección se muestran los registros de uso de equipos, incluyendo la información del equipo y del operador.",
    },
    {
      target: "id-edit-uso-equipos",
      title: "Editar uso de equipo",
      description:
        "Utiliza este botón para editar el uso de un equipo o maquinaria por parte de un operador.",
    },
    {
      target: "id-paginacion-uso-equipos",
      title: "Paginación",
      description:
        "Utiliza la paginación para navegar entre las diferentes páginas de registros de uso.",
    },
  ],
  "/diagnostico": [
    {
      target: "id-header-diagnostico",
      title: "Diagnóstico Veterinario",
      description:
        "Desde esta sección puedes obtener un diagnóstico veterinario preliminar a partir de los datos y síntomas de un animal.",
    },
    {
      target: "id-form-diagnostico",
      title: "Datos del paciente",
      description:
        "Ingresa los datos del animal, como especie, raza, edad y síntomas, para realizar el diagnóstico.",
    },
    {
      target: "btn-obtener-diagnostico",
      title: "Obtener Diagnostico Preliminar",
      description:
        "Al dar click en el botón generaras un diagnostico preliminar.",
    },
    {
      target: "id-resultados-diagnostico",
      title: "Resultados del diagnóstico",
      description:
        "Aquí se mostrará el resultado del diagnóstico preliminar generado a partir de los datos ingresados.",
    },
  ],
  "/agricultura-inteligente": [
    {
      target: "id-header-consulta-agricola",
      title: "Consulta agricola",
      description:
        "Aqui podras generar consultas preliminares sobre agricultura.",
    },
    {
      target: "id-form-consulta-agricola",
      title: "Datos del cultivo",
      description:
        "Aquí puedes ingresar la información del cultivo, tipo de suelo, clima y problemas observados para obtener recomendaciones agrícolas.",
    },
    {
      target: "id-btn-agricola",
      title: "Obtener Diagnóstico Agricola",
      description:
        "Al darle click al boton podras generar de forma preliminar un diagnostico agricola según los datos ingresados en el formulario.",
    },
    {
      target: "id-resultados-consulta-agricola",
      title: "Resultados de la consulta",
      description:
        "En esta sección se muestran el análisis y las recomendaciones generadas a partir de los datos ingresados.",
    },
  ],
  "/siembra-inteligente": [
    {
      target: "id-form-siembra-inteligente",
      title: "Datos del terreno",
      description:
        "Aquí puedes ingresar la información del cultivo, tipo de terreno, clima y área para calcular la densidad de siembra recomendada.",
    },
    {
      target: "id-btn-siembra-inteligente",
      title: "Calcular Densidad",
      description:
        "Al darle click al boton se obtendra una recomendación optima de la densidad de la siembra que ingreses en el formulario.",
    },
    {
      target: "id-resultados-siembra-inteligente",
      title: "Resultados de la siembra",
      description:
        "En esta sección se muestra la recomendación de densidad de siembra calculada a partir de los datos ingresados.",
    },
  ],
  "/historial-medico": [
    {
      target: "id-filters-historial-clinico",
      title: "Filtros de búsqueda",
      description:
        "Utiliza estos filtros para buscar historiales clínicos por finca, animal y rango de fechas.",
    },
    {
      target: "id-paginacion-historial-clinico",
      title: "Control de paginación",
      description:
        "Aquí puedes seleccionar cuántos historiales mostrar por página y navegar entre las diferentes páginas.",
    },
    {
      target: "id-resumen-historial-clinico",
      title: "Resumen de historiales",
      description:
        "Consulta rápidamente el total de historiales, las fincas atendidas y los animales que han recibido atención.",
    },
    {
      target: "id-listado-historial-clinico",
      title: "Historiales clínicos",
      description:
        "Aquí se muestran los historiales clínicos de tus animales con la información registrada en cada atención.",
    },
    {
      target: "btn-download-historial",
      title: "Descargar Historial clínico",
      description:
        "Al darle click al botón podras descargar el documento del historial clinico adjuntado.",
    },
    {
      target: "id-paginacion-historial-clinico-inferior",
      title: "Navegación entre historiales",
      description:
        "Utiliza estos controles para avanzar, retroceder o ir directamente a una página específica de historiales.",
    },
  ],
  "/tratamientos": [
    {
      target: "tratamientos-header",
      title: "Tratamientos Animales",
      description:
        "Desde aquí puedes consultar y gestionar los tratamientos aplicados a tus animales.",
    },
    {
      target: "tratamientos-filtros",
      title: "Filtros de búsqueda",
      description:
        "Utiliza estos filtros para buscar tratamientos por finca, animal o rango de fechas.",
    },
    {
      target: "tratamientos-total",
      title: "Total de tratamientos",
      description:
        "Aquí puedes consultar la cantidad total de tratamientos registrados.",
    },
    {
      target: "tratamientos-documentos",
      title: "Tratamientos con documentos",
      description: "Consulta cuántos tratamientos tienen documentos asociados.",
    },
    {
      target: "tratamientos-servicios",
      title: "Servicios diferentes",
      description:
        "Muestra la cantidad de servicios veterinarios diferentes registrados.",
    },
    {
      target: "tratamientos-recientes",
      title: "Tratamientos recientes",
      description:
        "Aquí puedes identificar los tratamientos registrados durante los últimos 7 días.",
    },
    {
      target: "tratamientos-lista",
      title: "Tratamientos aplicados",
      description:
        "En esta sección se muestran los tratamientos registrados y sus detalles.",
    },
    {
      target: "btn-download-doc-tratamiento",
      title: "Descargar documento del tratamiento adjuntado",
      description:
        "Al darle click al boton podras descargar el documento del tratamiento.",
    },
    {
      target: "tratamientos-paginacion-inferior",
      title: "Paginación",
      description:
        "Utiliza estos controles para navegar entre las páginas de tratamientos.",
    },
  ],
  "/celos": [
    {
      target: "celos-header",
      title: "Control de Celos",
      description:
        "Desde aquí puedes registrar y monitorear los períodos de celo de tus animales.",
    },
    {
      target: "celos-nuevo-btn",
      title: "Nuevo Celo",
      description:
        "Utiliza este botón para registrar un nuevo período de celo para uno de tus animales.",
    },
    {
      target: "celos-filtros",
      title: "Filtros de búsqueda",
      description:
        "Utiliza los filtros para buscar registros por finca, animal, especie, intensidad o rango de fechas.",
    },
    {
      target: "celos-tabla",
      title: "Registros de celo",
      description:
        "Aquí puedes consultar los registros de celo y acceder al detalle de cada registro.",
    },
    {
      target: "celos-detalle-btn",
      title: "Detalles del Celo",
      description:
        "Utiliza este botón para observar los detalles del período de celo para uno de tus animales.",
    },
    {
      target: "celos-edit-btn",
      title: "Editar Celo",
      description:
        "Utiliza este botón para editar el período de celo para uno de tus animales.",
    },
    {
      target: "celos-delete-btn",
      title: "Eliminar Celo",
      description:
        "Utiliza este botón para eliminar el período de celo para uno de tus animales.",
    },
    {
      target: "celos-paginacion",
      title: "Paginación",
      description:
        "Utiliza estos controles para navegar entre las diferentes páginas de registros.",
    },
  ],
  "/servicios-reproductivos": [
    {
      target: "servicios-reproductivos-header",
      title: "Servicios Reproductivos",
      description:
        "Desde aquí puedes registrar, consultar y monitorear los servicios reproductivos de tus animales.",
    },
    {
      target: "servicios-reproductivos-nuevo",
      title: "Nuevo Servicio",
      description:
        "Utiliza este botón para registrar un nuevo servicio reproductivo.",
    },
    {
      target: "servicios-reproductivos-filtros",
      title: "Filtros de búsqueda",
      description:
        "Utiliza los filtros para consultar servicios por finca y animal.",
    },
    {
      target: "servicios-reproductivos-resumen",
      title: "Resumen",
      description:
        "Aquí puedes consultar las estadísticas principales de los servicios reproductivos.",
    },
    {
      target: "servicios-reproductivos-lista",
      title: "Servicios registrados",
      description:
        "En esta sección puedes consultar los servicios reproductivos registrados y realizar acciones sobre ellos.",
    },
    {
      target: "btn-estados-servicios",
      title: "Estado de servicios registrados",
      description:
        "Al dar click al botón podras observar los estados del servicio seleccionado.",
    },
    {
      target: "btn-edit-servicio",
      title: "Editar Servicio",
      description:
        "Al dar click al botón podras editar el servicio seleccionado.",
    },
    {
      target: "servicios-reproductivos-paginacion",
      title: "Paginación",
      description:
        "Utiliza estos controles para navegar entre las diferentes páginas de servicios.",
    },
  ],
  "/partos-animales": [
    {
      target: "partos-header",
      title: "Control de Partos",
      description:
        "Desde aquí puedes consultar y monitorear los partos registrados de tus animales.",
    },
    {
      target: "partos-nuevo-btn",
      title: "Nuevo Parto",
      description:
        "Utiliza este botón para registrar un nuevo parto de uno de tus animales.",
    },
    {
      target: "partos-filtros",
      title: "Filtros",
      description:
        "Utiliza los filtros para consultar partos por finca, hembra, estado, tipo de parto o fechas.",
    },
    {
      target: "partos-lista",
      title: "Historial de Partos",
      description:
        "Aquí se muestran los partos registrados y puedes consultar o editar su información.",
    },
    {
      target: "partos-edit-btn",
      title: "Editar Parto",
      description:
        "Utiliza este botón para editar el parto de uno de tus animales.",
    },
    {
      target: "partos-paginacion",
      title: "Paginación",
      description:
        "Utiliza estos controles para navegar entre las diferentes páginas de partos.",
    },
    {
      target: "partos-detalles",
      title: "Resumen de Partos",
      description:
        "Aquí puedes consultar información adicional y detalles de los partos registrados.",
    },
  ],
  "/perfil": [
    {
      target: "perfil-header",
      title: "Tu perfil",
      description:
        "Desde aquí puedes consultar y administrar la información de tu perfil.",
    },
    {
      target: "perfil-foto",
      title: "Foto de perfil",
      description:
        "Aquí puedes visualizar tu foto de perfil y acceder a tu galería de imágenes.",
    },
    {
      target: "perfil-cambiar-foto",
      title: "Cambiar foto",
      description:
        "Utiliza este botón para seleccionar y actualizar tu foto de perfil.",
    },
    {
      target: "perfil-datos-principales",
      title: "Información principal",
      description:
        "Aquí puedes consultar tu nombre y correo electrónico asociado a tu cuenta.",
    },
    {
      target: "perfil-datos-contacto",
      title: "Información de contacto",
      description:
        "En esta sección puedes consultar tu ubicación, teléfono y fecha de registro.",
    },
  ],
};
