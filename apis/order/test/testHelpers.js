var co = require('co');

var app = require('../');
module.exports.request = require('supertest').agent(app.listen());

var orders = require('../orderRoutes.js').orders;
module.exports.orders = orders;

module.exports.removeAll = function(){
	co(function *(){
		yield orders.remove({});
	});
};

module.exports.test_order = { 
	orderId: '123456789', 
	ordered : new Date("2015-01-01"), 
	userId : "987654321" 
};