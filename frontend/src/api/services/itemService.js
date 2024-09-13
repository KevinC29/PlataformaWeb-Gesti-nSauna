// api/services/itemService.js

import http from '../http';
import { handleError } from '../../middleware/errorHandler';
import apiConfig from '../apiConfig';

const apiUrl = `${apiConfig.baseURL}/item`;

// Crear un ítem
export const createItem = async (itemData) => {
  try {
    const response = await http.post(apiUrl, itemData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener todos los ítems
export const getItems = async () => {
  try {
    const response = await http.get(apiUrl);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener un ítem por ID
export const getItem = async (id) => {
  try {
    const response = await http.get(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Actualizar un ítem
export const updateItem = async (id, itemData) => {
  try {
    const response = await http.put(`${apiUrl}/${id}`, itemData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Eliminar un ítem
export const deleteItem = async (id) => {
  try {
    const response = await http.delete(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
