import { TourStep } from "@/components/agroservicio/guia/TourGuide";

export const agroGestionStepsEn: Record<string, TourStep[]> = {
  "/agro-propietario/agro-servicios": [
    {
      target: "id-filters-dashboard",
      title: "Dashboard Filters",
      description:
        "Use these filters to query metrics by date range and specific branch.",
    },
    {
      target: "id-resumen-dashboard",
      title: "Dashboard Summary",
      description:
        "Here you can view a summary of key metrics such as invoice count, total sales, average ticket, and taxes.",
    },
    {
      target: "id-metrica-ventas",
      title: "Sales Analysis",
      description:
        "This chart compares total sales with the corresponding subtotal for the selected period.",
    },
    {
      target: "id-metrica-impuestos",
      title: "Tax Distribution",
      description:
        "Here you can visualize how taxes generated during the selected period are distributed.",
    },
    {
      target: "id-metrica-descuentos",
      title: "Discounts and Extra Charges",
      description:
        "This chart shows discounts applied and additional charges recorded on invoices.",
    },
    {
      target: "id-metrica-indicadores",
      title: "Indicators Summary",
      description:
        "Here you can view indicators related to invoice count and average ticket.",
    },
    {
      target: "id-detalles-financieros",
      title: "Financial Details",
      description:
        "In this section you can view the financial breakdown, including subtotal, 15% VAT, 18% VAT, and discounts.",
    },
    {
      target: "id-top-sucursales",
      title: "Top Branches",
      description:
        "Here you can view the ranking of branches that generated the highest sales during the selected period.",
    },
    {
      target: "id-top-clientes",
      title: "Top Customers",
      description:
        "This section shows the customers with the highest share of sales during the selected period.",
    },
    {
      target: "id-top-productos",
      title: "Best-Selling Products",
      description:
        "Here you can view the products that recorded the highest number of sales during the selected period.",
    },
    {
      target: "id-estados-facturas",
      title: "Invoice Status",
      description:
        "This section displays the distribution of invoices by their status.",
    },
  ],

  "/agro-propietario/auditoria": [
    {
      target: "id-auditoria-header",
      title: "Audits",
      description:
        "Here you can view the log of all actions performed in the system. The header shows the total records per category.",
    },
    {
      target: "id-auditoria-tabs-list",
      title: "Audit Categories",
      description:
        "Select one of the tabs to filter records by category: Suppliers, Products, Purchases, Batch Movements, or Employees.",
    },
    {
      target: "id-tab-proveedores",
      title: "Supplier Audit",
      description:
        "In this tab you can view all audit records related to suppliers, such as creations, edits, and deletions.",
    },
    {
      target: "id-tab-productos",
      title: "Product Audit",
      description:
        "Here you will find the history of changes made to products, including prices, stock, and categories.",
    },
    {
      target: "id-tab-compras",
      title: "Purchase Audit",
      description:
        "View the detailed log of all purchases made, with information on dates, amounts, and statuses.",
    },
    {
      target: "id-tab-movimientos-lote",
      title: "Batch Movement Audit",
      description:
        "View the inventory movement history by batch, including entries, exits, and adjustments.",
    },
    {
      target: "id-tab-empleados",
      title: "Employee Audit",
      description:
        "Review audit records related to employees, such as hires, terminations, role changes, and information updates.",
    },
    {
      target: "id-auditoria-proveedores",
      title: "Supplier Audit Table",
      description:
        "Here you can see the detailed list of all supplier audit records with complete information.",
    },
    {
      target: "id-auditoria-badges",
      title: "Audit Summary",
      description:
        "The badges show the total records in each category, giving you a quick overview of system activity.",
    },
  ],

  "/agro-propietario/agro-perfil": [
    {
      target: "id-agro-perfil-header",
      title: "My Agri-Service",
      description:
        "This is the main configuration page for your agri-service. Here you can manage all information about your business.",
    },
    {
      target: "id-agro-perfil-edit-btn",
      title: "Edit Information",
      description:
        "Click this button to start editing your agri-service information. If it's your first time, the button will say 'Create Information'.",
    },
    {
      target: "id-agro-perfil-logo-section",
      title: "Agri-Service Logo",
      description:
        "The logo is essential to identify your agri-service in the system. It must be a PNG image without background and no larger than 1MB.",
    },
    {
      target: "id-agro-perfil-logo-preview",
      title: "Logo Preview",
      description:
        "Here you can see how your agri-service logo will look. It should be a clear and representative image.",
    },
    {
      target: "id-agro-perfil-logo-upload",
      title: "Upload Logo",
      description:
        "Select a PNG image and click 'Upload Logo' to save it. The logo is required to access the other modules.",
    },
    {
      target: "id-agro-perfil-logo-warning",
      title: "Logo Required",
      description:
        "This message reminds you that you need to upload a logo to use all system features.",
    },
    {
      target: "id-agro-perfil-fields",
      title: "Agri-Service Information",
      description:
        "Complete all fields with your agri-service information. All fields are required.",
    },
    {
      target: "id-agro-perfil-field-nombre",
      title: "Agri-Service Name",
      description:
        "Enter your agri-service's trade name. It should be a unique and easy-to-remember name.",
    },
    {
      target: "id-agro-perfil-field-rtn",
      title: "RTN",
      description:
        "Enter your National Tax Registry (RTN). It must be exactly 14 numeric digits.",
    },
    {
      target: "id-agro-perfil-field-correo",
      title: "Email",
      description:
        "Enter your agri-service's main contact email. It must be a valid email address.",
    },
    {
      target: "id-agro-perfil-field-telefono",
      title: "Phone",
      description:
        "Enter your agri-service's phone number. The format should be xxxx-xxxx.",
    },
    {
      target: "id-agro-perfil-field-direccion",
      title: "Address",
      description:
        "Enter your agri-service's full address. It must be at least 10 characters.",
    },
    {
      target: "id-agro-perfil-actions",
      title: "Save Actions",
      description:
        "Use 'Cancel' to discard changes or 'Save Changes' to save the updated information.",
    },
    {
      target: "id-agro-perfil-dates",
      title: "Registration Dates",
      description:
        "Here you can see when your agri-service was created and when it was last updated.",
    },
    {
      target: "id-agro-perfil-propietario",
      title: "Owner Information",
      description:
        "This section shows the owner's data, including country, department, and municipality.",
    },
  ],

  "/agro-propietario/agro-sucursales": [
    {
      target: "add-sucursal-btn",
      title: "Add Branch",
      description:
        "Use this button to register a new branch for your agri-service.",
    },
    {
      target: "id-table-sucursales",
      title: "Registered Branches",
      description:
        "Here you can view the branches you have registered. You can also edit each one's information.",
    },
    {
      target: "id-edit-sucursal",
      title: "Edit Branch",
      description: "Use this button to edit your agri-service's branch.",
    },
  ],

  "/agro-propietario/agro-empleados": [
    {
      target: "id-empleados-header",
      title: "Employee Control",
      description:
        "This page lets you manage all employees of your agri-service. Here you can view, add, and manage staff.",
    },
    {
      target: "id-empleados-add-btn",
      title: "Add Employee",
      description:
        "Click this button to register a new employee in your agri-service. A form will open to complete their data.",
    },
    {
      target: "id-empleados-stats",
      title: "Employee Statistics",
      description:
        "These cards give you a quick overview of your employees' situation: total, active, inactive, and active percentage.",
    },
    {
      target: "id-empleados-stat-total",
      title: "Total Employees",
      description:
        "Shows the total number of employees registered in your agri-service, both active and inactive.",
    },
    {
      target: "id-empleados-stat-activos",
      title: "Active Employees",
      description:
        "This indicator shows how many employees are currently active and can access the system.",
    },
    {
      target: "id-empleados-stat-inactivos",
      title: "Inactive Employees",
      description:
        "Shows the number of employees who are inactive and do not have access to the system right now.",
    },
    {
      target: "id-empleados-stat-porcentaje",
      title: "Active Percentage",
      description:
        "This percentage gives you an overview of the proportion of active employees relative to the total.",
    },
    {
      target: "id-empleados-table",
      title: "Employee Table",
      description:
        "In this table you can view and manage each employee's information. Click the edit icon to modify their data.",
    },
    {
      target: "id-options-empleados",
      title: "Employee Options",
      description:
        "Here you can see options to edit and deactivate employees from your agri-service.",
    },
  ],

  "/agro-propietario/agro-clientes": [
    {
      target: "id-clientes-header",
      title: "Customer Control",
      description:
        "Manage all customers of your agri-service. Here you can view, add, and manage customers.",
    },
    {
      target: "id-clientes-add-btn",
      title: "Add Customer",
      description:
        "Click here to register a new customer in your agri-service.",
    },
    {
      target: "id-clientes-stats",
      title: "Customer Statistics",
      description:
        "View a quick summary of your customers: total, active, departments, and municipalities.",
    },
    {
      target: "id-clientes-filters",
      title: "Search Filters",
      description:
        "Use these filters to search for customers by name, department, or municipality.",
    },
    {
      target: "id-clientes-filter-search",
      title: "Search by Name",
      description: "Type the customer's name or ID to find them quickly.",
    },
    {
      target: "id-clientes-filter-departamento",
      title: "Filter by Department",
      description:
        "Select a department to see only customers from that region.",
    },
    {
      target: "id-clientes-filter-municipio",
      title: "Filter by Municipality",
      description:
        "Filter customers by municipality. You need to select a department first.",
    },
    {
      target: "id-clientes-filter-actions",
      title: "Filter Actions",
      description: "Use 'Clear all' to reset all applied filters.",
    },
    {
      target: "id-clientes-table-container",
      title: "Customer List",
      description:
        "Here you can view all registered customers with their main information.",
    },
    {
      target: "id-clientes-table",
      title: "Customer Table",
      description:
        "View and manage each customer's information. Click the edit icon to modify their data.",
    },
    {
      target: "id-edit-cliente",
      title: "Edit Customer",
      description: "Here you can edit customers of your agri-service.",
    },
    {
      target: "id-ver-productos",
      title: "Frequent Products",
      description:
        "Here you can view the products the customer buys frequently.",
    },
  ],

  "/agro-propietario/agro-compras-productos": [
    {
      target: "id-compras-header",
      title: "Product Purchases",
      description:
        "This page lets you manage all product purchases for your agri-service. Here you can view the purchase history and register new ones.",
    },
    {
      target: "id-compras-add-btn",
      title: "Add Purchase",
      description:
        "Click this button to register a new product purchase. A form will open to complete the purchase details.",
    },
    {
      target: "id-compras-filters",
      title: "Purchase Filters",
      description:
        "Use these filters to search for specific purchases by supplier, branch, or payment type.",
    },
    {
      target: "id-compras-filter-proveedor",
      title: "Filter by Supplier",
      description:
        "Select a supplier to view only purchases made to that specific supplier.",
    },
    {
      target: "id-compras-filter-sucursal",
      title: "Filter by Branch",
      description:
        "Filter purchases by the branch where they were made or where the merchandise was received.",
    },
    {
      target: "id-compras-filter-tipo-pago",
      title: "Filter by Payment Type",
      description:
        "Filter purchases by payment method used: Cash, Credit, Check, Transfer, or Card.",
    },
    {
      target: "id-compras-filter-actions",
      title: "Clear Filters",
      description:
        "Click this button to reset all applied filters and view all purchases again.",
    },
    {
      target: "id-compras-table-section",
      title: "Purchase List",
      description:
        "Here you can view all registered purchases with their main information.",
    },
    {
      target: "id-compras-table",
      title: "Purchase Table",
      description:
        "This table shows the details of each purchase: invoice number, supplier, branch, date, payment type, total, and status.",
    },
    {
      target: "id-detalles-compra-producto",
      title: "Purchase Details",
      description:
        "Here you can view the details of the product purchase for your agri-service.",
    },
  ],

  "/agro-propietario/agro-compras-insumos": [
    {
      target: "id-compras-header",
      title: "Supply Purchases",
      description:
        "This page lets you manage all supply purchases for your agri-service. Here you can view the purchase history and register new purchases.",
    },
    {
      target: "add-compra-insumo",
      title: "Add Purchase",
      description:
        "From here you can register a new supply purchase for your agri-service.",
    },
    {
      target: "id-filters-compra-insumo",
      title: "Search Filters",
      description:
        "Use these filters to quickly find supply purchases by supplier, branch, or payment type.",
    },
    {
      target: "compra-prov-insumo",
      title: "Filter by Supplier",
      description:
        "Select a supplier to view only supply purchases made to that supplier.",
    },
    {
      target: "compra-sucursal-insumo",
      title: "Filter by Branch",
      description:
        "Select a branch to view supply purchases corresponding to a specific location.",
    },
    {
      target: "compra-tipo-insumo",
      title: "Filter by Payment Type",
      description:
        "Select a payment type to filter purchases made using a specific payment method.",
    },
    {
      target: "table-compra-insumos",
      title: "Supply Purchase Table",
      description:
        "Here you can view the summary of all supply purchases made.",
    },
  ],

  "/agro-propietario/agro-facturas": [
    {
      target: "modulo-facturas",
      title: "Invoices Module",
      description: "Here you can manage all invoices for your agri-service.",
    },
    {
      target: "filters-facturacion",
      title: "Billing Filters",
      description:
        "Filter invoices by branch and date range to quickly find what you need.",
    },
    {
      target: "sucusal-facturacion",
      title: "Filter by Branch",
      description:
        "Select a specific branch to see only invoices generated there.",
    },
    {
      target: "fechaIn-facturacion",
      title: "Start Date Filter",
      description:
        "Set a start date to filter invoices generated from that day onward.",
    },
    {
      target: "fechaFin-facturacion",
      title: "End Date Filter",
      description:
        "Set an end date to filter invoices generated up to that day.",
    },
    {
      target: "tabla-facturas",
      title: "Invoice Table",
      description:
        "View all generated invoices with detailed information: number, date, branch, amount, and status.",
    },
    {
      target: "acciones-facturas",
      title: "Invoice Actions",
      description:
        "Here you can view the different actions you can apply to invoices for your agri-service.",
    },
  ],

  "/agro-propietario/agro-notas-credito": [
    {
      target: "notas-credito-page",
      title: "Credit Notes",
      description: "Complete credit note management for your agri-service.",
    },
    {
      target: "add-crear-nota",
      title: "New Credit Note",
      description: "Create a new credit note to make adjustments to invoices.",
    },
    {
      target: "filtros-notas-credito",
      title: "Search Filters",
      description: "Filter credit notes by branch and date range.",
    },
    {
      target: "tabla-notas-credito",
      title: "Notes List",
      description: "Detailed table with all registered credit notes.",
    },
    {
      target: "acciones-nota",
      title: "Credit Note Actions",
      description:
        "Here you can perform actions such as viewing or downloading the credit note.",
    },
  ],

  "/agro-propietario/agro-rangos-facturas": [
    {
      target: "modulo-rangos",
      title: "Range Control",
      description:
        "Complete panel to manage the billing ranges of your agri-service.",
    },
    {
      target: "add-rango",
      title: "Create Range",
      description: "Register a new billing range with all necessary data.",
    },
    {
      target: "estadisticas-rangos",
      title: "Range Statistics",
      description:
        "View key metrics: total ranges, active ranges, and ranges about to expire.",
    },
    {
      target: "buscador-rangos",
      title: "Range Search",
      description:
        "This search allows you to find ranges by CAI, prefix, or agri-service.",
    },
    {
      target: "lista-rangos",
      title: "Range Table",
      description:
        "Complete list of ranges with information on CAI, prefix, dates, and status.",
    },
    {
      target: "acciones-rango",
      title: "Range Actions",
      description:
        "Here you can perform actions on the range, such as viewing details and editing ranges.",
    },
  ],

  "/agro-propietario/agro-lotes": [
    {
      target: "lotes-page",
      title: "Batch Management",
      description:
        "Complete panel to manage the product inventory by branch for your agri-service.",
    },
    {
      target: "estadisticas-lotes",
      title: "Inventory Summary",
      description:
        "View total products, units, total cost, and average inventory value.",
    },
    {
      target: "card-total-productos",
      title: "Total Products",
      description: "Total number of different products in inventory.",
    },
    {
      target: "card-unidades-totales",
      title: "Total Units",
      description: "Total sum of available units in inventory.",
    },
    {
      target: "card-costo-total",
      title: "Total Cost",
      description: "Total inventory value in local currency.",
    },
    {
      target: "card-valor-promedio",
      title: "Average Value",
      description: "Average cost per product unit in inventory.",
    },
    {
      target: "filtro-sucursal-lotes",
      title: "Branch Selection",
      description: "Choose the branch to view its specific inventory.",
    },
    {
      target: "buscador-lotes",
      title: "Product Search",
      description: "Find products quickly by name or code.",
    },
    {
      target: "tabla-lotes",
      title: "Product List",
      description:
        "Complete table with all products in the selected inventory.",
    },
    {
      target: "acciones-lotes",
      title: "Batch Actions",
      description:
        "Here you can transfer product batches between branches of your agri-service.",
    },
  ],

  "/agro-propietario/agro-traslados": [
    {
      target: "traslados-page",
      title: "Inventory Transfers",
      description: "Complete history of product transfers between branches.",
    },
    {
      target: "buscador-traslados",
      title: "Transfer Search",
      description: "Search transfers by product name or code.",
    },
    {
      target: "filters-tralados",
      title: "Transfer Filters",
      description: "Filter by branch, start date, and end date.",
    },
    {
      target: "metricas-traslados",
      title: "Transfer Metrics",
      description: "Statistics on transfers and transferred products.",
    },
    {
      target: "historial-traslados",
      title: "Transfer History",
      description: "List of all inventory movements.",
    },
  ],

  "/agro-propietario/agro-movimientos-lotes": [
    {
      target: "movimientos-lotes-page",
      title: "Batch Movements Module",
      description:
        "View and track all inventory movements of your batches in the agri-service.",
    },
    {
      target: "filtros-movimientos-lotes",
      title: "Movement Filters",
      description: "Filter movements by branch, movement type, and date range.",
    },
    {
      target: "buscador-movimientos",
      title: "Movement Search",
      description:
        "Search movements by product, invoice number, or purchase ID.",
    },
    {
      target: "tabla-movimientos-lotes",
      title: "Movement Table",
      description:
        "Complete list of all batch movements with detailed information.",
    },
    {
      target: "resultados-movimientos",
      title: "Search Results",
      description:
        "Shows the movements found according to the applied filters and search.",
    },
  ],

  "/agro-propietario/agro-productos": [
    {
      target: "productos-page",
      title: "Products Module",
      description:
        "Manage the complete catalog of agricultural products for your agri-service.",
    },
    {
      target: "add-productos",
      title: "Add Products",
      description:
        "Here you can enter the various products for your agri-service.",
    },
    {
      target: "filtros-productos",
      title: "Product Filters",
      description:
        "Filter products by category, brand, and supplier to quickly find what you need.",
    },
    {
      target: "tabla-productos-agro",
      title: "Product Table",
      description:
        "Complete list of all products with detailed inventory and price information.",
    },
    {
      target: "config-escalas-descuentos",
      title: "Scale and Discount Configuration",
      description:
        "Manage the configuration of price scales and discounts for the selected product.",
    },
    {
      target: "edit-producto",
      title: "Edit Product",
      description: "Modify the information of the selected product.",
    },
    {
      target: "subir-imagen-producto",
      title: "Upload Product Images",
      description: "Manage the images and photo gallery of the product.",
    },
  ],

  "/agro-propietario/agro-insumos": [
    {
      target: "insumos-page",
      title: "Supplies Module",
      description:
        "Manage the complete catalog of agricultural supplies for your agri-service.",
    },
    {
      target: "add-insumos",
      title: "Add Supplies",
      description:
        "Here you can enter the various supplies for your agri-service.",
    },
    {
      target: "filtros-insumos",
      title: "Supply Filters",
      description: "Filter supplies by supplier.",
    },
    {
      target: "tabla-insumos-agro",
      title: "Supply List",
      description: "Complete table of supplies with prices and stock.",
    },
    {
      target: "config-escalas-descuentos-insumos",
      title: "Scales and Discounts",
      description: "Configure price scales and discounts per supply.",
    },
    {
      target: "edit-insumo",
      title: "Edit Supply",
      description: "Modify the information of the selected supply.",
    },
  ],

  "/agro-propietario/agro-proveedores": [
    {
      target: "proveedores-page",
      title: "Suppliers Module",
      description:
        "Manage the complete catalog of agricultural suppliers for your agri-service.",
    },
    {
      target: "add-proveedor",
      title: "Add Supplier",
      description: "Add a new supplier for your agri-service.",
    },
    {
      target: "buscador-proveedores",
      title: "Supplier Search",
      description: "Search suppliers by name, NIT, or NRC.",
    },
    {
      target: "tabla-proveedores",
      title: "Supplier List",
      description:
        "Complete table of suppliers with contact and document information.",
    },
    {
      target: "edit-proveedor",
      title: "Edit Supplier",
      description: "Modify the information of the selected supplier.",
    },
  ],

  "/agro-propietario/agro-consumo-insumos": [
    {
      target: "consumo-insumos-page",
      title: "Supply Consumption Module",
      description:
        "Manage supply consumption in your agri-service, recording product exits.",
    },
    {
      target: "add-consumo-insumo",
      title: "Add Consumption",
      description: "Register a new supply consumption in the system.",
    },
    {
      target: "filtros-consumo-insumos",
      title: "Consumption Filters",
      description:
        "Filter consumption records by branch for more specific analysis.",
    },
    {
      target: "tabla-consumo-insumos",
      title: "Consumption List",
      description:
        "View all supply consumption records with detailed information.",
    },
  ],

  "/agro-propietario/agro-existencia": [
    {
      target: "existencia-productos-page",
      title: "Product Stock Module",
      description:
        "View the current stock of products in all branches of your agri-service.",
    },
    {
      target: "filtros-existencia",
      title: "Stock Filters",
      description:
        "Filter stock by branch or by specific product for detailed analysis.",
    },
    {
      target: "buscador-existencia",
      title: "Stock Search",
      description:
        "Search products by name, code, or branch to check availability.",
    },
    {
      target: "tabla-existencia",
      title: "Stock Table",
      description:
        "Complete list of products with their current stock in each branch.",
    },
  ],

  "/agro-propietario/agro-impuestos": [
    {
      target: "impuestos-page",
      title: "Taxes Module",
      description:
        "Manage the taxes applicable to products sold in your agri-service.",
    },
    {
      target: "add-impuesto",
      title: "Add Tax",
      description:
        "Register a new tax to apply to products in your agri-service.",
    },
    {
      target: "tabla-impuestos",
      title: "Tax List",
      description:
        "View all registered taxes with their name, percentage, and status.",
    },
    {
      target: "edit-impuesto",
      title: "Edit Tax",
      description: "Modify the name or percentage of the selected tax.",
    },
  ],

  "/agro-propietario/agro-descuentos": [
    {
      target: "descuentos-page",
      title: "Discounts Module",
      description:
        "Manage the discounts available to your customers in the agri-service.",
    },
    {
      target: "add-descuento",
      title: "Add Discount",
      description:
        "Register a new discount to apply to products in your agri-service.",
    },
    {
      target: "tabla-descuentos",
      title: "Discount List",
      description:
        "View all registered discounts with their name, percentage, and status.",
    },
    {
      target: "edit-descuento",
      title: "Edit Discount",
      description: "Modify the name or percentage of the selected discount.",
    },
  ],
};
