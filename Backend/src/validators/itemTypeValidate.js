import mongoose from 'mongoose';

export const validateItemTypeData = (data) => {
  // Si `data` es null o no es un objeto, retornar el error correspondiente
  if (data === null || typeof data !== 'object') {
    return { isValid: false, message: "Datos inválidos: no es un objeto válido." };
  }

  // Validar `name` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('name')) {
    if (typeof data.name !== 'string' || data.name.trim().length === 0) {
      return { isValid: false, message: "El campo 'Nombre' no puede estar vacío." };
    }
  }

  // Validar `description` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('description')) {
    if (typeof data.description !== 'string' || data.description.trim().length === 0) {
      return { isValid: false, message: "El campo 'Descripción' no puede estar vacío." };
    }
  }

  // Validar `isActive` si está presente: debe ser un booleano
  if (data.hasOwnProperty('isActive')) {
    if (typeof data.isActive !== 'boolean') {
      return { isValid: false, message: "El campo 'Activo' debe ser un booleano." };
    }
  }

  // Validar `section` si está presente: debe ser un ObjectId válido
  if (data.hasOwnProperty('section')) {
    if (!mongoose.Types.ObjectId.isValid(data.section) || typeof data.section !== 'string') {
      return { isValid: false, message: "El campo 'Sección' es inválido." };
    }
  }

  // Validar `_id` si está presente: debe ser un ID de MongoDB válido
  if (data.hasOwnProperty('_id')) {
    if (!mongoose.Types.ObjectId.isValid(data._id) || typeof data._id !== 'string') {
      return { isValid: false, message: "El campo 'ID'es inválido." };
    }
  }

  return { isValid: true };
};
