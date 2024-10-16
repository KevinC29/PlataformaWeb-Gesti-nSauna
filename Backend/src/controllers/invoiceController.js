// facturaController.js
import { generateInvoicePDF } from "../utils/invoice/pdfInvoiceService.js";
import { sendInvoiceEmail } from "../config/email.js";
import handleError from "../utils/helpers/handleError.js";
import { validateInoviceData } from '../validators/invoiceValidate.js';

export const invoiceSend = async (req, res) => {
  try {

    const validationResult = validateInoviceData(req.body);
    if (!validationResult.isValid) {
      return handleError(res, null, null, 400, validationResult.message);
    }

    const { htmlTemplate, email, subject, numberInvoice } = req.body;

    if (!htmlTemplate || !email || !subject || !numberInvoice) {
      return handleError(res, null, null, 400, "Datos insuficientes para crear y enviar la factura");
    }

    if (!email) {
      return handleError(res, null, null, 500, "No cuenta con un correo para enviar");
    }

    // Generar el PDF de la factura
    const pdfPath = await generateInvoicePDF(htmlTemplate, numberInvoice);
    console.log(pdfPath)
    // Enviar la factura por correo electrónico
    // const emailSent = await sendInvoiceEmail(email, pdfPath, subject);

    // if (!emailSent) {
    //   return handleError(res, null, null, 500, "Error al enviar el correo con la factura adjunta");
    // }

    res.status(200).json({ message: "Factura creada y enviada con éxito", pdfPath });
  } catch (error) {
    handleError(res, error, null, 500, "Error al generar o enviar la factura");
  }
};
