// src/seed.js
const { query } = require('./infrastructure/database');

// Función para insertar productos en la base de datos
const seedProducts = async () => {
    // Array con los productos que se van a insertar
    const products = [
        { name: 'Camiseta Básica', description: 'Camiseta de algodón de alta calidad, disponible en varios colores.', price: 1500, stock: 100 },
        { name: 'Jeans Ajustados', description: 'Jeans de mezclilla ajustados para un ajuste cómodo.', price: 2500, stock: 50 },
        { name: 'Zapatillas Deportivas', description: 'Zapatillas deportivas cómodas y modernas para todo tipo de actividad.', price: 4000, stock: 30 },
        { name: 'Sudadera con Capucha', description: 'Sudadera con capucha de algodón, perfecta para los días fríos.', price: 3500, stock: 70 },
        { name: 'Gorra Deportiva', description: 'Gorra deportiva para protegerse del sol durante actividades al aire libre.', price: 1200, stock: 150 },
        { name: 'Chaqueta de Cuero', description: 'Chaqueta de cuero elegante, ideal para ocasiones formales.', price: 8000, stock: 25 },
        { name: 'Reloj Inteligente', description: 'Reloj inteligente con múltiples funciones para el seguimiento de actividades físicas.', price: 10000, stock: 15 },
    ];

    try {
        // Limpiar la tabla de productos antes de insertar
        await query('DELETE FROM products');

        // Insertar cada producto en la base de datos
        for (let product of products) {
            const queryText = 'INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4)';
            await query(queryText, [product.name, product.description, product.price, product.stock]);
        }

        console.log('Productos insertados correctamente.');
    } catch (error) {
        console.error('Error al insertar productos:', error);
    }
};

// Ejecutar la semilla
seedProducts();
