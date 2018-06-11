var co = require('co')
var helpers = require('./testHelpers.js')
var users = helpers.users
var request = helpers.request

describe('DEL user /:id', function () {
  var test_user = {}

  beforeEach(function (done) {
    test_user = helpers.testUser
    helpers.removeAll(done)
  })

  afterEach(function (done) {
    helpers.removeAll(done)
  })

  it('deletes an existing user', function (done) {
    co(function * () {
      // Insert test user in database
      var user = yield users.insert(test_user)
      var userUrl = '/' + user._id

      // Delete the user
      request
        .del(userUrl)
        .expect(200, done)
    })
  })
})
