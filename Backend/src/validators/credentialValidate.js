import mongoose from 'mongoose';

export const validateCredentialData = (data) => {
  // Si `data` es null o no es un objeto, retornar el error correspondiente
  if (data === null || typeof data !== 'object') {
    return { isValid: false, message: "Datos inválidos: no es un objeto válido." };
  }

  // Validar `email` si está presente: debe ser una cadena de texto no vacía y tener formato de email
  if (data.hasOwnProperty('email')) {
    if ( typeof data.email !== 'string' ||
      data.email.trim().length === 0
    ) {
      return { isValid: false, message: "El campo 'Email' no puede estar vacío." };
    }
  }

  // Validar `password` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('password')) {
    if (typeof data.password !== 'string' || data.password.trim().length === 0) {
      return { isValid: false, message: "El campo 'Contraseña' no puede estar vacío." };
    }
  }

  // Validar `newPassword` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('newPassword')) {
    if (typeof data.newPassword !== 'string' || data.newPassword.trim().length === 0) {
      return { isValid: false, message: "El campo 'Nueva Contraseña' no puede estar vacío." };
    }
  }

  // Validar `confirmPassword` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('confirmPassword')) {
    if (typeof data.confirmPassword !== 'string' || data.confirmPassword.trim().length === 0) {
      return { isValid: false, message: "El campo 'Confirmar Contraseña' no puede estar vacío." };
    }
  }

  // Validar `isActive` si está presente: debe ser un booleano
  if (data.hasOwnProperty('isActive')) {
    if (typeof data.isActive !== 'boolean') {
      return { isValid: false, message: "El campo 'Activo' debe ser un booleano." };
    }
  }

  // Validar `user` si está presente: debe ser un ObjectId válido
  if (data.hasOwnProperty('user')) {
    if (!mongoose.Types.ObjectId.isValid(data.user) || typeof data.user !== 'string') {
      return { isValid: false, message: "El campo 'Usuario' es inválido." };
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
