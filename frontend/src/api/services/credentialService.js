// api/services/credentialService.js

import http from '../http';
import { handleError } from '../../middleware/errorHandler';
import apiConfig from '../apiConfig';

const apiUrl = `${apiConfig.baseURL}/credential`;

// Actualizar la contraseña de una credencial
export const updateCredentialPassword = async (id, passwordData) => {
  try {
    const response = await http.put(`${apiUrl}/${id}`, passwordData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Actualizar el estado de una credencial
export const updateCredentialStatus = async (statusData) => {
  try {
    const response = await http.post(`${apiUrl}/isActive`, statusData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener un usuario por ID de persona autenticada
export const getUserByAuthenticatedUser = async () => {
  try {
    const response = await http.get(`${apiUrl}/user-profile`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

