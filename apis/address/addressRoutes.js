const parse = require('co-body')
const monk = require('monk')
const wrap = require('co-monk')
const db = monk('localhost/addressApi')
const addresses = wrap(db.get('addresses'))

function * add () {
  var postedAddress = yield parse(this)

  if (!exists(postedAddress.userId)) {
    this.set('ValidationError', 'User ID is required')
    this.status = 200
    return
  };

  var insertedAddress = yield addresses.insert(postedAddress)

  this.set('location', this.originalUrl + '/' + insertedAddress._id)
  this.status = 201
};

function * get (id) {
  var address = yield addresses.findOne({_id:id})
  this.body = address
  this.status = 200
};

function * update (id) {
  var postedAddress = yield parse(this)

  yield addresses.findOneAndUpdate({_id:id}, postedAddress)

  var prefixOfUrl = this.originalUrl.replace(id, '')
  this.set('location', prefixOfUrl + id)
  this.status = 204
};

function * remove (id) {
  yield addresses.remove({_id: id})
  this.status = 200
};

var exists = function (value) {
  if (value === undefined) { return false }
  if (value === null) { return false }
  return true
}

module.exports = {
  add,
  get,
  update,
  remove,
  addresses
}
