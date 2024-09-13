// api/services/userService.js

import http from '../http';
import { handleError } from '../../middleware/errorHandler';
import apiConfig from '../apiConfig';

const apiUrl = `${apiConfig.baseURL}/user`;

// Crear un usuario
export const createUser = async (userData) => {
  try {
    const response = await http.post(apiUrl, userData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener todos los usuarios
export const getUsers = async () => {
  try {
    const response = await http.get(apiUrl);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener un usuario por ID
export const getUser = async (id) => {
  try {
    const response = await http.get(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Actualizar un usuario
export const updateUser = async (id, userData) => {
  try {
    const response = await http.put(`${apiUrl}/${id}`, userData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Eliminar un usuario
export const deleteUser = async (id) => {
  try {
    const response = await http.delete(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
