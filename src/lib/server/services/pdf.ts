
import puppeteer from 'puppeteer';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs-extra';
import path from 'path';

// Output directory
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'output');
fs.ensureDirSync(OUTPUT_DIR);

interface PdfOptions {
    html: string;
    data?: any; // For future expansion if we pass raw data for verification
}

export async function generatePdfFromHtml({ html }: PdfOptions): Promise<string> {
    let browser;
    try {
        console.log('🚀 Launching Puppeteer...');
        browser = await puppeteer.launch({
            headless: true,
            executablePath: puppeteer.executablePath(), // Use installed Chrome
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage', // Overcome limited resource problems
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--no-zygote',
                '--disable-gpu'
            ]
        });
        console.log('✅ Puppeteer launched');
        const page = await browser.newPage();

        // Set content and wait for DOM to load (don't wait for external resources)
        console.log('📄 Setting HTML content...');
        await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });
        console.log('✅ HTML content set');

        console.log('📄 Generating PDF...');
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px'
            }
        });

        const tempPath = path.join(OUTPUT_DIR, `temp_${Date.now()}.pdf`);
        await fs.writeFile(tempPath, pdfBuffer);

        return tempPath;
    } catch (error) {
        console.error('❌ Puppeteer error:', error);
        throw new Error('Failed to generate PDF from HTML');
    } finally {
        if (browser) await browser.close();
    }
}

export async function enhancePdf(
    inputPath: string,
    qrData: string,
    signatureText: string = 'Digitally Signed by Arpit Solar Shop'
): Promise<string> {
    try {
        // 1. Load existing PDF
        const existingPdfBytes = await fs.readFile(inputPath);
        const pdfDoc = await PDFDocument.load(existingPdfBytes);

        // 2. Embed QR Code
        const qrDataUrl = await QRCode.toDataURL(qrData);
        const qrImage = await pdfDoc.embedPng(qrDataUrl);
        const qrDims = qrImage.scale(0.5); // Adjust scale as needed

        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();

        // Place QR Code (Top Right)
        firstPage.drawImage(qrImage, {
            x: width - qrDims.width - 30, // 30px padding from right
            y: height - qrDims.height - 30, // 30px padding from top
            width: qrDims.width,
            height: qrDims.height,
        });

        // 3. Add "Digital Signature" / Watermark
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        firstPage.drawText(signatureText, {
            x: 30,
            y: 30, // Bottom left
            size: 10,
            font: font,
            color: rgb(0.5, 0.5, 0.5), // Grey color
        });

        // 4. Metadata & Locking
        pdfDoc.setTitle('Solar Quotation');
        pdfDoc.setAuthor('Arpit Solar Shop');
        pdfDoc.setSubject('Official Quotation');
        pdfDoc.setProducer('Arpit Solar Shop Automation');
        pdfDoc.setCreationDate(new Date());
        pdfDoc.setModificationDate(new Date());

        // Note: True "locking" requires permissions which pdf-lib supports to some extent
        // but full read-only requiring password is user-unfriendly. 
        // We set metadata to imply immutability.

        const pdfBytes = await pdfDoc.save();

        const finalName = `quote_${Date.now()}.pdf`;
        const finalPath = path.join(OUTPUT_DIR, finalName);
        await fs.writeFile(finalPath, pdfBytes);

        // Cleanup temp file
        // await fs.remove(inputPath); 

        return finalPath;

    } catch (error) {
        console.error('❌ pdf-lib error:', error);
        throw new Error('Failed to enhance PDF');
    }
}
