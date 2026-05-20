"use client";

import { navItems } from "@/helpers/data/sidebarData";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "../ui/separator";
import { LogOut } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useAuthStore } from "@/providers/store/useAuthStore";
import useGetPermisosByClientePaquete from "@/hooks/permisos/useGetPermisosByClientePaquete";
import useGetPermisosByCliente from "@/hooks/permisos/useGetPermisosByCliente";
import { TipoCliente } from "@/interfaces/enums/clientes.enums";

interface Props {
  handleLogout: () => Promise<void>;
}

const SidebarAdmin: React.FC<Props> = ({ handleLogout }) => {
  const { cliente } = useAuthStore();
  const pathname = usePathname();

  const paqueteId = cliente?.paqueteActivo?.paquete?.id ?? "";
  const clienteId = cliente?.id ?? "";

  const esPropietario = cliente?.rol === TipoCliente.PROPIETARIO;

  const { data: permisosPaquete } = useGetPermisosByClientePaquete(paqueteId);

  const { data: permisosCliente } = useGetPermisosByCliente(clienteId);

  const permisos = esPropietario ? permisosPaquete : permisosCliente;

  const permisosVer =
    permisos
      ?.filter((permiso) => permiso.ver === true)
      ?.map((permiso) => permiso.permiso.url) || [];

  const filteredNavItems = navItems
    .map((section) => {
      const filteredItems = section.items.filter((item) => {
        if (item.href === "/panel") {
          return true;
        }

        return permisosVer.includes(item.href);
      });

      return {
        ...section,
        items: filteredItems,
      };
    })
    .filter((section) => section.items.length > 0);

  const isItemActive = (href: string) => pathname === href;

  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex w-64 flex-col border-r border-gray-200 bg-white">
        <div className="flex h-16 flex-shrink-0 items-center px-6 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900">Agroservicio</h1>
        </div>

        <div className="flex flex-1 flex-col overflow-y-auto px-2 py-4">
          <Accordion type="multiple" className="space-y-2">
            {filteredNavItems.map((section) => (
              <AccordionItem key={section.category} value={section.category}>
                <AccordionTrigger>{section.category}</AccordionTrigger>
                <AccordionContent className="space-y-1 mt-1 pl-2">
                  {section.items.map((item) => {
                    const isActive = isItemActive(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        }`}
                      >
                        <item.icon className="mr-2 h-4 w-4" />
                        {item.name}
                      </Link>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {filteredNavItems.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p>No tienes permisos asignados</p>
                <p className="text-sm">Contacta al administrador</p>
              </div>
            </div>
          )}

          <div className="mt-auto p-4 border-t border-gray-100">
            <Separator className="my-4" />
            <button
              onClick={handleLogout}
              className="flex w-full items-center rounded-lg px-4 py-3 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
