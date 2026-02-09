-- Fix author_id foreign key constraint issue
-- Make author_id nullable and remove the constraint temporarily

-- Drop the foreign key constraint
ALTER TABLE blog_posts 
DROP CONSTRAINT IF EXISTS blog_posts_author_id_fkey;

-- Make author_id nullable
ALTER TABLE blog_posts 
ALTER COLUMN author_id DROP NOT NULL;
