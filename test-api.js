import fs from 'fs';

async function log(message) {
    console.log(message);
    try {
        fs.appendFileSync('test-results.txt', message + '\n');
    } catch (e) {
        console.error("Error writing to log file:", e);
    }
}

async function testQuote(category, payload) {
    await log(`Testing ${category}...`);
    try {
        const response = await fetch('http://localhost:3000/api/generate-quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            await log(`✅ ${category} SUCCESS: Status ${response.status}`);
            try {
                const data = await response.json();
                await log(`   PDF URL: ${data.data?.pdfUrl || 'N/A'}`);
            } catch (jsonError) {
                await log(`   Error parsing JSON success response: ${jsonError.message}`);
            }
        } else {
            await log(`❌ ${category} FAILED: Status ${response.status}`);
            try {
                const text = await response.text();
                await log(`   Error: ${text}`);
            } catch (textError) {
                await log(`   Error reading error response: ${textError.message}`);
            }
        }
    } catch (error) {
        await log(`❌ ${category} ERROR: ${error.message}`);
    }
    await log('-----------------------------------');
}

async function runTests() {
    // 1. Tata
    await testQuote('Tata', {
        name: "API Test Tata",
        phone: "9876543210",
        project_location: "Delhi",
        product_category: "Tata",
        power_demand_kw: "5",
        phase: "Three",
        source: "Tata Quote Form"
    });

    // 2. Shakti
    await testQuote('Shakti', {
        name: "API Test Shakti",
        phone: "9876543211",
        project_location: "Mumbai",
        product_category: "Shakti",
        power_demand_kw: "4",
        phase: "Single",
        source: "Shakti Quote Form"
    });

    // 3. Reliance (Calculator Flow)
    await testQuote('Reliance', {
        name: "API Test Reliance",
        phone: "9876543212",
        project_location: "Bangalore",
        product_category: "Calculator",
        power_demand_kw: "12",
        phase: "Three",
        source: "Calculator Quote Form",
        customer_type: "commercial",
        mounting_type: "RCC Elevated",
        metadata: {
            panel_config: "20 x 550W",
            inverter_size_kw: 12,
            price_per_watt: 35,
            estimated_price: 450000,
            base_price: 400000,
            gst_amount: 50000
        }
    });

    // 4. Integrated
    await testQuote('Integrated', {
        name: "API Test Integrated",
        phone: "9876543213",
        project_location: "Chennai",
        product_category: "Integrated",
        power_demand_kw: "5",
        phase: "Three",
        source: "Integrated Quote Form",
        brand: "Waaree"
    });
}

runTests();
