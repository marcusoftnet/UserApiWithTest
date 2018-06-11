/* global describe, beforeEach, afterEach, it */
const helpers = require('./testHelpers.js')
const users = helpers.users
const request = helpers.request

describe('DEL user /:id', () => {
  beforeEach(async () => helpers.removeAll())
  afterEach(async () => helpers.removeAll())

  it('deletes an existing user', async () => {
    const user = await users.insert(helpers.testUser)
    request
      .del(`/${user._id}`)
      .expect(200)
  })
})
