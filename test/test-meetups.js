
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , request = require('supertest')
  , app = require('../server')
  , context = describe
  , User = mongoose.model('User')
  , City = mongoose.model('City')
  , Country = mongoose.model('Country')
  , Meetup = mongoose.model('Meetup')
  , agent = request.agent(app)

var count

/**
 * Meetups tests
 */

describe('Meetups', function () {
  var india
    , bangalore

  before(function (done) {
    india = new Country ({
      "name" : "India",
      "twoLetterCode" : "IN",
      "threeLetterCode" : "IND",
      "continent" : "AS",
      "timezone" : "Asia/Kolkata",
      "gmtOffset" : 5.5
    })
    india.save()
    bangalore = new City({
      "name" : "Bangalore",
      "fingerprint" : "bangalore", 
      "latitude" : 12.97194,
      "longitude" : 77.59369,
      "state" : "Karnataka",
      "country" : india.id,
    })
    bangalore.save(done)
  })

  describe('GET /meetups', function () {
    it('should respond with Content-Type text/html', function (done) {
      agent
      .get('/meetups')
      .expect('Content-Type', /plain/)
      .expect(302)
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

    /*
    context('When logged in', function () {
      before(function (done) {
        // login the user
        agent
        .post('/users/session')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .end(done)
      })

      it('should respond with Content-Type text/html', function (done) {
        agent
        .get('/meetups/new')
        .expect('Content-Type', /html/)
        .expect(200)
        .expect(/New Meetup/)
        .end(done)
      })
    })
    */
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

    /*
    context('When logged in', function () {
      before(function (done) {
        // login the user
        agent
        .post('/users/session')
        .field('email', 'foobar@example.com')
        .field('password', 'foobar')
        .end(done)
      })

      describe('Invalid parameters', function () {
        before(function (done) {
          Meetup.count(function (err, cnt) {
            count = cnt
            done()
          })
        })

        it('should respond with error', function (done) {
          agent
          .post('/meetups')
          .field('title', '')
          .field('body', 'foo')
          .expect('Content-Type', /html/)
          .expect(200)
          .expect(/Meetup title cannot be blank/)
          .end(done)
        })

        it('should not save to the database', function (done) {
          Meetup.count(function (err, cnt) {
            count.should.equal(cnt)
            done()
          })
        })
      })

      describe('Valid parameters', function () {
        before(function (done) {
          Meetup.count(function (err, cnt) {
            count = cnt
            done()
          })
        })

        it('should redirect to the new meetup page', function (done) {
          agent
          .post('/meetups')
          .field('title', 'foo')
          .field('body', 'bar')
          .expect('Content-Type', /plain/)
          .expect('Location', /\/meetups\//)
          .expect(302)
          .expect(/Moved Temporarily/)
          .end(done)
        })

        it('should insert a record to the database', function (done) {
          Meetup.count(function (err, cnt) {
            cnt.should.equal(count + 1)
            done()
          })
        })

        it('should save the meetup to the database', function (done) {
          Meetup
          .findOne({ title: 'foo'})
          .populate('user')
          .exec(function (err, meetup) {
            should.not.exist(err)
            meetup.should.be.an.instanceOf(Meetup)
            meetup.title.should.equal('foo')
            meetup.body.should.equal('bar')
            meetup.user.email.should.equal('foobar@example.com')
            meetup.user.name.should.equal('Foo bar')
            done()
          })
        })
      })
    })
    */
  })


  after(function (done) {
    require('./helper').clearDb(done)
  })
})
