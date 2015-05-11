var co = require('co');

var app = require('../');
module.exports.request = require('supertest').agent(app.listen());
var addresses = app.addresses;
module.exports.addresses = app.addresses;

module.exports.removeAll = function(){
	co(function *(){
		yield addresses.remove({});
	});
};

module.exports.test_address  = { 
	userId: 987654321, 
	street : 'Jalan Jawa No 20', 
	city : 'Bandung', 
	country: 'Indonesia'
};