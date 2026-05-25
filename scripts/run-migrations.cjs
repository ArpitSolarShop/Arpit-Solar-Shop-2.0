const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

// Manually parse .env.local
const envPath = path.join(__dirname, '../.env.local');
let databaseUrl = process.env.DATABASE_URL;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const lines = envContent.split('\n');
  for (const line of lines) {
    const match = line.match(/^\s*DATABASE_URL\s*=\s*["']?([^"'\s]+)["']?/);
    if (match) {
      databaseUrl = match[1];
      break;
    }
  }
}

if (!databaseUrl) {
  console.error('❌ Error: DATABASE_URL not found in environment or .env.local');
  process.exit(1);
}

console.log('🔌 Connecting to database...');
const client = new Client({
  connectionString: databaseUrl,
  ssl: {
    rejectUnauthorized: false
  }
});

async function runMigrations() {
  try {
    await client.connect();
    console.log('✅ Connected to PostgreSQL successfully!');

    // 0. Base setup: Extensions and Helper functions
    console.log('🚀 Running base setups (Extensions & Helpers)...');
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
      await client.query(`
        CREATE OR REPLACE FUNCTION update_updated_at_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ language 'plpgsql';
      `);
      console.log('✅ Base setups complete!');
    } catch (err) {
      console.warn('⚠️ Base setups warning:', err.message);
    }

    // 1. Run cms blog migration
    try {
      const blogMigrationPath = path.join(__dirname, '../supabase/migrations/20260120_create_cms_blog.sql');
      console.log(`📄 Reading migration: ${path.basename(blogMigrationPath)}`);
      const blogSql = fs.readFileSync(blogMigrationPath, 'utf8');

      console.log('🚀 Executing CMS & Blog migration...');
      await client.query(blogSql);
      console.log('✅ CMS & Blog tables successfully created/verified!');
    } catch (err) {
      console.warn('⚠️ CMS & Blog migration warning (could be that some resources/policies already exist):', err.message);
    }

    // 2. Run solar quote requests migration
    try {
      const quoteMigrationPath = path.join(__dirname, '../supabase/migrations/20260525_create_solar_quote_requests.sql');
      console.log(`📄 Reading migration: ${path.basename(quoteMigrationPath)}`);
      const quoteSql = fs.readFileSync(quoteMigrationPath, 'utf8');

      console.log('🚀 Executing Solar Quote Requests migration...');
      await client.query(quoteSql);
      console.log('✅ Solar Quote Requests table successfully created/verified!');
    } catch (err) {
      console.warn('⚠️ Solar Quote Requests migration warning (could be that some resources/policies already exist):', err.message);
    }

    // 3. Grant privileges explicitly to Supabase roles
    console.log('🚀 Granting explicit privileges to anon, authenticated, and service_role...');
    try {
      await client.query(`
        -- Grant access to schema public
        GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
        
        -- Grant access to tables
        GRANT ALL ON public.solar_quote_requests TO anon, authenticated, service_role;
        GRANT ALL ON public.blog_posts TO anon, authenticated, service_role;
        GRANT ALL ON public.cms_pages TO anon, authenticated, service_role;
        
        -- If there are any sequences, grant usage on them
        GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
      `);
      console.log('✅ Privileges granted successfully!');
    } catch (err) {
      console.error('❌ Failed to grant privileges:', err.message);
    }

  } catch (err) {
    console.error('❌ Database connection or global run failed:', err);
  } finally {
    await client.end();
    console.log('🔌 Connection closed.');
  }
}

runMigrations();
