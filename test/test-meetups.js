var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../server')
  , context = describe
  , User = mongoose.model('User')
  , Meetup = mongoose.model('Meetup')
  , agent = request.agent(app)
  , util = require('util')

describe('Meetups', function () {

  describe('GET /meetups', function () {
    it('should respond with Content-Type text/html', function (done) {
      agent
      .get('/meetups')
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect(200)
      .end(done)
    })
  })

  describe('GET /meetups/new', function () {
    context('When not logged in', function () {
      it('should redirect to /login', function (done) {
        agent
        .get('/meetups/new')
        .expect('Content-Type', /plain/)
        .expect(302)
        .expect('Location', '/login')
        .expect(/Moved Temporarily/)
        .end(done)
      })
    })
  })

  describe('POST /meetups', function () {
    context('When not logged in', function () {
      it('should redirect to /login', function (done) {
        request(app)
        .get('/meetups/new')
        .expect('Content-Type', /plain/)
        .expect(302)
        .expect('Location', '/login')
        .expect(/Moved Temporarily/)
        .end(done)
      })
    })
  })


  after(function (done) {
    require('./helper').clearDb(done)
  })
})
