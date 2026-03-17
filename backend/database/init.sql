-- ==============================================================================
-- Aurelia Homme - E-Commerce Database Schema
-- Dialect: PostgreSQL
-- ==============================================================================

-- 1. USERS & PROFILES
-- ==============================================================================

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone VARCHAR(20),
    role VARCHAR(50) DEFAULT 'customer', -- 'customer', 'admin'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Extended profile for the AI Stylist feature
CREATE TABLE user_profiles (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    body_type VARCHAR(50), -- e.g., 'Athletic', 'Slim', 'Broad'
    style_preference VARCHAR(100), -- e.g., 'Classic', 'Urban Casual', 'Avant-Garde'
    height_cm INTEGER,
    weight_kg INTEGER,
    skin_tone VARCHAR(50),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. CATALOG (CATEGORIES, PRODUCTS, VARIANTS)
-- ==============================================================================

CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Handles sizes, colors, and inventory
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    sku VARCHAR(100) UNIQUE NOT NULL,
    size VARCHAR(50),
    color VARCHAR(50),
    stock_quantity INTEGER DEFAULT 0,
    price_adjustment DECIMAL(10, 2) DEFAULT 0.00, -- In case XXL costs more, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. ORDERS & CART
-- ==============================================================================

CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'shipped', 'delivered', 'cancelled'
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address TEXT NOT NULL,
    billing_address TEXT,
    tracking_number VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. REVIEWS & RATINGS
-- ==============================================================================

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


-- ==============================================================================
-- SEED DATA (MOCK DATA FOR TESTING)
-- ==============================================================================

-- Insert Categories
INSERT INTO categories (id, name, slug, description) VALUES
('c1000000-0000-0000-0000-000000000000', 'Outerwear', 'outerwear', 'Coats, jackets, and blazers'),
('c2000000-0000-0000-0000-000000000000', 'Knitwear', 'knitwear', 'Sweaters, turtlenecks, and cardigans'),
('c3000000-0000-0000-0000-000000000000', 'Shirts', 'shirts', 'Dress shirts and casual button-downs'),
('c4000000-0000-0000-0000-000000000000', 'Trousers', 'trousers', 'Tailored pants and casual chinos'),
('c5000000-0000-0000-0000-000000000000', 'Accessories', 'accessories', 'Belts, ties, and pocket squares'),
('c6000000-0000-0000-0000-000000000000', 'Footwear', 'footwear', 'Boots, oxfords, and loafers');

-- Insert Products
INSERT INTO products (id, category_id, name, slug, description, price, image_url) VALUES
('p1000000-0000-0000-0000-000000000000', 'c1000000-0000-0000-0000-000000000000', 'Sterling Charcoal Suit', 'sterling-charcoal-suit', 'A timeless classic crafted from pure Mongolian cashmere.', 1250.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBf4_zUESdwZhN5Nb9wIt62G81mZ5f3sPAK4bLU-CAdbEydJkZ4OlFyt7W0lMA0SmoSN-27GTpUiGZxvzH4PMTWVUuW6PZUdmMmTNwRRj8z9kkjKgN1f8ldOk1ie6LD7HnvtUH3vF5I0HyoIfNUJ9KfCe2gP0yFlHy_tbz3e-eGwjK_pP5OmGfooVxtetazXnf0FNeLSd3avJayvXdivrfRiYlScZs76izYfc3-2PYxNrIP361Xi-ZnrcKt4OFzPs-Vl85332wkzEY'),
('p2000000-0000-0000-0000-000000000000', 'c2000000-0000-0000-0000-000000000000', 'Midnight Wool Blazer', 'midnight-wool-blazer', 'Lightweight, breathable, and incredibly soft.', 890.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuC9i87OVxxHmXunaf2nV6RiRdkzm0xIfz7Y08mMzSsDa_7UmulYg6nIlHDtegH4XL_-zONXUmzj1tN0WnJGcwc8kuUe-C4hpQobTA6QIMw0Ws8y-DnnCHcg04FeH7sie07O9ibl1mHmSxRSNDWlJhrw3qcNWLu6jJLeZJYdvhRWPsv7ta0uqjXcA8BK4Axsq8Q31Eqt2fDHkbtnTgGy8QNifJ3mhbogqXq_VTs7IG_8iXTeTBD-Z-IS-BroR1dC2AbCO671tI5pA1Q'),
('p3000000-0000-0000-0000-000000000000', 'c3000000-0000-0000-0000-000000000000', 'Egyptian Cotton Shirt', 'egyptian-cotton-shirt', 'Precision cut for a modern, tapered silhouette.', 220.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkp0y2C5sO1Kmu91TWIe7h52GvFcx0SmWm6yi-P4Q-C8fA1CzZqU4g5fguoaaXzb2x6tuCDAp5hhhQTzDTkFT83YMgOUUWv09T-BjnNNBEPSX8bz9zcvgq3jIgzzDckCKuB_vIouYoyZR7ECLCZR0703Rvs6Tavi0yJI5biQLzxTQ6W6m0ssRY2i3yR6LfpgkhUgtUs23Amzigrm7XQm_5M8rhY6Zf19HqelKZzSH8RkKcGGrBAmj7H07F10NsKCvjSdXxq0TvYq0'),
('p4000000-0000-0000-0000-000000000000', 'c5000000-0000-0000-0000-000000000000', 'Hand-Stitched Belt', 'hand-stitched-belt', 'Handcrafted in Italy using full-grain calf leather.', 180.00, 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3fvopJ4PhAVgkq5NfFoID5ynBIrdzvSVBtewp2HioS4M8Jn_5kO10K0n1P_OORiArGz567PAw-qwr3yHNCevPBF7mZ90E6iR2WkoCB8q28DuI9ufe50dRNic7Xu8WHEOO9pNyCW0soMPHCl4fXH0SlH49L-xqTzS3JPdA8nhYxTOCsOKfJJEH0lDnW0NjLKp6AM-bu7V4iSjw6St7fcmp2tvuOogG-F5M4oqME6tYpe8pxv8QjSppX3iqmSBC3yvCjVbAiB2fAQw');

-- Insert Product Variants
INSERT INTO product_variants (product_id, sku, size, color, stock_quantity) VALUES
('p1000000-0000-0000-0000-000000000000', 'SCS-CHAR-S', 'S', 'Charcoal', 5),
('p1000000-0000-0000-0000-000000000000', 'SCS-CHAR-M', 'M', 'Charcoal', 12),
('p1000000-0000-0000-0000-000000000000', 'SCS-CHAR-L', 'L', 'Charcoal', 8),
('p2000000-0000-0000-0000-000000000000', 'MWB-NAVY-M', 'M', 'Navy', 15),
('p2000000-0000-0000-0000-000000000000', 'MWB-NAVY-L', 'L', 'Navy', 10),
('p3000000-0000-0000-0000-000000000000', 'ECS-WHT-32', '32', 'White', 20),
('p3000000-0000-0000-0000-000000000000', 'ECS-WHT-34', '34', 'White', 25),
('p4000000-0000-0000-0000-000000000000', 'HSB-BRN-34', '34', 'Brown', 30),
('p4000000-0000-0000-0000-000000000000', 'HSB-BRN-36', '36', 'Brown', 20);
