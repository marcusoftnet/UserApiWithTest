const parse = require('co-body')
const monk = require('monk')
const db = monk('localhost/usersApi')
const users = db.get('users')

const add = async (ctx) => {
  const postedUser = await parse(ctx)
  if (!exists(postedUser.name)) {
    ctx.set('ValidationError', 'Name is required')
    ctx.status = 200
    return
  }

  if (!exists(postedUser.city)) {
    ctx.set('ValidationError', 'City is required')
    ctx.status = 200
    return
  }

  const insertedUser = await users.insert(postedUser)
  const url = `${ctx.originalUrl}/${insertedUser._id}`.replace('//', '/')
  ctx.set('location', url)
  ctx.status = 201
}

const get = async (ctx, id) => {
  const user = await users.findOne({_id: id})
  ctx.body = user
  ctx.status = 200
}

const update = async (ctx, id) => {
  const userFromRequest = await parse(ctx)
  await users.findOneAndUpdate({_id: id}, userFromRequest)
  ctx.set('location', ctx.originalUrl)
  ctx.status = 204
}

const remove = async (ctx, id) => {
  await users.remove({_id: id})
  ctx.status = 200
}

const exists = (value) => (value !== undefined) && (value !== null)

module.exports = {
  users,
  add,
  get,
  update,
  remove
}
