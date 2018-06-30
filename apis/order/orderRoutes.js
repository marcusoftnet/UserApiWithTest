const parse = require('co-body')
const monk = require('monk')
const db = monk('localhost/ordersAPI')
const orders = db.get('orders')

const add = async (ctx) => {
  const postedOrder = await parse(ctx)

  if (!exists(postedOrder.userId)) {
    ctx.set('ValidationError', 'User reference is required')
    ctx.status = 200
    return
  }

  const insertedOrder = await orders.insert(postedOrder)
  const url = `${ctx.originalUrl}/${insertedOrder._id}`.replace('//', '/')
  ctx.set('location', url)
  ctx.status = 201
}

const get = async (ctx, id) => {
  const order = await orders.findOne({orderId: id})
  ctx.body = order
  ctx.status = 200
}

const getForUser = async (ctx, userId) => {
  const order = await orders.findOne({userId: userId})
  ctx.body = order
  ctx.status = 200
}

const update = async (ctx, orderId) => {
  const orderFromRequest = await parse(ctx)
  await orders.findOneAndUpdate({ orderId: orderId }, orderFromRequest)
  const prefixOfUrl = ctx.originalUrl.replace(orderId, '')
  ctx.set('location', prefixOfUrl + orderId)
  ctx.status = 204
}

const exists = (value) => (value !== undefined) && (value !== null)

module.exports = {
  orders,
  add,
  get,
  getForUser,
  update
}
