const db = require('../infrastructure/database');

exports.createOrder = async (req, res) => {
    const { userId, products } = req.body;

    try {
        // Paso 1: Calcular el monto total de la orden en centavos
        const totalAmount = products.reduce((acc, product) => acc + (product.price * product.quantity), 0);

        // Paso 2: Crear la orden en la base de datos
        const order = await orderService.createOrder(userId, totalAmount);

        // Paso 3: Crear los detalles de la orden en order_items
        for (const product of products) {
            await orderService.addOrderItem(order.id, product.id, product.quantity, product.price);
        }

        // Paso 4: Crear la sesión de pago en Stripe
        const session = await paymentService.createCheckoutSession(order.id, totalAmount);

        // Responder con la información de la sesión de pago
        res.json({
            sessionId: session.id,
            url: session.url // URL de Stripe para completar el pago
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la orden o la sesión de pago: ' + error.message });
    }
};


exports.getOrderById = async (orderId) => {
    try {
        const result = await db.query('SELECT * FROM orders WHERE id = $1', [orderId]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Error al obtener la orden: ' + error.message);
    }
};
