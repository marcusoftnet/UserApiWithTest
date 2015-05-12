var koa = require("koa");
var app = module.exports = koa();
var routes = require("koa-route");

// routes
var orderRoutes = require("./orderRoutes.js");
app.use(routes.post("/", orderRoutes.add));
app.use(routes.get("/:id", orderRoutes.get));
app.use(routes.put("/:id", orderRoutes.update));
app.use(routes.del("/:id", orderRoutes.remove));
app.use(routes.get("/user/:userId", orderRoutes.getForUser));

// Fire it up
console.log("The app is listening. Port 3000");
