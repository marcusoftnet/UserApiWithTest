/// <reference path="../../../typings/mocha/mocha.d.ts"/>
var co = require("co");
var should = require("should");
var helpers = require('./testHelpers.js');
var orders = helpers.orders;
var request = helpers.request;

describe('Order API', function(){

	var test_order = {};

	beforeEach(function (done) {
		test_order = helpers.test_order;
		helpers.removeAll();
		done();
	});

	afterEach(function (done) {
		helpers.removeAll();
		done();		
	});

	it('creates a new order for complete posted data', function(done){
		request
			.post('/')
			.send(test_order)
			.expect('location', /^\/order\/[0-9a-fA-F]{24}$/) // /order/234234523562512512
			.expect(201)
			.end(function () {
				co(function *() {
					var orderFromDb = yield orders.findOne({ orderId : test_order.orderId });
					orderFromDb.orderId.should.equal(test_order.orderId);
				}).then(done, done);
			});				
	});

	it('returns validation error if user is not present', function(done){
		var orderToFail = {};

		request
			.post('/')
			.send(orderToFail)
			.expect('ValidationError', "User reference is required")
			.expect(200, done);
	});
	
	it('returns an existing order', function (done) {
		co(function *() {
			var order = yield orders.insert(test_order);
			var orderURI = '/' + order.orderId;

			// Get
			request
				.get(orderURI)
	      		.set('Accept', 'application/json')
	      		.expect('Content-Type', /json/)
	      		.expect(/123456789/)
	      		.expect(/987654321/)
	      		.expect(200, done);
	    });
	});
	
	it('returns an existing order by user id', function (done) {
		co(function *() {
			var order = yield orders.insert(test_order);
			var orderByUserURI = '/user/' + order.userId;

			// Get
			request
				.get(orderByUserURI)
	      		.set('Accept', 'application/json')
	      		.expect('Content-Type', /json/)
	      		.expect(/123456789/)
	      		.expect(/987654321/)
	      		.expect(200, done);
	    });
	});
	
	it('updates an existing order', function(done){
		co(function *() {
			var order = yield orders.insert(test_order);
			var orderURI = '/' + order.orderId;
			
			var updatedOrder = test_order;
			updatedOrder.userId = 111111111;

			request
				.put(orderURI)
				.send(updatedOrder)
				.expect('location', '/' + order.orderId)
				.expect(204, done);
		});
	});
});