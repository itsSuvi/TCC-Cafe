-- ==========================================================
-- THE CLASSIC CRUSH - BAKERY & CAFÉ
-- PostgreSQL / Supabase Seed Data
-- ==========================================================

-- Categories
INSERT INTO categories (id, name, slug, description, image, display_order, is_active) VALUES
('cat-desserts', 'Signature Desserts', 'signature-desserts', 'Freshly handcrafted decadent chocolate waffles, fantasy cups & artisan jars', 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=800&q=80', 1, true),
('cat-quick-bites', 'Quick Bites', 'quick-bites', 'Crispy baked masala patties, freshly oven-baked pizzas & Korean buns', 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80', 2, true),
('cat-sandwiches-maggi', 'Sandwiches & Maggie', 'sandwiches-maggi', 'Cheesy grilled artisanal sandwiches & steaming piping-hot Maggie bowls', 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=800&q=80', 3, true),
('cat-beverages-pastries', 'Beverages & Small Eats', 'beverages-small-eats', 'Handcrafted iced coffees, cooling mojitos, brownies & custom cakes', 'https://images.unsplash.com/photo-1517256064527-09c73fc73e38?auto=format&fit=crop&w=800&q=80', 4, true),
('cat-burgers', 'Burgers', 'burgers', 'Juicy vegetable, paneer & melted cheddar burgers served on toasted brioche', 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80', 5, true),
('cat-fries', 'French Fries', 'french-fries', 'Golden crunchy potato fries tossed in aromatic seasonings & molten cheese', 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80', 6, true),
('cat-momos', 'Momos', 'momos', 'Steamed, golden fried & crispy kurkure momos served with fiery red chutney', 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=800&q=80', 7, true)
ON CONFLICT (id) DO UPDATE SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Delivery Settings
INSERT INTO delivery_settings (id, max_delivery_radius_km, free_delivery_threshold, minimum_order_value, estimated_delivery_time_minutes, estimated_pickup_time_minutes, cafe_latitude, cafe_longitude, cafe_address, cafe_phone, cafe_alt_phone, cafe_whatsapp, cafe_email, instagram_url) VALUES
(1, 6.0, 299.00, 49.00, 30, 15, 26.8467, 80.9462, 'The Classic Crush Bakery & Café, School of Hotel Management Campus', '+91 8090205081', '+91 8318008104', '918090205081', 'theclassiccrush@gmail.com', 'https://instagram.com/theclassiccrush')
ON CONFLICT (id) DO NOTHING;

-- Delivery Zones
INSERT INTO delivery_zones (min_distance_km, max_distance_km, fee) VALUES
(0.0, 2.0, 20.00),
(2.0, 4.0, 30.00),
(4.0, 6.0, 40.00);

-- Coupons
INSERT INTO coupons (code, description, discount_type, discount_value, minimum_order_amount, is_active) VALUES
('WELCOME50', 'Flat ₹50 OFF on your first order above ₹199', 'FLAT', 50.00, 199.00, true),
('CRUSH10', '10% OFF on all signature desserts & quick bites', 'PERCENTAGE', 10.00, 99.00, true),
('GRAND100', 'Grand Opening Special: Flat ₹100 OFF on orders above ₹399', 'FLAT', 100.00, 399.00, true);
