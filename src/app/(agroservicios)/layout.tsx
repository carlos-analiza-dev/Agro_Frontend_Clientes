"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/providers/store/useAuthStore";
import { toast } from "react-toastify";
import { FullScreenLoader } from "@/components/generics/FullScreenLoader";
import { useFavoritos } from "@/hooks/favoritos/useFavoritos";
import { useCartStore } from "@/providers/store/useCartStore";
import { isTokenExpired } from "@/helpers/funciones/tokenExpired";
import { SessionExpiredModal } from "@/components/generics/SessionExpiredModal";
import { TipoPaquete } from "@/interfaces/enums/paquetes/paquetes.enum";
import NavBarAgro from "@/components/NavBars/NavBarAgro";
import SidebarAgro from "@/components/SideBars/SidebarAgro";
import ShetContentCompAgro from "@/components/generics/ShetContentCompAgro";

export default function AgroServiciosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { logout, cliente, token } = useAuthStore();
  const { limpiarFavoritos } = useFavoritos();
  const { clearCart } = useCartStore();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  const tieneAgroGestion =
    cliente?.paqueteActivo?.paquete?.tipo === TipoPaquete.AGRO_GESTION;

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
        router.push("/");
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
    if (!cliente) return;
    if (isTokenExpired(token)) return;

    if (!tieneAgroGestion) {
      toast.warning("No tienes acceso a Agro Servicios");
      router.push("/panel");
      return;
    }
  }, [tieneAgroGestion, token, cliente, router, isHydrated]);

  const handleLogout = async () => {
    try {
      setMobileSidebarOpen(false);
      setLoading(true);
      await logout();
      limpiarFavoritos();
      clearCart();
      localStorage.removeItem("user_location");

      await new Promise((resolve) => setTimeout(resolve, 100));

      router.push("/");
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      toast.error("Ocurrió un error al cerrar la sesión");
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const handleSessionExpired = async () => {
    setShowSessionModal(false);
    setLoading(true);
    try {
      await logout();
      router.push("/");
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

  if (loading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarAgro handleLogout={handleLogout} />

      <ShetContentCompAgro
        setMobileSidebarOpen={setMobileSidebarOpen}
        handleLogout={handleLogout}
        mobileSidebarOpen={mobileSidebarOpen}
      />

      <div className="flex flex-1 flex-col overflow-hidden lg:ml-64">
        <NavBarAgro
          setMobileSidebarOpen={setMobileSidebarOpen}
          handleLogout={handleLogout}
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
