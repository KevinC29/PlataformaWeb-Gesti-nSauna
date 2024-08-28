// api/services/sectionService.js

import http from '../http';
import { handleError } from '../../middleware/errorHandler';
import apiConfig from '../apiConfig';

const apiUrl = `${apiConfig.baseURL}/section`;

// Crear una sección
export const createSection = async (sectionData) => {
  try {
    const response = await http.post(apiUrl, sectionData);
    console.log(response.data)
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener todas las secciones
export const getSections = async () => {
  try {
    const response = await http.get(apiUrl);
    console.log(response)

    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener una sección por ID
export const getSection = async (id) => {
  try {
    const response = await http.get(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Actualizar una sección
export const updateSection = async (id, sectionData) => {
  try {
    const response = await http.put(`${apiUrl}/${id}`, sectionData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Actualizar el estado de una sección
export const updateSectionStatus = async (statusData) => {
  try {
    const response = await http.post(`${apiUrl}/isActive`, statusData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Eliminar una sección
export const deleteSection = async (id) => {
  try {
    const response = await http.delete(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
