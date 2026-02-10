
// const fetch = require('node-fetch'); // Using native fetch

async function testQuote() {
    try {
        const response = await fetch('http://localhost:3000/api/generate-quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_category: "Tata",
                power_demand_kw: "3",
                phone: "9999999999",
                source: "Test Script",
                phase: "Single",
                name: "Debug User",
                address: "Test Address",
                mounting_type: "Tin Shed"
            })
        });

        const data = await response.json();
        console.log('DEBUG INFO:', JSON.stringify(data.debug, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

testQuote();
