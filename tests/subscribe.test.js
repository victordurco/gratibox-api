import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';
import { validSessionFactory } from '../factories/session.factory.js';
import { 
    validSubscribeBodyFactory, 
    invalidSubscribeBodyFactory,
    userWithPlanSubscribeBodyFactory,
 } from '../factories/subscription.factory.js';


afterAll(async () => {
    await connection.query(`DELETE FROM addresses;`);
    await connection.query(`DELETE FROM weekly_plan;`);
    await connection.query(`DELETE FROM monthly_plan;`);
    await connection.query(`DELETE FROM sessions;`);
    await connection.query(`DELETE FROM users;`)
    connection.end();
});

describe('post /subscribe', () => {
    test('returns 200 with valid body and token', async () => {
        const user = await validSessionFactory();
        const validBody = await validSubscribeBodyFactory();

        const result = await supertest(app).post('/subscribe')
            .send(validBody)
            .set('Authorization', `Bearer ${user.token}`);
        expect(result.status).toEqual(201);
    });

    test('returns 400 with valid body and token', async () => {
        const user = await validSessionFactory();
        const invalidBody = await invalidSubscribeBodyFactory();

        const result = await supertest(app).post('/subscribe')
            .send(invalidBody)
            .set('Authorization', `Bearer ${user.token}`);
        expect(result.status).toEqual(400);
    });

    test('returns 409 with user that already have a subscription', async () => {
        const user = await validSessionFactory();
        const alreadyHavePlanBody = await userWithPlanSubscribeBodyFactory();

        const result = await supertest(app).post('/subscribe')
            .send(alreadyHavePlanBody)
            .set('Authorization', `Bearer ${user.token}`);
        expect(result.status).toEqual(409);
    });
});

