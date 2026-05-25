import { Producto } from "@/api/productos/interfaces/response-productos-disponibles.interface";
import { toast } from "react-toastify";

export const handleShareWhatsApp = (
  productoId: string,
  producto: Producto,
  isAvailable: boolean,
  precio: string,
  moneda: string,
) => {
  const urlBase = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;

  const productUrl = `${urlBase}/productos-agroservicios/${productoId}`;

  const simboloMoneda = moneda || "L.";

  const mensaje = encodeURIComponent(
    `🌟 *${producto?.nombre}* 🌟\n\n` +
      `💰 *Precio:* ${simboloMoneda} ${parseFloat(precio).toFixed(2)}\n` +
      `${producto?.marca?.nombre ? `🏷️ *Marca:* ${producto.marca.nombre}\n` : ""}` +
      `${producto?.categoria?.nombre ? `📂 *Categoría:* ${producto.categoria.nombre}\n` : ""}\n` +
      `${isAvailable ? "✅ Disponible" : "❌ No disponible"}\n\n` +
      `🔗 ${productUrl}\n\n` +
      `¡Encuéntralo en Agroservicios!`,
  );

  window.open(`https://wa.me/?text=${mensaje}`, "_blank");
};

export const handleShareFacebook = (productoId: string) => {
  const urlBase = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  const productUrl = `${urlBase}/productos-agroservicios/${productoId}`;
  window.open(
    `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`,
    "_blank",
  );
};

export const handleShareTwitter = (productoId: string, producto: Producto) => {
  const urlBase = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  const productUrl = `${urlBase}/productos-agroservicios/${productoId}`;
  const text = encodeURIComponent(`¡Mira este producto! ${producto?.nombre}`);
  window.open(
    `https://twitter.com/intent/tweet?text=${text}&url=${encodeURIComponent(productUrl)}`,
    "_blank",
  );
};

export const handleCopyLink = async (productoId: string) => {
  const urlBase = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
  const productUrl = `${urlBase}/productos-agroservicios/${productoId}`;
  try {
    await navigator.clipboard.writeText(productUrl);
  } catch (err) {
    toast.error("Error al copiar el link");
  }
};
