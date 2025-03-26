const db = require('../infrastructure/database');

exports.getAllProducts = async () => {
    try {
        const res = await db.query('SELECT * FROM products');
        return res.rows;
    } catch (err) {
        throw new Error('Error al obtener productos: ' + err.message);
    }
};

exports.createProduct = async (name, price) => {
    try {
        const res = await db.query('INSERT INTO products (name, description, price, stock) VALUES ($1, $2, $3, $4) RETURNING *', [name, description, price, stock]);
        return res.rows[0];
    } catch (err) {
        throw new Error('Error al crear producto: ' + err.message);
    }
};
