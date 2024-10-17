import puppeteer from 'puppeteer';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const generateInvoicePDF = async (htmlTemplate, numberInvoice) => {
  try {
    const browser = await puppeteer.launch({
      headless: 'shell'
    });
    const page = await browser.newPage();
    await page.setContent(htmlTemplate, {
      waitUntil: 'networkidle0',
    });
    const pdfPath = path.join(__dirname, `NotaVenta${numberInvoice}.pdf`);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '10mm',
        right: '10mm',
        bottom: '10mm',
        left: '10mm',
      },
    });
    await browser.close();
    return pdfPath;
  } catch (error) {
    throw new Error(`Error al crear la factura en PDF: ${error.message}`);
  }
};
