const Koa = require('koa')
const app = new Koa()
const routes = require('koa-route')
const userRoutes = require('./userRoutes.js')

app.use(routes.post('/', userRoutes.add))
app.use(routes.get('/:id', userRoutes.get))
app.use(routes.put('/:id', userRoutes.update))
app.use(routes.del('/:id', userRoutes.remove))

if (!module.parent) {
  app.listen(3000)
  console.log('User API listening on port ' + 3000)
}

module.exports = {
  app
}
