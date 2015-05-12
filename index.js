var koa = require('koa');
var app = module.exports = koa();
var mount = require('koa-mount');
var config = require("./config.js")();

// The root application
var rootApp = koa();
rootApp.use(function *(next){
  yield next;
  this.body = 'Find the APIs under /user, /order and /address respectively';
});

// APIS
var userApi = require('UserAPI');
var addressApi = require('AddressAPI');
var orderApi = require('OrderAPI');

// Mounting
app.use(mount('/', rootApp));
app.use(mount('/users', userApi));
app.use(mount('/address', addressApi));


// middleware configuration
var auth = require('koa-basic-auth');
var userAuth = require('./authentication.js');
app.use(userAuth.reqBasic);
app.use(mount('/orders', auth(config.adminUser)));
app.use(mount('/orders', orderApi));

// listen and all of that
app.listen(config.port);
console.log("listening on port " + config.port);