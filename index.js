const Koa = require('koa')
const app = new Koa()
const mount = require('koa-mount')
const config = require('./config.js')()
const auth = require('koa-basic-auth')
const userAuth = require('./authentication.js')

// The root application
const rootApp = new Koa()
rootApp.use(async (ctx, next) => {
  await next()
  ctx.body = 'Find the APIs under /user, /order and /address respectively'
})

// APIS
const userApi = require('UserAPI').app
const addressApi = require('AddressAPI').app
const orderApi = require('OrderAPI').app

// Mounting
app.use(mount('/users', userApi))
app.use(mount('/address', addressApi))
app.use(mount('/', rootApp))

// middleware configuration
app.use(userAuth.reqBasic)
app.use(mount('/orders', auth(config.adminUser)))
app.use(mount('/orders', orderApi))

if (!module.parent) {
  app.listen(config.port)
  console.log('listening on port ' + config.port)
}

module.exports = {
  app
}
