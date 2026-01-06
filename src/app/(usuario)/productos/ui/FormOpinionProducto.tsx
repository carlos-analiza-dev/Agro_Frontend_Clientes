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
    <div className="border rounded-lg p-6 bg-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Escribe tu opinión</h3>
          <p className="text-sm text-muted-foreground">
            Sobre: {productoNombre}
          </p>
        </div>
        {onCancel && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCancel}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Calificación general *</label>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-1"
              >
                <Star
                  className={cn(
                    "h-8 w-8 transition-colors",
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "fill-gray-200 text-gray-200"
                  )}
                />
              </button>
            ))}
            <span className="ml-2 text-sm text-muted-foreground">
              {rating > 0
                ? `${rating} estrella${rating !== 1 ? "s" : ""}`
                : "Selecciona"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="titulo" className="text-sm font-medium">
            Título de la opinión *
          </label>
          <Input
            id="titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ej: Excelente producto, muy buena calidad"
            maxLength={200}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground text-right">
            {titulo.length}/200 caracteres
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="comentario" className="text-sm font-medium">
            Tu experiencia *
          </label>
          <Textarea
            id="comentario"
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            placeholder="Comparte tu experiencia con este producto. ¿Qué te gustó o no te gustó? ¿Cumple con lo esperado?"
            rows={5}
            maxLength={2000}
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground text-right">
            {comentario.length}/2000 caracteres
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="flex gap-3">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
              className="flex-1"
            >
              Cancelar
            </Button>
          )}
          <Button
            type="submit"
            disabled={isSubmitting || rating === 0}
            className={cn("flex-1", onCancel ? "flex-1" : "w-full")}
          >
            {isSubmitting ? "Enviando..." : "Publicar opinión"}
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          Tu opinión aparecerá como "Compra verificada" ya que has adquirido
          este producto.
        </p>
      </form>
    </div>
  );
}
