import request from 'supertest';
import { app } from '../../app';

// test when non existing email supplied

it('test when non exsiting email supplied', async () => {
  return request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(400);
});

//test if password does not match

it('test if password does not match', async () => {
  await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  await request(app)
    .post('/api/users/signin')
    .send({
      email: 'test@test.com',
      password: 'password1',
    })
    .expect(400);
}, 10000);

it('test if user is created and jwt is set in the cookie', async () => {
  const response = await request(app)
    .post('/api/users/signup')
    .send({
      email: 'test@test.com',
      password: 'password',
    })
    .expect(201);

  expect(response.get('Set-Cookie')).toBeDefined();
}, 10000);

// test if user is created and jwt is set in the cookie
