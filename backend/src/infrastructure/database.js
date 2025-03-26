const { Pool } = require('pg');  // Importa Pool en lugar de Client

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'prueba-tecnica',
    password: 'admin',
    port: 5432,  // O el puerto que estés utilizando
});

pool.connect()
    .then(() => console.log('Conectado a la base de datos'))
    .catch(err => console.error('Error al conectar a la base de datos:', err));

module.exports = {
    query: (text, params) => pool.query(text, params),  // Exportando la función query del Pool
};
