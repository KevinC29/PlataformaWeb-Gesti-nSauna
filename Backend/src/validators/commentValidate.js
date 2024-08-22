import mongoose from 'mongoose';

export const validateCommentData = (data) => {

    console.log(data)
    // Si `data` es null o no es un objeto, retornar false
    if (data === null || typeof data !== 'object') {
        return false;
    }

    // Validar `date` si está presente: debe ser una fecha válida
    if (data.hasOwnProperty('date')) {
        if (!(data.date instanceof Date) || isNaN(data.date.getTime())) {
            return false;
        }
    }

    // Validar `message` si está presente: debe ser una cadena no vacía
    if (data.hasOwnProperty('message')) {
        if (typeof data.message !== 'string' || data.message.trim().length === 0) {
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

    // Validar `_id` si está presente: debe ser un ID de MongoDB válido
    if (data.hasOwnProperty('_id')) {
        if (!mongoose.Types.ObjectId.isValid(data._id)) {
            return false;
        }
    }

    return true;
};
