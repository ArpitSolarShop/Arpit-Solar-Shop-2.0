// Script to create products table in Supabase
// Run this in your Supabase SQL Editor

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env.local');
    console.log('Required variables:');
    console.log('- NEXT_PUBLIC_SUPABASE_URL');
    console.log('- SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupProductsTable() {
    console.log('🚀 Starting products table setup...\n');

    try {
        // Read the SQL file
        const sqlFile = path.join(__dirname, 'supabase-products-migration.sql');
        const sql = fs.readFileSync(sqlFile, 'utf8');

        console.log('📄 SQL migration file loaded');
        console.log('⚠️  Note: You need to run this SQL in your Supabase SQL Editor\n');
        console.log('Steps:');
        console.log('1. Go to your Supabase Dashboard');
        console.log('2. Navigate to SQL Editor');
        console.log('3. Copy the contents of supabase-products-migration.sql');
        console.log('4. Paste and run the SQL\n');

        // Alternatively, try to check if table exists
        const { data, error } = await supabase
            .from('products')
            .select('count')
            .limit(1);

        if (error) {
            if (error.message.includes('does not exist')) {
                console.log('❌ Products table does not exist yet');
                console.log('📋 Please run the SQL migration file in Supabase SQL Editor\n');
            } else {
                console.error('❌ Error checking products table:', error.message);
            }
        } else {
            console.log('✅ Products table exists!');

            // Check product count
            const { count } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            console.log(`📦 Found ${count} products in the database\n`);

            if (count === 0) {
                console.log('⚠️  No products found. The sample data might not have been inserted.');
                console.log('Please run the INSERT statements from the migration file.\n');
            } else {
                console.log('✅ Setup complete! Your products are ready.\n');

                // Show sample products
                const { data: products } = await supabase
                    .from('products')
                    .select('id, name, brand, price')
                    .limit(5);

                console.log('Sample products:');
                products?.forEach(p => {
                    console.log(`  - ${p.name} (${p.brand}) - ₹${p.price?.toLocaleString()}`);
                });
            }
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

setupProductsTable();
