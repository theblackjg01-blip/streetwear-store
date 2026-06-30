-- ============================================================
-- STREETWEAR STORE - Initial Schema
-- Run this in Supabase SQL Editor
-- ============================================================

-- 1. TABLES

CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  compare_at_price DECIMAL(10,2),
  category TEXT,
  images TEXT[] DEFAULT '{}',
  sizes TEXT[] DEFAULT '{}',
  colors TEXT[] DEFAULT '{}',
  stock_by_variant JSONB DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  is_new_drop BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  email TEXT,
  default_address JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','shipped','cancelled')),
  total DECIMAL(10,2) NOT NULL,
  shipping_address JSONB,
  stripe_session_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  variant JSONB DEFAULT '{}',
  quantity INT NOT NULL DEFAULT 1,
  price_at_purchase DECIMAL(10,2) NOT NULL
);

-- 2. INDEXES

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_is_active ON products(is_active);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- 3. ROW LEVEL SECURITY

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own; admin can read all
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Orders: users can view own orders; admin can view all
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admin can manage orders"
  ON orders FOR ALL
  USING (auth.uid() IN (SELECT id FROM profiles WHERE id IN (SELECT id FROM auth.users WHERE email LIKE '%admin%')))
  WITH CHECK (true);

-- Order items: users can view items from own orders
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Products: public read, admin write
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true OR auth.uid() IN (SELECT id FROM profiles WHERE id IN (SELECT id FROM auth.users WHERE email LIKE '%admin%')));

CREATE POLICY "Admin can manage products"
  ON products FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%admin%'))
  WITH CHECK (true);

-- Categories: public read, admin write
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  USING (true);

CREATE POLICY "Admin can manage categories"
  ON categories FOR ALL
  USING (auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%admin%'))
  WITH CHECK (true);

-- 4. AUTO-CREATE PROFILE ON SIGNUP

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY definer;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. SEED DATA

INSERT INTO categories (name, slug) VALUES
  ('Tops', 'tops'),
  ('Bottoms', 'bottoms'),
  ('Outerwear', 'outerwear'),
  ('Accessories', 'accessories'),
  ('Footwear', 'footwear');

INSERT INTO products (name, slug, description, price, compare_at_price, category, images, sizes, colors, stock_by_variant, is_active, is_new_drop) VALUES
  (
    'Urban Hoodie',
    'urban-hoodie',
    'Heavyweight cotton hoodie with oversized fit. Features embroidered logo on chest and signature graphic on back.',
    89.99,
    120.00,
    'Tops',
    ARRAY['https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800', 'https://images.unsplash.com/photo-1578768079052-aa76e52ff62e?w=800'],
    ARRAY['S','M','L','XL','XXL'],
    ARRAY['Black','White','Olive'],
    '{"S":{"Black":10,"White":8,"Olive":5},"M":{"Black":15,"White":12,"Olive":8},"L":{"Black":20,"White":15,"Olive":10},"XL":{"Black":12,"White":10,"Olive":6},"XXL":{"Black":5,"White":4,"Olive":3}}',
    true,
    true
  ),
  (
    'Cargo Pants',
    'cargo-pants',
    'Relaxed fit cargo pants with multiple pockets. Adjustable waistband and tapered leg.',
    74.99,
    NULL,
    'Bottoms',
    ARRAY['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800', 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?w=800'],
    ARRAY['S','M','L','XL'],
    ARRAY['Black','Khaki','Grey'],
    '{"S":{"Black":10,"Khaki":8,"Grey":6},"M":{"Black":15,"Khaki":12,"Grey":10},"L":{"Black":12,"Khaki":10,"Grey":8},"XL":{"Black":8,"Khaki":6,"Grey":4}}',
    true,
    true
  ),
  (
    'Graphic Tee',
    'graphic-tee',
    'Premium cotton t-shirt with oversized front print. Relaxed fit, ribbed collar.',
    39.99,
    55.00,
    'Tops',
    ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'],
    ARRAY['S','M','L','XL'],
    ARRAY['Black','White','Red'],
    '{"S":{"Black":20,"White":15,"Red":10},"M":{"Black":30,"White":25,"Red":15},"L":{"Black":25,"White":20,"Red":12},"XL":{"Black":15,"White":12,"Red":8}}',
    true,
    false
  ),
  (
    'Bomber Jacket',
    'bomber-jacket',
    'Classic nylon bomber jacket with quilted lining. Ribbed cuffs and hem, snap button closure.',
    149.99,
    200.00,
    'Outerwear',
    ARRAY['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800', 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800'],
    ARRAY['M','L','XL'],
    ARRAY['Black','Navy','Army Green'],
    '{"M":{"Black":8,"Navy":6,"Army Green":5},"L":{"Black":12,"Navy":10,"Army Green":8},"XL":{"Black":6,"Navy":5,"Army Green":4}}',
    true,
    true
  ),
  (
    '5-Panel Cap',
    '5-panel-cap',
    'Structured 5-panel cap with embroidered logo. Adjustable strap, curved brim.',
    29.99,
    NULL,
    'Accessories',
    ARRAY['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800', 'https://images.unsplash.com/photo-1620234842646-3e7d73621de2?w=800'],
    ARRAY['One Size'],
    ARRAY['Black','White','Orange'],
    '{"One Size":{"Black":30,"White":25,"Orange":15}}',
    true,
    false
  ),
  (
    'Runner Sneakers',
    'runner-sneakers',
    'Mesh and suede runner sneakers with cushioned sole. Padded collar and tongue.',
    119.99,
    160.00,
    'Footwear',
    ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800', 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800'],
    ARRAY['US 8','US 9','US 10','US 11','US 12'],
    ARRAY['Black/White','All Black','White/Cream'],
    '{"US 8":{"Black/White":8,"All Black":6,"White/Cream":5},"US 9":{"Black/White":12,"All Black":10,"White/Cream":8},"US 10":{"Black/White":15,"All Black":12,"White/Cream":10},"US 11":{"Black/White":10,"All Black":8,"White/Cream":6},"US 12":{"Black/White":5,"All Black":4,"White/Cream":3}}',
    true,
    true
  );
