const co = require('co')
const app = require('../app.js')
const request = require('supertest').agent(app.listen())
const users = require('../userRoutes.js').users

const testUser = { name: 'Marcus', city: 'Bandung, Indonesia' }

async function removeAll (done) {
  await users.remove({})
  done()
}

module.exports = {
  testUser,
  app,
  request,
  users,
  removeAll
}
