import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString = process.env.VITE_PG_URI || process.env.DATABASE_URL;
if (!connectionString) {
    console.error('Missing VITE_PG_URI or DATABASE_URL in environment');
    process.exit(1);
}

async function runMigration() {
    const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
    
    try {
        await client.connect();
        console.log('✅ Connected to Supabase');

        const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '20261017_create_solar_leads.sql');
        const sql = fs.readFileSync(sqlPath, 'utf-8');
        
        await client.query(sql);
        console.log('✅ Migration executed successfully — solar_leads table created');
        
        // Verify
        const result = await client.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'solar_leads' ORDER BY ordinal_position");
        console.log('\n📋 Table columns:');
        result.rows.forEach(r => console.log(`   ${r.column_name} (${r.data_type})`));
        
    } catch (err) {
        console.error('❌ Migration failed:', err.message);
    } finally {
        await client.end();
    }
}

runMigration();
