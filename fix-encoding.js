const fs = require('fs');
const path = require('path');

console.log('Starting encoding fixes...');

// Fix Shakti Solar
const shaktiPath = path.join(__dirname, 'src/app/(website)/shakti-solar/page.tsx');
let shaktiContent = fs.readFileSync(shaktiPath, 'utf8');
shaktiContent = shaktiContent.replace(/à¤®à¥à¤«à¥à¤¤ à¤¬à¤¿à¤œà¤²à¥€ à¤¯à¥‹à¤œà¤¨à¤¾/g, 'मुफ्त बिजली योजना');
fs.writeFileSync(shaktiPath, shaktiContent, 'utf8');
console.log('✓ Fixed Shakti Solar');

// Fix Tata Solar
const tataPath = path.join(__dirname, 'src/app/(website)/tata-solar/page.tsx');
let tataContent = fs.readFileSync(tataPath, 'utf8');
tataContent = tataContent.replace(/à¤®à¥à¤«à¥à¤¤ à¤¬à¤¿à¤œà¤²à¥€ à¤¯à¥‹à¤œà¤¨à¤¾/g, 'मुफ्त बिजली योजना');
fs.writeFileSync(tataPath, tataContent, 'utf8');
console.log('✓ Fixed Tata Solar');

// Fix Integrated
const integratedPath = path.join(__dirname, 'src/app/(website)/integrated/page.tsx');
let integratedContent = fs.readFileSync(integratedPath, 'utf8');
integratedContent = integratedContent.replace(/â€"/g, '—');
integratedContent = integratedContent.replace(/â€™/g, "'");
fs.writeFileSync(integratedPath, integratedContent, 'utf8');
console.log('✓ Fixed Integrated');

console.log('\n✅ All encoding fixes completed!');
