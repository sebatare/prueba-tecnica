const orderModel = require('../models/orderModel');

exports.createOrder = async (totalAmount, status) => {
    try {
        const order = await orderModel.createOrder(totalAmount, status);
        return order;
    } catch (error) {
        throw new Error('Error en el servicio de órdenes: ' + error.message);
    }
};

exports.getOrderById = async (orderId) => {
    try {
        const order = await orderModel.getOrderById(orderId);
        return order;
    } catch (error) {
        throw new Error('Error al obtener la orden: ' + error.message);
    }
};
