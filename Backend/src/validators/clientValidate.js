import mongoose from "mongoose";

export const validateClientData = (data) => {
  console.log(data);
  // Si `data` es null o no es un objeto, retornar false
  if (data === null || typeof data !== "object") {
    return false;
  }

  // Validar `account` si está presente: debe ser un número válido
  if (data.hasOwnProperty("account")) {
    if (typeof data.account !== "number" || isNaN(data.account)) {
      return false;
    }
  }

  // Validar `accountState` si está presente: debe ser uno de los valores permitidos
  if (data.hasOwnProperty("accountState")) {
    const validStates = ["paid", "pending"];
    if (
      typeof data.accountState !== "string" ||
      !validStates.includes(data.accountState)
    ) {
      return false;
    }
  }

  // Validar `user` si está presente: debe ser un ObjectId válido
  if (data.hasOwnProperty("user")) {
    if (!mongoose.Types.ObjectId.isValid(data.user)) {
      return false;
    }
  }

  return true;
};
