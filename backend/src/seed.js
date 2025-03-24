// src/seed.js
const { query } = require('./infrastructure/database');

// Función para insertar productos en la base de datos
const seedProducts = async () => {
    // Array con los productos que se van a insertar
    const products = [
        { name: 'Producto 1', price: 100 },
        { name: 'Producto 2', price: 200 },
        { name: 'Producto 3', price: 300 },
    ];

    try {
        // Limpiar la tabla de productos antes de insertar
        await query('DELETE FROM products');

        // Insertar cada producto en la base de datos
        for (let product of products) {
            const queryText = 'INSERT INTO products (name, price) VALUES ($1, $2)';
            await query(queryText, [product.name, product.price]);
        }

        console.log('Productos insertados correctamente.');
    } catch (error) {
        console.error('Error al insertar productos:', error);
    }
};

// Ejecutar la semilla
seedProducts();
