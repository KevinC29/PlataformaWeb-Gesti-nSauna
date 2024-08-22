import mongoose from 'mongoose';

export const validateItemData = (data) => {

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

    // Validar `price` si está presente: debe ser un número válido
    if (data.hasOwnProperty('price')) {
        if (typeof data.price !== 'number' || isNaN(data.price)) {
            return false;
        }
    }

    // Validar `imageUrl` si está presente: debe ser una cadena no vacía
    if (data.hasOwnProperty('imageUrl')) {
        if (typeof data.imageUrl !== 'string' || data.imageUrl.trim().length === 0) {
            return false;
        }
    }

    // Validar `isActive` si está presente: debe ser un booleano
    if (data.hasOwnProperty('isActive')) {
        if (typeof data.isActive !== 'boolean') {
            return false;
        }
    }

    // Validar `itemType` si está presente: debe ser un ObjectId válido
    if (data.hasOwnProperty('itemType')) {
        if (!mongoose.Types.ObjectId.isValid(data.itemType)) {
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
