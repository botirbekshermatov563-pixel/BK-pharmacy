-- ==============================================================================
-- BK PHARMACY DATABASE SCHEMA
-- Compatible with Supabase PostgreSQL
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name_ru VARCHAR(255) NOT NULL,
    name_uz VARCHAR(255) NOT NULL,
    icon VARCHAR(100) DEFAULT 'pill',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id VARCHAR(100) NOT NULL,
    name_ru VARCHAR(255) NOT NULL,
    name_uz VARCHAR(255) NOT NULL,
    form_ru VARCHAR(150),
    form_uz VARCHAR(150),
    dosage_ru VARCHAR(100),
    dosage_uz VARCHAR(100),
    price NUMERIC(12, 2) NOT NULL DEFAULT 0,
    old_price NUMERIC(12, 2),
    image_url TEXT NOT NULL,
    description_ru TEXT,
    description_uz TEXT,
    composition_ru TEXT,
    composition_uz TEXT,
    usage_ru TEXT,
    usage_uz TEXT,
    rating NUMERIC(3, 1) DEFAULT 5.0,
    reviews_count INT DEFAULT 0,
    in_stock BOOLEAN DEFAULT true,
    badge_type VARCHAR(50) DEFAULT 'normal', -- 'bestseller', 'natural', 'premium', 'kids'
    badge_ru VARCHAR(100),
    badge_uz VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    delivery_city VARCHAR(100) DEFAULT 'Ташкент',
    delivery_address TEXT NOT NULL,
    notes TEXT,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) DEFAULT 'new', -- 'new', 'processing', 'completed', 'cancelled'
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. SITE SETTINGS TABLE (CMS for contacts, hero slogans, promotional banners)
CREATE TABLE IF NOT EXISTS public.site_settings (
    key VARCHAR(100) PRIMARY KEY,
    value JSONB NOT NULL,
    description TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for customers
CREATE POLICY "Allow public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public read products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow public read settings" ON public.site_settings FOR SELECT USING (true);

-- Public can insert new orders
CREATE POLICY "Allow public insert orders" ON public.orders FOR INSERT WITH CHECK (true);

-- Authenticated admins have full CRUD permissions
CREATE POLICY "Allow admin full access categories" ON public.categories FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access products" ON public.products FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access orders" ON public.orders FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow admin full access settings" ON public.site_settings FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 6. STORAGE BUCKET FOR PRODUCT IMAGES
INSERT INTO storage.buckets (id, name, public) 
VALUES ('product-images', 'product-images', true)
ON CONFLICT (id) DO NOTHING;

-- Public can view images
CREATE POLICY "Public Access to product-images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

-- Only authenticated users can upload product images
CREATE POLICY "Authenticated users can upload to product-images" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can update product-images" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated users can delete product-images" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'product-images');
