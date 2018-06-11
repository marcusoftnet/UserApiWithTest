/* global describe, beforeEach, afterEach, it */
const helpers = require('./testHelpers.js')
const users = helpers.users
const request = helpers.request

describe('POST to /user', () => {
  beforeEach(async () => helpers.removeAll())
  afterEach(async () => helpers.removeAll())

  it('creates a new user for complete posted data', async () => {
    // Post
    request
      .post('/')
      .send(helpers.testUser)
      .expect('location', /^\/[0-9a-fA-F]{24}$/) // Mongo Object Id /234234523562512512
      .expect(201)
      .expect(async () => {
        const userFromDb = await users.findOne({ name: helpers.testUser.name })
        userFromDb.name.should.equal(helpers.testUser.name)
      })
  })

  it('returns validation error if name is not present', async () => {
    var u = { city: 'A city without a user name' }

    request
      .post('/')
      .send(u)
      .expect('ValidationError', 'Name is required')
      .expect(200)
  })

  it('returns validation error if city is not present', async () => {
    var u = { name: 'A name without a city' }

    request
      .post('/')
      .send(u)
      .expect('ValidationError', 'City is required')
      .expect(200)
  })
})
