import puppeteerCore from 'puppeteer-core';
import chromium from '@sparticuz/chromium';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import QRCode from 'qrcode';
import fs from 'fs-extra';
import path from 'path';

// Output directory
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'output');
fs.ensureDirSync(OUTPUT_DIR);

interface PdfOptions {
    html: string;
    data?: any;
}

export async function generatePdfFromHtml({ html }: PdfOptions): Promise<string> {
    let browser;
    try {
        console.log('🚀 Launching Puppeteer...');

        // Determine environment and executable
        let executablePath: string | undefined;
        let args: string[] = chromium.args;

        if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
            console.log('☁️ Running in PRODUCTION (Vercel/Serverless)');
            executablePath = await chromium.executablePath();
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

                if (!executablePath) {
                    throw new Error('Chrome not found. Please install Google Chrome from https://www.google.com/chrome/');
                }
            } else if (process.platform === 'darwin') {
                executablePath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
                console.log('🍎 Using macOS Chrome path:', executablePath);
            } else {
                // Linux - try bundled Chromium from sparticuz, then fallback
                try {
                    executablePath = await chromium.executablePath();
                    console.log('🐧 Using Chromium from sparticuz:', executablePath);
                } catch (e) {
                    console.log('⚠️ Chromium not available, trying system Chrome...');
                    executablePath = '/usr/bin/google-chrome';
                }
            }
        }

        console.log(`ℹ️ Final Executable Path: ${executablePath}`);
        console.log(`ℹ️ Platform: ${process.platform}`);
        console.log(`ℹ️ Node Environment: ${process.env.NODE_ENV || 'development'}`);

        console.log('🚀 Attempting to launch browser with config:', {
            args: [...args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
            executablePath,
            headless: true,
        });

        browser = await puppeteerCore.launch({
            args: [...args, '--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--disable-gpu'],
            defaultViewport: { width: 1920, height: 1080 },
            executablePath: executablePath,
            headless: true,
            timeout: 120000, // Increased to 2 minutes
            protocolTimeout: 120000, // Add protocol timeout
        });

        console.log('✅ Puppeteer launched');
        const page = await browser.newPage();

        // Set content with faster loading strategy
        console.log('📄 Setting HTML content...');
        await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 60000 }); // Changed from networkidle0 to domcontentloaded for faster loading
        console.log('✅ HTML content set');

        // Reduced wait time - only 500ms is needed for CSS/fonts to apply
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log('✅ Rendering wait complete');

        console.log('📄 Generating PDF...');
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                bottom: '20px',
                left: '20px',
                right: '20px'
            },
            timeout: 60000, // Reduced to 60s - should be more than enough
        });

        const tempPath = path.join(OUTPUT_DIR, `temp_${Date.now()}.pdf`);
        await fs.writeFile(tempPath, pdfBuffer);
        console.log('✅ PDF saved to disk');

        return tempPath;
    } catch (error: any) {
        console.error('❌ Puppeteer error:', error);
        console.error('Error stack:', error.stack);

        // Provide more specific error messages for common issues
        if (error.message?.includes('Target closed') || error.message?.includes('Session closed')) {
            throw new Error('PDF generation failed: Browser connection lost. This may be due to system resources. Please try again or contact support if the issue persists.');
        } else if (error.message?.includes('timeout') || error.message?.includes('Timeout')) {
            throw new Error('PDF generation timed out (>90s). The quote data may be too complex or the server is busy. Please try again.');
        } else if (error.message?.includes('Protocol error')) {
            throw new Error('Browser protocol error. Try again or use a simpler quote configuration.');
        } else {
            throw new Error(`Failed to generate PDF: ${error.message || error}`);
        }
    } finally {
        // Proper cleanup: close browser in try-catch to prevent cleanup errors from masking real issues
        if (browser) {
            try {
                console.log('🧹 Closing browser...');
                await browser.close();
                console.log('✅ Browser closed successfully');
            } catch (closeError) {
                console.error('⚠️ Error closing browser (non-fatal):', closeError);
                // Don't throw here - we want to preserve the original error if any
            }
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
