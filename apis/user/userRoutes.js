const parse = require('co-body')
const monk = require('monk')
const wrap = require('co-monk')
const db = monk('localhost/usersApi')
const users = wrap(db.get('users'))

const add = function * () {
  const postedUser = yield parse(this)
  if (!exists(postedUser.name)) {
    this.set('ValidationError', 'Name is required')
    this.status = 200
    return
  };

  if (!exists(postedUser.city)) {
    this.set('ValidationError', 'City is required')
    this.status = 200
    return
  };

  const insertedUser = yield users.insert(postedUser)

  this.set('location', this.originalUrl + '/' + insertedUser._id)
  this.status = 201
}

const get = function * (id) {
  const user = yield users.findOne({_id: id})
  this.body = user
  this.status = 200
}

const update = function * (id) {
  const userFromRequest = yield parse(this)

  yield users.findOneAndUpdate({_id: id}, userFromRequest)

  const prefixOfUrl = this.originalUrl.replace(id, '')
  this.set('location', prefixOfUrl + id)
  this.status = 204
}

const remove = function * (id) {
  yield users.remove({_id: id})
  this.status = 200
}

var exists = function (value) {
  if (value === undefined) { return false }
  if (value === null) { return false }
  return true
}

module.exports = {
  users,
  add,
  get,
  update,
  remove
}
