// api/services/orderService.js

import http from '../http';
import { handleError } from '../../middleware/errorHandler';
import apiConfig from '../apiConfig';

const apiUrl = `${apiConfig.baseURL}/order`;

// Crear una orden
export const createOrder = async (orderData) => {
  try {
    const response = await http.post(apiUrl, orderData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener todas las órdenes
export const getOrders = async () => {
  try {
    const response = await http.get(apiUrl);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener órdenes por fecha
export const getOrdersByDate = async ({ startDate, endDate }) => {
  try {
    const response = await http.get(`${apiUrl}/by-date`, {
      params: { startDate, endDate },
    });
    return response.data;
  } catch (error) {
    handleError(error);
    throw error; 
  }
};

// Obtener una orden por ID
export const getOrder = async (id) => {
  try {
    const response = await http.get(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Actualizar una orden
export const updateOrder = async (id, orderData) => {
  try {
    const response = await http.put(`${apiUrl}/${id}`, orderData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Eliminar una orden
export const deleteOrder = async (id) => {
  try {
    const response = await http.delete(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
