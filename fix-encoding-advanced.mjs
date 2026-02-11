import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('Analyzing and fixing encoding...\n');

// Read Shakti file and show what we find
const shaktiPath = path.join(__dirname, 'src/app/(website)/shakti-solar/page.tsx');
let shaktiContent = fs.readFileSync(shaktiPath, 'utf8');

// Find the problematic line
const idx = shaktiContent.indexOf('PM Surya Ghar');
if (idx !== -1) {
    const snippet = shaktiContent.substring(idx, idx + 150);
    console.log('Shakti found text:', snippet);
    console.log('\nSearching for Hindi text patterns...');

    // Try multiple possible encodings of the corrupted text
    const patterns = [
        /à¤®à¥\u008dà¤«à¥\u008dà¤¤ à¤¬à¤¿à¤\u009cà¤²à¥\u0080 à¤¯à¥\u008bà¤\u009cà¤¨à¤¾/g,
        /\u00e0\u00a4\u00ae\u00e0\u00a5\u008d\u00e0\u00a4\u00ab\u00e0\u00a5\u008d\u00e0\u00a4\u00a4 \u00e0\u00a4\u00ac\u00e0\u00a4\u00bf\u00e0\u00a4\u009c\u00e0\u00a4\u00b2\u00e0\u00a5\u0080 \u00e0\u00a4\u00af\u00e0\u00a5\u008b\u00e0\u00a4\u009c\u00e0\u00a4\u00a8\u00e0\u00a4\u00be/g
    ];

    let replaced = false;
    for (let i = 0; i < patterns.length; i++) {
        if (patterns[i].test(shaktiContent)) {
            console.log(`Found pattern ${i}!`);
            shaktiContent = shaktiContent.replace(patterns[i], 'मुफ्त बिजली योजना');
            replaced = true;
            break;
        }
    }

    if (replaced) {
        fs.writeFileSync(shaktiPath, shaktiContent, 'utf8');
        console.log('✓ Shakti fixed');
    } else {
        // Last resort: replace by buffer manipulation
        const buffer = fs.readFileSync(shaktiPath);
        const hexSearch = Buffer.from('à¤®à¥à¤«à¥à¤¤ à¤¬à¤¿à¤œà¤²à¥€ à¤¯à¥‹à¤œà¤¨à¤¾', 'utf8');
        const hexReplace = Buffer.from('मुफ्त बिजली योजना', 'utf8');

        let bufferStr = buffer.toString('binary');
        const searchStr = hexSearch.toString('binary');
        const replaceStr = hexReplace.toString('binary');

        if (bufferStr.includes(searchStr)) {
            bufferStr = bufferStr.replace(new RegExp(searchStr.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replaceStr);
            fs.writeFileSync(shaktiPath, Buffer.from(bufferStr, 'binary'));
            console.log('✓ Shakti fixed via binary mode');
        } else {
            console.log('⚠ Could not find corrupted text in Shakti');
        }
    }
}

console.log('\n✅ Script complete');
