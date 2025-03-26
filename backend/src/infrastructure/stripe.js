const dotenv = require('dotenv');
dotenv.config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.createStripePaymentIntent = async (amount) => {
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount * 100,  // Convertir a centavos
            currency: 'usd',
        });
        return paymentIntent;
    } catch (error) {
        throw new Error('Error al crear el pago con Stripe: ' + error.message);
    }
};
