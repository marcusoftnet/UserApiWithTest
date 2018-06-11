const co = require('co')
const app = require('../app.js')
const request = require('supertest').agent(app.listen())
const users = require('../userRoutes.js').users

const testUser = { name: 'Marcus', city: 'Bandung, Indonesia' }

function removeAll (done) {
  co(function * () {
    yield users.remove({})
    // and other things we need to clean up
    done()
  })
}

module.exports = {
  testUser,
  app,
  request,
  users,
  removeAll
}
