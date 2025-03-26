const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/', productController.getAllProducts);
router.post('/create-product', productController.createProduct);
router.post('/refund-products', productController.refundProducts);

module.exports = router;
