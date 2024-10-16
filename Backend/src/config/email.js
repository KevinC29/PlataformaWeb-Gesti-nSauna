import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

export async function sendInvoiceEmail(email, pdfPath, subject) {
  try {
    // Configuración del transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: false, 
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Verifica si el transporte se creó correctamente
    if (!transporter) {
      throw new Error("No se pudo crear el transporte de correo");
    }

    // Leer el PDF generado
    const pdfAttachment = fs.readFileSync(pdfPath);

    // Contenido del correo
    const emailContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        Estimado cliente, adjuntamos su factura, gracias por preferirnos.
      </div>
    `;

    // Enviar el correo con el PDF adjunto
    await transporter.sendMail({
      from: `"El vapor de La Molienda" <${process.env.MAIL_USER}>`,
      to: email,
      subject: subject,
      html: emailContent,
      attachments: [
        {
          filename: 'Factura.pdf',
          content: pdfAttachment,
          contentType: 'application/pdf',
        },
      ],
    });

    return true;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return false;
  }
}
