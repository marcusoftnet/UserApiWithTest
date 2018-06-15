/* global describe, before, beforeEach, after, it */
const should = require('should')
const app = require('./index.js')
const orders = require('./orderRoutes.js').orders
const supertest = require('supertest')

describe('Order API', () => {
  let request
  let server

  const testOrder = {
    orderId: '123456789',
    ordered: new Date('2015-01-01'),
    userId: '987654321'
  }

  before(() => { server = app.listen(8888) })
  after(() => { server.close() })

  beforeEach(async () => {
    await orders.remove({})
    request = supertest(server)
  })

  const throwIfError = (err, res) => { if (err) throw err }

  it('creates a new order for complete posted data', async () => {
    request
      .post('/')
      .send(testOrder)
      .expect('location', /^\/[0-9a-fA-F]{24}$/) // /order/234234523562512512
      .expect(201)
      .expect(async () => {
        const orderFromDb = await orders.findOne({ orderId: testOrder.orderId })
        orderFromDb.orderId.should.equal(testOrder.orderId)
      })
      .end(throwIfError)
  })

  it('returns validation error if user is not present', async () => {
    const orderToFail = {}
    request
      .post('/')
      .send(orderToFail)
      .expect('ValidationError', 'User reference is required')
      .expect(200)
      .end(throwIfError)
  })

  it('returns an existing order', async () => {
    const order = await orders.insert(testOrder)
    request
      .get(`/${order.orderId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect(/123456789/)
      .expect(/987654321/)
      .expect(200)
      .end(throwIfError)
  })

  it('returns an existing order by user id', async () => {
    const order = await orders.insert(testOrder)
    request
      .get(`/user/${order.userId}`)
      .set('Accept', 'application/json')
      .expect('Content-Type', 'application/json')
      .expect(/123456789/)
      .expect(/987654321/)
      .expect(200)
      .end(throwIfError)
  })

  it('updates an existing order', async () => {
    const order = await orders.insert(testOrder)
    const updatedOrder = testOrder
    updatedOrder.userId = 111111111

    request
      .put(`/${order.orderId}`)
      .send(updatedOrder)
      .expect('location', `/${order.orderId}`)
      .expect(204)
      .end(throwIfError)
  })
})
