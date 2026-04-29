export const getMetodoPagoIcon = (metodo: string) => {
  switch (metodo.toLowerCase()) {
    case "efectivo":
      return "💵";
    case "transferencia":
      return "🏦";
    case "cheque":
      return "📝";
    default:
      return "💳";
  }
};
