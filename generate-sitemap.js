import fs from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// 1. Get the current folder path
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 2. Read the JSON file manually (Safest method)
const locationsPath = path.join(__dirname, 'src', 'data', 'locations.json');
const locationsData = fs.readFileSync(locationsPath, 'utf-8');
const locations = JSON.parse(locationsData);

// ⚠️ IMPORTANT: Change this to "https://www.arpitsolar.com" before deploying!
// const BASE_URL = "http://localhost:8080"; 
const BASE_URL = "https://www.arpitsolar.com";

console.log(`Generating sitemap for ${locations.length} locations + Static Pages...`);

// 3. Define your Manual (Static) Pages
const staticPages = [
  // Homepage
  { path: "/", priority: "1.0", freq: "daily" },
  
  // Solutions
  { path: "/solutions/residential", priority: "0.9", freq: "weekly" },
  { path: "/solutions/commercial-industrial", priority: "0.9", freq: "weekly" },

  // Brands (High Priority)
  { path: "/reliance", priority: "0.85", freq: "weekly" },
  { path: "/shakti-solar", priority: "0.85", freq: "weekly" },
  { path: "/tata-solar", priority: "0.85", freq: "weekly" },

  // Services & Products
  { path: "/services", priority: "0.8", freq: "monthly" },
  { path: "/products", priority: "0.8", freq: "monthly" },
  { path: "/get-quote", priority: "0.9", freq: "monthly" },

  // About & Contact
  { path: "/about/us", priority: "0.6", freq: "monthly" },
  { path: "/about/sustainability", priority: "0.6", freq: "monthly" },
  { path: "/contact", priority: "0.8", freq: "monthly" }
];

const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

  ${staticPages.map(page => `
  <url>
    <loc>${BASE_URL}${page.path === "/" ? "" : page.path}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>${page.freq}</changefreq>
    <priority>${page.priority}</priority>
  </url>
  `).join('')}

  ${locations.map((loc) => `
  <url>
    <loc>${BASE_URL}/solar-in-${loc.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  `).join('')}

</urlset>`;

// 4. Save to public/sitemap.xml
const publicPath = path.join(__dirname, 'public', 'sitemap.xml');
fs.writeFileSync(publicPath, sitemapContent);

console.log(`✅ Sitemap generated successfully at ${publicPath}`);