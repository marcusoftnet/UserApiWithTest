var co = require('co')

var sut = require('../index.js')
module.exports.request = require('supertest').agent(sut.app.listen())
var addresses = sut.addresses
module.exports.addresses = sut.addresses

module.exports.removeAll = function () {
  co(function * () {
    yield addresses.remove({})
  })
}

module.exports.test_address = {
  userId: 987654321,
  street: 'Jalan Jawa No 20',
  city: 'Bandung',
  country: 'Indonesia'
}
