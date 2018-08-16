/* global describe, before, beforeEach, after it */
const supertest = require('supertest')
const app = require('../').app
const config = require('../config')()

describe('Our application', () => {
  let request
  let server

  before(() => { server = app.listen(8888) })
  after(() => { server.close() })
  beforeEach(async () => { request = supertest(server) })
  const throwIfError = (err, res) => { if (err) throw err }

  it('has a simple root application', async () => {
    request
      .get('/')
      .expect(200)
      .expect(/Find the APIs under/)
      .end(throwIfError)
  })

  it('an user api to which we can post', async () => {
    request
      .post('/users')
      .send({name: 'Marcus', city: 'Bandung, Indonesia'})
      .expect(201)
      .expect('location', /^\/users\/[0-9a-fA-F]{24}$/)
      .end(throwIfError)
  })

  it('and an address api to which we can post', async () => {
    const testAddress = {
      userId: 987654321,
      street: 'Jalan Jawa No 20',
      city: 'Bandung',
      country: 'Indonesia'
    }

    request
      .post('/address')
      .send(testAddress)
      .expect(201)
      .expect('location', /^\/address\/[0-9a-fA-F]{24}$/)
      .end(throwIfError)
  })
})
