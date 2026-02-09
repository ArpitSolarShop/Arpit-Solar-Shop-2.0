-- Migration: Add SEO columns to blog_posts
-- Description: Add alias columns for SEO metadata

-- Add seo_title and seo_description as aliases or migrate from meta_ columns
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS seo_title TEXT,
ADD COLUMN IF NOT EXISTS seo_description TEXT;

-- If there's existing data in meta_ columns, copy it
UPDATE blog_posts 
SET seo_title = meta_title,
    seo_description = meta_description
WHERE seo_title IS NULL OR seo_description IS NULL;
