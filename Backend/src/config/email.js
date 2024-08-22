import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export async function sendRecoveryCodeEmail(email, data, subject) {
  try {
    // Configuración del transporter
    const transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      secure: 'false', 
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Verifica si el transporte se creó correctamente
    if (!transporter) {
      return false;
    }

    // Contenido del correo
    const emailContent = `
      <div style="font-family: Arial, sans-serif; background-color: #f5f5f5; padding: 20px;">
        este es un ejemplo
      </div>
    `;

    // Enviar el correo
    await transporter.sendMail({
      from: `"El vapor La Molienda" <${process.env.MAIL_USER}>`,
      to: email,
      subject: subject,
      html: emailContent,
    });

    return true;
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return false;
  }
}
