const productService = require('../services/productService');
const db = require('../infrastructure/database');  // Usamos el Pool desde la infraestructura

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los productos", error: error.message });
    }
};

// Crear un producto
exports.createProduct = async (req, res) => {
    const { name, price } = req.body;
    try {
        const product = await productService.createProduct(name, price);
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al crear el producto: ' + error.message });
    }
};

// Función de reembolso de productos
exports.refundProducts = async (req, res) => {
    const { session_id } = req.body;

    if (!session_id) {
        return res.status(400).json({ message: 'El sessionId es obligatorio' });
    }

    try {
        // Obtener el order_id usando el sessionId
        const orderResult = await db.query('SELECT id FROM orders WHERE stripe_session_id = $1', [session_id]);
        const order = orderResult.rows[0];

        if (!order) {
            return res.status(404).json({ message: 'Orden no encontrada' });
        }

        // Obtener los productos relacionados con el session_id
        const productsResult = await db.query(`
        SELECT p.id, oi.quantity, p.name, oi.price
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = $1
      `, [order.id]);

        // Devolver los productos
        const products = productsResult.rows.map(product => ({
            id: product.id,     // id del producto
            quantity: product.quantity,  // cantidad del producto
            name: product.name, // nombre del producto
            price: product.price, // precio del producto
        }));

        res.status(200).json(products);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

