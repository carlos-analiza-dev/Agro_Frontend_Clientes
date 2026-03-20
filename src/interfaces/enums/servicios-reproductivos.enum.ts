export enum TipoServicio {
  MONTA_NATURAL = "MONTA_NATURAL",
  INSEMINACION_ARTIFICIAL = "INSEMINACION_ARTIFICIAL",
  TRANSFERENCIA_EMBRIONES = "TRANSFERENCIA_EMBRIONES",
  FERTILIZACION_INVITRO = "FERTILIZACION_INVITRO",
}

export enum EstadoServicio {
  PROGRAMADO = "PROGRAMADO",
  REALIZADO = "REALIZADO",
  FALLIDO = "FALLIDO",
  CANCELADO = "CANCELADO",
}

export enum EstadoCeloAnimal {
  ACTIVO = "ACTIVO", // El animal está en celo
  FINALIZADO = "FINALIZADO", // Terminó el celo
  SERVIDO = "SERVIDO", // Se realizó servicio en este celo
  PREÑADO = "PREÑADO", // El servicio fue exitoso
  NO_FECUNDADO = "NO_FECUNDADO", // Hubo servicio pero no hubo preñez
  SIN_SERVICIO = "SIN_SERVICIO", // Terminó el celo sin servicio
}
