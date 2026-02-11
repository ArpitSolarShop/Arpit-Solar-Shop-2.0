import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Starting encoding fixes...');

// Fix Shakti Solar
const shaktiPath = path.join(__dirname, 'src/app/(website)/shakti-solar/page.tsx');
let shaktiContent = fs.readFileSync(shaktiPath, 'utf8');
const shaktiOriginal = shaktiContent;
shaktiContent = shaktiContent.replace(/à¤®à¥à¤«à¥à¤¤ à¤¬à¤¿à¤œà¤²à¥€ à¤¯à¥‹à¤œà¤¨à¤¾/g, 'मुफ्त बिजली योजना');
if (shaktiContent !== shaktiOriginal) {
    fs.writeFileSync(shaktiPath, shaktiContent, 'utf8');
    console.log('✓ Fixed Shakti Solar');
} else {
    console.log('⚠ No changes needed in Shakti Solar');
}

// Fix Tata Solar  
const tataPath = path.join(__dirname, 'src/app/(website)/tata-solar/page.tsx');
let tataContent = fs.readFileSync(tataPath, 'utf8');
const tataOriginal = tataContent;
tataContent = tataContent.replace(/à¤®à¥à¤«à¥à¤¤ à¤¬à¤¿à¤œà¤²à¥€ à¤¯à¥‹à¤œà¤¨à¤¾/g, 'मुफ्त बिजली योजना');
if (tataContent !== tataOriginal) {
    fs.writeFileSync(tataPath, tataContent, 'utf8');
    console.log('✓ Fixed Tata Solar');
} else {
    console.log('⚠ No changes needed in Tata Solar');
}

// Fix Integrated
const integratedPath = path.join(__dirname, 'src/app/(website)/integrated/page.tsx');
let integratedContent = fs.readFileSync(integratedPath, 'utf8');
const integratedOriginal = integratedContent;
integratedContent = integratedContent.replace(/â€"/g, '—');
integratedContent = integratedContent.replace(/â€™/g, "'");
if (integratedContent !== integratedOriginal) {
    fs.writeFileSync(integratedPath, integratedContent, 'utf8');
    console.log('✓ Fixed Integrated');
} else {
    console.log('⚠ No changes needed in Integrated');
}

console.log('\n✅ All encoding fixes completed!');
