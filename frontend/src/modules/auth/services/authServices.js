import axios from 'axios';

// Configura la base URL de tu API si es necesario
const api = axios.create({
  baseURL: 'http://localhost:5000/api/1.0', // Cambia esto según la URL de tu API
});

// Función para iniciar sesión
export const login = async (email, password) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al iniciar sesión');
  }
};

// Función para restablecer la contraseña
export const resetPassword = async (email) => {
  try {
    const response = await api.post('/auth/reset', { email });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Error al restablecer la contraseña');
  }
};