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
} from "lucide-react";

export const agroRoutes = [
  {
    name: "Dashboard",
    href: "/agro-propietario/agro-servicios",
    icon: LayoutDashboard,
  },
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
    name: "Productos",
    href: "/agro-propietario/agro-productos",
    icon: ShoppingBag,
  },
  {
    name: "Inventario",
    href: "/agro-inventario",
    icon: Warehouse,
  },
  {
    name: "Pedidos",
    href: "/agro-pedidos",
    icon: Package,
  },
  {
    name: "Servicios Veterinarios",
    href: "/agro-servicios-veterinarios",
    icon: BriefcaseMedical,
  },
  {
    name: "Clientes",
    href: "/agro-clientes",
    icon: Users,
  },
  {
    name: "Proveedores",
    href: "/agro-proveedores",
    icon: Truck,
  },
  {
    name: "Facturación",
    href: "/agro-facturas",
    icon: FileText,
  },
  {
    name: "Ingresos",
    href: "/agro-ingresos",
    icon: DollarSign,
  },
  {
    name: "Personal",
    href: "/agro-propietario/agro-empleados",
    icon: UserCog,
  },
  {
    name: "Notificaciones",
    href: "/agro-notificaciones",
    icon: Bell,
  },
];

export const agroEmpleadoRoutes = [
  {
    name: "Dashboard",
    href: "/agro-empleados/agro-servicios",
    icon: LayoutDashboard,
  },
  {
    name: "Mi Agroservicio",
    href: "/agro-empleados/agro-perfil",
    icon: Building2,
  },
  {
    name: "Productos",
    href: "/agro-empleados/agro-productos",
    icon: ShoppingBag,
  },
  {
    name: "Inventario",
    href: "/agro-inventario",
    icon: Warehouse,
  },
  {
    name: "Pedidos",
    href: "/agro-pedidos",
    icon: Package,
  },
  {
    name: "Servicios Veterinarios",
    href: "/agro-servicios-veterinarios",
    icon: BriefcaseMedical,
  },
  {
    name: "Clientes",
    href: "/agro-clientes",
    icon: Users,
  },
  {
    name: "Proveedores",
    href: "/agro-proveedores",
    icon: Truck,
  },
  {
    name: "Facturación",
    href: "/agro-facturas",
    icon: FileText,
  },
  {
    name: "Ingresos",
    href: "/agro-ingresos",
    icon: DollarSign,
  },
  {
    name: "Personal",
    href: "/agro-empleados/agro-empleados",
    icon: UserCog,
  },
  {
    name: "Notificaciones",
    href: "/agro-notificaciones",
    icon: Bell,
  },
];
