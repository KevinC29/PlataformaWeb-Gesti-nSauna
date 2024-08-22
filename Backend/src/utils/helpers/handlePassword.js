import crypto from 'crypto';
import bcrypt from 'bcrypt';

export const generateStrongPassword = () => {
    return crypto.randomBytes(32).toString('hex'); // Genera una contraseña hexadecimal de 32 caracteres
};

export const encryptPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10); // Genera un salt con un factor de costo de 10
        const hash = await bcrypt.hash(password, salt); // Encripta la contraseña con el salt generado
        return hash;
    } catch (error) {
        console.error('Error al encriptar la contraseña:', error);
        throw new Error('Error al encriptar la contraseña');
    }
};

export const verifyPassword = async (password, hash) => {
    try {
        const match = await bcrypt.compare(password, hash); // Compara la contraseña ingresada con el hash almacenado
        return match;
    } catch (error) {
        console.error('Error al verificar la contraseña:', error);
        throw new Error('Error al verificar la contraseña');
    }
};
