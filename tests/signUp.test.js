/* eslint-disable no-undef */
const request = require('supertest');
const { app } = require('../src/app');
const { build } = require('../src/config/dbBuild');
const { sequelize } = require('../src/config/connection');

beforeEach(() => build());

describe('sign up tests', () => {
  test('success sign up', (done) => {
    request(app)
      .post('/api/signup')
      .send({
        name: 'test2testssssssssss',
        email: 't@gmail.com',
        password: 'test123',
        confirmPassword: 'test123',
      })
      .expect(201)
      .expect('Content-Type', /json/)
      .expect((response) => expect(response.header['set-cookie'][0].split('=')[0]).toBe('token'))
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('signed up successfully');
        return done();
      });
  });

  test('sign up with validation error', (done) => {
    request(app)
      .post('/api/signup')
      .send({
        name: 'te',
        email: 'test12345678@gmail.com',
        password: 'test123',
        confirmPassword: 'test123',
      })
      .expect(400)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('Bad Request');
        return done();
      });
  });

  test('sign up with used email', (done) => {
    request(app)
      .post('/api/signup')
      .send({
        name: 'test2test',
        email: 'test1@gmail.com',
        password: 'test123',
        confirmPassword: 'test123',
      })
      .expect(409)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('This email is already connected to an account');
        return done();
      });
  });
});

afterAll(() => sequelize.close());
