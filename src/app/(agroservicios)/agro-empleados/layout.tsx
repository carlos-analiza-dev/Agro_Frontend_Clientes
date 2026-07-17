"use client";

import { Permiso } from "@/api/permisos/interface/response-permisos.interface";
import { FullScreenLoader } from "@/components/generics/FullScreenLoader";
import { SessionExpiredModal } from "@/components/generics/SessionExpiredModal";
import ShetContentCompAgro from "@/components/generics/ShetContentCompAgro";
import NavBarAgro from "@/components/NavBars/NavBarAgro";
import SidebarAgro from "@/components/SideBars/SidebarAgro";
import { publicRoutes } from "@/helpers/data/publics-routes";
import { isTokenExpired } from "@/helpers/funciones/tokenExpired";
import { useFavoritos } from "@/hooks/favoritos/useFavoritos";
import useGetPermisosByRol from "@/hooks/permisos/useGetPermisosByRol";
import { useAuthEmpleadoStore } from "@/providers/store/useAuthEmpleados";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { useCartStore } from "@/providers/store/useCartStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const RUTA_PERMITIDA_SIN_PERMISOS = "/agro-empleados/agro-servicios";

export default function EmpleadosAgroServiciosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { logout, empleado, token } = useAuthEmpleadoStore();
  const { cliente, token: token_cliente } = useAuthStore();
  const isCliente = !!cliente && !!token_cliente;
  const rolId = empleado?.role.id ?? "";
  const { limpiarFavoritos } = useFavoritos();
  const { clearCart } = useCartStore();
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const { data: permisosEmpleados, isLoading: isLoadingPermisos } =
    useGetPermisosByRol(rolId);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const checkExpiration = () => {
      if (token && isTokenExpired(token)) {
        setShowSessionModal(true);
        return true;
      }
      return false;
    };

    checkExpiration();
  }, [token, isHydrated]);

  useEffect(() => {
    if (!token) return;

    const interval = setInterval(() => {
      if (isTokenExpired(token)) {
        setShowSessionModal(true);
        clearInterval(interval);
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    if (!isHydrated) return;

    const checkAuth = () => {
      if (!token) {
        router.push("/login-empleados");
        return;
      }

      if (isTokenExpired(token)) {
        setShowSessionModal(true);
        return;
      }
    };

    checkAuth();
  }, [token, router, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;
    if (!token) return;
    if (!empleado) return;
    if (isTokenExpired(token)) return;
    if (isLoadingPermisos) return;

    const isPublicRoute =
      publicRoutes.includes(pathname) ||
      publicRoutes.some((route) => pathname.startsWith(route + "/"));

    if (isPublicRoute) {
      return;
    }

    if (pathname === RUTA_PERMITIDA_SIN_PERMISOS) {
      return;
    }

    const hasPermission = () => {
      if (!permisosEmpleados || permisosEmpleados.length === 0) {
        return false;
      }

      return permisosEmpleados.some((permiso: Permiso) => {
        return (
          permiso.isActive &&
          (pathname === permiso.url || pathname.startsWith(permiso.url + "/"))
        );
      });
    };

    if (!hasPermission()) {
      router.push(RUTA_PERMITIDA_SIN_PERMISOS);
    }
  }, [
    empleado,
    pathname,
    token,
    isLoadingPermisos,
    isHydrated,
    router,
    permisosEmpleados,
  ]);

  const handleLogout = async () => {
    try {
      setMobileSidebarOpen(false);
      setLoading(true);
      await logout();
      limpiarFavoritos();
      clearCart();
      localStorage.removeItem("user_location");

      await new Promise((resolve) => setTimeout(resolve, 100));

      router.push("/login-empleados");
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      toast.error("Ocurrió un error al cerrar la sesión");
      router.push("/login-empleados");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionExpired = async () => {
    setShowSessionModal(false);
    setLoading(true);
    try {
      await logout();
      router.push("/login-empleados");
    } catch (error) {
      toast.error("Error al cerrar sesión expirada");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!pathname.startsWith("/agro-empleados")) {
      router.replace("/agro-empleados/agro-servicios");
    }
  }, [pathname, router, isHydrated]);

  useEffect(() => {
    if (!isHydrated) return;

    if (isCliente) {
      router.replace("/panel");
      return;
    }

    if (!token) {
      router.replace("/");
      return;
    }

    if (isTokenExpired(token)) {
      setShowSessionModal(true);
    }
  }, [isHydrated, isCliente, token]);

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAgro handleLogout={handleLogout} isPropietario={false} />

      <ShetContentCompAgro
        setMobileSidebarOpen={setMobileSidebarOpen}
        handleLogout={handleLogout}
        mobileSidebarOpen={mobileSidebarOpen}
        isPropietario={false}
      />

      <div className="flex flex-1 flex-col overflow-hidden lg:ml-64">
        <NavBarAgro
          setMobileSidebarOpen={setMobileSidebarOpen}
          handleLogout={handleLogout}
          isPropietario={false}
        />
        <main className="flex-1 overflow-y-auto bg-gray-50 md:p-6">
          {children}
        </main>
      </div>

      <SessionExpiredModal
        isOpen={showSessionModal}
        onClose={handleSessionExpired}
      />
    </div>
  );
}
