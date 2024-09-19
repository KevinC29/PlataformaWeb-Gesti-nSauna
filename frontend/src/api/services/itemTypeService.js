// api/services/itemTypeService.js

import http from '../http';
import { handleError } from '../../middleware/errorHandler';
import apiConfig from '../apiConfig';

const apiUrl = `${apiConfig.baseURL}/itemType`;

// Crear un tipo de ítem
export const createItemType = async (itemTypeData) => {
  try {
    const response = await http.post(apiUrl, itemTypeData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener todos los tipos de ítems
export const getItemTypes = async () => {
  try {
    const response = await http.get(apiUrl);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener un tipo de ítem por ID
export const getItemType = async (id) => {
  try {
    const response = await http.get(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Actualizar un tipo de ítem
export const updateItemType = async (id, itemTypeData) => {
  try {
    const response = await http.put(`${apiUrl}/${id}`, itemTypeData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Eliminar un tipo de ítem
export const deleteItemType = async (id) => {
  try {
    const response = await http.delete(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
