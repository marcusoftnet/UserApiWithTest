var co = require('co')

var app = require('../app.js')
module.exports.request = require('supertest').agent(app.listen())

var users = require('../userRoutes.js').users
module.exports.users = users

module.exports.removeAll = function (done) {
  co(function * () {
    yield users.remove({})
    // and other things we need to clean up
    done()
  })
}

module.exports.test_user = { name: 'Marcus', city: 'Bandung, Indonesia'}
