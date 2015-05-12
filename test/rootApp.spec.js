/// <reference path="../typings/mocha/mocha.d.ts"/>
var supertest = require('supertest');
var app = require("../");
var config = require('../config')();
var request = supertest.agent(app.listen());

describe('Our application', function () {
    it('has a simple root application', function (done) {
        request
            .get('/')
            .expect(200)
            .expect(/Find the APIs under/)
            .end(done);
    });
    it('an user api to which we can post', function (done) {
         request
			.post('/users')
			.send({ name: 'Marcus', city : 'Bandung, Indonesia'})
            .expect(201)
			.expect('location', /^\/users\/[0-9a-fA-F]{24}$/)
			.end(done);
    });
    it('and an address api to which we can post', function (done) {
        var test_address = { 
        	userId: 987654321, 
        	street : 'Jalan Jawa No 20', 
        	city : 'Bandung', 
        	country: 'Indonesia'
        };
        
         request
			.post('/address')
			.send(test_address)
            .expect(201)
			.expect('location', /^\/address\/[0-9a-fA-F]{24}$/)
			.end(done);
    });
    it('and an order api, but that requires login', function (done) {
    	var test_order = { 
        	orderId: '123456789', 
        	ordered : new Date("2015-01-01"), 
        	userId : "987654321" 
        };

        request
			.post('/orders')
			.auth(config.adminUser.name, config.adminUser.pass)
			.send(test_order)
			.expect('location', /^\/orders\/[0-9]{9}$/) 
			.expect(201)
			.end(done);
    });
    it('exactly - the order API require login. Not logging in will give you access', function (done) {
    	var test_order = { };

        request
			.post('/orders')
			.send(test_order)
			.expect(401)
			.end(done);
    });
});