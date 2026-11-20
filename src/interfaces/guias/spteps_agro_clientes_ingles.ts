import { TourStep } from "@/components/agroservicio/guia/TourGuide";

export const agroClientesStepsEnglish: Record<string, TourStep[]> = {
  "/panel": [
    {
      target: "id-dashboard-clientes",
      title: "General Dashboard",
      description:
        "Here you can view metrics from different sections of your agro-service.",
    },
    {
      target: "id-dashboard-header",
      title: "Dashboard Title",
      description: "View the panel title and the name of the current section.",
    },
    {
      target: "id-dashboard-totales",
      title: "Main Metrics",
      description:
        "View the key statistics: total animals, farms, and completed appointments.",
    },
    {
      target: "id-dashboard-tabs-list",
      title: "Navigation Tabs",
      description:
        "Select between Livestock, Agriculture, or Production to view specific details.",
    },
    {
      target: "id-tab-ganaderia",
      title: "Livestock Section",
      description: "View information related to livestock production.",
    },
    {
      target: "id-tab-agricola",
      title: "Agriculture Section",
      description: "Access data and agricultural metrics for your crops.",
    },
    {
      target: "id-tab-produccion",
      title: "Production Section",
      description: "Review production and performance indicators.",
    },
    {
      target: "id-tab-content-ganaderia",
      title: "Livestock Content",
      description: "Complete details about livestock production.",
    },
  ],
  "/fincas": [
    {
      target: "fincas-container",
      title: "My Farms",
      description: "Here you can view all your farms registered in the system.",
    },
    {
      target: "buscador-principal",
      title: "Farm Search",
      description: "Search your farms by name to find them quickly.",
    },
    {
      target: "titulo-mis-fincas",
      title: "Farm List",
      description: "View the complete list of all your available farms.",
    },
    {
      target: "scroll-area-fincas",
      title: "Farm Scrolling",
      description: "Scroll vertically to view all your registered farms.",
    },
    {
      target: "message-error-empty",
      title: "No Farms",
      description:
        "A message will be displayed here when you have no registered farms or no results are found.",
    },
    {
      target: "fab-crear-finca",
      title: "Create New Farm",
      description: "Press this button to register a new farm in the system.",
    },
  ],
  "/cultivos": [
    {
      target: "id-cultivo-container",
      title: "Crop Management",
      description: "Here you can manage all crops registered on your farms.",
    },
    {
      target: "id-cultivo-header",
      title: "Crop Header",
      description: "View the title and description of the crops section.",
    },
    {
      target: "id-cultivo-add-button",
      title: "Add New Crop",
      description: "Press this button to register a new crop on your farm.",
    },
    {
      target: "id-cultivo-filters",
      title: "Crop Filters",
      description:
        "Filter crops by farm to quickly find what you're looking for.",
    },
    {
      target: "id-cultivo-select-trigger",
      title: "Farm Selector",
      description: "Select a specific farm to view only its crops.",
    },
    {
      target: "id-cultivo-clear-filters",
      title: "Clear Filters",
      description: "Remove applied filters and show all crops again.",
    },
    {
      target: "id-cultivo-card",
      title: "Crop Details",
      description:
        "Click on a card to view or edit the complete crop information.",
    },
    {
      target: "id-edit-cultivo",
      title: "Edit Crop",
      description: "Press this button to edit a crop on your farm.",
    },
    {
      target: "id-detalles-cultivo",
      title: "Crop Details",
      description: "Press this button to view the crop details.",
    },
    {
      target: "id-finalizar-cultivo",
      title: "Finish Crop",
      description:
        "Press this button to finish the crop if it has already been harvested.",
    },
  ],
  "/produccion": [
    {
      target: "id-produccion-container",
      title: "Production Management",
      description:
        "Here you can manage all productions registered on your farms.",
    },
    {
      target: "id-produccion-header",
      title: "Production Header",
      description:
        "In this section you can view the title and access product control.",
    },
    {
      target: "id-produccion-control-productos",
      title: "Product Control",
      description:
        "From here you can manage products and check the inventory of your productions.",
    },
    {
      target: "id-produccion-productos",
      title: "Products",
      description:
        "Access the section where you can manage products and set their prices.",
    },
    {
      target: "id-produccion-inventario",
      title: "Inventory",
      description: "Check and manage the available inventory of your products.",
    },
    {
      target: "id-produccion-list",
      title: "My Productions",
      description:
        "Here all the productions you have registered are displayed.",
    },
    {
      target: "id-produccion-card",
      title: "Production Detail",
      description:
        "Each card represents a registered production and allows you to view its main data.",
    },
    {
      target: "id-add-produccion",
      title: "Add Production",
      description: "Press this button to register a new production.",
    },
  ],
  "/trabajadores": [
    {
      target: "id-trabajadores-container",
      title: "Worker Management",
      description: "Here you can manage the workers assigned to your farms.",
    },
    {
      target: "id-trabajadores-header",
      title: "Worker Header",
      description:
        "From here you can identify the section and access the main actions.",
    },
    {
      target: "id-trabajadores-add-button",
      title: "New Worker",
      description: "Press this button to register a new worker.",
    },
    {
      target: "id-trabajadores-search",
      title: "Search Workers",
      description:
        "Use this field to quickly search for a worker by name, ID, or phone number.",
    },
    {
      target: "id-trabajadores-filters-button",
      title: "Filters",
      description:
        "Use this option to filter workers by their verification status.",
    },
    {
      target: "id-trabajadores-filters",
      title: "Worker Filters",
      description:
        "Here you can select whether you want to view all workers, verified, or unverified.",
    },
    {
      target: "id-trabajadores-filter-verified",
      title: "Verification Status",
      description: "Filter the list by the workers' verification status.",
    },
    {
      target: "id-trabajadores-clear-filters",
      title: "Clear Filters",
      description: "Press this button to remove all applied filters.",
    },
    {
      target: "id-trabajadores-stats",
      title: "Worker Summary",
      description:
        "Here you can quickly check the total number of workers and how many are verified.",
    },
    {
      target: "id-trabajadores-list",
      title: "Worker List",
      description:
        "Here you can view all registered workers and manage their information.",
    },
    {
      target: "id-ver-finca-trabajador",
      title: "Assigned Farms",
      description:
        "Press this button to view the farms assigned to the worker.",
    },
    {
      target: "id-edit-trabajador",
      title: "Edit Worker",
      description: "Press this button to edit the worker's information.",
    },
    {
      target: "id-options-trabajador",
      title: "More Options",
      description:
        "From this menu you can perform different actions on the worker.",
    },
    {
      target: "id-trabajadores-pagination",
      title: "Pagination",
      description:
        "Use these controls to navigate between the different pages of workers.",
    },
  ],
  "/animales": [
    {
      target: "id-animales-container",
      title: "Animal Management",
      description: "Here you can manage all animals registered on your farms.",
    },
    {
      target: "id-animales-header",
      title: "My Animals",
      description:
        "In this section you can view and manage the registered animals.",
    },
    {
      target: "id-animales-actions",
      title: "Animal Actions",
      description:
        "From here you can access the main tools related to your animals.",
    },
    {
      target: "id-carga-masiva",
      title: "Bulk Upload",
      description:
        "Use this option to register multiple animals quickly through a bulk upload.",
    },
    {
      target: "id-control-peso",
      title: "Weight Control",
      description:
        "From here you can access the tools to record and check your animals' weight.",
    },
    {
      target: "id-alimentacion-animal",
      title: "Feeding",
      description:
        "Access the section where you can view and manage your animals' feeding.",
    },
    {
      target: "id-animales-filters",
      title: "Animal Filters",
      description:
        "Use these options to quickly find the animals you need to check.",
    },
    {
      target: "id-buscador-animal",
      title: "Search Animal",
      description: "Search for an animal using its identifier or name.",
    },
    {
      target: "id-select-finca-animal",
      title: "Filter by Farm",
      description: "Select a farm to show only the animals registered there.",
    },
    {
      target: "id-animales-active-filters",
      title: "Active Filters",
      description: "Here you can view the filters that are currently applied.",
    },
    {
      target: "id-animales-clear-filters",
      title: "Clear Filters",
      description:
        "Press this button to remove all applied filters and show all animals again.",
    },
    {
      target: "id-animales-list",
      title: "Animal List",
      description:
        "Here the cards with the animals registered on your farms are displayed.",
    },
    {
      target: "id-animal-card",
      title: "Animal Information",
      description:
        "Each card contains the animal's main information and the actions available to manage it.",
    },
    {
      target: "id-animales-load-more",
      title: "Load More Animals",
      description:
        "Use this option to load more animals when there are additional records.",
    },
    {
      target: "add-animal-btn",
      title: "Add Animal",
      description: "Press this button to register a new animal.",
    },
  ],
  "/sanidad-animal": [
    {
      target: "id-sanidad-container",
      title: "Health Management",
      description:
        "Here you can manage and monitor all health events registered for your animals.",
    },
    {
      target: "id-sanidad-header",
      title: "Animal Health",
      description:
        "In this section you can view and manage your animals' health by species.",
    },
    {
      target: "id-sanidad-header-info",
      title: "Health Information",
      description:
        "Here the title and general description of the health section are displayed.",
    },
    {
      target: "id-sanidad-btn-ver-eventos",
      title: "View Events",
      description:
        "Press this button to view deleted events and the change history.",
    },
    {
      target: "id-sanidad-filtros-container",
      title: "Health Filters",
      description:
        "Use these options to quickly find the health events you need to check.",
    },
    {
      target: "id-sanidad-filtro-especie",
      title: "Filter by Species",
      description:
        "Select a species to show only the health events associated with it.",
    },
    {
      target: "id-sanidad-filtro-especie-select",
      title: "Species Selector",
      description:
        "From this selector you can choose the species by which you want to filter the records.",
    },
    {
      target: "id-sanidad-filtro-especie-mostrando",
      title: "Selected Species",
      description:
        "Here you can view the species currently applied as a filter.",
    },
    {
      target: "id-sanidad-buscador-animales",
      title: "Search Animal",
      description:
        "Search for a specific animal to view its registered health events.",
    },
    {
      target: "id-sanidad-estadisticas-container",
      title: "Health Statistics",
      description:
        "Here a general summary of your animals' health status is displayed.",
    },
    {
      target: "id-sanidad-cards-grid",
      title: "Health Summary",
      description:
        "View the main indicators such as health status, last event, next event, and monthly cost.",
    },
    {
      target: "id-sanidad-card-estado-sanitario",
      title: "Health Status",
      description:
        "Here you can see the general health status of the registered animals.",
    },
    {
      target: "id-sanidad-card-ultimo-evento",
      title: "Last Event",
      description:
        "Here the last health event registered for the animals is displayed.",
    },
    {
      target: "id-sanidad-card-proximo-evento",
      title: "Next Event",
      description:
        "Here you can check the next health event scheduled for your animals.",
    },
    {
      target: "id-sanidad-card-costo-mes",
      title: "Monthly Health Cost",
      description:
        "Here the health cost accumulated during the current month is displayed.",
    },
    {
      target: "id-sanidad-proximos-eventos-alerta",
      title: "Upcoming Events",
      description: "Here alerts about upcoming health events are displayed.",
    },
    {
      target: "id-sanidad-total-registros",
      title: "Total Records",
      description:
        "Here you can view the total number of health records found.",
    },
    {
      target: "id-sanidad-tabs-container",
      title: "Health Sections",
      description:
        "Use these tabs to switch between the event summary and the cost analysis.",
    },
    {
      target: "id-sanidad-tabs",
      title: "Health Tabs",
      description:
        "Here you can navigate between the general summary and monthly costs.",
    },
    {
      target: "id-sanidad-tabs-list",
      title: "Tab List",
      description: "Select the tab you want to view: Summary or Monthly Costs.",
    },
    {
      target: "id-sanidad-tab-resumen",
      title: "Summary Tab",
      description:
        "Press this tab to view the complete list of registered health events.",
    },
    {
      target: "id-sanidad-tab-costos",
      title: "Monthly Costs Tab",
      description: "Press this tab to view the monthly health cost analysis.",
    },
    {
      target: "id-sanidad-tab-content-resumen",
      title: "Summary Content",
      description:
        "Here the table with all registered health events is displayed.",
    },
    {
      target: "id-sanidad-card-resumen",
      title: "Summary Card",
      description:
        "This card contains the complete list of registered health events.",
    },
    {
      target: "id-sanidad-card-resumen-header",
      title: "Summary Header",
      description:
        "Here the title and description of the summary section are displayed.",
    },
    {
      target: "id-sanidad-card-resumen-content",
      title: "Summary Content",
      description:
        "Here you will find the search bar, the events table, and the pagination.",
    },
    {
      target: "id-sanidad-resumen-buscador-container",
      title: "Event Search",
      description: "Use this search bar to find specific health events.",
    },
    {
      target: "id-sanidad-resumen-buscador",
      title: "Search Event",
      description:
        "Type the service name, person responsible, or animal to filter the events.",
    },
    {
      target: "id-sanidad-resumen-loader",
      title: "Loading Events",
      description:
        "A loading indicator is displayed here while the health events are loading.",
    },
    {
      target: "id-sanidad-resumen-empty",
      title: "No Results",
      description:
        "A message is displayed here when no records are found with the applied filters.",
    },
    {
      target: "id-sanidad-resumen-tabla-container",
      title: "Events Table",
      description:
        "Here all registered health events are listed with their details.",
    },
    {
      target: "id-sanidad-resumen-paginacion-container",
      title: "Event Pagination",
      description:
        "Use these controls to navigate between the pages of registered events.",
    },
    {
      target: "id-sanidad-resumen-paginacion-info",
      title: "Pagination Information",
      description:
        "Here the range of records you are currently viewing is displayed.",
    },
    {
      target: "id-sanidad-resumen-paginacion",
      title: "Pagination Controls",
      description:
        "Use these buttons to move forward or backward between the event pages.",
    },
    {
      target: "id-sanidad-tab-content-costos",
      title: "Costs Content",
      description:
        "Here the monthly health cost analysis broken down by service is displayed.",
    },
    {
      target: "id-sanidad-card-costos",
      title: "Costs Card",
      description:
        "This card contains the detailed analysis of monthly health costs.",
    },
    {
      target: "id-sanidad-card-costos-header",
      title: "Costs Header",
      description:
        "Here the title and description of the monthly costs section are displayed.",
    },
    {
      target: "id-sanidad-card-costos-content",
      title: "Costs Content",
      description:
        "Here the statistics, charts, and summaries of health costs are found.",
    },
    {
      target: "id-sanidad-costos-loader",
      title: "Loading Costs",
      description:
        "A loading indicator is displayed here while the cost data is loading.",
    },
    {
      target: "id-sanidad-costos-empty",
      title: "No Cost Data",
      description:
        "A message is displayed here when there is no cost data available.",
    },
    {
      target: "id-sanidad-costos-content-wrapper",
      title: "Cost Analysis",
      description:
        "Here all indicators and charts related to health costs are presented.",
    },
    {
      target: "id-sanidad-costos-stats-grid",
      title: "Cost Statistics",
      description:
        "Here the main cost indicators are displayed: total, average, services, and highest expense.",
    },
    {
      target: "id-sanidad-costos-stat-total-gastado",
      title: "Total Spent",
      description:
        "Here the total amount spent on health services is displayed.",
    },
    {
      target: "id-sanidad-costos-stat-promedio-mensual",
      title: "Monthly Average",
      description: "Here the average health expense per month is displayed.",
    },
    {
      target: "id-sanidad-costos-stat-servicios-registrados",
      title: "Registered Services",
      description:
        "Here the number of unique health services registered is displayed.",
    },
    {
      target: "id-sanidad-costos-stat-mayor-gasto",
      title: "Highest Expense",
      description:
        "Here the health service with the highest registered cost is displayed.",
    },
    {
      target: "id-sanidad-costos-filtro-servicio",
      title: "Filter by Service",
      description: "Select a service to filter the cost data shown.",
    },
    {
      target: "id-sanidad-costos-filtro-servicio-select",
      title: "Service Selector",
      description:
        "From this selector you can choose the service by which you want to filter the costs.",
    },
    {
      target: "id-sanidad-costos-evolucion-mensual",
      title: "Monthly Evolution",
      description:
        "Here a chart with the evolution of health costs month by month is displayed.",
    },
    {
      target: "id-sanidad-costos-distribucion-resumen-grid",
      title: "Distribution and Summary",
      description:
        "Here the cost distribution by service and the detailed summary are displayed.",
    },
    {
      target: "id-sanidad-costos-distribucion-servicio",
      title: "Distribution by Service",
      description:
        "Here a chart with the distribution of costs by service type is displayed.",
    },
    {
      target: "id-sanidad-costos-resumen-por-servicio",
      title: "Summary by Service",
      description:
        "Here a detailed summary of costs grouped by service is displayed.",
    },
    {
      target: "id-sanidad-costos-mes-extremos-grid",
      title: "Extreme Months",
      description:
        "Here the months with the highest and lowest registered health expenses are displayed.",
    },
    {
      target: "id-sanidad-costos-card-mes-mayor-gasto",
      title: "Highest Expense Month",
      description:
        "Here the month in which the highest health expense was recorded is displayed.",
    },
    {
      target: "id-sanidad-costos-card-mes-menor-gasto",
      title: "Lowest Expense Month",
      description:
        "Here the month in which the lowest health expense was recorded is displayed.",
    },
  ],
  "/servicios": [
    {
      target: "id-servicios-container",
      title: "Service Management",
      description:
        "Here you can view and select all available services to schedule appointments.",
    },
    {
      target: "id-servicios-header",
      title: "Service Header",
      description:
        "From here you can identify the section and view the main title.",
    },
    {
      target: "id-servicios-title",
      title: "Section Title",
      description: "Main title of the services section.",
    },
    {
      target: "id-servicios-list",
      title: "Service List",
      description: "Here you can view all available active services.",
    },
    {
      target: "id-servicios-empty-container",
      title: "Empty State",
      description:
        "This message is displayed when there are no services available.",
    },
    {
      target: "id-servicios-empty-component",
      title: "Empty State Component",
      description: "Displays information when there are no active services.",
    },
    {
      target: "id-add-cita",
      title: "Schedule Appointment",
      description:
        "Here you can schedule a new appointment for the selected service.",
    },
  ],
  "/productos": [
    {
      target: "id-container-productos",
      title: "Product Management",
      description: "Here you can view all available products.",
    },
    {
      target: "id-productos-header",
      title: "Available Products",
      description:
        "In this section you can explore the products available in the system.",
    },
    {
      target: "id-categorias-productos",
      title: "Categories",
      description:
        "Use the categories to filter products and quickly find what you're looking for.",
    },
    {
      target: "id-categoria-todos",
      title: "All Products",
      description: "Select this option to show products from all categories.",
    },
    {
      target: "id-list-productos",
      title: "Product List",
      description:
        "Here all available products are displayed organized in cards.",
    },
    {
      target: "id-producto-card",
      title: "Product",
      description:
        "Select a product to view its information and learn more details.",
    },
    {
      target: "id-empty-productos",
      title: "No Products",
      description:
        "No products were found to display currently in the agro-service.",
    },
    {
      target: "add-btn-favorite-product",
      title: "Favorite Products",
      description: "By clicking the button you can add your favorite products.",
    },
    {
      target: "id-btn-detalles-productos",
      title: "Product Details",
      description:
        "By clicking the button you can view more details of the selected product.",
    },
  ],
  "/citas": [
    {
      target: "id-citas-container",
      title: "Appointment Management",
      description:
        "Here you can view and manage all your scheduled appointments.",
    },
    {
      target: "id-citas-header",
      title: "Appointment Header",
      description:
        "From here you can identify the section and access the main actions.",
    },
    {
      target: "id-citas-title",
      title: "Section Title",
      description: "Main title of the appointment history section.",
    },
    {
      target: "id-citas-refresh",
      title: "Refresh Appointments",
      description: "Press this button to refresh the appointment list.",
    },
    {
      target: "id-citas-scroll-area",
      title: "Appointment List",
      description: "Here you can view all your appointments in card format.",
    },
    {
      target: "id-citas-list",
      title: "Appointment Container",
      description: "Complete list of all your scheduled appointments.",
    },
    {
      target: "id-citas-card-wrapper",
      title: "Appointment Card",
      description:
        "Each card shows the information of an appointment. Press to view more details.",
    },
    {
      target: "id-citas-empty-container",
      title: "Empty State",
      description:
        "This message is displayed when there are no registered appointments.",
    },
    {
      target: "id-citas-empty-alert",
      title: "Empty State Alert",
      description:
        "Displays information when there are no appointments available.",
    },
    {
      target: "id-citas-empty-title",
      title: "Empty State Title",
      description: "Title indicating that no appointments were found.",
    },
    {
      target: "id-citas-empty-description",
      title: "Empty State Description",
      description:
        "Description explaining that there are no appointments available.",
    },
    {
      target: "id-citas-empty-retry",
      title: "Retry",
      description: "Press this button to try loading the appointments again.",
    },
    {
      target: "id-citas-load-more",
      title: "Load More Appointments",
      description: "Press this button to load more appointments in the list.",
    },
    {
      target: "id-citas-fab",
      title: "Add Appointment",
      description: "Floating button to quickly schedule a new appointment.",
    },
  ],
  "/pedidos": [
    {
      target: "id-container-pedidos",
      title: "Order Management",
      description: "Here you can view and check all your placed orders.",
    },
    {
      target: "id-cards-pedidos",
      title: "Order List",
      description: "Here your orders are displayed in card format.",
    },
    {
      target: "id-pedidos-empty-container",
      title: "No Orders",
      description:
        "This section is displayed when there are no orders available to check.",
    },
    {
      target: "id-nuevo-pedido",
      title: "Create New Order",
      description: "This section is displayed so you can create a new order.",
    },
    {
      target: "id-cancel-pedido",
      title: "Cancel Order",
      description: "By clicking the button you will cancel the placed order.",
    },
    {
      target: "btn-impuestos-pedidos",
      title: "Order Taxes",
      description:
        "By clicking the button you can show or hide the taxes associated with the order.",
    },
  ],
  "/pedidos-procesados": [
    {
      target: "id-container-pedidos",
      title: "Order Management",
      description: "Here you can view and check all your placed orders.",
    },
    {
      target: "id-cards-pedidos",
      title: "Order List",
      description: "Here your orders are displayed in card format.",
    },
    {
      target: "id-pedidos-empty-container",
      title: "No Orders",
      description:
        "This section is displayed when there are no orders available to check.",
    },
    {
      target: "id-nuevo-pedido",
      title: "Create New Order",
      description: "This section is displayed so you can create a new order.",
    },
    {
      target: "id-cancel-pedido",
      title: "Cancel Order",
      description: "By clicking the button you will cancel the placed order.",
    },
    {
      target: "btn-impuestos-pedidos",
      title: "Order Taxes",
      description:
        "By clicking the button you can show or hide the taxes associated with the order.",
    },
  ],
  "/pedidos-facturados": [
    {
      target: "id-container-pedidos",
      title: "Order Management",
      description: "Here you can view and check all your placed orders.",
    },
    {
      target: "id-cards-pedidos",
      title: "Order List",
      description: "Here your orders are displayed in card format.",
    },
    {
      target: "id-pedidos-empty-container",
      title: "No Orders",
      description:
        "This section is displayed when there are no orders available to check.",
    },
    {
      target: "id-nuevo-pedido",
      title: "Create New Order",
      description: "This section is displayed so you can create a new order.",
    },
    {
      target: "id-cancel-pedido",
      title: "Cancel Order",
      description: "By clicking the button you will cancel the placed order.",
    },
    {
      target: "btn-impuestos-pedidos",
      title: "Order Taxes",
      description:
        "By clicking the button you can show or hide the taxes associated with the order.",
    },
  ],
  "/pedidos-cancelados": [
    {
      target: "id-container-pedidos",
      title: "Order Management",
      description: "Here you can view and check all your placed orders.",
    },
    {
      target: "id-cards-pedidos",
      title: "Order List",
      description: "Here your orders are displayed in card format.",
    },
    {
      target: "id-pedidos-empty-container",
      title: "No Orders",
      description:
        "This section is displayed when there are no orders available to check.",
    },
    {
      target: "id-nuevo-pedido",
      title: "Create New Order",
      description: "This section is displayed so you can create a new order.",
    },
    {
      target: "id-cancel-pedido",
      title: "Cancel Order",
      description: "By clicking the button you will cancel the placed order.",
    },
    {
      target: "btn-impuestos-pedidos",
      title: "Order Taxes",
      description:
        "By clicking the button you can show or hide the taxes associated with the order.",
    },
  ],
  "/gastos": [
    {
      target: "gastos-page-title",
      title: "Expense Control",
      description:
        "From this section you can record, check, and monitor your farms' expenses.",
    },
    {
      target: "gastos-filters-btn",
      title: "Filters",
      description:
        "Use the filters to search expenses by farm, species, category, payment method, or date range.",
    },
    {
      target: "add-gasto-btn",
      title: "New Expense",
      description:
        "Click here to record a new expense. On mobile devices the corresponding screen will open.",
    },
    {
      target: "gastos-table",
      title: "Expense List",
      description:
        "Here you can check the registered expenses and access the options available for each one.",
    },
    {
      target: "btn-edit-gasto",
      title: "Edit Expense",
      description:
        "Click here to edit an expense. On mobile devices the corresponding screen will open.",
    },
    {
      target: "gastos-pagination",
      title: "Pagination",
      description:
        "Use these controls to navigate between the different pages of expenses.",
    },
    {
      target: "gastos-summary",
      title: "Expense Summary",
      description:
        "Here you can check the total expenses and the number of records being displayed.",
    },
  ],
  "/ingresos": [
    {
      target: "ingresos-page-title",
      title: "Income Control",
      description:
        "From this section you can record, check, and monitor your farms' income.",
    },
    {
      target: "ingresos-filters-btn",
      title: "Filters",
      description:
        "Use the filters to search income by farm, species, category, payment method, or date range.",
    },
    {
      target: "add-ingreso-btn",
      title: "New Income",
      description: "Click here to record a new income.",
    },
    {
      target: "ingresos-table",
      title: "Income List",
      description:
        "Here you can check the registered income and access the available actions.",
    },
    {
      target: "edit-ingreso-btn",
      title: "Edit Income",
      description: "Click here to edit an income.",
    },
    {
      target: "ingresos-pagination",
      title: "Pagination",
      description:
        "Use these controls to navigate between the different pages of income.",
    },
    {
      target: "ingresos-summary",
      title: "Income Summary",
      description:
        "Here you can check the total income and the number of records being displayed.",
    },
  ],
  "/rentabilidad": [
    {
      target: "rentabilidad-page-title",
      title: "Profitability Dashboard",
      description:
        "From this dashboard you can analyze the profitability and financial behavior of your livestock business.",
    },
    {
      target: "rentabilidad-filters",
      title: "Filters",
      description:
        "Use the filters to check profitability by farm, species, and the period you want to analyze.",
    },
    {
      target: "rentabilidad-metrics",
      title: "Main Indicators",
      description:
        "Here you can check the main financial indicators: income, expenses, net profitability, and profit margin.",
    },
    {
      target: "rentabilidad-indicators",
      title: "ROI and Benefit/Cost",
      description:
        "These indicators allow you to know the return on investment and how much income you generate for each monetary unit spent.",
    },
    {
      target: "rentabilidad-tabs",
      title: "Profitability Analysis",
      description:
        "Use these tabs to analyze the evolution, categories, and performance of your farms.",
    },
    {
      target: "rentabilidad-evolucion",
      title: "Evolution",
      description:
        "Check how profitability has evolved over time and compare the best and worst periods.",
    },
    {
      target: "rentabilidad-categorias",
      title: "Categories",
      description:
        "Analyze how your income and expenses are distributed according to the different categories.",
    },
    {
      target: "rentabilidad-fincas",
      title: "Farms",
      description:
        "Compare the profitability of your different farms to identify which ones perform better.",
    },
  ],
  "/configuracion-trabajador": [
    {
      target: "config-trabajadores-page-title",
      title: "Worker Configuration",
      description:
        "From this section you can manage the salaries, positions, and configurations of your workers.",
    },
    {
      target: "add-config-trabajador-btn",
      title: "New Worker",
      description: "Click here to add the configuration for a new worker.",
    },
    {
      target: "config-trabajadores-stats",
      title: "Worker Summary",
      description:
        "Here you can check the total number of workers, the average daily salary, and the number of active workers.",
    },
    {
      target: "config-trabajadores-filters",
      title: "Search and Filters",
      description:
        "Use these options to quickly find workers and filter the list by their status.",
    },
    {
      target: "config-trabajadores-table",
      title: "Worker List",
      description:
        "Here you can check your workers' configurations and access the available actions.",
    },
    {
      target: "detalles-config-trabajador-btn",
      title: "Worker Details",
      description:
        "Click here to view the details of the worker's configuration.",
    },
    {
      target: "edit-config-trabajador-btn",
      title: "Edit Worker",
      description: "Click here to edit the worker's configuration.",
    },
    {
      target: "config-trabajadores-pagination",
      title: "Pagination",
      description:
        "Use these controls to navigate between the different pages of workers.",
    },
  ],
  "/jornadas": [
    {
      target: "jornadas-trabajadores-page-title",
      title: "Worker Shifts",
      description:
        "From this section you can record and check the work shifts and overtime of your workers.",
    },
    {
      target: "add-jornada-trabajador-btn",
      title: "Record Shift",
      description: "Click here to record a worker's daily shift.",
    },
    {
      target: "jornadas-trabajadores-stats",
      title: "Shift Summary",
      description:
        "Here you can check the total records, days worked, and accumulated overtime.",
    },
    {
      target: "jornadas-trabajadores-filters",
      title: "Search Filters",
      description:
        "Use these filters to search shifts by worker, date range, month, or work status.",
    },
    {
      target: "jornadas-trabajadores-table",
      title: "Shift List",
      description:
        "Here you can check the recorded shifts and access the options available to edit them.",
    },
    {
      target: "id-export-excel-jornada",
      title: "Export Shifts to Excel",
      description:
        "Here you can generate an Excel file that will show a summary of shifts by worker.",
    },
    {
      target: "detalles-jornada-trabajador-btn",
      title: "Shift Details",
      description: "Click here to view the details of the worker's shift.",
    },
    {
      target: "edit-jornada-trabajador-btn",
      title: "Edit Shift",
      description: "Click here to edit the worker's shift.",
    },
    {
      target: "jornadas-trabajadores-pagination",
      title: "Pagination",
      description:
        "Use these controls to navigate between the different pages of shifts.",
    },
  ],
  "/planillas": [
    {
      target: "id-planillas-header",
      title: "Worker Payrolls",
      description:
        "From this section you can manage the payrolls and payments of your workers.",
    },
    {
      target: "add-planilla-btn",
      title: "New Payroll",
      description: "Use this button to create a new worker payroll.",
    },
    {
      target: "id-resumen-planillas",
      title: "Payroll Summary",
      description:
        "Here you can quickly check the total payrolls, paid ones, total net, and those in process.",
    },
    {
      target: "id-filters-planillas",
      title: "Filters",
      description:
        "Use the filters to check payrolls by date range, month, or status.",
    },
    {
      target: "id-table-planillas",
      title: "Payroll List",
      description:
        "Here you will find the list of payrolls and can check or edit each record.",
    },
    {
      target: "id-acciones-planilla",
      title: "Payroll Actions",
      description:
        "Here you can see the different actions that can be executed on a payroll.",
    },
    {
      target: "id-detalle-planilla",
      title: "Payroll Details",
      description:
        "Here you can view details related to the payroll and its editing.",
    },
  ],
  "/reportes-planillas": [
    {
      target: "id-filtros-reportes-planillas",
      title: "Report Filters",
      description:
        "Use these filters to check worker payments by period and payment method.",
    },
    {
      target: "id-total-pagado-planillas",
      title: "Total Paid",
      description:
        "Here you can check the total paid to workers according to the selected filters.",
    },
    {
      target: "id-resumen-estados-planillas",
      title: "Payroll Statuses",
      description: "Check a summary of payrolls grouped by their status.",
    },
    {
      target: "id-resumen-horas-extras-planillas",
      title: "Overtime",
      description: "View the summary of overtime generated by workers.",
    },
    {
      target: "id-resumen-metodos-pago-planillas",
      title: "Payment Methods",
      description:
        "Check how payments made are distributed according to the method used.",
    },
  ],
  "/actividades": [
    {
      target: "id-title-actividades",
      title: "Daily Activities",
      description:
        "From this section you can manage and follow up on the activities carried out by your workers.",
    },
    {
      target: "add-actividad-btn",
      title: "Add Activity",
      description: "Use this button to record a new activity for a worker.",
    },
    {
      target: "id-filtros-actividades",
      title: "Search Filters",
      description:
        "You can use the filters to find specific activities by worker, farm, dates, or other criteria.",
    },
    {
      target: "id-estados-actividades",
      title: "Filter by Status",
      description:
        "Use these tabs to quickly check activities according to their status.",
    },
    {
      target: "id-grid-actividades",
      title: "Registered Activities",
      description:
        "Here the registered activities and their corresponding information are displayed.",
    },
    {
      target: "id-options-actividades",
      title: "Activity Actions",
      description:
        "Here the actions that can be performed on an activity are displayed, such as: 'View details', 'Cancel', 'Delete'",
    },
    {
      target: "id-paginacion-actividades",
      title: "Pagination",
      description:
        "Use the pagination to navigate between the different pages of activities.",
    },
  ],
  "/equipos": [
    {
      target: "id-title-equipos",
      title: "Equipment and Machinery",
      description:
        "In this section you can check, register, and monitor the equipment and machinery used on your farms.",
    },
    {
      target: "add-equipo-btn",
      title: "Add Equipment",
      description:
        "Use this button to register new equipment or machinery and assign it to a farm.",
    },
    {
      target: "id-resumen-equipos",
      title: "Equipment Summary",
      description:
        "Here you can quickly check the number of registered, active, in-maintenance, and inactive equipment.",
    },
    {
      target: "id-filters-equipos",
      title: "Equipment Filters",
      description:
        "Use the filters to search equipment by farm, status, or other available criteria.",
    },
    {
      target: "id-table-equipos",
      title: "Equipment List",
      description:
        "Here the list of equipment and machinery registered in the system is displayed.",
    },
    {
      target: "id-list-equipos",
      title: "Registered Equipment",
      description:
        "From this list you can check the information of each equipment and access its available actions.",
    },
    {
      target: "edit-equipo-btn",
      title: "Edit Equipment",
      description:
        "Use this button to edit the equipment or machinery and assign it to a farm.",
    },
    {
      target: "id-pagination-equipos",
      title: "Pagination",
      description:
        "Use the pagination to navigate between the different pages of registered equipment.",
    },
  ],
  "/mantenimientos": [
    {
      target: "id-add-mantenimiento",
      title: "Enter Maintenance",
      description:
        "Use this button to record new maintenance for your equipment or machinery.",
    },
    {
      target: "id-filters-mantenimientos",
      title: "Maintenance Filters",
      description:
        "Use these filters to search maintenance by type, dates, or farm.",
    },
    {
      target: "id-resumen-mantenimientos",
      title: "Maintenance Summary",
      description:
        "Here you can see the number of maintenance records shown and the total registered maintenance.",
    },
    {
      target: "id-container-mantenimientos",
      title: "Registered Maintenance",
      description:
        "In this section the registered maintenance of your equipment and machinery is displayed.",
    },
    {
      target: "id-edit-mantenimiento",
      title: "Edit Maintenance",
      description:
        "Use this button to edit the maintenance of your equipment or machinery.",
    },
    {
      target: "id-paginacion-mantenimientos",
      title: "Pagination",
      description:
        "Use the pagination to navigate between the different pages of maintenance records.",
    },
  ],
  "/uso-equipos": [
    {
      target: "id-add-uso-equipos",
      title: "Record Equipment Use",
      description:
        "Use this button to record a new use of equipment or machinery by an operator.",
    },
    {
      target: "id-filters-uso-equipos",
      title: "Search Filters",
      description:
        "Use these filters to search use records by equipment or operator.",
    },
    {
      target: "id-resumen-uso-equipos",
      title: "Record Summary",
      description:
        "Here you can view the number of records shown and the total available use records.",
    },
    {
      target: "id-table-uso-equipos",
      title: "Use Records",
      description:
        "In this section the equipment use records are displayed, including the equipment and operator information.",
    },
    {
      target: "id-edit-uso-equipos",
      title: "Edit Equipment Use",
      description:
        "Use this button to edit the use of equipment or machinery by an operator.",
    },
    {
      target: "id-paginacion-uso-equipos",
      title: "Pagination",
      description:
        "Use the pagination to navigate between the different pages of use records.",
    },
  ],
  "/diagnostico": [
    {
      target: "id-header-diagnostico",
      title: "Veterinary Diagnosis",
      description:
        "From this section you can obtain a preliminary veterinary diagnosis based on an animal's data and symptoms.",
    },
    {
      target: "id-form-diagnostico",
      title: "Patient Data",
      description:
        "Enter the animal's data, such as species, breed, age, and symptoms, to perform the diagnosis.",
    },
    {
      target: "btn-obtener-diagnostico",
      title: "Get Preliminary Diagnosis",
      description:
        "By clicking the button you will generate a preliminary diagnosis.",
    },
    {
      target: "id-resultados-diagnostico",
      title: "Diagnosis Results",
      description:
        "Here the result of the preliminary diagnosis generated from the entered data will be displayed.",
    },
  ],
  "/agricultura-inteligente": [
    {
      target: "id-header-consulta-agricola",
      title: "Agricultural Consultation",
      description:
        "Here you can generate preliminary consultations about agriculture.",
    },
    {
      target: "id-form-consulta-agricola",
      title: "Crop Data",
      description:
        "Here you can enter the crop information, soil type, climate, and observed problems to obtain agricultural recommendations.",
    },
    {
      target: "id-btn-agricola",
      title: "Get Agricultural Diagnosis",
      description:
        "By clicking the button you can preliminarily generate an agricultural diagnosis based on the data entered in the form.",
    },
    {
      target: "id-resultados-consulta-agricola",
      title: "Consultation Results",
      description:
        "In this section the analysis and recommendations generated from the entered data are displayed.",
    },
  ],
  "/siembra-inteligente": [
    {
      target: "id-form-siembra-inteligente",
      title: "Terrain Data",
      description:
        "Here you can enter the crop information, terrain type, climate, and area to calculate the recommended planting density.",
    },
    {
      target: "id-btn-siembra-inteligente",
      title: "Calculate Density",
      description:
        "By clicking the button you will obtain an optimal recommendation for the planting density entered in the form.",
    },
    {
      target: "id-resultados-siembra-inteligente",
      title: "Planting Results",
      description:
        "In this section the planting density recommendation calculated from the entered data is displayed.",
    },
  ],
  "/historial-medico": [
    {
      target: "id-filters-historial-clinico",
      title: "Search Filters",
      description:
        "Use these filters to search clinical histories by farm, animal, and date range.",
    },
    {
      target: "id-paginacion-historial-clinico",
      title: "Pagination Control",
      description:
        "Here you can select how many histories to show per page and navigate between the different pages.",
    },
    {
      target: "id-resumen-historial-clinico",
      title: "History Summary",
      description:
        "Quickly check the total histories, farms served, and animals that have received care.",
    },
    {
      target: "id-listado-historial-clinico",
      title: "Clinical Histories",
      description:
        "Here your animals' clinical histories are displayed with the information recorded in each care event.",
    },
    {
      target: "btn-download-historial",
      title: "Download Clinical History",
      description:
        "By clicking the button you can download the attached clinical history document.",
    },
    {
      target: "id-paginacion-historial-clinico-inferior",
      title: "Navigation Between Histories",
      description:
        "Use these controls to move forward, backward, or go directly to a specific page of histories.",
    },
  ],
  "/tratamientos": [
    {
      target: "tratamientos-header",
      title: "Animal Treatments",
      description:
        "From here you can check and manage the treatments applied to your animals.",
    },
    {
      target: "tratamientos-filtros",
      title: "Search Filters",
      description:
        "Use these filters to search treatments by farm, animal, or date range.",
    },
    {
      target: "tratamientos-total",
      title: "Total Treatments",
      description:
        "Here you can check the total number of registered treatments.",
    },
    {
      target: "tratamientos-documentos",
      title: "Treatments with Documents",
      description: "Check how many treatments have associated documents.",
    },
    {
      target: "tratamientos-servicios",
      title: "Different Services",
      description:
        "Shows the number of different veterinary services registered.",
    },
    {
      target: "tratamientos-recientes",
      title: "Recent Treatments",
      description:
        "Here you can identify the treatments registered during the last 7 days.",
    },
    {
      target: "tratamientos-lista",
      title: "Applied Treatments",
      description:
        "In this section the registered treatments and their details are displayed.",
    },
    {
      target: "btn-download-doc-tratamiento",
      title: "Download Attached Treatment Document",
      description:
        "By clicking the button you can download the treatment document.",
    },
    {
      target: "tratamientos-paginacion-inferior",
      title: "Pagination",
      description:
        "Use these controls to navigate between the treatment pages.",
    },
  ],
  "/celos": [
    {
      target: "celos-header",
      title: "Heat Control",
      description:
        "From here you can record and monitor your animals' heat periods.",
    },
    {
      target: "celos-nuevo-btn",
      title: "New Heat",
      description:
        "Use this button to record a new heat period for one of your animals.",
    },
    {
      target: "celos-filtros",
      title: "Search Filters",
      description:
        "Use the filters to search records by farm, animal, species, intensity, or date range.",
    },
    {
      target: "celos-tabla",
      title: "Heat Records",
      description:
        "Here you can check the heat records and access the details of each record.",
    },
    {
      target: "celos-detalle-btn",
      title: "Heat Details",
      description:
        "Use this button to view the details of the heat period for one of your animals.",
    },
    {
      target: "celos-edit-btn",
      title: "Edit Heat",
      description:
        "Use this button to edit the heat period for one of your animals.",
    },
    {
      target: "celos-delete-btn",
      title: "Delete Heat",
      description:
        "Use this button to delete the heat period for one of your animals.",
    },
    {
      target: "celos-paginacion",
      title: "Pagination",
      description:
        "Use these controls to navigate between the different pages of records.",
    },
  ],
  "/servicios-reproductivos": [
    {
      target: "servicios-reproductivos-header",
      title: "Reproductive Services",
      description:
        "From here you can record, check, and monitor your animals' reproductive services.",
    },
    {
      target: "servicios-reproductivos-nuevo",
      title: "New Service",
      description: "Use this button to record a new reproductive service.",
    },
    {
      target: "servicios-reproductivos-filtros",
      title: "Search Filters",
      description: "Use the filters to check services by farm and animal.",
    },
    {
      target: "servicios-reproductivos-resumen",
      title: "Summary",
      description:
        "Here you can check the main statistics of the reproductive services.",
    },
    {
      target: "servicios-reproductivos-lista",
      title: "Registered Services",
      description:
        "In this section you can check the registered reproductive services and perform actions on them.",
    },
    {
      target: "btn-estados-servicios",
      title: "Status of Registered Services",
      description:
        "By clicking the button you can view the statuses of the selected service.",
    },
    {
      target: "btn-edit-servicio",
      title: "Edit Service",
      description: "By clicking the button you can edit the selected service.",
    },
    {
      target: "servicios-reproductivos-paginacion",
      title: "Pagination",
      description:
        "Use these controls to navigate between the different pages of services.",
    },
  ],
  "/partos-animales": [
    {
      target: "partos-header",
      title: "Birth Control",
      description:
        "From here you can check and monitor the registered births of your animals.",
    },
    {
      target: "partos-nuevo-btn",
      title: "New Birth",
      description:
        "Use this button to record a new birth for one of your animals.",
    },
    {
      target: "partos-filtros",
      title: "Filters",
      description:
        "Use the filters to check births by farm, female, status, birth type, or dates.",
    },
    {
      target: "partos-lista",
      title: "Birth History",
      description:
        "Here the registered births are displayed and you can check or edit their information.",
    },
    {
      target: "partos-edit-btn",
      title: "Edit Birth",
      description: "Use this button to edit the birth of one of your animals.",
    },
    {
      target: "partos-paginacion",
      title: "Pagination",
      description:
        "Use these controls to navigate between the different pages of births.",
    },
    {
      target: "partos-detalles",
      title: "Birth Summary",
      description:
        "Here you can check additional information and details of the registered births.",
    },
  ],
  "/perfil": [
    {
      target: "perfil-header",
      title: "Your Profile",
      description:
        "From here you can check and manage your profile information.",
    },
    {
      target: "perfil-foto",
      title: "Profile Photo",
      description:
        "Here you can view your profile photo and access your image gallery.",
    },
    {
      target: "perfil-cambiar-foto",
      title: "Change Photo",
      description: "Use this button to select and update your profile photo.",
    },
    {
      target: "perfil-datos-principales",
      title: "Main Information",
      description:
        "Here you can check your name and the email address associated with your account.",
    },
    {
      target: "perfil-datos-contacto",
      title: "Contact Information",
      description:
        "In this section you can check your location, phone number, and registration date.",
    },
  ],
};
