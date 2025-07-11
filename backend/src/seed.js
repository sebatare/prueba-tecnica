// src/seed.js
const { query } = require('./infrastructure/database');

// Function to create the products table if it doesn't exist
const createProductsTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price NUMERIC(10, 2) NOT NULL,
            stock INTEGER NOT NULL DEFAULT 0,
            imgUrl VARCHAR(255),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await query(createTableQuery);
        console.log('Products table checked/created successfully with imgUrl column.');
    } catch (error) {
        console.error('Error creating products table:', error);
        throw error;
    }
};

// Function to create the orders table if it doesn't exist
const createOrdersTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            total_amount NUMERIC(10, 2) NOT NULL,
            status VARCHAR(50) NOT NULL DEFAULT 'pending', -- e.g., 'pending', 'paid', 'refunded', 'cancelled'
            stripe_session_id VARCHAR(255) UNIQUE, -- To link with Stripe sessions
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await query(createTableQuery);
        console.log('Orders table checked/created successfully.');
    } catch (error) {
        console.error('Error creating orders table:', error);
        throw error;
    }
};

// Function to create the order_items table if it doesn't exist
const createOrderItemsTable = async () => {
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS order_items (
            id SERIAL PRIMARY KEY,
            order_id INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
            product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
            quantity INTEGER NOT NULL,
            price NUMERIC(10, 2) NOT NULL,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `;
    try {
        await query(createTableQuery);
        console.log('Order_items table checked/created successfully.');
    } catch (error) {
        console.error('Error creating order_items table:', error);
        throw error;
    }
};


// Function to insert products into the database
const seedProducts = async () => {
    // Array with the products to be inserted, now including imgUrl
    const products = [
        { name: 'Camiseta Básica', description: 'Camiseta de algodón de alta calidad, disponible en varios colores.', price: 1500, stock: 100, imgUrl: 'https://example.com/images/camiseta-basica.jpg' },
        { name: 'Jeans Ajustados', description: 'Jeans de mezclilla ajustados para un ajuste cómodo.', price: 2500, stock: 50, imgUrl: 'https://example.com/images/jeans-ajustados.jpg' },
        { name: 'Zapatillas Deportivas', description: 'Zapatillas deportivas cómodas y modernas para todo tipo de actividad.', price: 4000, stock: 30, imgUrl: 'https://example.com/images/zapatillas-deportivas.jpg' },
        { name: 'Sudadera con Capucha', description: 'Sudadera con capucha de algodón, perfecta para los días fríos.', price: 3500, stock: 70, imgUrl: 'https://example.com/images/sudadera-capucha.jpg' },
        { name: 'Gorra Deportiva', description: 'Gorra deportiva para protegerse del sol durante actividades al aire libre.', price: 1200, stock: 150, imgUrl: 'https://example.com/images/gorra-deportiva.jpg' },
        { name: 'Chaqueta de Cuero', description: 'Chaqueta de cuero elegante, ideal para ocasiones formales.', price: 8000, stock: 25, imgUrl: 'https://example.com/images/chaqueta-cuero.jpg' },
        { name: 'Reloj Inteligente', description: 'Reloj inteligente con múltiples funciones para el seguimiento de actividades físicas.', price: 10000, stock: 15, imgUrl: 'https://example.com/images/reloj-inteligente.jpg' },
    ];

    try {
        // First, ensure all necessary tables exist in the correct order
        await createProductsTable(); // Products table needs to exist before order_items for FK
        await createOrdersTable();
        await createOrderItemsTable(); // This depends on both products and orders existing

        // Clear existing data from all tables (optional for seeds, but good for clean runs)
        // Order of deletion matters due to foreign keys
        await query('DELETE FROM order_items');
        await query('DELETE FROM orders');
        await query('DELETE FROM products');
        console.log('Existing data cleared from products, orders, and order_items.');

        // Insert each product into the database with the new imgUrl
        for (let product of products) {
            const queryText = 'INSERT INTO products (name, description, price, stock, imgUrl) VALUES ($1, $2, $3, $4, $5)';
            await query(queryText, [product.name, product.description, product.price, product.stock, product.imgUrl]);
        }

        console.log('Products inserted correctly with imgUrl.');

        // No need to insert sample orders/order_items here, as they are dynamic via the controller
        // This seed focuses on setting up the schema and initial product data.

    } catch (error) {
        console.error('Error during seeding process:', error);
    }
};

// Execute the seed
seedProducts();