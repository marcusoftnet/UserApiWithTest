var parse = require("co-body");

var monk = require("monk");
var wrap = require("co-monk");
var db = monk("localhost/usersApi");
var users = wrap(db.get("users"));
module.exports.users = users;

module.exports.add = function * () {
	var postedUser = yield parse(this);
	if(!exists(postedUser.name)){
		this.set('ValidationError', 'Name is required');
		this.status = 200;
		return;
	};

	if(!exists(postedUser.city)){
		this.set('ValidationError', 'City is required');
		this.status = 200;
		return;
	};

	var insertedUser = yield users.insert(postedUser);

	this.set("location", this.originalUrl + "/" + insertedUser._id);
	this.status = 201;
};

module.exports.get = function *(id) {
	var user = yield users.findOne({_id: id});
	this.body = user;
	this.status = 200;
};

module.exports.update = function * (id) {
	var userFromRequest = yield parse(this);

	yield users.findOneAndUpdate({_id: id}, userFromRequest);

	var prefixOfUrl = this.originalUrl.replace(id, "");
	this.set("location", prefixOfUrl + id);
	this.status = 204;
}

module.exports.remove = function * (id) {
	yield users.remove({_id : id});
	this.status = 200;
};

var exists = function (value) {
	if(value === undefined)
		return false;
	if(value === null)
		return false;
	return true;
};