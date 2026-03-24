"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { CrearOpinion } from "@/api/opiniones/accions/crear-opinion";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

interface FormOpinionProductoProps {
  productoId: string;
  productoNombre: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export default function FormOpinionProducto({
  productoId,
  productoNombre,
  onSuccess,
  onCancel,
}: FormOpinionProductoProps) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [titulo, setTitulo] = useState("");
  const [comentario, setComentario] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating === 0) {
      setError("Por favor selecciona una calificación");
      return;
    }

    if (!titulo.trim()) {
      setError("Por favor ingresa un título");
      return;
    }

    if (!comentario.trim()) {
      setError("Por favor ingresa un comentario");
      return;
    }

    setIsSubmitting(true);

    try {
      const data = {
        rating,
        titulo,
        comentario,
        productoId,
      };

      await CrearOpinion(data);

      toast.success("Tu opinión ha sido publicada exitosamente.");
      queryClient.invalidateQueries({ queryKey: ["opiniones"] });
      queryClient.invalidateQueries({ queryKey: ["rating"] });
      queryClient.invalidateQueries({ queryKey: ["producto-opinado"] });
      queryClient.invalidateQueries({ queryKey: ["producto-comprado"] });
      setRating(0);
      setTitulo("");
      setComentario("");

      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Error al enviar la opinión";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="border rounded-xl sm:rounded-lg p-4 sm:p-6 bg-white w-full max-w-2xl mx-auto">
      <div className="flex items-start sm:items-center justify-between gap-3 mb-4 sm:mb-6">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg md:text-xl font-semibold truncate">
            Escribe tu opinión
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground truncate">
            Sobre: {productoNombre}
          </p>
        </div>
        {onCancel && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <div className="space-y-2 sm:space-y-3">
          <label className="text-xs sm:text-sm font-medium block">
            Calificación general <span className="text-red-500">*</span>
          </label>

          <div className="flex flex-col xs:flex-row xs:items-center gap-2 xs:gap-3">
            <div className="flex items-center gap-0.5 sm:gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-0.5 sm:p-1 touch-manipulation"
                  aria-label={`Calificar con ${star} estrella${star !== 1 ? "s" : ""}`}
                >
                  <Star
                    className={cn(
                      "w-6 h-6 sm:w-8 sm:h-8 md:w-9 md:h-9 transition-colors",
                      star <= (hoverRating || rating)
                        ? "fill-yellow-400 text-yellow-400"
                        : "fill-gray-200 text-gray-200",
                    )}
                  />
                </button>
              ))}
            </div>

            <span className="text-xs sm:text-sm text-muted-foreground">
              {rating > 0 ? (
                <>
                  <span className="hidden xs:inline">
                    {rating} estrella{rating !== 1 ? "s" : ""}
                  </span>
                  <span className="xs:hidden">{rating}/5</span>
                </>
              ) : (
                "Selecciona"
              )}
            </span>
          </div>
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label
            htmlFor="titulo"
            className="text-xs sm:text-sm font-medium block"
          >
            Título de la opinión <span className="text-red-500">*</span>
          </label>
          <Input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Excelente producto, muy buena calidad"
            maxLength={200}
            disabled={isSubmitting}
            className="h-9 sm:h-10 text-sm"
          />
          <p className="text-xs text-muted-foreground text-right">
            {titulo.length}/200
          </p>
        </div>

        <div className="space-y-1 sm:space-y-2">
          <label
            htmlFor="comentario"
            className="text-xs sm:text-sm font-medium block"
          >
            Tu experiencia <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Comparte tu experiencia con este producto. ¿Qué te gustó o no te gustó? ¿Cumple con lo esperado?"
            rows={4}
            maxLength={2000}
            disabled={isSubmitting}
            className="text-sm min-h-[100px] sm:min-h-[120px]"
          />
          <p className="text-xs text-muted-foreground text-right">
            {comentario.length}/2000
          </p>
        </div>

        {error && (
          <div className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-xs sm:text-sm text-red-600 break-words">
              {error}
            </p>
          </div>
        )}

        <div className="flex flex-col-reverse xs:flex-row gap-2 xs:gap-3 pt-2">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="w-full xs:flex-1 h-9 sm:h-10 text-sm"
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className={cn(
              "w-full h-9 sm:h-10 text-sm",
              onCancel ? "xs:flex-1" : "",
            )}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="hidden xs:inline">Enviando...</span>
                <span className="xs:hidden">Enviando</span>
              </span>
            ) : (
              "Publicar opinión"
            )}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center px-2">
          Tu opinión aparecerá como{" "}
          <span className="font-medium">"Compra verificada"</span> ya que has
          adquirido este producto.
        </p>
      </form>
    </div>
  );
}
