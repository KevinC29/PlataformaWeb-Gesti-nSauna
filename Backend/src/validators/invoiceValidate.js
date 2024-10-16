export const validateInoviceData = (data) => {

  // Validar `email` si está presente y no está vacío
  if (data.hasOwnProperty('email') && typeof data.email === 'string' && data.email.trim().length > 0) {
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(data.email)) {
      return { isValid: false, message: "El usuario no cuenta con un email válido." };
    }
  }

  return { isValid: true };
};
