// Obtener variables de entorno
const API_BASE_URL = process.env.VUE_APP_API_BASE_URL;
const APP_TOKEN_NAME = process.env.VUE_APP_TOKEN_NAME;

// Exportar configuración
export default {
  baseURL: API_BASE_URL,
  tokenName: APP_TOKEN_NAME
};