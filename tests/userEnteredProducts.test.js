/* eslint-disable no-undef */
const request = require('supertest');
const { app } = require('../src/app');
const { build } = require('../src/config/dbBuild');
const { sequelize } = require('../src/config/connection');

beforeEach(() => build());

describe('User entered bids route test', () => {
  test('with token', (done) => {
    request(app)
      .get('/api/user/bids')
      .set('Cookie', [`token=${process.env.TOKEN}`])
      .expect(200)
      .expect('Content-Type', /json/)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.data.length).toBe(2);
        return done();
      });
  });
  test('without token', (done) => {
    request(app)
      .get('/api/user/bids')
      .expect(401)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body.message).toBe('You need to login or sign up');
        return done();
      });
  });
});

afterAll(() => sequelize.close());
