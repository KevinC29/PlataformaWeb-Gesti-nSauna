import puppeteer from 'puppeteer';
import path from 'path';

// Función para crear un PDF basado en una plantilla HTML
export const generateInvoicePDF = async (htmlTemplate, numberInvoice) => {
  try {
    const pdfPath = path.join(__dirname, `Factura${numberInvoice}.pdf`);

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(htmlTemplate);
    await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });
    await browser.close();
    return pdfPath;
  } catch (error) {
    throw new Error("Error al crear la factura en PDF: " + error.message);
  }
};
