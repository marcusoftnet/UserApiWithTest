const Koa = require('koa')
const app = new Koa()
const routes = require('koa-route')
const addressRoutes = require('./addressRoutes.js')

// routes
app.use(routes.post('/', addressRoutes.add))
app.use(routes.get('/:id', addressRoutes.get))
app.use(routes.put('/:id', addressRoutes.update))
app.use(routes.del('/:id', addressRoutes.remove))

// Fire it up
if (process.env.standalone) {
  app.listen(3000)
}
console.log('The app is listening. Port 3000')

module.exports = {
  app
}
