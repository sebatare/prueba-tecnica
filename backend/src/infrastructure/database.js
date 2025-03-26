require('dotenv').config();  

const { Pool } = require('pg');

const pool = new Pool({
    user: process.env.DB_USER,       
    host: process.env.DB_HOST,       
    database: process.env.DB_NAME,   
    password: process.env.DB_PASSWORD,   
    port: process.env.DB_PORT,           
});

pool.connect()
    .then(() => console.log('Conectado a la base de datos'))
    .catch(err => console.error('Error al conectar a la base de datos:', err));

module.exports = {
    query: (text, params) => pool.query(text, params),  // Exportando la función query del Pool
};
