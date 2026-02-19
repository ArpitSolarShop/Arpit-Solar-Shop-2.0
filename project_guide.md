# Arpit Solar Shop - Developer Guide & Project Documentation

Welcome to the **Arpit Solar Shop** project! This document serves as a comprehensive guide to understanding, maintaining, and extending the application.

## 1. Project Overview
This is a high-performance, SEO-optimized web application for a solar installation business. It is built to capture leads, provide instant quotes, and dominate local search results via programmatic SEO.

### Tech Stack
-   **Framework**: [Next.js 15 (App Router)](https://nextjs.org) - React framework for production.
-   **Language**: [TypeScript](https://www.typescriptlang.org) - For type safety.
-   **Styling**: [Tailwind CSS](https://tailwindcss.com) + [Shadcn UI](https://ui.shadcn.com) - For beautiful, responsive UI.
-   **Database**: [Supabase](https://supabase.com) - PostgreSQL database for storing leads (`solar_quote_requests`).
-   **CRM Integration**: **Kit19** - External CRM for sales team management.
-   **Deployment**: Vercel (recommended) or Netlify.

---

## 2. Project Structure
Here is an overview of the key directories and files:

```
src/
├── app/                        # Next.js App Router (Pages & API)
│   ├── (website)/              # Public website pages (grouped layout)
│   │   ├── solar-installation/ # Programmatic SEO Pages ([city]/page.tsx)
│   │   ├── blog/               # Blog System ([slug]/page.tsx)
│   │   └── contact/            # Contact Page
│   ├── admin/                  # Admin Panel (Protected)
│   │   └── leads/              # Lead View
│   ├── api/                    # API Routes (e.g., generate-quote)
│   └── actions/                # Server Actions (form submissions)
│       └── crm.ts              # Core logic for Kit19 + Supabase
├── components/                 # React Components
│   ├── forms/                  # Lead Forms (Hero, Contact, SiteVisit)
│   ├── sections/               # Landing Page Sections
│   └── ui/                     # Reusable UI elements (Buttons, Cards)
├── config/                     # Configuration files (site, nav, admin)
├── data/                       # Static Data (locations.json, posts.json)
├── lib/                        # Utility Libraries
│   └── server/                 # Server-side logic (Supabase, CRM)
└── public/                     # Static Assets (Images, Logos)
```

---

## 3. Core Systems Explained

### A. Lead Capture System (The "Heart" of the App)
The app is designed to never lose a lead. We use a **Redundant Dual-Write** strategy.

**Flow:**
1.  **User Submits Form**: (Hero Quote, Contact Us, or Site Visit Popup).
2.  **Server Action (`crm.ts`)**: The form data is sent to the server.
3.  **Step 1: Local Backup**: Data is immediately saved to **Supabase** table `solar_quote_requests`.
    *   *Why?* Ensures accurate data ownership and backup if CRM fails.
4.  **Step 2: CRM Push**: Data is formatted and sent to **Kit19** API.
    *   *Why?* For the sales team to call the customer.

**Key Files:**
-   `src/app/actions/crm.ts`: The "brain" of lead processing.
-   `src/lib/server/services/supabase.ts`: Database helper functions.
-   `src/components/forms/HeroGetQuote.tsx`: The main calculator form.

### B. Programmatic SEO Engine
We generate hundreds of location-specific landing pages dynamically to rank for "Solar Installer in [City]".

**How it Works:**
1.  **Data Source**: `src/data/locations.json` contains a list of cities (Varanasi, Prayagraj, etc.) with metadata (slug, subsidy amount, reliable partners).
2.  **Dynamic Route**: `src/app/(website)/solar-installation/[city]/page.tsx` catches the URL (e.g., `/solar-installation/varanasi`).
3.  **Generation**:
    -   `generateStaticParams`: Tells Next.js to build a page for *every* city in the JSON file at build time.
    -   The page content is customized with the city name, specific subsidy info, and local images.

**To Add a City**: Just add an entry to `src/data/locations.json` and redeploy!

### C. Admin Panel
A protected area for you to view the data stored in your local database.

-   **URL**: `/admin/leads`
-   **Features**: View all inquiries, check status, and verify CRM data.
-   **Code**: `src/app/admin/leads/page.tsx`

### D. Communication & Analytics
-   **DoubleTick Widget**: Official WhatsApp integration (`DoubleTick.tsx`). Bypasses CSP via `middleware.ts` to allow direct customer chats.
-   **Vercel Analytics**: Privacy-friendly page view tracking (`layout.tsx`).
-   **Yami Chatbot**: Legacy custom chatbot (Hidden but preserved in code).

---

## 4. Environment Variables
You need these in your `.env.local` file for the app to work locally:

```bash
# Supabase (Database)
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
SUPABASE_SERVICE_ROLE_KEY="your-service-key" (Optional, for Admin)

# Kit19 (CRM)
KIT19_API_KEY="your-api-key" (Server-side only!)
```

---

## 5. Common Commands

### Development
Start the local server.
```bash
npm run dev
```

### Build & Check
Run this before deploying to ensure no errors.
```bash
# Check types
npx tsc --noEmit

# Build production bundle
npm run build
```

---

## 6. How to Extend

### Adding a New Blog Post
1.  Open `src/data/posts.json`.
2.  Add a new JSON object with `slug`, `title`, `content`, etc.
3.  The new post will automatically appear at `/blog/new-post-slug`.

### Changing Prices or Subsidies
1.  **Global Prices**: Edit `src/components/forms/HeroGetQuote.tsx` (or extracting to a config file is recommended for future).
2.  **City Subsidies**: Edit `src/data/locations.json`.

---

## 7. Troubleshooting

-   **"Image not found"**: Check `public/` folder. Always use `/image.png` (leading slash).
-   **"CRM Sync Failed"**: Check `src/app/actions/crm.ts` logs. Verify Kit19 API Key.
-   **"Supabase Error"**: Check RLS policies or API keys.

Happy Coding! 🚀
