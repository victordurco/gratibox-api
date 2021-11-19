import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';
import {
  validNewUserFactory,
  invalidNewUserFactory,
  existingUserFactory,
} from '../factories/user.factory';

afterAll(async () => {
  await connection.query('DELETE FROM users;');
  connection.end();
});

describe('POST /sign-up', () => {
  test('returns 201 with valid new user data', async () => {
    const validNewUser = validNewUserFactory();
    const result = await supertest(app).post('/sign-up').send(validNewUser);
    expect(result.status).toEqual(201);
  });

  test('returns 400 with invalid new user data', async () => {
    const invalidNewUser = invalidNewUserFactory();
    const result = await supertest(app).post('/sign-up').send(invalidNewUser);
    expect(result.status).toEqual(400);
  });

  test('returns 409 with existing email', async () => {
    const existingUser = await existingUserFactory();
    const result = await supertest(app).post('/sign-up').send(existingUser);
    expect(result.status).toEqual(409);
  });
});
