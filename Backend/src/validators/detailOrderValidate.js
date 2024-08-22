import mongoose from 'mongoose';

export const validateDetailOrderData = (data) => {

    console.log(data)
    // Si `data` es null o no es un objeto, retornar false
    if (data === null || typeof data !== 'object') {
        return false;
    }

    // Validar `item` si está presente: debe ser un ObjectId válido
    if (data.hasOwnProperty('item')) {
        if (!mongoose.Types.ObjectId.isValid(data.item)) {
            return false;
        }
    }

    // Validar `cantidad` si está presente: debe ser un número válido
    if (data.hasOwnProperty('cantidad')) {
        if (typeof data.cantidad !== 'number' || isNaN(data.cantidad) || data.cantidad <= 0) {
            return false;
        }
    }

    // Validar `price` si está presente: debe ser un número válido
    if (data.hasOwnProperty('price')) {
        if (typeof data.price !== 'number' || isNaN(data.price) || data.price <= 0) {
            return false;
        }
    }

    // Validar `isActive` si está presente: debe ser un booleano
    if (data.hasOwnProperty('isActive')) {
        if (typeof data.isActive !== 'boolean') {
            return false;
        }
    }

    // Validar `order` si está presente: debe ser un ObjectId válido
    if (data.hasOwnProperty('order')) {
        if (!mongoose.Types.ObjectId.isValid(data.order)) {
            return false;
        }
    }

    return true;
};
