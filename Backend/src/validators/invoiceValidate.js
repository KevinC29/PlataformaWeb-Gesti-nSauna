import mongoose from 'mongoose';

export const validateInvoiceData = (data) => {

  // Si `data` es null o no es un objeto, retornar el error correspondiente
  if (data === null || typeof data !== 'object') {
    return { isValid: false, message: "Datos inválidos: no es un objeto válido." };
  }
  
  // Validar `email` si está presente y no está vacío
  if (!data.email || typeof data.email === 'string' && data.email.trim().length > 0) {
    if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(data.email)) {
      return { isValid: false, message: "El usuario no cuenta con un email válido." };
    }
  }

  // Validar `htmlTemplate`
  if (!data.htmlTemplate || typeof data.htmlTemplate !== 'string' || data.htmlTemplate.trim().length === 0) {
    return { isValid: false, message: "No existe un formato de factura válido." };
  }

  // Validar `subject`
  if (!data.subject || typeof data.subject !== 'string' || data.subject.trim().length === 0) {
    return { isValid: false, message: "El Asunto es requerido." };
  }

  // Validar `numberInvoice`
  if (!data.numberInvoice || typeof data.numberInvoice !== 'string' || data.numberInvoice.trim().length === 0) {
    return { isValid: false, message: "El numero de Nota de venta es requerido." };
  }

  // Validar `orderId` como un ID válido de Mongoose
  if (!data.orderId || typeof data.orderId !== 'string' || !mongoose.Types.ObjectId.isValid(data.orderId)) {
    return { isValid: false, message: "El numero de Orden es inválido" };
  }

  return { isValid: true };
};
