"use client";

import React from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "../ui/sheet";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { navItems } from "@/helpers/data/sidebarData";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useAuthStore } from "@/providers/store/useAuthStore";

interface Props {
  setMobileSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleLogout: () => Promise<void>;
  mobileSidebarOpen: boolean;
}

const SheetContentComp = ({
  setMobileSidebarOpen,
  handleLogout,
  mobileSidebarOpen,
}: Props) => {
  const pathname = usePathname();
  const { cliente } = useAuthStore();

  const permisosVer =
    cliente?.clientePermisos
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
    <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
      <SheetContent
        side="left"
        className="w-64 p-0 h-screen flex flex-col overflow-hidden"
      >
        <SheetHeader className="border-b border-gray-200 flex-shrink-0">
          <div className="flex h-16 items-center justify-between px-6">
            <SheetTitle className="text-xl font-bold text-gray-900">
              Agroservicios
            </SheetTitle>
          </div>
        </SheetHeader>

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="flex-1 overflow-y-auto px-2 py-4">
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
                          onClick={() => setMobileSidebarOpen(false)}
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
              <div className="flex-1 flex items-center justify-center py-8">
                <div className="text-center text-gray-500">
                  <p>No tienes permisos asignados</p>
                  <p className="text-sm">Contacta al administrador</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex-shrink-0 p-4 border-t border-gray-100">
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
      </SheetContent>
    </Sheet>
  );
};

export default SheetContentComp;
