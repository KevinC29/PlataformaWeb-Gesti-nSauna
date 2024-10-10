import mongoose from 'mongoose';

export const validateOrderData = (data) => {
  // Si `data` es null o no es un objeto, retornar el error correspondiente
  if (data === null || typeof data !== 'object') {
    return { isValid: false, message: "Datos inválidos: no es un objeto válido." };
  }

  // Validar `dateOrder` si está presente: debe ser una fecha válida y no anterior a la fecha actual
  if (data.hasOwnProperty('dateOrder')) {
    const currentDate = new Date();
    if (!(data.dateOrder instanceof Date) || isNaN(data.dateOrder.getTime()) || data.dateOrder < currentDate) {
      return { isValid: false, message: "El campo 'Fecha del pedido' debe ser una fecha válida y no anterior a la fecha actual." };
    }
  }

  // Validar `numberOrder` si está presente: debe ser un número válido y mayor a cero
  if (data.hasOwnProperty('numberOrder')) {
    if (typeof data.numberOrder !== 'number' || isNaN(data.numberOrder) || data.numberOrder <= 0) {
      return { isValid: false, message: "El campo 'Número de pedido' debe ser un número válido y mayor a cero." };
    }
  }

  // Validar `consumptionAccount` si está presente: debe ser un número válido y mayor a cero
  if (data.hasOwnProperty('consumptionAccount')) {
    if (typeof data.consumptionAccount !== 'number' || isNaN(data.consumptionAccount) || data.consumptionAccount < 0) {
      return { isValid: false, message: "El campo 'Cuenta de consumo' debe ser un número válido y mayor a cero." };
    }
  }

  // Validar `balance` si está presente: debe ser un número válido y mayor a cero
  if (data.hasOwnProperty('balance')) {
    if (typeof data.balance !== 'number' || isNaN(data.balance) || data.balance < 0) {
      return { isValid: false, message: "El campo 'Saldo' debe ser un número válido." };
    }
  }

  // Validar `total` si está presente: debe ser un número válido y mayor a cero
  if (data.hasOwnProperty('total')) {
    if (typeof data.total !== 'number' || isNaN(data.total) || data.total < 0) {
      return { isValid: false, message: "El campo 'Total' debe ser un número válido." };
    }
  }

  // Validar `paymentState` si está presente: debe ser uno de los valores permitidos
  if (data.hasOwnProperty('paymentState')) {
    const validStates = ['paid', 'pending'];
    if (typeof data.paymentState !== 'string' || !validStates.includes(data.paymentState)) {
      return { isValid: false, message: "El campo 'Estado de pago' debe ser uno de los valores permitidos 'Pagado' o 'Pendiente'." };
    }
  }

  // Validar `paymentMethod` si está presente: debe ser uno de los valores permitidos
  if (data.hasOwnProperty('paymentMethod')) {
    const validMethods = ['cash', 'credit/debit card', 'electronic money', 'other'];
    if (typeof data.paymentMethod !== 'string' || !validMethods.includes(data.paymentMethod)) {
      return { isValid: false, message: "El campo 'Método de pago' debe ser uno de los valores permitidos 'Efectivo', 'Tarjeta de Crédito/Débito', 'Dinero Electrónico' u 'Otros'." };
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

  return { isValid: true };
};
