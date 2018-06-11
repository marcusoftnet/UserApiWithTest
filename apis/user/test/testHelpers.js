const app = require('../app.js')
const request = require('supertest').agent(app.listen())
const users = require('../userRoutes.js').users

const testUser = { name: 'Marcus', city: 'Bandung, Indonesia' }

const removeAll = async () => users.remove({})

module.exports = {
  testUser,
  app,
  request,
  users,
  removeAll
}
