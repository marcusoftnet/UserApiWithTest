const koa = require('koa')
const app = koa()
const routes = require('koa-route')
const userRoutes = require('./userRoutes.js')

app.use(routes.post('/', userRoutes.add))
app.use(routes.get('/:id', userRoutes.get))
app.use(routes.put('/:id', userRoutes.update))
app.use(routes.del('/:id', userRoutes.remove))

console.log('The app is listening. Port 3000')
module.exports = app
