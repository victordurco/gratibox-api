import '../src/setup.js';
import supertest from 'supertest';
import app from '../src/app.js';
import connection from '../src/database.js';

afterAll(async () => {
  connection.end();
});

describe('GET /states', () => {
  test('returns 200 when requested', async () => {
    const result = await supertest(app).get('/states');
    expect(result.status).toEqual(200);
  });
});
