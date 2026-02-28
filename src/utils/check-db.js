const fetch = require('node-fetch');
require('dotenv').config({ path: '.env.local' });

async function getProducts() {
    const res = await fetch(process.env.NEXT_PUBLIC_SUPABASE_URL + '/rest/v1/products?select=name,brand,product_type,system_configurations&is_published=eq.true&limit=3', {
        headers: { apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY }
    });
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}
getProducts();
