var koa = require("koa");
var app = module.exports = koa();
var routes = require("koa-route");

// routes
var userRoutes = require("./userRoutes.js");
app.use(routes.post("/user", userRoutes.add));
app.use(routes.get("/user/:id", userRoutes.get));
app.use(routes.put("/user/:id", userRoutes.update));
app.use(routes.del("/user/:id", userRoutes.remove));

// Fire it up
app.listen(3000);
console.log("The app is listening. Port 3000");
