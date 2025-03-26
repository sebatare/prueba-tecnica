const orderService = require('../services/orderService');
const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const db = require('../infrastructure/database');  // Usamos el Pool desde la infraestructura
const Order = require('../models/orderModel');


const getOrderBySessionId = async (session_id) => {
    try {
        const result = await db.query('SELECT * FROM orders WHERE stripe_session_id = $1', [session_id]);
        return result.rows[0];  // Retorna la primera fila si existe
    } catch (error) {
        throw new Error('Error al obtener la orden: ' + error.message);
    }
};

// Función para obtener los productos de la orden
const getOrderItems = async (orderId) => {
    try {
        const result = await db.query('SELECT * FROM order_items WHERE order_id = $1', [orderId]);
        return result.rows;  // Retorna todos los productos de la orden
    } catch (error) {
        throw new Error('Error al obtener los productos de la orden: ' + error.message);
    }
};


// Crear la orden y la sesión de pago
exports.createOrder = async (req, res) => {
    const { products } = req.body;

    try {
        // Paso 1: Calcular el monto total de la orden en centavos
        const totalAmount = products.reduce((acc, product) => acc + (product.price * product.quantity), 0);

        // Paso 2: Crear la orden en la base de datos
        const result = await db.query(
            'INSERT INTO orders (total_amount, status) VALUES ($1, $2) RETURNING *',
            [totalAmount, 'pending']
        );

        const order = result.rows[0]; // Obtener la orden creada

        // Paso 3: Insertar los productos en la tabla order_items
        for (const product of products) {
            await db.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [order.id, product.id, product.quantity, product.price]
            );
        }

        // Paso 4: Crear la sesión de pago en Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: products.map(product => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `Producto ${product.id}`,
                    },
                    unit_amount: product.price, // Precio en centavos
                },
                quantity: product.quantity,
            })),
            mode: 'payment',
            success_url: `http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:5173/cancel`,
        });

        // Paso 5: Actualizar la orden con el session_id de Stripe
        await db.query(
            'UPDATE orders SET stripe_session_id = $1 WHERE id = $2',
            [session.id, order.id]
        );

        // Responder con la URL de Stripe para completar el pago
        res.json({ sessionId: session.id, url: session.url });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear la orden o la sesión de pago: ' + error.message });
    }
};

// Función para reembolsar la orden

exports.refundOrder = async (req, res) => {
    try {
        const { session_id } = req.body;

        if (!session_id) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        // Obtener la sesión de pago en Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (!session.payment_intent) {
            return res.status(400).json({ message: "No payment intent found" });
        }

        // Crear el reembolso
        const refund = await stripe.refunds.create({
            payment_intent: session.payment_intent,
        });

        // Actualizar el estado de la orden en la base de datos
        const updateQuery = `UPDATE orders SET status = 'refunded' WHERE stripe_session_id = $1 RETURNING *`;
        const result = await db.query(updateQuery, [session_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "Refund processed successfully", refund, order: result.rows[0] });
    } catch (error) {
        console.error("Error processing refund:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};


exports.updateOrderStatus = async (req, res) => {
    try {
        const { session_id } = req.body;

        if (!session_id) {
            return res.status(400).json({ message: "Session ID is required" });
        }

        // Consultamos el estado del pago en Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== 'paid') {
            return res.status(400).json({ message: "Payment not completed" });
        }

        // Actualizamos la orden en la base de datos
        const updateQuery = 'UPDATE orders SET status = $1 WHERE stripe_session_id = $2 RETURNING *';
        const result = await db.query(updateQuery, ['paid', session_id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "Order updated successfully", order: result.rows[0] });
    } catch (error) {
        console.error("Error updating order:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// Obtener detalles del reembolso
exports.getRefundDetails = async (req, res) => {
    try {
        const { session_id } = req.body;

        if (!session_id) {
            return res.status(400).json({ message: 'Session ID is required' });
        }

        // Obtener la sesión de pago de Stripe usando el session_id
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (!session.payment_intent) {
            return res.status(400).json({ message: 'No payment intent found' });
        }

        // Obtener el reembolso asociado al payment_intent
        const refunds = await stripe.refunds.list({ payment_intent: session.payment_intent });

        if (refunds.data.length === 0) {
            return res.status(404).json({ message: 'No refunds found for this payment intent' });
        }

        // Solo devolvemos el primer reembolso (en caso de que haya más de uno)
        const refund = refunds.data[0];

        res.json({ refund });
    } catch (error) {
        console.error("Error fetching refund details:", error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.partialRefund = async (req, res) => {
    const { session_id, product_ids, subtotal } = req.body;
    console.log(req.body);

    if (!session_id || !product_ids || !subtotal) {
        return res.status(400).json({ message: "Datos insuficientes para procesar el reembolso parcial." });
    }

    try {
        // Recuperamos la sesión de pago de Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        // Verificar que la sesión tiene un payment intent
        if (!session.payment_intent) {
            return res.status(400).json({ message: "No se encontró el pago asociado a esta sesión." });
        }

        // Crear el reembolso parcial
        const refund = await stripe.refunds.create({
            payment_intent: session.payment_intent,
            amount: Math.round(parseFloat(subtotal) * 100), // Convertir a centavos
        });

        // Aquí puedes agregar la lógica de actualización de la base de datos si es necesario

        return res.json({ message: "Reembolso parcial procesado con éxito", refund });
    } catch (error) {
        console.error("Error al procesar el reembolso parcial:", error);
        return res.status(500).json({ message: "Error interno al procesar el reembolso parcial." });
    }
};