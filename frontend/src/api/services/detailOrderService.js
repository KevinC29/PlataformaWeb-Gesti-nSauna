// api/services/detailOrderService.js

import http from '../http';
import { handleError } from '../../middleware/errorHandler';
import apiConfig from '../apiConfig';

const apiUrl = `${apiConfig.baseURL}/detailOrder`;

// Crear un detalle de orden
export const createDetailOrder = async (detailOrderData) => {
  try {
    const response = await http.post(apiUrl, detailOrderData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener todos los detalles de orden
export const getDetailsOrder = async () => {
  try {
    const response = await http.get(apiUrl);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener un detalle de orden por ID
export const getDetailOrder = async (id) => {
  try {
    const response = await http.get(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener detalles de orden por ID de Orden
export const getDetailsOrderByOrder = async (id) => {
  try {
    const response = await http.get(`${apiUrl}/by-order/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Actualizar un detalle de orden
export const updateDetailOrder = async (id, detailOrderData) => {
  try {
    const response = await http.put(`${apiUrl}/${id}`, detailOrderData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Eliminar un detalle de orden
export const deleteDetailOrder = async (id) => {
  try {
    const response = await http.delete(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
