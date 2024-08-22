import mongoose from 'mongoose';

export const validateUserData = (data) => {
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

  // Validar `lastName` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('lastName')) {
    if (typeof data.lastName !== 'string' || data.lastName.trim().length === 0) {
      return { isValid: false, message: "El campo 'Apellido' no puede estar vacío." };
    }
  }

  // Validar `dni` si está presente: debe ser una cadena con al menos 10 dígitos
  if (data.hasOwnProperty('dni')) {
    const dni = data.dni.trim();
    if (typeof dni !== 'string' || dni.length < 10 || !/^\d+$/.test(dni)) {
      return { isValid: false, message: "El campo 'DNI' debe contar con al menos 10 dígitos numéricos." };
    }
  }

  // Validar `email` si está presente: debe ser una cadena de texto no vacía y tener formato de email
  if (data.hasOwnProperty('email')) {
    if (typeof data.email !== 'string' || data.email.trim().length === 0 || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(data.email)) {
      return { isValid: false, message: "El campo 'Email' no puede estar vacío y tener un formato de email válido." };
    }
  }

  // Validar `isActive` si está presente: debe ser un booleano
  if (data.hasOwnProperty('isActive')) {
    if (typeof data.isActive !== 'boolean') {
      return { isValid: false, message: "El campo 'Activo' debe ser un booleano." };
    }
  }

  // Validar `role` si está presente: debe ser un ObjectId válido
  if (data.hasOwnProperty('role')) {
    if (!mongoose.Types.ObjectId.isValid(data.role)) {
      return { isValid: false, message: "El campo 'Rol' es inválido." };
    }
  }

  // Validar `_id` si está presente: debe ser un ID de MongoDB válido
  if (data.hasOwnProperty('_id')) {
    if (!mongoose.Types.ObjectId.isValid(data._id)) {
      return { isValid: false, message: "El campo 'ID' es inválido." };
    }
  }

  return { isValid: true };
};
