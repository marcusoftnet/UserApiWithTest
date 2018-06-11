/* global describe, beforeEach, afterEach, it */
const app = require('./app.js')
const request = require('supertest').agent(app.listen())
const users = require('./userRoutes.js').users
const testUser = { name: 'Marcus', city: 'Bandung, Indonesia' }
const removeAll = async () => users.remove({})

describe('User API', () => {
  beforeEach(async () => removeAll())
  afterEach(async () => removeAll())

  describe('DEL user /:id', () => {
    it('deletes an existing user', async () => {
      const user = await users.insert(testUser)
      request
        .del(`/${user._id}`)
        .expect(200)
    })
  })

  describe('GET user /:id ', function () {
    it('returns JSON for existing user', async () => {
      const user = await users.insert(testUser)
      request
        .get(`/${user._id}`)
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(/Marcus/)
        .expect(/Bandung, Indonesia/)
        .expect(200)
    })
  })

  describe('POST to /user', () => {
    it('creates a new user for complete posted data', async () => {
      // Post
      request
        .post('/')
        .send(testUser)
        .expect('location', /^\/[0-9a-fA-F]{24}$/) // Mongo Object Id /234234523562512512
        .expect(201)
        .expect(async () => {
          const userFromDb = await users.findOne({ name: testUser.name })
          userFromDb.name.should.equal(testUser.name)
        })
    })
    it('returns validation error if name is not present', async () => {
      request
        .post('/')
        .send({ city: 'A city without a user name' })
        .expect('ValidationError', 'Name is required')
        .expect(200)
    })
    it('returns validation error if city is not present', async () => {
      request
        .post('/')
        .send({ name: 'A name without a city' })
        .expect('ValidationError', 'City is required')
        .expect(200)
    })
  })
  describe('PUT to /user', () => {
    it('updates an existing user for complete put data', async () => {
      const user = await users.insert(testUser)
      const userUrl = `/${user._id}`
      request
        .put(userUrl)
        .send({name: 'Marcus v2', City: 'Bandung Updated'})
        .expect('location', userUrl)
        .expect(204)
    })
  })
})
