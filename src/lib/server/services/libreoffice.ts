
import { exec } from 'child_process';
import path from 'path';
import fs from 'fs-extra';

// 📁 Ensure output folder exists
const OUTPUT_DIR = path.join(process.cwd(), 'public', 'output');
fs.ensureDirSync(OUTPUT_DIR);

// 👉 Set your LibreOffice binary path
// On Windows, update this to the full path if needed
const sofficeCommand = process.platform === 'win32'
    ? `"C:\\Program Files\\LibreOffice\\program\\soffice.exe"`
    : 'libreoffice';

export async function convertDocxToPdf(docxPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(docxPath)) {
            return reject(new Error(`DOCX file not found at path: ${docxPath}`));
        }

        // 🧹 Clear output folder before conversion (Optional: risky if concurrent requests)
        // For now, let's NOT empty the whole directory to avoid race conditions in a clearer assumption,
        // or we can stick to original logic if concurrency isn't high.
        // Original logic: fs.emptyDirSync(OUTPUT_DIR);
        // Let's comment it out for safety in a web server context.

        const cmd = `${sofficeCommand} --headless --convert-to pdf --outdir "${OUTPUT_DIR}" "${docxPath}"`;
        console.log('📤 Running command:', cmd);

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error('❌ LibreOffice conversion error:', stderr || error.message);
                return reject(new Error('LibreOffice failed to convert file.'));
            }

            const pdfFileName = path.basename(docxPath, '.docx') + '.pdf';
            const pdfPath = path.join(OUTPUT_DIR, pdfFileName);

            if (!fs.existsSync(pdfPath)) {
                console.error('⚠️ Conversion output:', stdout);
                console.error('⚠️ Conversion errors:', stderr);
                return reject(new Error('PDF was not created.'));
            }

            console.log('✅ PDF created at:', pdfPath);
            resolve(pdfPath);
        });
    });
}
