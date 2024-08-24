import mongoose from 'mongoose';

export const validateDetailOrderData = (data) => {
  // Si `data` es null o no es un objeto, retornar el error correspondiente
  if (data === null || typeof data !== 'object') {
    return { isValid: false, message: "Datos inválidos: no es un objeto válido." };
  }

  // Validar `item` si está presente: debe ser un ObjectId válido
  if (data.hasOwnProperty('item')) {
    if (!mongoose.Types.ObjectId.isValid(data.item) || typeof data.item !== 'string') {
      return { isValid: false, message: "El campo 'Item' es inválido." };
    }
  }

  // Validar `cantidad` si está presente: debe ser un número válido y mayor que 0
  if (data.hasOwnProperty('cantidad')) {
    if (typeof data.cantidad !== 'number' || isNaN(data.cantidad) || data.cantidad <= 0) {
      return { isValid: false, message: "El campo 'Cantidad' debe ser un número válido mayor que 0." };
    }
  }

  // Validar `price` si está presente: debe ser un número válido y mayor que 0
  if (data.hasOwnProperty('price')) {
    if (typeof data.price !== 'number' || isNaN(data.price) || data.price <= 0) {
      return { isValid: false, message: "El campo 'Precio' debe ser un número válido mayor que 0." };
    }
  }

  // Validar `isActive` si está presente: debe ser un booleano
  if (data.hasOwnProperty('isActive')) {
    if (typeof data.isActive !== 'boolean') {
      return { isValid: false, message: "El campo 'Activo' debe ser un booleano." };
    }
  }

  // Validar `order` si está presente: debe ser un ObjectId válido
  if (data.hasOwnProperty('order')) {
    if (!mongoose.Types.ObjectId.isValid(data.order) || typeof data.order !== 'string') {
      return { isValid: false, message: "El campo 'Orden' es inválido." };
    }
  }

  return { isValid: true };
};
