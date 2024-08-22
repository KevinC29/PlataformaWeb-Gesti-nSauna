import mongoose from 'mongoose';

export const validateUserData = (data) => {

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

    // Validar `lastName` si está presente: debe ser una cadena no vacía
    if (data.hasOwnProperty('lastName')) {
        if (typeof data.lastName !== 'string' || data.lastName.trim().length === 0) {
            return false;
        }
    }

    // Validar `dni` si está presente: debe ser una cadena con al menos 10 dígitos
    if (data.hasOwnProperty('dni')) {
        const dni = data.dni.trim();
        if (typeof dni !== 'string' || dni.length < 10 || !/^\d+$/.test(dni)) {
            return false;
        }
    }

    // Validar `email` si está presente: debe ser una cadena de texto no vacía y tener formato de email
    if (data.hasOwnProperty('email')) {
        if (typeof data.email !== 'string' || data.email.trim().length === 0 || !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(data.email)) {
            return false;
        }
    }

    // Validar `isActive` si está presente: debe ser un booleano
    if (data.hasOwnProperty('isActive')) {
        if (typeof data.isActive !== 'boolean') {
            return false;
        }
    }

    // Validar `role` si está presente: debe ser un ObjectId válido
    if (data.hasOwnProperty('role')) {
        if (!mongoose.Types.ObjectId.isValid(data.role)) {
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
