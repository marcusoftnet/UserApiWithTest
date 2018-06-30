const parse = require('co-body')
const monk = require('monk')
const db = monk('localhost/addressApi')
const addresses = db.get('addresses')

const add = async (ctx) => {
  var postedAddress = await parse(ctx)

  if (!exists(postedAddress.userId)) {
    ctx.set('ValidationError', 'User ID is required')
    ctx.status = 200
    return
  }

  const insertedAddress = await addresses.insert(postedAddress)
  const url = `${ctx.originalUrl}/${insertedAddress._id}`.replace('//', '/')
  ctx.set('location', url)
  ctx.status = 201
}

const get = async (ctx, id) => {
  const address = await addresses.findOne({_id: id})
  ctx.body = address
  ctx.status = 200
}

const update = async (ctx, id) => {
  var postedAddress = await parse(ctx)

  await addresses.findOneAndUpdate({_id: id}, postedAddress)

  var prefixOfUrl = ctx.originalUrl.replace(id, '')
  ctx.set('location', prefixOfUrl + id)
  ctx.status = 204
}

const remove = async (ctx, id) => {
  await addresses.remove({_id: id})
  ctx.status = 200
}

const exists = (value) => (value !== undefined) && (value !== null)

module.exports = {
  add,
  get,
  update,
  remove,
  addresses
}
