// src/app.js
const express = require('express');
const { createStripePaymentIntent } = require('./infrastructure/stripe');
const { query } = require('./infrastructure/database');
const dotenv = require('dotenv');

// Cargar las variables de entorno antes de usar cualquier configuración
dotenv.config();

// Ahora puedes acceder a las variables de entorno, como la clave de Stripe
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
const port = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta para solicitar un reembolso
app.post('/refund', async (req, res) => {
    const { paymentIntentId, amount } = req.body;  // paymentIntentId de Stripe y cantidad para el reembolso

    try {
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? amount * 100 : undefined, // Reembolso parcial si se especifica la cantidad
        });

        res.json({ refund, message: 'Reembolso procesado exitosamente' });
    } catch (error) {
        console.error('Error al procesar el reembolso:', error);
        res.status(500).send('Error al procesar el reembolso');
    }
});

// Ruta para obtener la lista de productos
app.get('/products', async (req, res) => {
    try {
        const result = await query('SELECT * FROM products');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error al obtener productos');
    }
});

// POST CREAR-PAGO-INTENTO
app.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;  // Cantidad en dólares


    try {

        const paymentIntent = await createStripePaymentIntent(amount);

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Error al crear el PaymentIntent:', error);
        res.status(500).send('Error al crear el PaymentIntent');
    }
});

// POST CREAR-ORDEN
app.post('/create-order', async (req, res) => {
    const { totalAmount, status } = req.body;  // Total de la orden y estado

    try {
        const result = await query('INSERT INTO orders (total_amount, status) VALUES ($1, $2) RETURNING id', [totalAmount, status]);
        const orderId = result.rows[0].id;
        res.json({ orderId, message: 'Orden registrada con éxito' });
    } catch (error) {
        console.error('Error al registrar la orden:', error);
        res.status(500).send('Error al registrar la orden');
    }
});

app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
