'use strict';

var should = require('should');
var app = require('../../app');
var User = require('../user/user.model');
var Meetup = require('./meetup.model');

var user = new User({
  provider: 'local',
  name: 'Fake User',
  email: 'test@test.com',
  password: 'password'
});

var meetup = new Meetup({
  title: "Angular fullstack meetup",
  description: "Lets meet at Starbucks in JP Nagar",
  startDate: new Date(2015,0,1),
  endDate: new Date(2015,0,2),
  venue: "Starbucks, JP Nagar, Bangalore",
  city: "Bangalore",
  state: "Karnataka",
  country: "India",
  loc: {
    type: 'Point',
    coordinates: [-79.9455, 40.44428]
  }
});

describe('Meetup Model', function() {
  before(function(done) {
    user.save(function() {
      done();
    });
  });

  afterEach(function(done) {
    Meetup.remove().exec().then(function() {
      User.remove().exec().then(function() {
        done();
      });
    });
  });

  it('should begin with no meetups', function(done) {
    Meetup.find({}, function(err, meetups) {
      meetups.should.have.length(0);
      done();
    });
  });

  /*
  it('should have linked user', function(done) {
    meetup.user = user.id;
    meetup.save(function() {
      Meetup
        .findOne({_id: meetup.id})
        .populate('user', 'name email')
        .exec(function (err, doc) {
          should.not.exist(err);
          doc.user.name.should.equal("test@test.com")
          done();
        })
    });
  });
  */

  it('should split tags before saving', function(done) {
    meetup.tags = "angularjs,tdd,mobile dev";
    meetup.save(function() {
      meetup.tags.should.be.length(3);
      meetup.tags[0].should.equal("angularjs");
      meetup.tags[1].should.equal("tdd");
      meetup.tags[2].should.equal("mobile dev");
      done();
    });
  });
});
