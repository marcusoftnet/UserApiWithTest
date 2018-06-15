const Koa = require('koa')
const app = new Koa()
const routes = require('koa-route')

const orderRoutes = require('./orderRoutes.js')
app.use(routes.post('/order', orderRoutes.add))
app.use(routes.get('/:id', orderRoutes.get))
app.use(routes.put('/:id', orderRoutes.update))
app.use(routes.del('/:id', orderRoutes.remove))
app.use(routes.get('/user/:userId', orderRoutes.getForUser))

console.log('The app is listening. Port 3000')

module.exports = app
