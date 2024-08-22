import mongoose from 'mongoose';

export const validateItemTypeData = (data) => {

    console.log(data)
    // Si `data` es null o no es un objeto, retornar false
    if (data === null || typeof data !== 'object') {
        return false;
    }

    // Validar `name` si está presente: debe ser una cadena no vacía
    if (data.hasOwnProperty('name')) {
        if (typeof data.name !== 'string' || data.name.trim().length === 0) {
            return false;
        }
    }

    // Validar `description` si está presente: debe ser una cadena no vacía
    if (data.hasOwnProperty('description')) {
        if (typeof data.description !== 'string' || data.description.trim().length === 0) {
            return false;
        }
    }

    // Validar `isActive` si está presente: debe ser un booleano
    if (data.hasOwnProperty('isActive')) {
        if (typeof data.isActive !== 'boolean') {
            return false;
        }
    }

    // Validar `section` si está presente: debe ser un ObjectId válido
    if (data.hasOwnProperty('section')) {
        if (!mongoose.Types.ObjectId.isValid(data.section)) {
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
