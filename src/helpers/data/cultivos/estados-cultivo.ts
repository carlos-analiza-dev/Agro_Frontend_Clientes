import { TipoCultivoEnum } from "@/interfaces/enums/cultivos/tipo-cultivo.enums";

export const ciclosCultivo: Record<
  TipoCultivoEnum,
  {
    crecimiento: number;
    desarrollo: number;
    floracion: number;
    maduracion: number;
  }
> = {
  [TipoCultivoEnum.MAIZ]: {
    crecimiento: 20,
    desarrollo: 50,
    floracion: 80,
    maduracion: 110,
  },
  [TipoCultivoEnum.FRIJOL]: {
    crecimiento: 15,
    desarrollo: 35,
    floracion: 55,
    maduracion: 75,
  },
  [TipoCultivoEnum.ARROZ]: {
    crecimiento: 25,
    desarrollo: 60,
    floracion: 90,
    maduracion: 120,
  },
  [TipoCultivoEnum.SORGO]: {
    crecimiento: 20,
    desarrollo: 55,
    floracion: 85,
    maduracion: 115,
  },
  [TipoCultivoEnum.CAFE]: {
    crecimiento: 120,
    desarrollo: 240,
    floracion: 365,
    maduracion: 540,
  },
  [TipoCultivoEnum.PAPA]: {
    crecimiento: 30,
    desarrollo: 60,
    floracion: 90,
    maduracion: 120,
  },
  [TipoCultivoEnum.TOMATE]: {
    crecimiento: 20,
    desarrollo: 45,
    floracion: 70,
    maduracion: 100,
  },
  [TipoCultivoEnum.CEBOLLA]: {
    crecimiento: 25,
    desarrollo: 55,
    floracion: 80,
    maduracion: 110,
  },
  [TipoCultivoEnum.AJO]: {
    crecimiento: 30,
    desarrollo: 60,
    floracion: 90,
    maduracion: 120,
  },
  [TipoCultivoEnum.YUCA]: {
    crecimiento: 90,
    desarrollo: 180,
    floracion: 300,
    maduracion: 450,
  },
  [TipoCultivoEnum.HORTALIZAS]: {
    crecimiento: 10,
    desarrollo: 25,
    floracion: 40,
    maduracion: 60,
  },
  [TipoCultivoEnum.FRUTAS]: {
    crecimiento: 60,
    desarrollo: 120,
    floracion: 200,
    maduracion: 300,
  },
  [TipoCultivoEnum.OTROS]: {
    crecimiento: 30,
    desarrollo: 60,
    floracion: 90,
    maduracion: 120,
  },
};

export const getEstadoCultivo = (
  fechaSiembra: string,
  tipoCultivo: TipoCultivoEnum,
) => {
  if (!fechaSiembra) return { label: "Sin información", variant: "secondary" };

  const hoy = new Date();
  const siembra = new Date(fechaSiembra);

  const dias = Math.floor(
    (hoy.getTime() - siembra.getTime()) / (1000 * 3600 * 24),
  );

  const ciclo = ciclosCultivo[tipoCultivo];

  if (!ciclo) {
    return { label: "Sin configuración", variant: "secondary" };
  }

  if (dias < 0) return { label: "📅 Programado", variant: "secondary" };

  if (dias < ciclo.crecimiento)
    return { label: "🌱 Crecimiento inicial", variant: "default" };

  if (dias < ciclo.desarrollo)
    return { label: "🌿 Desarrollo vegetativo", variant: "default" };

  if (dias < ciclo.floracion)
    return { label: "🌻 Floración", variant: "success" };

  if (dias < ciclo.maduracion)
    return { label: "🌾 Maduración", variant: "warning" };

  return { label: "✅ Cosecha lista", variant: "success" };
};
