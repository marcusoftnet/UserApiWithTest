/* global describe, before, beforeEach, after, it */
const sut = require('./index.js')
const should = require('should')
const addressRoutes = require('./addressRoutes.js')
const addresses = addressRoutes.addresses
const supertest = require('supertest')

const testAddress = {
  userId: 987654321,
  street: 'Jalan Jawa No 20',
  city: 'Bandung',
  country: 'Indonesia'
}

describe('Address API', () => {
  let request
  let server

  before(() => { server = sut.app.listen(8888) })
  after(() => { server.close() })

  beforeEach(async () => {
    await addresses.remove({})
    request = supertest(server)
  })

  const throwIfError = (err, res) => { if (err) throw err }

  it('creates a new address', async () => {
    request
      .post('/')
      .send(testAddress)
      .expect('location', /^\/[0-9a-fA-F]{24}$/) // Mongo Object Id /address/234234523562512512
      .expect(201)
      .expect(async () => {
        const addressesFromDb = await addresses.find({})
        addressesFromDb.length.should.equal(1)
        addressesFromDb[0].city.should.equal(testAddress.city)
      })
      .end(throwIfError)
  })

  it('returns validation error if user is not present', async () => {
    const addressToPost = {}

    request
      .post('/')
      .send(addressToPost)
      .expect('ValidationError', 'User ID is required')
      .expect(200)
      .end(throwIfError)
  })

  it('deletes an existing address', async () => {
    const address = await addresses.insert(testAddress)

    request
      .del(`/${address._id}`)
      .expect(200)
      .end(throwIfError)
  })

  it('returns an existing address', async () => {
    const address = await addresses.insert(testAddress)

    request
      .get(`/${address._id}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(/987654321/)
      .expect(/Bandung/)
      .expect(/Indonesia/)
      .expect(200)
      .end(throwIfError)
  })

  it('updates an existing address', async () => {
    const address = await addresses.insert(testAddress)

    request
      .put(`/${address._id}`)
      .send({name: 'Marcus v2', city: 'Bandung Updated'})
      .expect('location', `/${address._id}`)
      .expect(204)
      .expect(async () => {
        const addressFromDb = await addresses.findOne({_id: address._id})
        addressFromDb.city.should.equal('Bandung Updated')
      })
      .end(throwIfError)
  })
})
