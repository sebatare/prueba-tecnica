const productModel = require('../models/productModel');

exports.getAllProducts = async () => {
    try {
        const products = await productModel.getAllProducts();
        return products;
    } catch (error) {
        throw new Error('Error al obtener los productos: ' + error.message);
    }
};

exports.createProduct = async (name, price) => {
    try {
        const product = await productModel.createProduct(name, price);
        return product;
    } catch (error) {
        throw new Error('Error al crear el producto: ' + error.message);
    }
};
