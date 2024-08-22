import mongoose from 'mongoose';

export const validateCredentialData = (data) => {

  console.log(data)
  // Si `data` es null o no es un objeto, retornar false
  if (data === null || typeof data !== 'object') {
    return false;
  }

  // Validar `email` si está presente: debe ser una cadena de texto no vacía y tener formato de email
  if (data.hasOwnProperty('email')) {
    if (typeof data.email !== 'string' || data.email.trim().length === 0 || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(data.email)) {
      return false;
    }
  }

  // Validar `password, new o confirm` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('password')) {
    if (typeof data.password !== 'string' || data.password.trim().length === 0) {
      return false;
    }
  }

  // Validar `newPassword` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('newPassword')) {
    if (typeof data.password !== 'string' || data.password.trim().length === 0) {
      return false;
    }
  }

  // Validar `confirmPasword` si está presente: debe ser una cadena no vacía
  if (data.hasOwnProperty('confirmPassword')) {
    if (typeof data.password !== 'string' || data.password.trim().length === 0) {
      return false;
    }
  }

  // Validar `isActive` si está presente: debe ser un booleano
  if (data.hasOwnProperty('isActive')) {
    if (typeof data.isActive !== 'boolean') {
      return false;
    }
  }

  // Validar `user` si está presente: debe ser un ObjectId válido
  if (data.hasOwnProperty('user')) {
    if (!mongoose.Types.ObjectId.isValid(data.user)) {
      return false;
    }
  }

  return true;
};
