import axios from 'axios';

const validateImageUrl = async (imageUrl) => {
    try {
        // Verifica que la URL sea una cadena de texto
        if (typeof imageUrl !== 'string') {
            return { isValid: false, message: 'URL de imagen no proporcionada o formato incorrecto' };
        }
        // Verifica que la URL apunte a una imagen
        const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const contentType = response.headers['content-type'];

        if (!contentType || !contentType.startsWith('image/')) {
            return { isValid: false, message: 'La URL no apunta a una imagen' };
        }

        return { isValid: true };
    } catch (error) {
        console.error('Error validando URL de imagen:', error);
        return { isValid: false, message: 'URL de imagen no válida o inaccesible' };
    }
};

export default validateImageUrl;
