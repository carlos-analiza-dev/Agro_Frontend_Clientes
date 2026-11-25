import { TourStep } from "@/components/agroservicio/guia/TourGuide";

export const agroGestionStepsEmpleadosEn: Record<string, TourStep[]> = {
  "/agro-empleados/agro-servicios": [
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

  "/agro-empleados/agro-clientes": [
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

  "/agro-empleados/agro-compras-productos": [
    {
      target: "id-compras-header",
      title: "Product Purchases",
      description:
        "Here you can view product purchases made in the agri-service and register new purchases.",
    },
    {
      target: "id-compras-add-btn",
      title: "Add Purchase",
      description: "Click here to register a new product purchase.",
    },
    {
      target: "id-compras-filters",
      title: "Purchase Filters",
      description:
        "Use these filters to search for purchases by supplier, branch, or payment type.",
    },
    {
      target: "id-compras-filter-proveedor",
      title: "Filter by Supplier",
      description: "Select a supplier to view only their purchases.",
    },
    {
      target: "id-compras-filter-tipo-pago",
      title: "Filter by Payment Type",
      description: "Filter purchases by the payment method used.",
    },
    {
      target: "id-compras-filter-actions",
      title: "Clear Filters",
      description: "Use this option to clear the applied filters.",
    },
    {
      target: "id-compras-table-section",
      title: "Purchase List",
      description: "Here you can view all registered purchases.",
    },
    {
      target: "id-compras-table",
      title: "Purchase Table",
      description:
        "In this table you can view the detailed information of each purchase.",
    },
    {
      target: "id-detalles-compra-producto",
      title: "Purchase Details",
      description:
        "Here you can view the details of the products included in a purchase.",
    },
  ],

  "/agro-empleados/agro-compras-insumos": [
    {
      target: "id-compras-header",
      title: "Supply Purchases",
      description:
        "Here you can view supply purchases made in the agri-service.",
    },
    {
      target: "add-compra-insumo",
      title: "Add Purchase",
      description: "Use this button to register a new supply purchase.",
    },
    {
      target: "id-filters-compra-insumo",
      title: "Search Filters",
      description:
        "Use these filters to search for supply purchases by different criteria.",
    },
    {
      target: "compra-prov-insumo",
      title: "Filter by Supplier",
      description: "Select a supplier to view their supply purchases.",
    },
    {
      target: "compra-tipo-insumo",
      title: "Filter by Payment Type",
      description: "Select a payment type to filter purchases.",
    },
    {
      target: "table-compra-insumos",
      title: "Purchase Table",
      description:
        "Here you can view the summary of all supply purchases made.",
    },
  ],

  "/agro-empleados/agro-facturas": [
    {
      target: "modulo-facturas",
      title: "Invoices Module",
      description:
        "Here you can manage and view the invoices of your agri-service.",
    },
    {
      target: "add-factura-btn",
      title: "Enter Invoice",
      description:
        "Here you can enter invoices related to your agri-service sales.",
    },
    {
      target: "filters-facturacion",
      title: "Billing Filters",
      description: "Filter invoices by branch and date range.",
    },
    {
      target: "fechaIn-facturacion",
      title: "Start Date",
      description: "Set the date from which you want to view invoices.",
    },
    {
      target: "fechaFin-facturacion",
      title: "End Date",
      description: "Set the date up to which you want to view invoices.",
    },
    {
      target: "tabla-facturas",
      title: "Invoice Table",
      description:
        "Here you can view all invoices with their main information.",
    },
    {
      target: "acciones-facturas",
      title: "Invoice Actions",
      description: "Here you can perform the available actions on invoices.",
    },
  ],

  "/agro-empleados/agro-notas-credito": [
    {
      target: "notas-credito-page",
      title: "Credit Notes",
      description:
        "Here you can view and manage the agri-service credit notes.",
    },
    {
      target: "add-crear-nota",
      title: "New Credit Note",
      description: "Use this option to create a new credit note.",
    },
    {
      target: "filtros-notas-credito",
      title: "Search Filters",
      description: "Filter credit notes by branch and date range.",
    },
    {
      target: "tabla-notas-credito",
      title: "Notes List",
      description: "Here you can view all registered credit notes.",
    },
    {
      target: "acciones-nota",
      title: "Actions",
      description:
        "Here you can perform the available actions on credit notes.",
    },
  ],

  "/agro-empleados/agro-rangos-facturas": [
    {
      target: "modulo-rangos",
      title: "Range Control",
      description: "Here you can view and manage the available billing ranges.",
    },
    {
      target: "add-rango",
      title: "Create Range",
      description: "Use this option to register a new billing range.",
    },
    {
      target: "estadisticas-rangos",
      title: "Range Statistics",
      description: "View the key metrics related to billing ranges.",
    },
    {
      target: "buscador-rangos",
      title: "Range Search",
      description: "Search ranges by CAI, prefix, or agri-service.",
    },
    {
      target: "lista-rangos",
      title: "Range Table",
      description: "Here you can view all registered ranges.",
    },
    {
      target: "acciones-rango",
      title: "Range Actions",
      description: "Here you can perform the available actions on ranges.",
    },
  ],

  "/agro-empleados/agro-lotes": [
    {
      target: "lotes-page",
      title: "Batch Management",
      description: "Here you can view the product inventory by branch.",
    },
    {
      target: "estadisticas-lotes",
      title: "Inventory Summary",
      description: "View the general inventory summary.",
    },
    {
      target: "card-total-productos",
      title: "Total Products",
      description: "Shows the total number of different products in inventory.",
    },
    {
      target: "card-unidades-totales",
      title: "Total Units",
      description: "Shows the total number of available units.",
    },
    {
      target: "card-costo-total",
      title: "Total Cost",
      description: "Shows the total inventory value.",
    },
    {
      target: "card-valor-promedio",
      title: "Average Value",
      description: "Shows the average cost per unit.",
    },
    {
      target: "filtro-sucursal-lotes",
      title: "Branch Selection",
      description: "Select a branch to view its inventory.",
    },
    {
      target: "buscador-lotes",
      title: "Product Search",
      description: "Search products by name or code.",
    },
    {
      target: "tabla-lotes",
      title: "Product List",
      description: "Here you can view the products available in inventory.",
    },
    {
      target: "acciones-lotes",
      title: "Batch Actions",
      description: "Here you can perform the available actions on batches.",
    },
  ],

  "/agro-empleados/agro-traslados": [
    {
      target: "traslados-page",
      title: "Inventory Transfers",
      description: "Here you can view product transfers between branches.",
    },
    {
      target: "buscador-traslados",
      title: "Transfer Search",
      description: "Search transfers by product name or code.",
    },
    {
      target: "metricas-traslados",
      title: "Transfer Metrics",
      description: "View statistics related to transfers.",
    },
    {
      target: "historial-traslados",
      title: "Transfer History",
      description: "Here you can view the inventory movement history.",
    },
  ],

  "/agro-empleados/agro-movimientos-lotes": [
    {
      target: "movimientos-lotes-page",
      title: "Batch Movements",
      description: "Here you can view and track inventory movements.",
    },
    {
      target: "filtros-movimientos-lotes",
      title: "Movement Filters",
      description: "Filter movements by branch, type, and date range.",
    },
    {
      target: "buscador-movimientos",
      title: "Movement Search",
      description: "Search movements by product, invoice, or purchase.",
    },
    {
      target: "tabla-movimientos-lotes",
      title: "Movement Table",
      description: "Here you can view all registered batch movements.",
    },
    {
      target: "resultados-movimientos",
      title: "Results",
      description:
        "Shows the results according to the applied filters and search.",
    },
  ],

  "/agro-empleados/agro-productos": [
    {
      target: "productos-page",
      title: "Products Module",
      description: "Here you can manage the agricultural products catalog.",
    },
    {
      target: "add-productos",
      title: "Add Products",
      description: "Use this option to register new products.",
    },
    {
      target: "filtros-productos",
      title: "Product Filters",
      description: "Filter products by category, brand, and supplier.",
    },
    {
      target: "tabla-productos-agro",
      title: "Product Table",
      description: "Here you can view the complete product list.",
    },
    {
      target: "config-escalas-descuentos",
      title: "Scales and Discounts",
      description: "Configure the product's price scales and discounts.",
    },
    {
      target: "edit-producto",
      title: "Edit Product",
      description: "Modify the information of the selected product.",
    },
    {
      target: "subir-imagen-producto",
      title: "Product Images",
      description: "Manage the product images.",
    },
  ],

  "/agro-empleados/agro-insumos": [
    {
      target: "insumos-page",
      title: "Supplies Module",
      description: "Here you can manage the agricultural supplies catalog.",
    },
    {
      target: "add-insumos",
      title: "Add Supplies",
      description: "Use this option to register new supplies.",
    },
    {
      target: "filtros-insumos",
      title: "Supply Filters",
      description: "Filter supplies by supplier.",
    },
    {
      target: "tabla-insumos-agro",
      title: "Supply List",
      description:
        "Here you can view registered supplies with their prices and stock.",
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

  "/agro-empleados/agro-proveedores": [
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

  "/agro-empleados/agro-consumo-insumos": [
    {
      target: "consumo-insumos-page",
      title: "Supply Consumption Module",
      description:
        "Here you can manage supply consumption and register their exits.",
    },
    {
      target: "add-consumo-insumo",
      title: "Add Consumption",
      description: "Use this option to register a new supply consumption.",
    },
    {
      target: "tabla-consumo-insumos",
      title: "Consumption List",
      description: "Here you can view all supply consumption records.",
    },
  ],

  "/agro-empleados/agro-existencia": [
    {
      target: "existencia-productos-page",
      title: "Stock Module",
      description:
        "Here you can view the current stock of products in the branches.",
    },
    {
      target: "filtros-existencia",
      title: "Stock Filters",
      description: "Filter stock by branch or product.",
    },
    {
      target: "buscador-existencia",
      title: "Stock Search",
      description: "Search products by name, code, or branch.",
    },
    {
      target: "tabla-existencia",
      title: "Stock Table",
      description: "Here you can view the current stock of each product.",
    },
  ],

  "/agro-empleados/agro-impuestos": [
    {
      target: "impuestos-page",
      title: "Taxes Module",
      description: "Here you can view the taxes applicable to products.",
    },
    {
      target: "add-impuesto",
      title: "Add Tax",
      description: "Use this option to register a new tax.",
    },
    {
      target: "tabla-impuestos",
      title: "Tax List",
      description: "Here you can view registered taxes.",
    },
    {
      target: "edit-impuesto",
      title: "Edit Tax",
      description: "Modify the information of the selected tax.",
    },
  ],

  "/agro-empleados/agro-descuentos": [
    {
      target: "descuentos-page",
      title: "Discounts Module",
      description: "Here you can view and manage available discounts.",
    },
    {
      target: "add-descuento",
      title: "Add Discount",
      description: "Use this option to register a new discount.",
    },
    {
      target: "tabla-descuentos",
      title: "Discount List",
      description: "Here you can view all registered discounts.",
    },
    {
      target: "edit-descuento",
      title: "Edit Discount",
      description: "Modify the information of the selected discount.",
    },
  ],
};
