// api/services/commentService.js

import http from '../http';
import { handleError } from '../../middleware/errorHandler';
import apiConfig from '../apiConfig';

const apiUrl = `${apiConfig.baseURL}/comment`;

// Crear un comentario
export const createComment = async (commentData) => {
  try {
    const response = await http.post(apiUrl, commentData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Obtener todos los comentarios
export const getComments = async () => {
  try {
    const response = await http.get(apiUrl);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Actualizar el estado de un comentario
export const updateCommentStatus = async (statusData) => {
  try {
    const response = await http.post(`${apiUrl}/isActive`, statusData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// Eliminar un comentario
export const deleteComment = async (id) => {
  try {
    const response = await http.delete(`${apiUrl}/${id}`);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};
