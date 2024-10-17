import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs/promises';
import path from 'path';

dotenv.config();

export async function sendInvoiceEmail(email, pdfPath, subject) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    if (!transporter) {
      throw new Error("No se pudo crear el transporte de correo");
    }

    const pdfAttachment = await fs.readFile(pdfPath);
    const pdfFileName = path.basename(pdfPath);

    const emailContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        Estimado cliente, adjuntamos su Nota de Venta, gracias por preferirnos.
      </div>
    `;

    await transporter.sendMail({
      from: `"El vapor de La Molienda" <${process.env.MAIL_USER}>`,
      to: email,
      subject: subject,
      html: emailContent,
      attachments: [
        {
          filename: pdfFileName,
          content: pdfAttachment,
          contentType: 'application/pdf',
        },
      ],
    });

    return true;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    throw new Error("Error al enviar el correo: " + error.message);
  }
}
