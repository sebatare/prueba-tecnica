const dotenv = require('dotenv'); 
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Función para crear un cliente de Stripe
const createStripePaymentIntent = async (amount) => {
    try {
        // Validación mejorada del amount
        if (!amount || isNaN(amount) || amount <= 0) {
            throw new Error('Invalid amount. It should be a positive number.');
        }

        // Convierte el monto a centavos y lo trunca
        const integerAmount = Math.floor(parseFloat(amount) * 100);

        const paymentIntent = await stripe.paymentIntents.create({
            amount: integerAmount,
            currency: 'usd',
        });

        return paymentIntent;
    } catch (error) {
        console.error('Error creating PaymentIntent:', error);
        throw error;
    }
};


// Exportar la función
module.exports = { createStripePaymentIntent };
