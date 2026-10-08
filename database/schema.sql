-- ==========================================================
-- THE CLASSIC CRUSH - BAKERY & CAFÉ
-- PostgreSQL / Supabase Database Architecture Schema
-- ==========================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE veg_type AS ENUM ('VEG', 'NON_VEG');
CREATE TYPE order_type AS ENUM ('DELIVERY', 'PICKUP');
CREATE TYPE order_status AS ENUM (
  'RECEIVED',
  'CONFIRMED',
  'PREPARING',
  'READY',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED'
);
CREATE TYPE payment_method AS ENUM ('UPI', 'CARD', 'NET_BANKING', 'COD', 'PAY_AT_CAFE');
CREATE TYPE payment_status AS ENUM ('PENDING', 'PAID', 'FAILED', 'REFUNDED', 'COD');
CREATE TYPE coupon_type AS ENUM ('PERCENTAGE', 'FLAT');

-- 3. USERS / CUSTOMERS TABLE
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) UNIQUE NOT NULL,
  email VARCHAR(255),
  role VARCHAR(50) DEFAULT 'CUSTOMER',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. SAVED ADDRESSES
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  full_name VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  house_flat VARCHAR(255) NOT NULL,
  street VARCHAR(255) NOT NULL,
  area VARCHAR(255) NOT NULL,
  city VARCHAR(100) NOT NULL,
  pincode VARCHAR(20) NOT NULL,
  landmark VARCHAR(255),
  delivery_instructions TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  distance_km DOUBLE PRECISION,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. CATEGORIES
CREATE TABLE categories (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  image TEXT,
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. PRODUCTS
CREATE TABLE products (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  original_price DECIMAL(10, 2),
  category_id VARCHAR(100) REFERENCES categories(id) ON DELETE SET NULL,
  image TEXT NOT NULL,
  veg_type veg_type DEFAULT 'VEG',
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_available BOOLEAN DEFAULT TRUE,
  preparation_time_minutes INT DEFAULT 15,
  ingredients JSONB DEFAULT '[]'::jsonb,
  customizations JSONB DEFAULT '[]'::jsonb,
  rating DECIMAL(3, 1) DEFAULT 5.0,
  rating_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. ORDERS
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number VARCHAR(50) UNIQUE NOT NULL, -- e.g. CC-2026-0001
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  order_type order_type NOT NULL DEFAULT 'DELIVERY',
  subtotal DECIMAL(10, 2) NOT NULL,
  delivery_fee DECIMAL(10, 2) DEFAULT 0.00,
  tax DECIMAL(10, 2) DEFAULT 0.00,
  discount DECIMAL(10, 2) DEFAULT 0.00,
  coupon_code VARCHAR(50),
  grand_total DECIMAL(10, 2) NOT NULL,
  order_status order_status NOT NULL DEFAULT 'RECEIVED',
  payment_method payment_method NOT NULL,
  payment_status payment_status NOT NULL DEFAULT 'PENDING',
  payment_id VARCHAR(255),
  delivery_address JSONB,
  estimated_time_minutes INT DEFAULT 30,
  delivery_partner_name VARCHAR(255),
  delivery_partner_phone VARCHAR(50),
  cancellation_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. ORDER ITEMS (Immutable historical snapshot of purchased prices)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id VARCHAR(100) REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  product_image TEXT,
  quantity INT NOT NULL,
  unit_price DECIMAL(10, 2) NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  veg_type veg_type DEFAULT 'VEG',
  selected_options JSONB DEFAULT '[]'::jsonb,
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. DELIVERY SETTINGS & ZONES
CREATE TABLE delivery_settings (
  id INT PRIMARY KEY DEFAULT 1,
  max_delivery_radius_km DOUBLE PRECISION DEFAULT 6.0,
  free_delivery_threshold DECIMAL(10, 2) DEFAULT 299.00,
  minimum_order_value DECIMAL(10, 2) DEFAULT 49.00,
  estimated_delivery_time_minutes INT DEFAULT 30,
  estimated_pickup_time_minutes INT DEFAULT 15,
  cafe_latitude DOUBLE PRECISION DEFAULT 26.8467,
  cafe_longitude DOUBLE PRECISION DEFAULT 80.9462,
  cafe_address TEXT NOT NULL,
  cafe_phone VARCHAR(50) NOT NULL,
  cafe_alt_phone VARCHAR(50),
  cafe_whatsapp VARCHAR(50) NOT NULL,
  cafe_email VARCHAR(255) NOT NULL,
  instagram_url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  min_distance_km DOUBLE PRECISION NOT NULL,
  max_distance_km DOUBLE PRECISION NOT NULL,
  fee DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. COUPONS & DISCOUNTS
CREATE TABLE coupons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  code VARCHAR(50) UNIQUE NOT NULL,
  description TEXT NOT NULL,
  discount_type coupon_type NOT NULL DEFAULT 'FLAT',
  discount_value DECIMAL(10, 2) NOT NULL,
  minimum_order_amount DECIMAL(10, 2) DEFAULT 0.00,
  max_discount_amount DECIMAL(10, 2),
  is_active BOOLEAN DEFAULT TRUE,
  expiry_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. REVIEWS & RATINGS
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id VARCHAR(100) REFERENCES products(id) ON DELETE CASCADE,
  user_name VARCHAR(255) NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  verified_purchase BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. INDEXES FOR HIGH-SPEED QUERYING
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_available ON products(is_available);
CREATE INDEX idx_orders_status ON orders(order_status);
CREATE INDEX idx_orders_phone ON orders(customer_phone);
CREATE INDEX idx_orders_number ON orders(order_number);
CREATE INDEX idx_reviews_product ON reviews(product_id);
