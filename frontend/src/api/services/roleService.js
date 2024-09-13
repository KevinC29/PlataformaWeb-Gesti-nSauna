// api/services/roleService.js

import http from '../http';
import { handleError } from '../../middleware/errorHandler';
import apiConfig from '../apiConfig';

const apiUrl = `${apiConfig.baseURL}/role`;

// Crear un rol
export const createRole = async (roleData) => {
  try {
    const response = await http.post(apiUrl, roleData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener todos los roles
export const getRoles = async () => {
  try {
    const response = await http.get(apiUrl);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener un rol por ID
export const getRole = async (id) => {
  try {
    const response = await http.get(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Actualizar un rol
export const updateRole = async (id, roleData) => {
  try {
    const response = await http.put(`${apiUrl}/${id}`, roleData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Eliminar un rol
export const deleteRole = async (id) => {
  try {
    const response = await http.delete(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
