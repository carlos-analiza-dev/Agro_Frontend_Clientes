import { ID_REGEX } from "@/helpers/data/formularios/identificacion";

export const validateIdentification = (value: string, codigoPais: string) => {
  if (!value) return "La identificación es requerida";

  switch (codigoPais) {
    case "HN":
      return ID_REGEX.HN.regex.test(value) || ID_REGEX.HN.message;
    case "SV":
      return ID_REGEX.SV.regex.test(value) || ID_REGEX.SV.message;
    case "GT":
      return ID_REGEX.GT.regex.test(value) || ID_REGEX.GT.message;
    default:
      return ID_REGEX.PASSPORT.regex.test(value) || ID_REGEX.PASSPORT.message;
  }
};

export const validateEmail = (email: string) => {
  const re =
    /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;
  return re.test(email) || "El correo electrónico no tiene formato adecuado";
};

export const validatePhone = (value: string) => {
  const cleanPhone = value.replace(/\s/g, "");

  const phoneRegex = /^\d{4}-\d{4}$/;

  if (!phoneRegex.test(cleanPhone)) {
    return "El teléfono debe tener el formato xxxx-xxxx (ej: 9876-5432)";
  }

  return true;
};
