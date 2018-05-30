'use strict';
const chai = require('chai');
const chaiHttp = require('chai-http');
const { app, runServer, closeServer } = require('../server');
const { DATABASE_URL } = require('../config');
global.TEST_DATABASE_URL = "mongodb://tgray6:sagesage1@ds239940.mlab.com:39940/imp4gif-test";

const expect = chai.expect;
const should = chai.should;
chai.use(chaiHttp);



describe('Items Endpoint', function() {

	before(function() {
		return runServer(TEST_DATABASE_URL);
	});

	after(function() {
		return closeServer();
	});

	it('should 200 on GET requests', function() {
    	return chai
    		.request(app)
      		.get('/items')
       		.then(function(res) {
        		expect(res).to.have.status(200);
        		expect(res.body).to.be.an('object');
       		});
    });
});