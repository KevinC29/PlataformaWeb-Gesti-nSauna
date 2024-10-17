// api/services/invoiceService.js
import http from '../http';
import { handleError } from '../../middleware/errorHandler';
import apiConfig from '../apiConfig';

const apiUrl = `${apiConfig.baseURL}/invoice`;

// Crear y enviar factura
export const createAndSendInvoice = async (invoiceData) => {
  try {
    const response = await http.post(`${apiUrl}/send`, invoiceData);
    return response.data;
  } catch (error) {
    handleError(error);
    throw error;
  }
};

// // Descargar factura en PDF
// export const downloadInvoicePDF = async (invoiceId) => {
//   try {
//     const response = await http.get(`${apiUrl}/${invoiceId}/download`, { responseType: 'blob' });
    
//     // Crear un enlace para descargar el PDF
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement('a');
//     link.href = url;
//     link.setAttribute('download', `Factura_${invoiceId}.pdf`);
//     document.body.appendChild(link);
//     link.click();

//     return response.data; // Retorna el blob del PDF
//   } catch (error) {
//     handleError(error);
//     throw error; // Lanza el error para que pueda ser manejado en el componente
//   }
// };
