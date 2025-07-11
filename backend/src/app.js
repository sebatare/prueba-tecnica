require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});
