var co  = require('co');
var helpers = require('./testHelpers.js');
var users = helpers.users;
var request = helpers.request;

describe('PUT to /user', function(){

	var test_user = {};

	beforeEach(function (done) {
		test_user = helpers.test_user;
		helpers.removeAll(done);
	});

	afterEach(function (done) {
		helpers.removeAll(done);
	});

	it('updates an existing user for complete put data', function(done){
		co(function *() {
			// Insert test user in database
			var user = yield users.insert(test_user);
			var userUrl = '/user/' + user._id;

			request
				.put(userUrl)
				.send({name: 'Marcus v2', City: 'Bandung Updated'})
				.expect('location', userUrl)
				.expect(204, done);
		});
	});
});