/* global describe, beforeEach, afterEach, it */
const helpers = require('./testHelpers.js')
const users = helpers.users
const request = helpers.request

describe('PUT to /user', () => {
  beforeEach(async () => helpers.removeAll())
  afterEach(async () => helpers.removeAll())

  it('updates an existing user for complete put data', async () => {
    const user = await users.insert(helpers.testUser)
    const userUrl = `/${user._id}`
    request
      .put(userUrl)
      .send({name: 'Marcus v2', City: 'Bandung Updated'})
      .expect('location', userUrl)
      .expect(204)
  })
})
