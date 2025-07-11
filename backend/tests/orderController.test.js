jest.mock('../src/infrastructure/database'); // Mockeamos la base de datos
jest.mock('stripe'); // Mockeamos Stripe

const db = require('../src/infrastructure/database');
const stripe = require('stripe');

describe('POST /create-order', () => {
    it('should create an order and return a sessionId and url', async () => {
        const products = [
            { id: 1, price: 1000, quantity: 2 },
            { id: 2, price: 500, quantity: 1 }
        ];

        // Simula la respuesta de la base de datos
        db.query.mockResolvedValueOnce({ rows: [{ id: 1, total_amount: 2500 }] });
        db.query.mockResolvedValueOnce({ rows: [] });

        // Simula la creación de la sesión de pago en Stripe
        stripe.checkout.sessions.create.mockResolvedValueOnce({
            id: 'session_123',
            url: 'http://localhost:5173/success?session_id=session_123'
        });

        const response = await request(app).post('/create-order').send({ products });

        // Verificamos que la respuesta sea la esperada
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('sessionId', 'session_123');
        expect(response.body).toHaveProperty('url', 'http://localhost:5173/success?session_id=session_123');

        // Verificamos que se haya llamado a la base de datos y a Stripe
        expect(db.query).toHaveBeenCalledTimes(2);
        expect(stripe.checkout.sessions.create).toHaveBeenCalledTimes(1);
    });

    it('should return an error if the order creation fails', async () => {
        const products = [
            { id: 1, price: 1000, quantity: 2 },
            { id: 2, price: 500, quantity: 1 }
        ];

        // Simula un error en la base de datos
        db.query.mockRejectedValueOnce(new Error('Database error'));

        const response = await request(app).post('/create-order').send({ products });

        // Verificamos que la respuesta sea la esperada
        expect(response.status).toBe(500);
        expect(response.body.message).toBe('Error al crear la orden: Database error');
    });
});
