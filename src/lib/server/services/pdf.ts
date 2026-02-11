import puppeteerCore from 'puppeteer-core';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs-extra';
import path from 'path';

import os from 'os';

// Output directory - Use /tmp in production (Vercel) and local temp
const OUTPUT_DIR = os.tmpdir();
// fs.ensureDirSync(OUTPUT_DIR); // tmpdir always exists

interface PdfOptions {
    html: string;
    data?: any;
}

export async function generatePdfFromHtml({ html }: PdfOptions): Promise<string> {
    let browser;
    try {
        console.log('🚀 Launching Puppeteer...');

        let executablePath: string | undefined;
        let args: string[] = [];

        // Determine environment and executable
        if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
            console.log('☁️ Running in PRODUCTION (Vercel/Serverless)');
            // Use chromium-min for production to save size
            const chromium = require('@sparticuz/chromium-min');

            // Standard Vercel/AWS Lambda config
            executablePath = await chromium.executablePath('https://github.com/Sparticuz/chromium/releases/download/v131.0.1/chromium-v131.0.1-pack.tar');
            args = chromium.args;
        } else {
            console.log('💻 Running in DEVELOPMENT (Local)');

            // For Windows, always use system Chrome - it's more reliable
            if (process.platform === 'win32') {
                const possiblePaths = [
                    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
                    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
                    process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe',
                ];

                console.log('🔍 Searching for Chrome on Windows...');
                for (const chromePath of possiblePaths) {
                    if (chromePath && await fs.pathExists(chromePath)) {
                        executablePath = chromePath;
                        console.log('✅ Found Chrome at:', executablePath);
                        break;
                    }
                }
            } else if (process.platform === 'darwin') {
                executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
            } else {
                executablePath = '/usr/bin/google-chrome';
            }
        }

        console.log(`ℹ️ Final Executable Path: ${executablePath}`);

        browser = await puppeteerCore.launch({
            args: [...args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
            defaultViewport: { width: 1920, height: 1080 },
            executablePath: executablePath,
            headless: true,
            timeout: 60000,
        });

        console.log('✅ Puppeteer launched');
        const page = await browser.newPage();

        // Set content with faster loading strategy
        console.log('📄 Setting HTML content...');
        await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });
        console.log('✅ HTML content set');

        // Initial wait for fonts
        await new Promise(resolve => setTimeout(resolve, 500));

        console.log('📄 Generating PDF...');
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0px',
                bottom: '0px',
                left: '0px',
                right: '0px'
            },
            timeout: 30000,
        });

        const tempPath = path.join(OUTPUT_DIR, `temp_${Date.now()}.pdf`);
        await fs.writeFile(tempPath, pdfBuffer);
        console.log('✅ PDF saved to disk');

        return tempPath;
    } catch (error: any) {
        console.error('❌ Puppeteer error:', error);
        throw new Error(`Failed to generate PDF: ${error.message}`);
    } finally {
        if (browser) {
            try {
                await browser.close();
            } catch (e) { console.error('Error closing browser', e); }
        }
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
