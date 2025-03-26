const stripeService = require('../infrastructure/stripe');

exports.createPaymentIntent = async (amount) => {
    try {
        const paymentIntent = await stripeService.createStripePaymentIntent(amount);
        return paymentIntent;
    } catch (error) {
        throw new Error('Error en el servicio de pagos: ' + error.message);
    }
};
