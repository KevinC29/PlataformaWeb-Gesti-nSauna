import mongoose from 'mongoose';

export const validateCommentData = (data) => {
  // Si `data` es null o no es un objeto, retornar el error correspondiente
  if (data === null || typeof data !== 'object') {
    return { isValid: false, message: "Datos inválidos: no es un objeto válido." };
  }

  // Validar `date` si está presente: debe ser una fecha válida y no anterior a la actual
  if (data.hasOwnProperty('date')) {
    const currentDate = new Date();
    if (!(data.dateOrder instanceof Date) || isNaN(data.dateOrder.getTime()) || data.dateOrder < currentDate) {
      return { isValid: false, message: "El campo 'Fecha del comentario' debe ser una fecha válida y no anterior a la fecha actual." };
    }
  }

  // Validar `message` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('message')) {
    if (typeof data.message !== 'string' || data.message.trim().length === 0) {
      return { isValid: false, message: "El campo 'Mensaje' no puede estar vacío." };
    }
  }

  // Validar `isActive` si está presente: debe ser un booleano
  if (data.hasOwnProperty('isActive')) {
    if (typeof data.isActive !== 'boolean') {
      return { isValid: false, message: "El campo 'Activo' debe ser un booleano." };
    }
  }

  // Validar `client` si está presente: debe ser un ObjectId válido
  if (data.hasOwnProperty('client')) {
    if (!mongoose.Types.ObjectId.isValid(data.client) || typeof data.client !== 'string') {
      return { isValid: false, message: "El campo 'Cliente' es inválido." };
    }
  }

  // Validar `_id` si está presente: debe ser un ID de MongoDB válido
  if (data.hasOwnProperty('_id')) {
    if (!mongoose.Types.ObjectId.isValid(data._id) || typeof data._id !== 'string') {
      return { isValid: false, message: "El campo 'ID' es inválido." };
    }
  }

  return { isValid: true };
};
