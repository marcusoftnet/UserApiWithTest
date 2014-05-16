var parse = require("co-body");

var monk = require("monk");
var wrap = require("co-monk");
var db = monk("localhost/usersApi");
var users = wrap(db.get("users"));
module.exports.users = users;

module.exports.add = function * () {
	var postedUser = yield parse(this);

	var insertedUser = yield users.insert(postedUser);

	this.set("location", "/user/" + insertedUser._id);
	this.status = 200;
};

module.exports.get = function *(id) {
	var user = yield users.findById(id);
	this.body = user;
	this.status = 200;
};

module.exports.update = function * (id) {
	var userFromRequest = yield parse(this);

	yield users.updateById(id, userFromRequest);

	this.set("location", "/user/" + id);
	this.status = 204;
}

module.exports.remove = function * (id) {
	yield users.remove({_id : id});
	this.status = 200;
};