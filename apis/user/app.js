var koa = require("koa");
var app = module.exports = koa();
var routes = require("koa-route");

// routes
var userRoutes = require("./userRoutes.js");
app.use(routes.post("/", userRoutes.add));
app.use(routes.get("/:id", userRoutes.get));
app.use(routes.put("/:id", userRoutes.update));
app.use(routes.del("/:id", userRoutes.remove));

// Fire it up
console.log("The app is listening. Port 3000");
