var co = require("co");
var should = require("should");
var helpers = require('./testHelpers.js');
var addresses = helpers.addresses;
var request = helpers.request;

describe('Address API', function(){

	var test_address = {};

	beforeEach(function (done) {
		test_address = helpers.test_addresses;
		helpers.removeAll(done);
	});

	afterEach(function (done) {
		helpers.removeAll(done);
	});

	it('creates a new address', function(done){
		// Post
		request
			.post('/address')
			.send(test_address)
			.expect('location', /^\/address\/[0-9a-fA-F]{24}$/) // Mongo Object Id /address/234234523562512512
			.expect(201)
			.end(function () {
				co(function *() {
					var addressFromDb = yield addresses.findOne({ userId : test_user.userId });
					addressFromDb.city.should.equal(test_address.city);
				}).then(done, done);
			});				
	});

	it('returns validation error if user is not present', function(done){
		delete test_address.userId;
		
		request
			.post('/address')
			.send(u)
			.expect('ValidationError', "User is required")
			.expect(200, done);
	});
	
	it('deletes an existing address', function(done){
		co(function *() {
			var address = yield addresses.insert(test_address);
			var addressUrl = '/address/' + address._id;

			request
				.del(addressUrl)
				.expect(200, done);
		});
	});
	
	it('returns an existing address', function (done) {
		co(function *() {
			
			var address = yield addresses.insert(test_user);
			var addressUrl = '/address/' + address._id;

			// Get
			request
				.get(addressUrl)
	      		.set('Accept', 'application/json')
	      		.expect('Content-Type', /json/)
	      		.expect(/987654321/)
	      		.expect(/Bandung/)
				.expect(/Indonesia/)
	      		.expect(200, done);
	    });
	});
	
	it('updates an existing address', function(done){
		co(function *() {
			var address = yield addresses.insert(test_address);
			var addressUrl = '/address/' + address._id;

			request
				.put(addressUrl)
				.send({name: 'Marcus v2', City: 'Bandung Updated'})
				.expect('location', addressUrl)
				.expect(204)
				.end(function () {
					co(function *() {
						var addressFromDb = yield users.findOne({ userId : test_user.userId });
						addressFromDb.city.should.equal('Bandung Updated');
					}).then(done, done);
				});
		});
	});
});