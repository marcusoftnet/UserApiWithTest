var koa = require("koa");
var app = module.exports = koa();
var routes = require("koa-route");
var parse = require("co-body");

var monk = require("monk");
var wrap = require("co-monk");
var db = monk("localhost/addressApi");
var addresses = wrap(db.get("addresses"));
module.exports.addresses = addresses;

// routes
app.use(routes.post("/", add));
app.use(routes.get("/:id", get));
app.use(routes.put("/:id", update));
app.use(routes.del("/:id", remove));

// Fire it up
app.listen(3000);
console.log("The app is listening. Port 3000");


function *add() {
	var postedAddress = yield parse(this);

	if(!exists(postedAddress.userId)){
		this.set('ValidationError', 'User ID is required');
		this.status = 200;
		return;
	};

	var insertedAddress = yield addresses.insert(postedAddress);

	this.set("location", "/" + insertedAddress._id);
	this.status = 201;
};

function *get(id) {
	var address = yield addresses.findById(id);
	this.body = address;
	this.status = 200;
};

function *update(id) {
	var postedAddress = yield parse(this);

	yield addresses.updateById(id, postedAddress);

	this.set("location", "/" + id);
	this.status = 204;
};

function *remove(id) {
	yield addresses.remove({_id : id});
	this.status = 200;
};

var exists = function (value) {
	if(value === undefined)
		return false;
	if(value === null)
		return false;
	return true;
};