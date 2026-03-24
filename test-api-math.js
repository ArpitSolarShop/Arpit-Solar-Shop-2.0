const http = require('http');

const testPayloads = [
    {
        name: "1kW Test",
        payload: {
            customerInfo: { name: "Test 1kW", phone: "9999999999" },
            selectedProduct: { systemType: "On-grid", capacity: 1, systemSizeKw: 1 },
            skipWhatsApp: true
        }
    },
    {
        name: "2kW Test",
        payload: {
            customerInfo: { name: "Test 2kW", phone: "9999999999" },
            selectedProduct: { systemType: "On-grid", capacity: 2, systemSizeKw: 2 },
            skipWhatsApp: true
        }
    },
    {
        name: "3kW Test",
        payload: {
            customerInfo: { name: "Test 3kW", phone: "9999999999" },
            selectedProduct: { systemType: "On-grid", capacity: 3, systemSizeKw: 3 },
            skipWhatsApp: true
        }
    },
    {
        name: "4kW Test",
        payload: {
            customerInfo: { name: "Test 4kW", phone: "9999999999" },
            selectedProduct: { systemType: "On-grid", capacity: 4, systemSizeKw: 4 },
            skipWhatsApp: true
        }
    }
];

async function runTests() {
    console.log("Starting API Math Verification...");
    for (const test of testPayloads) {
        console.log(`\n--- Running ${test.name} ---`);
        try {
            const data = JSON.stringify(test.payload);
            const options = {
                hostname: 'localhost',
                port: 3000,
                path: '/api/generate-quote',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': data.length
                }
            };

            const req = http.request(options, (res) => {
                let responseBody = '';
                res.on('data', (chunk) => { responseBody += chunk; });
                res.on('end', () => {
                    try {
                        const parsed = JSON.parse(responseBody);
                        if (parsed.message && !parsed.totals) {
                             console.log(`Status: ${res.statusCode}, Message: ${parsed.message}`);
                        } else {
                            console.log(`Success! Total: ₹${parsed.totals?.grandTotal || 'N/A'}`);
                            // We mainly want to ensure no 500 error and the math doesn't crash
                        }
                    } catch (e) {
                        console.log(`Status: ${res.statusCode}, Response: ${responseBody.substring(0, 100)}...`);
                    }
                });
            });

            req.on('error', (error) => {
                console.error(`Error: ${error.message}`);
            });

            req.write(data);
            req.end();

            await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (e) {
            console.error(e);
        }
    }
}

runTests();
