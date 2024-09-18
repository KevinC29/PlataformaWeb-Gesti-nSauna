// api/services/authService.js

import http from '../http';
import { handleError } from '../../middleware/errorHandler';
import apiConfig from '../apiConfig';

const apiUrl = `${apiConfig.baseURL}/auth`;

// Iniciar sesión
export const login = async (credentials) => {
  try {
    
    const response = await http.post(`${apiUrl}/login`, credentials);

    if (response.data && response.data.token) {
      localStorage.setItem(process.env.VUE_APP_TOKEN_NAME, response.data.token);
    }

    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Restablecer contraseña
export const resetPassword = async (data) => {
  try {
    const response = await http.post(`${apiUrl}/reset`, data);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Cerrar sesión
export const logout = () => {
  localStorage.removeItem(process.env.VUE_APP_TOKEN_NAME);
};

// Obtener el token del almacenamiento local
export const getToken = () => {
  return localStorage.getItem(process.env.VUE_APP_TOKEN_NAME);
};

// Configurar el token en los headers de las solicitudes
export const setAuthHeader = (config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};
