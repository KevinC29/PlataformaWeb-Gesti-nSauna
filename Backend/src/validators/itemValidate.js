import mongoose from 'mongoose';

export const validateItemData = (data) => {
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

  // Validar `price` si está presente: debe ser un número válido
  if (data.hasOwnProperty('price')) {
    if (
      typeof data.price !== 'number' ||
      isNaN(data.price) ||
      data.price <= 0 ||
      !/^\d+(\.\d{1,2})?$/.test(data.price.toString())
    ) {
      return { isValid: false, message: "El campo 'Precio' debe ser un número válido y mayor a cero." };
    }
  }

  // Validar `imageUrl` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('imageUrl')) {
    if (typeof data.imageUrl !== 'string' || data.imageUrl.trim().length === 0) {
      return { isValid: false, message: "El campo 'URL de imagen' no puede estar vacío." };
    }
  }

  // Validar `isActive` si está presente: debe ser un booleano
  if (data.hasOwnProperty('isActive')) {
    if (typeof data.isActive !== 'boolean') {
      return { isValid: false, message: "El campo 'Activo' debe ser un booleano." };
    }
  }

  // Validar `itemType` si está presente: debe ser un ObjectId válido
  if (data.hasOwnProperty('itemType')) {
    if (!mongoose.Types.ObjectId.isValid(data.itemType) || typeof data.itemType !== 'string') {
      return { isValid: false, message: "El campo 'Tipo de ítem' es inválido." };
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
