
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Initialize Supabase client
// Note: In Next.js, we should use process.env for server-side variables.
// Ensure these keys are in .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseBucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || process.env.SUPABASE_BUCKET!;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing from environment variables.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Enhanced fetchClosestRow with debug logs
export async function fetchClosestRow(tableName: string, targetValue: number, columnName: string = 'system_size') {
  console.log(`🔎 Searching in table: ${tableName} for closest to ${targetValue} on column ${columnName}`);
  const { data: allData, error: allError } = await supabase.from(tableName).select('*');
  if (allError) {
    console.error('❌ Error fetching rows:', allError);
    return null;
  }
  // console.log('📄 All rows in table:', allData);
  if (!allData || allData.length === 0) {
    console.warn('⚠️ No rows found in table:', tableName);
    return null;
  }
  let closestRow = null;
  let minDiff = Number.POSITIVE_INFINITY;

  for (const row of allData) {
    const val = parseFloat(row[columnName]);
    if (!isNaN(val)) {
      const diff = Math.abs(val - targetValue);
      if (diff < minDiff) {
        minDiff = diff;
        closestRow = row;
      }
    }
  }
  console.log('✅ Closest row found:', closestRow);
  return closestRow;
}

// Fetch the first row from a table
export async function fetchFirstRow(table: string) {
  const { data, error } = await supabase.from(table).select('*').limit(1);
  if (error) throw error;
  return data && data.length > 0 ? data[0] : null;
}

// Fetch all rows from a table
export async function fetchAllRows(table: string) {
  const { data, error } = await supabase.from(table).select('*');
  if (error) throw error;
  return data;
}

// Fetch configuration key-value pairs from a table
export async function fetchConfig(table: string) {
  const { data, error } = await supabase.from(table).select('*');
  if (error) throw error;
  const config: Record<string, any> = {};
  data.forEach((row: any) => {
    config[row.key || row.config_key] = row.value || row.config_value;
  });
  return config;
}

export async function uploadToBucket(filePath: string): Promise<string> {
  try {
    console.log('Starting upload for file:', filePath);
    const fileName = path.basename(filePath);

    // Verify file exists
    if (!fs.existsSync(filePath)) {
      console.error('File does not exist:', filePath);
      throw new Error('File not found');
    }

    const fileBuffer = fs.readFileSync(filePath);
    console.log('Uploading to bucket:', supabaseBucket, 'File:', fileName);

    const { data, error } = await supabase.storage
      .from(supabaseBucket)
      .upload(fileName, fileBuffer, {
        upsert: true,
        contentType: 'application/pdf',
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      throw new Error(`Storage error: ${error.message}`);
    }

    console.log('File uploaded successfully:', data);

    const { data: publicData } = supabase.storage
      .from(supabaseBucket)
      .getPublicUrl(fileName);

    if (!publicData.publicUrl) {
      console.error('Failed to get public URL');
      throw new Error('No public URL returned');
    }

    console.log('Public URL:', publicData.publicUrl);
    return publicData.publicUrl;
  } catch (error) {
    console.error('uploadToBucket error:', error);
    throw error;
  }
}

// Insert a new quote request into the solar_quote_requests table
export async function insertQuoteRequest(insertData: any) {
  // Sanitize data: remove columns that don't exist
  const {
    id,
    created_at,
    updated_at,
    ...cleanData
  } = insertData;

  console.log('Inserting into solar_quote_requests (Sanitized):', cleanData);
  const { error } = await supabase.from('solar_quote_requests').insert([cleanData]);
  if (error) {
    console.error('Supabase insert error:', error);
    throw new Error(`Failed to insert into Supabase: ${error.message}`);
  }
  return true;
}
