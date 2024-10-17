import mongoose from 'mongoose';
import { generateInvoicePDF } from "../utils/invoice/pdfInvoiceService.js";
import { sendInvoiceEmail } from "../config/email.js";
import handleError from "../utils/helpers/handleError.js";
import { validateInvoiceData } from '../validators/invoiceValidate.js';
import Order from '../models/orderModel.js';
import fs from 'fs/promises';
export const invoiceSend = async (req, res) => {
  let session;

  try {
    session = await mongoose.startSession();
    session.startTransaction();

    const validationResult = validateInvoiceData(req.body);
    if (!validationResult.isValid) {
      return handleError(res, null, session, 400, validationResult.message);
    }

    const { htmlTemplate, email, subject, numberInvoice, orderId } = req.body;

    const order = await Order.findById(orderId).exec();
    if (!order) {
      return handleError(res, null, session, 404, "La orden no existe");
    }

    if (!email) {
      return handleError(res, null, session, 500, "No cuenta con un correo para enviar");
    }

    // Generar el PDF de la factura
    const pdfPath = await generateInvoicePDF(htmlTemplate, numberInvoice);
    
    // Enviar la factura por correo electrónico
    const emailSent = await sendInvoiceEmail(email, pdfPath, subject);
    if (!emailSent) {
      return handleError(res, null, session, 500, "Error al enviar el correo con la factura adjunta");
    }

    await fs.unlink(pdfPath);

    const updatedOrder = await Order.findByIdAndUpdate(orderId, { isActive: false }, { new: true, session }).exec();

    await session.commitTransaction();
    res.status(200).json({ data: updatedOrder, message: "Factura creada y enviada con éxito" });
  } catch (error) {
    if (session && session.inTransaction()) {
      try {
        await session.abortTransaction();
      } catch (abortError) {
        console.error('Error al abortar la transacción:', abortError);
      }
    }
    handleError(res, error, session, 500, "Error al generar o enviar la factura");
  } finally {
    if (session) {
      session.endSession();
    }
  }
};
