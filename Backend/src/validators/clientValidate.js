import mongoose from "mongoose";

export const validateClientData = (data) => {
  // Si `data` es null o no es un objeto, retornar el error correspondiente
  if (data === null || typeof data !== "object") {
    return { isValid: false, message: "Datos inválidos: no es un objeto válido." };
  }

  // Validar `account` si está presente: debe ser un número válido con hasta dos decimales
  if (data.hasOwnProperty("account")) {
    if (
      typeof data.account !== "number" ||
      isNaN(data.account) ||
      data.account < 0 ||
      !/^\d+(\.\d{1,2})?$/.test(data.account.toString())
    ) {
      return { isValid: false, message: "El campo 'Cuenta' debe ser un número válido." };
    }
  }

  // Validar `accountState` si está presente: debe ser uno de los valores permitidos
  if (data.hasOwnProperty("accountState")) {
    const validStates = ["paid", "pending"];
    if (
      typeof data.accountState !== "string" ||
      !validStates.includes(data.accountState)
    ) {
      return { isValid: false, message: "El campo 'Estado de Cuenta' debe ser 'Pagado' o 'Pendiente'." };
    }
  }

  // Validar `user` si está presente: debe ser un ObjectId válido
  if (data.hasOwnProperty("user")) {
    if (!mongoose.Types.ObjectId.isValid(data.user) || typeof data.user !== 'string') {
      return { isValid: false, message: "El campo 'Usuario' es inválido." };
    }
  }

  return { isValid: true };
};
