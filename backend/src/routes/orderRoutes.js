const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

//router.post('/create-order', orderController.createOrder);
router.post('/create-order', orderController.createOrder);
router.put('/update-order-status', orderController.updateOrderStatus);
router.post('/refund-order', orderController.refundOrder);
router.post('/refund-details', orderController.getRefundDetails);
router.post('/partial-refund', orderController.partialRefund);
module.exports = router;
