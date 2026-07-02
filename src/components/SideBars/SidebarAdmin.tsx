"use client";

import { navItems } from "@/helpers/data/sidebar/sidebarData";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Sparkles, Menu } from "lucide-react";
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
import SidebarSkeleton from "./SidebarSkeleton";
import { cn } from "@/lib/utils";

interface Props {
  handleLogout: () => Promise<void>;
}

const SidebarItem = ({
  href,
  icon: Icon,
  name,
  isActive,
}: {
  href: string;
  icon: React.ElementType;
  name: string;
  isActive: boolean;
}) => (
  <Link
    href={href}
    className={cn(
      "flex items-center rounded-xl px-3 py-2.5 text-sm font-medium",
      isActive
        ? "bg-gradient-to-r from-green-600 to-green-700 text-white"
        : "text-gray-600 hover:bg-green-50/80 hover:text-green-600",
    )}
  >
    <Icon
      className={cn("h-4 w-4 mr-3", isActive ? "text-white" : "text-gray-400")}
    />
    {name}
    {isActive && (
      <span className="ml-auto flex h-1.5 w-1.5 rounded-full bg-green-400" />
    )}
  </Link>
);

const SidebarSection = ({
  category,
  children,
}: {
  category: string;
  children: React.ReactNode;
}) => (
  <AccordionItem
    value={category}
    className="border-b-0 bg-white/40 backdrop-blur-sm rounded-xl border border-white/40 overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.02)]"
  >
    <AccordionTrigger className="px-4 py-3 hover:bg-green-50/30 hover:no-underline text-sm font-semibold text-gray-700">
      <span className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-green-500 to-green-600" />
        {category}
      </span>
    </AccordionTrigger>
    <AccordionContent className="space-y-1 mt-1 px-2 pb-3">
      {children}
    </AccordionContent>
  </AccordionItem>
);

const LogoutButton = ({ onClick }: { onClick: () => Promise<void> }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex w-full items-center rounded-xl px-4 py-3 text-sm font-medium",
      "text-gray-500 hover:text-red-600 hover:bg-red-50/80",
    )}
  >
    <LogOut className="mr-3 h-5 w-5" />
    Cerrar sesión
  </button>
);

const SidebarLogo = () => (
  <div className="flex h-16 flex-shrink-0 items-center px-6 border-b border-gray-100/50 bg-gradient-to-r from-white via-green-50/20 to-white">
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-green-600 to-green-700 shadow-[0_4px_16px_rgba(34,197,94,0.2)]">
        <Sparkles className="h-4 w-4 text-white" />
      </div>
      <div>
        <h1 className="text-lg font-bold bg-gradient-to-r from-green-700 to-green-600 bg-clip-text text-transparent leading-none">
          Agroservicio
        </h1>
        <span className="text-[10px] text-gray-400 font-medium tracking-wider uppercase">
          Panel de control
        </span>
      </div>
    </div>
  </div>
);

const SidebarAdmin: React.FC<Props> = ({ handleLogout }) => {
  const { cliente } = useAuthStore();
  const pathname = usePathname();

  const paqueteId = cliente?.paqueteActivo?.paquete?.id ?? "";
  const clienteId = cliente?.id ?? "";

  const esPropietario = cliente?.rol === TipoCliente.PROPIETARIO;

  const { data: permisosPaquete } = useGetPermisosByClientePaquete(paqueteId);

  const {
    data: permisosCliente,
    isLoading,
    isError,
  } = useGetPermisosByCliente(clienteId);

  const permisos = esPropietario ? permisosPaquete : permisosCliente;

  const permisosVer =
    permisos
      ?.filter((permiso) => permiso.ver === true)
      ?.map((permiso) => permiso.permiso.url) || [];

  const filteredNavItems = navItems
    .map((section) => {
      const filteredItems = section.items.filter((item) => {
        if (item.href === "/panel") return true;

        if (item.href.startsWith("/animales/especies")) {
          return permisosVer.includes("/animales");
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

  if (isLoading || isError) {
    return <SidebarSkeleton />;
  }

  return (
    <aside className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex w-64 flex-col bg-white/80 backdrop-blur-xl border-r border-gray-100/50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <SidebarLogo />

        <div className="flex flex-1 flex-col overflow-y-auto px-3 py-4">
          <Accordion type="multiple" className="space-y-2">
            {filteredNavItems.map((section) => (
              <SidebarSection
                key={section.category}
                category={section.category}
              >
                {section.items.map((item) => {
                  const isActive = isItemActive(item.href);
                  return (
                    <SidebarItem
                      key={item.name}
                      href={item.href}
                      icon={item.icon}
                      name={item.name}
                      isActive={isActive}
                    />
                  );
                })}
              </SidebarSection>
            ))}
          </Accordion>

          {filteredNavItems.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100/50">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50/80 mx-auto mb-3">
                  <Menu className="h-6 w-6 text-gray-300" />
                </div>
                <p className="text-sm font-medium text-gray-600">
                  No tienes permisos asignados
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Contacta al administrador
                </p>
              </div>
            </div>
          )}

          <div className="mt-auto pt-4 border-t border-gray-100/50">
            <div className="p-2 bg-white/40 backdrop-blur-sm rounded-xl border border-gray-100/50">
              <LogoutButton onClick={handleLogout} />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
