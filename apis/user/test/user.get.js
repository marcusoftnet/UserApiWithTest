/* global describe, beforeEach, afterEach, it */
const helpers = require('./testHelpers.js')
const users = helpers.users
const request = helpers.request

describe('GET user /:id ', function () {
  beforeEach(async () => helpers.removeAll())
  afterEach(async () => helpers.removeAll())

  it('returns JSON for existing user', async () => {
    const user = await users.insert(helpers.testUser)
    request
      .get(`/${user._id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(/Marcus/)
      .expect(/Bandung, Indonesia/)
      .expect(200)
  })
})
