// api/http.js
import axios from 'axios';
import apiConfig from './apiConfig';
import { handleError } from '../middleware/errorHandler';

// Crear instancia de Axios
const http = axios.create({
  baseURL: apiConfig.baseURL,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Añadir interceptor para incluir el token en cada solicitud
http.interceptors.request.use(config => {
  const token = localStorage.getItem(process.env.VUE_APP_TOKEN_NAME);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Manejo global de errores
http.interceptors.response.use(
  response => response,
  error => {
    handleError(error);
    return Promise.reject(error);
  }
);

export default http;
