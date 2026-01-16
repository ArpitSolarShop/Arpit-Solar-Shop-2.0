
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs-extra';
import path from 'path';

export async function fillDocTemplate(templatePath: string, variables: any) {
    try {
        // Read the DOCX template
        const content = fs.readFileSync(templatePath, 'binary');
        const zip = new PizZip(content);

        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true
        });

        // Pass variables directly into the template
        doc.render(variables);

        const buf = doc.getZip().generate({ type: 'nodebuffer' });

        // 📁 Path to generated-docx folder
        const generatedDir = path.join(process.cwd(), 'src', 'lib', 'server', 'generated-docx');

        // 🧹 Ensure folder exists, then empty it (optional clearing)
        fs.ensureDirSync(generatedDir);
        // fs.emptyDirSync(generatedDir); // Optional

        // Save the new DOCX file
        const baseName = path.basename(templatePath, '.docx');
        const outputPath = path.join(generatedDir, `${baseName}_filled_${Date.now()}.docx`);
        fs.writeFileSync(outputPath, buf);

        console.log(`✅ DOCX created at: ${outputPath}`);
        return outputPath;

    } catch (error) {
        console.error("❌ Error filling DOCX template:", error);
        throw error;
    }
}
