var co = require('co')
var should = require('should')
var helpers = require('./testHelpers.js')
var users = helpers.users
var request = helpers.request

describe('POST to /user', function () {
  var test_user = {}

  beforeEach(function (done) {
    test_user = helpers.testUser
    helpers.removeAll(done)
  })

  afterEach(function (done) {
    helpers.removeAll(done)
  })

  it('creates a new user for complete posted data', function (done) {
    // Post
    request
      .post('/')
      .send(test_user)
      .expect('location', /^\/[0-9a-fA-F]{24}$/) // Mongo Object Id /234234523562512512
      .expect(201)
      .end(function () {
        co(function * () {
          var userFromDb = yield users.findOne({ name: test_user.name })
          userFromDb.name.should.equal(test_user.name)
        }).then(done, done)
      })
  })

  it('returns validation error if name is not present', function (done) {
    var u = { city: 'A city without a user name'}

    request
      .post('/')
      .send(u)
      .expect('ValidationError', 'Name is required')
      .expect(200, done)
  })

  it('returns validation error if city is not present', function (done) {
    var u = { name: 'A name without a city'}

    request
      .post('/')
      .send(u)
      .expect('ValidationError', 'City is required')
      .expect(200, done)
  })
})
