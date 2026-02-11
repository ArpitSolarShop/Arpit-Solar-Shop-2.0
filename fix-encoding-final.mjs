import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🔧 Starting encoding fixes...\n');

// Fix Shakti Solar
console.log('📄 Fixing Shakti Solar...');
const shaktiPath = path.join(__dirname, 'src/app/(website)/shakti-solar/page.tsx');
let shakti = fs.readFileSync(shaktiPath, 'utf8');
const shaktiOrig = shakti;
shakti = shakti.split('à¤®à¥à¤«à¥à¤¤ à¤¬à¤¿à¤œà¤²à¥€ à¤¯à¥‹à¤œà¤¨à¤¾').join('मुफ्त बिजली योजना');
if (shakti !== shaktiOrig) {
    fs.writeFileSync(shaktiPath, shakti, 'utf8');
    console.log('  ✅ Fixed Shakti Solar\n');
} else {
    console.log('  ⚠️  No matches found in Shakti Solar\n');
}

// Fix Tata Solar
console.log('📄 Fixing Tata Solar...');
const tataPath = path.join(__dirname, 'src/app/(website)/tata-solar/page.tsx');
let tata = fs.readFileSync(tataPath, 'utf8');
const tataOrig = tata;
tata = tata.split('à¤®à¥à¤«à¥à¤¤ à¤¬à¤¿à¤œà¤²à¥€ à¤¯à¥‹à¤œà¤¨à¤¾').join('मुफ्त बिजली योजना');
if (tata !== tataOrig) {
    fs.writeFileSync(tataPath, tata, 'utf8');
    console.log('  ✅ Fixed Tata Solar\n');
} else {
    console.log('  ⚠️  No matches found in Tata Solar\n');
}

// Fix Integrated
console.log('📄 Fixing Integrated...');
const integratedPath = path.join(__dirname, 'src/app/(website)/integrated/page.tsx');
let integrated = fs.readFileSync(integratedPath, 'utf8');
const integratedOrig = integrated;
integrated = integrated.split('â€"').join('—');
integrated = integrated.split('â€™').join("'");
if (integrated !== integratedOrig) {
    fs.writeFileSync(integratedPath, integrated, 'utf8');
    console.log('  ✅ Fixed Integrated\n');
} else {
    console.log('  ⚠️  No matches found in Integrated\n');
}

console.log('✨ All encoding fixes completed!');
