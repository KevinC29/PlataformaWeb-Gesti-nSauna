import mongoose from 'mongoose';

export const validateOrderData = (data) => {

    console.log(data)
    // Si `data` es null o no es un objeto, retornar false
    if (data === null || typeof data !== 'object') {
        return false;
    }

    // Validar `dateOrder` si está presente: debe ser una fecha válida y no anterior a la fecha actual
    if (data.hasOwnProperty('dateOrder')) {
        if (!(data.dateOrder instanceof Date) || isNaN(data.dateOrder.getTime()) || data.dateOrder < new Date()) {
            return false;
        }
    }


    // Validar `numberOrder` si está presente: debe ser un número y único
    if (data.hasOwnProperty('numberOrder')) {
        if (typeof data.numberOrder !== 'number' || isNaN(data.numberOrder) || data.numberOrder <= 0) {
            return false;
        }
    }

    // Validar `consumptionAccount` si está presente: debe ser un número
    if (data.hasOwnProperty('consumptionAccount')) {
        if (typeof data.consumptionAccount !== 'number' || isNaN(data.consumptionAccount) || data.consumptionAccount <= 0) {
            return false;
        }
    }

    // Validar `balance` si está presente: debe ser un número
    if (data.hasOwnProperty('balance')) {
        if (typeof data.balance !== 'number' || isNaN(data.balance) || data.balance <= 0) {
            return false;
        }
    }

    // Validar `total` si está presente: debe ser un número
    if (data.hasOwnProperty('total')) {
        if (typeof data.total !== 'number' || isNaN(data.total) || data.total <= 0) {
            return false;
        }
    }

    // Validar `paymentState` si está presente: debe ser uno de los valores permitidos
    if (data.hasOwnProperty('paymentState')) {
        const validStates = ['paid', 'pending'];
        if (typeof data.paymentState !== 'string' || !validStates.includes(data.paymentState)) {
            return false;
        }
    }

    // Validar `isActive` si está presente: debe ser un booleano
    if (data.hasOwnProperty('isActive')) {
        if (typeof data.isActive !== 'boolean') {
            return false;
        }
    }

    // Validar `client` si está presente: debe ser un ObjectId válido
    if (data.hasOwnProperty('client')) {
        if (!mongoose.Types.ObjectId.isValid(data.client)) {
            return false;
        }
    }

    return true;
};
