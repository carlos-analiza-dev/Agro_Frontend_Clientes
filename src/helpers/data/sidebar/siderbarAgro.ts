import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  Truck,
  BriefcaseMedical,
  Warehouse,
  DollarSign,
  FileText,
  UserCog,
  Bell,
  Building2,
  House,
  ShoppingCart,
  ShieldEllipsis,
  ArrowLeftRight,
  Receipt,
} from "lucide-react";

export const agroNavItems = [
  {
    category: "Panel",
    items: [
      {
        name: "Dashboard",
        href: "/agro-propietario/agro-servicios",
        icon: LayoutDashboard,
      },
      {
        name: "Auditoria",
        href: "/agro-propietario/auditoria",
        icon: ShieldEllipsis,
      },
    ],
  },
  {
    category: "Agroservicio",
    items: [
      {
        name: "Mi Agroservicio",
        href: "/agro-propietario/agro-perfil",
        icon: Building2,
      },
      {
        name: "Sucursales",
        href: "/agro-propietario/agro-sucursales",
        icon: House,
      },
      {
        name: "Personal",
        href: "/agro-propietario/agro-empleados",
        icon: UserCog,
      },
    ],
  },
  {
    category: "Compras",
    items: [
      {
        name: "Compras de Productos",
        href: "/agro-propietario/agro-compras-productos",
        icon: ShoppingCart,
      },
    ],
  },
  {
    category: "Facturación",
    items: [
      {
        name: "Facturas",
        href: "/agro-propietario/agro-facturas",
        icon: FileText,
      },
      {
        name: "Rangos de Facturación",
        href: "/agro-propietario/agro-rangos-facturas",
        icon: Receipt,
      },
    ],
  },
  {
    category: "Lotes",
    items: [
      {
        name: "Lotes",
        href: "/agro-propietario/agro-lotes",
        icon: Package,
      },
      {
        name: "Traslados",
        href: "/agro-propietario/agro-traslados",
        icon: ArrowLeftRight,
      },
    ],
  },
  {
    category: "Inventario",
    items: [
      {
        name: "Productos",
        href: "/agro-propietario/agro-productos",
        icon: ShoppingBag,
      },
      {
        name: "Proveedores",
        href: "/agro-propietario/agro-proveedores",
        icon: Truck,
      },
      {
        name: "Existencia Productos",
        href: "/agro-propietario/agro-existencia",
        icon: Warehouse,
      },
      {
        name: "Impuestos",
        href: "/agro-propietario/agro-impuestos",
        icon: Receipt,
      },
    ],
  },
  {
    category: "Ventas",
    items: [
      {
        name: "Pedidos",
        href: "/agro-pedidos",
        icon: Package,
      },
      {
        name: "Clientes",
        href: "/agro-clientes",
        icon: Users,
      },
    ],
  },
  {
    category: "Servicios",
    items: [
      {
        name: "Servicios Veterinarios",
        href: "/agro-servicios-veterinarios",
        icon: BriefcaseMedical,
      },
    ],
  },
  {
    category: "Finanzas",
    items: [
      {
        name: "Ingresos",
        href: "/agro-ingresos",
        icon: DollarSign,
      },
    ],
  },
  {
    category: "Sistema",
    items: [
      {
        name: "Notificaciones",
        href: "/agro-notificaciones",
        icon: Bell,
      },
    ],
  },
];

export const agroEmpleadoNavItems = [
  {
    category: "Panel",
    items: [
      {
        name: "Dashboard",
        href: "/agro-empleados/agro-servicios",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    category: "Agroservicio",
    items: [
      {
        name: "Mi Agroservicio",
        href: "/agro-empleados/agro-perfil",
        icon: Building2,
      },
      {
        name: "Personal",
        href: "/agro-empleados/agro-empleados",
        icon: UserCog,
      },
    ],
  },
  {
    category: "Compras",
    items: [
      {
        name: "Compras de Productos",
        href: "/agro-empleados/agro-compras-productos",
        icon: ShoppingCart,
      },
    ],
  },
  {
    category: "Facturación",
    items: [
      {
        name: "Facturas",
        href: "/agro-empleados/agro-facturas",
        icon: FileText,
      },
      {
        name: "Rangos de Facturación",
        href: "/agro-empleados/agro-rangos-facturas",
        icon: Receipt,
      },
    ],
  },
  {
    category: "Lotes",
    items: [
      {
        name: "Lotes",
        href: "/agro-empleados/agro-lotes",
        icon: Package,
      },
      {
        name: "Traslados",
        href: "/agro-empleados/agro-traslados",
        icon: ArrowLeftRight,
      },
    ],
  },
  {
    category: "Inventario",
    items: [
      {
        name: "Productos",
        href: "/agro-empleados/agro-productos",
        icon: ShoppingBag,
      },
      {
        name: "Proveedores",
        href: "/agro-empleados/agro-proveedores",
        icon: Truck,
      },
      {
        name: "Existencia Productos",
        href: "/agro-empleados/agro-existencia",
        icon: Warehouse,
      },
      {
        name: "Impuestos",
        href: "/agro-empleados/agro-impuestos",
        icon: Receipt,
      },
    ],
  },
  {
    category: "Ventas",
    items: [
      {
        name: "Pedidos",
        href: "/agro-pedidos",
        icon: Package,
      },
      {
        name: "Clientes",
        href: "/agro-clientes",
        icon: Users,
      },
    ],
  },
  {
    category: "Servicios",
    items: [
      {
        name: "Servicios Veterinarios",
        href: "/agro-servicios-veterinarios",
        icon: BriefcaseMedical,
      },
    ],
  },
  {
    category: "Finanzas",
    items: [
      {
        name: "Ingresos",
        href: "/agro-ingresos",
        icon: DollarSign,
      },
    ],
  },
  {
    category: "Sistema",
    items: [
      {
        name: "Notificaciones",
        href: "/agro-notificaciones",
        icon: Bell,
      },
    ],
  },
];
