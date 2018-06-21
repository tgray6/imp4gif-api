'use strict';
global.TEST_DATABASE_URL = "mongodb://tgray6:sagesage1@ds239940.mlab.com:39940/imp4gif-test";
const chai = require('chai');
const chaiHttp = require('chai-http');

const {app, runServer, closeServer} = require('../server');
const {User} = require('../models');


const expect = chai.expect;

chai.use(chaiHttp);

describe('/users', function() {
  const username = 'exampleUser';
  const password = 'examplePass';
  const nickname = 'Example';
  const usernameB = 'exampleUserB';
  const passwordB = 'examplePassB';
  const nicknameB = 'ExampleB';


  before(function() {
    return runServer(TEST_DATABASE_URL);
  });

  after(function() {
    return closeServer();
  });

  beforeEach(function() {});

  afterEach(function() {
    return User.remove({});
  });

  describe('/users', function() {
    describe('POST', function() {
      it('Should reject users with missing username', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            password,
            nickname
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('username');
          })
      });

      it('Should reject users with missing password', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            nickname
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal('Missing field');
            expect(res.body.location).to.equal('password');
          })
      });
      
      it('Should reject users with non-string username', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            username: 1234,
            password,
            nickname
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('username');
          }
          )
      });

      it('Should reject users with non-string password', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password: 1234,
            nickname
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('password');
          })
      });

      it('Should reject users with non-string nickname', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password,
            nickname: 1234
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Incorrect field type: expected string'
            );
            expect(res.body.location).to.equal('nickname');
          }
          )
      });

      it('Should reject users with empty username', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            username: '',
            password,
            nickname
          })
          .then(res =>{
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 5 characters long'
            );
            expect(res.body.location).to.equal('username');
          }
          )
      });

      it('Should reject users with empty nickname', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password,
            nickname:""
          })
          .then(res =>{
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 4 characters long'
            );
            expect(res.body.location).to.equal('nickname');
          }
          )
      });

      it('Should reject users with password less than ten characters', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password: '123456789',
            nickname
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at least 10 characters long'
            );
            expect(res.body.location).to.equal('password');
          })
      });

      it('Should reject users with password greater than 72 characters', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password: new Array(73).fill('a').join(''),
            nickname
          })
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Must be at most 72 characters long'
            );
            expect(res.body.location).to.equal('password');
          }
          )
      });

      it('Should reject users with duplicate username', function() {
        // Create an initial user
        return User.create({
          username,
          password,
          nickname
        })
          .then(() =>
            // Try to create a second user with the same username
            chai.request(app).post('/users').send({
              username,
              password,
              nickname
            })
          )
          .then(res => {
            expect(res).to.have.status(422);
            expect(res.body.reason).to.equal('ValidationError');
            expect(res.body.message).to.equal(
              'Username already taken'
            );
            expect(res.body.location).to.equal('username');
          }
          )
      });

      // it('Should reject users with duplicate nickname', function() {
      //   // Create an initial user
      //   return User.create({
      //     username,
      //     password,
      //     nickname
      //   })
      //     .then(() =>
      //       // Try to create a second user with the same nickname
      //       chai.request(app).post('/users').send({
      //         usernameB,
      //         password,
      //         nickname
      //       })
      //     )
      //     .then(res => {
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal(
      //         'Nickname already taken'
      //       );
      //       expect(res.body.location).to.equal('nickname');
      //     }
      //     )
      // });

      it('Should create a new user', function() {
        return chai
          .request(app)
          .post('/users')
          .send({
            username,
            password,
            nickname
          })
          .then(res => {
            expect(res).to.have.status(201);
            expect(res.body).to.be.an('object');
            expect(res.body).to.have.keys(
              'username',
              'nickname',
              "userID"
            );
            expect(res.body.username).to.equal(username);
            expect(res.body.nickname).to.equal(nickname);
            return User.findOne({
              username
            });
          })
          .then(user => {
            expect(user).to.not.be.null;
            expect(user.nickname).to.equal(nickname);
            return user.validatePassword(password);
          })
          .then(passwordIsCorrect => {
            expect(passwordIsCorrect).to.be.true;
          });
      });
    });
  });
});




//FOR DISCUSSION

      // it('Should reject users with missing password', function() {
      //   return chai
      //     .request(app)
      //     .post('/users')
      //     .send({
      //       username,
      //       nickname
      //     })
      //     .then(() =>
      //       expect.fail(null, null, 'Request should not succeed')
      //     )
      //     .catch(err => {
      //       if (err instanceof chai.AssertionError) {
      //         throw err;
      //       }

      //       const res = err.response;
      //       expect(res).to.have.status(422);
      //       expect(res.body.reason).to.equal('ValidationError');
      //       expect(res.body.message).to.equal('Missing field');
      //       expect(res.body.location).to.equal('password');
      //     });
      // });



