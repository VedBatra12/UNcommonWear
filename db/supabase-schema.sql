-- ====================================================================
-- UNCommon weaR — Supabase Database Schema
-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New query)
-- ====================================================================

-- 1. Designs Table
CREATE TABLE IF NOT EXISTS public.designs (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  image TEXT NOT NULL,
  mockup_image TEXT,
  category TEXT NOT NULL DEFAULT 'GRAPHIC',
  tags TEXT[] DEFAULT '{}',
  style TEXT DEFAULT 'Modern',
  mood TEXT DEFAULT 'Aesthetic',
  color TEXT DEFAULT 'Monochrome',
  description TEXT DEFAULT '',
  featured BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'published',
  views INTEGER DEFAULT 0,
  copies INTEGER DEFAULT 0,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Index for searching and filtering
CREATE INDEX IF NOT EXISTS idx_designs_code ON public.designs(code);
CREATE INDEX IF NOT EXISTS idx_designs_category ON public.designs(category);
CREATE INDEX IF NOT EXISTS idx_designs_status ON public.designs(status);

-- 2. Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  count INTEGER DEFAULT 0,
  color TEXT DEFAULT '#ffffff',
  accent TEXT DEFAULT '#ffffff',
  description TEXT DEFAULT '',
  icon TEXT DEFAULT 'sparkles',
  "order" INTEGER DEFAULT 0
);

-- 3. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL
);

-- 4. Analytics Table
CREATE TABLE IF NOT EXISTS public.analytics (
  id TEXT PRIMARY KEY,
  catalogue_views INTEGER DEFAULT 0,
  searches JSONB DEFAULT '{}'::jsonb,
  category_views JSONB DEFAULT '{}'::jsonb,
  design_views JSONB DEFAULT '{}'::jsonb,
  copy_actions JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (RLS) but allow public read/write access via anon key for cart & admin operations
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;

-- Drop old policies if any
DROP POLICY IF EXISTS "Allow all access to designs" ON public.designs;
DROP POLICY IF EXISTS "Allow all access to categories" ON public.categories;
DROP POLICY IF EXISTS "Allow all access to settings" ON public.settings;
DROP POLICY IF EXISTS "Allow all access to analytics" ON public.analytics;

-- Create permissive policies for anon key
CREATE POLICY "Allow all access to designs" ON public.designs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to settings" ON public.settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all access to analytics" ON public.analytics FOR ALL USING (true) WITH CHECK (true);

-- 5. Storage Bucket for Artworks
-- Insert bucket into storage.buckets if not exists
INSERT INTO storage.buckets (id, name, public) 
VALUES ('artworks', 'artworks', true)
ON CONFLICT (id) DO NOTHING;

-- Storage public read policy
DROP POLICY IF EXISTS "Public Artworks Read" ON storage.objects;
CREATE POLICY "Public Artworks Read" ON storage.objects 
FOR SELECT USING (bucket_id = 'artworks');

-- Storage public upload/write policy
DROP POLICY IF EXISTS "Public Artworks Upload" ON storage.objects;
CREATE POLICY "Public Artworks Upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'artworks');

DROP POLICY IF EXISTS "Public Artworks Update" ON storage.objects;
CREATE POLICY "Public Artworks Update" ON storage.objects 
FOR UPDATE USING (bucket_id = 'artworks');

DROP POLICY IF EXISTS "Public Artworks Delete" ON storage.objects;
CREATE POLICY "Public Artworks Delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'artworks');
