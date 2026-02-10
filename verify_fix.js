
// const fetch = require('node-fetch');

// Polyfill for Node versions < 18 if needed, though mostly standard now
// const fetch = global.fetch; 

async function triggerQuote() {
    try {
        console.log("Triggering quote generation...");
        // Using native fetch if available, otherwise might fail if node-fetch not installed. 
        // But we are in the same environment as before where we used native fetch successfully (?) 
        // Wait, previously I commented out `require('node-fetch')` and it worked.

        const response = await fetch('http://localhost:3000/api/generate-quote', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product_category: "Tata",
                power_demand_kw: "3",
                phone: "9876543210",
                source: "Verification Script",
                phase: "Single",
                name: "Verification User",
                address: "Check Address"
            })
        });
        const text = await response.text();
        console.log("Response Status:", response.status);
    } catch (e) {
        console.error("Error:", e);
    }
}

triggerQuote();
