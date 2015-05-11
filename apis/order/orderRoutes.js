var parse = require("co-body");

var monk = require("monk");
var wrap = require("co-monk");
var db = monk("localhost/ordersAPI");
var orders = wrap(db.get("orders"));
module.exports.orders = orders;

module.exports.add = function * () {
	var postedOrder = yield parse(this);

	if(!exists(postedOrder.userId)){
		this.set('ValidationError', 'User reference is required');
		this.status = 200;
		return;
	};

	var insertedOrder = yield orders.insert(postedOrder);

	this.set("location", "/order/" + insertedOrder.orderId);
	this.status = 201;
};

module.exports.get = function *(id) {
	var order = yield orders.findOne({orderId : id});
	this.body = order;
	this.status = 200;
};

module.exports.getForUser = function *(userId) {
	var order = yield orders.findOne({userId : userId});
	this.body = order;
	this.status = 200;
};

module.exports.update = function * (orderId) {
	var orderFromRequest = yield parse(this);

	yield orders.update({ orderId : orderId }, orderFromRequest);

	this.set("location", "/" + orderId);
	this.status = 204;
}

var exists = function (value) {
	if(value === undefined)
		return false;
	if(value === null)
		return false;
	return true;
};