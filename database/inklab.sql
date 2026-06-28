CREATE DATABASE IF NOT EXISTS inklab;
USE inklab;

-- ===========================
-- USERS
-- ===========================

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    fullname VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ===========================
-- CATEGORIES
-- ===========================

CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- ===========================
-- PRODUCTS
-- ===========================

CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_id INT,
    product_name VARCHAR(150) NOT NULL,
    description TEXT,
    price DECIMAL(12,2) NOT NULL,
    stock INT DEFAULT 0,
    image VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id)
    REFERENCES categories(id)
    ON DELETE SET NULL
);

-- ===========================
-- ORDERS
-- ===========================

CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT,

    total DECIMAL(12,2),

    status ENUM(
        'pending',
        'paid',
        'processing',
        'shipping',
        'completed'
    ) DEFAULT 'pending',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(user_id)
    REFERENCES users(id)
    ON DELETE CASCADE
);

-- ===========================
-- ORDER ITEMS
-- ===========================

CREATE TABLE order_items (

    id INT AUTO_INCREMENT PRIMARY KEY,

    order_id INT,

    product_id INT,

    quantity INT,

    subtotal DECIMAL(12,2),

    FOREIGN KEY(order_id)
    REFERENCES orders(id)
    ON DELETE CASCADE,

    FOREIGN KEY(product_id)
    REFERENCES products(id)
    ON DELETE CASCADE

);

-- ===========================
-- CUSTOM DESIGN
-- ===========================

CREATE TABLE custom_designs (

    id INT AUTO_INCREMENT PRIMARY KEY,

    user_name VARCHAR(100),

    whatsapp VARCHAR(20),

    product_type VARCHAR(100),

    quantity INT,

    design_file VARCHAR(255),

    notes TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);