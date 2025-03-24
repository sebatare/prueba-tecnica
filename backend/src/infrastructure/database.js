// src/infrastructure/database.js
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Configuración de la base de datos
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT || 5432, // Puerto por defecto de PostgreSQL
});

// Función para ejecutar una consulta
const query = (text, params) => {
    return pool.query(text, params);
};

// Exportar la conexión
module.exports = { pool, query };
