const request = require('supertest');
process.env.NODE_ENV = 'test';
const app = require('../src/app');

describe('Routes', () => {
  test('GET /board returns 200', async () => {
    const res = await request(app).get('/board');
    expect(res.statusCode).toBe(200);
  });

  test('GET /board/post returns 200', async () => {
    const res = await request(app).get('/board/post');
    expect(res.statusCode).toBe(200);
  });

  test('POST /board/post with valid data redirects', async () => {
    const res = await request(app)
      .post('/board/post')
      .type('form')
      .send({
        name: 'Test User',
        email: 'testunique@example.com',
        location: 'Test City',
        bio: 'Test bio',
        title: 'JavaScript',
        type: 'teach',
        description: 'I can teach JS',
        category: 'Technology'
      });
    expect(res.statusCode).toBe(302);
  });

  test('GET /matches returns 200', async () => {
    const res = await request(app).get('/matches');
    expect(res.statusCode).toBe(200);
  });

  test('GET /users/:id returns 200 for existing user', async () => {
    const res = await request(app).get('/users/1');
    expect(res.statusCode).toBe(200);
  });
});
