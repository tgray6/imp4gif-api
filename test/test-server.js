'use strict';
global.TEST_DATABASE_URL = "mongodb://tgray6:sagesage1@ds239940.mlab.com:39940/imp4gif-test";
const chai = require('chai');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');

const { app, runServer, closeServer } = require('../server');
const { User } = require('../models');
const { JWT_SECRET } = require('../config');


const expect = chai.expect;
const should = chai.should;
chai.use(chaiHttp);



describe('Protected endpoint', function() {
  const username = 'testUser';
  const password = 'testPassword';
  const nickname = 'testNick';


  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {
    return User.hashPassword(password).then(password =>
      User.create({
        username,
        password,
        nickname
      })
    );
  });

  afterEach(function() {
    return User.remove({});
  });

  describe('/items', function() {
    it('Should reject requests with no credentials', function() {
      return chai
        .request(app)
        .get('/items')
        .then(res => {
          expect(res).to.have.status(401);
        })
    });

    it('Should reject requests with an invalid token', function() {
      const token = jwt.sign(
        {
          username,
          nickname
        },
        'wrongSecret',
        {
          algorithm: 'HS256',
          expiresIn: '7d'
        }
      );

      return chai
        .request(app)
        .get('/items')
        .set('Authorization', `Bearer ${token}`)
        .then(res =>{
          expect(res).to.have.status(401);
        })
    });
    it('Should reject requests with an expired token', function() {
      const token = jwt.sign(
        {
          user: {
            username,
            nickname
          },
          exp: Math.floor(Date.now() / 1000) - 10 // Expired ten seconds ago
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username
        }
      );

      return chai
        .request(app)
        .get('/items')
        .set('authorization', `Bearer ${token}`)
        .then(res =>{
          expect(res).to.have.status(401);
        })
    });
    it('Should send protected data', function() {
      const token = jwt.sign(
        {
          user: {
            username,
            nickname
          }
        },
        JWT_SECRET,
        {
          algorithm: 'HS256',
          subject: username,
          expiresIn: '7d'
        }
      );

      return chai
        .request(app)
        .get('/items')
        .set('authorization', `Bearer ${token}`)
        .then(res => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
        });
    });
  });
});
