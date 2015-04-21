var co  = require('co');
var helpers = require('./testHelpers.js');
var users = helpers.users;
var request = helpers.request;

describe('GET /user/:id ', function(){

	var test_user = {};

	beforeEach(function (done) {
		test_user = helpers.test_user;
		helpers.removeAll(done);
	});

	afterEach(function (done) {
		helpers.removeAll(done);
	});

	it('returns JSON for existing user', function (done) {
		co(function *() {
			// Insert test user in database
			var user = yield users.insert(test_user);
			var userUrl = '/user/' + user._id;

			// Get
			request
				.get(userUrl)
	      		.set('Accept', 'application/json')
	      		.expect('Content-Type', /json/)
	      		.expect(/Marcus/)
	      		.expect(/Bandung, Indonesia/)
	      		.expect(200, done);
	    })();
	});
});