
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Meetup = mongoose.model('Meetup')
  , City = mongoose.model('City')
  , async = require('async')
  , util = require('util')
  , errors = require('../../lib/errors')
  , request = require('request')
  , _ = require('underscore')

// https://gist.github.com/qiao/1626318
function getClientIp(req) {
  var ipAddress;
  var forwardedIpsStr = req.header('x-forwarded-for'); 
  if (forwardedIpsStr) {
    var forwardedIps = forwardedIpsStr.split(',');
    ipAddress = forwardedIps[0];
  }
  if (!ipAddress) {
    ipAddress = req.connection.remoteAddress;
  }

  return '8.8.8.8'
  return ipAddress
}

/**
 * Load
 */

exports.load = function(req, res, next, id){
  var User = mongoose.model('User')

  Meetup.load(id, function (err, meetup) {
    if (err) return next(err)
    if (!meetup) return next(new Error('not found'))
    req.meetup = meetup
    next()
  })
}

/**
 * List
 */

exports.index = function(req, res){

  var ip = getClientIp(req)
    , url = util.format("http://freegeoip.net/json/%s", ip)

  request(url, function(err, response, body) {
    var searchParams = {}

    body = JSON.parse(body)
    searchParams.fingerprint = City.getFingerprint(body.city)
    searchParams.state = body.region_name
    searchParams.country = body.country_code

    if (err) {
      return res.render('500')
    }

    City.load(searchParams, function(err, city) {
      console.log(searchParams, city)
      if (err) {
        return res.render('404')
      }
      return res.redirect(util.format('/meetups/by-city/%s', city.id))
    })
  })
}

/**
 * List by city
 */

exports.byCity = function(req, res, next, city, state, country){

  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
    , perPage = 30
    , tags = []
    , options = {
        perPage: perPage,
        page: page,
        city: city
      }

  Meetup.list(options, function(err, meetups) {
    if (err) return callback(error)
    Meetup.count().exec(function (err, count) {
      callback(null, meetups)
    })
  })

  _.each(meetups, function(meetup, index) {
    _.each(meetup.tags.split(','), function (tag, index) {
      tag = tag.trim()
      if (tag && !tags[tag]) {
        tags.push(tag)
      }
    })
  })

  Meetup.count().exec(function (err, count) {
    res.render('meetups/index', {
      title: 'Upcoming events',
      meetups: meetups,
      tags: _.first(tags, 20),
      area: JSON.parse(results[0]),
      page: page + 1,
      pages: Math.ceil(count / perPage)
    })
  })
}

/**
 * New meetup
 */

exports.new = function(req, res){
  res.render('meetups/new', {
    title: 'New Meetup',
    meetup: new Meetup({})
  })
}

/**
 * Create an meetup
 */

exports.create = function (req, res) {
  var meetup = new Meetup(req.body)
  meetup.user = req.user

  meetup.save(function (err, doc, count) {
    if (!err) {
      req.flash('success', 'Successfully created meetup!')
      return res.redirect('/meetups/'+doc._id)
    }

    res.render('meetups/new', {
      title: 'New Meetup',
      meetup: meetup,
      errors: errors.format(err.errors || err)
    })
  })
}

/**
 * Edit an meetup
 */

exports.edit = function (req, res) {
  res.render('meetups/edit', {
    title: 'Edit ' + req.meetup.title,
    meetup: req.meetup
  })
}

/**
 * Update meetup
 */

exports.update = function(req, res){
  var meetup = req.meetup
  meetup = _.extend(meetup, req.body)

  meetup.save(function(err, doc) {
    if (!err) {
      return res.redirect('/meetups/' + meetup._id)
    }

    res.render('meetups/edit', {
      title: 'Edit Meetup',
      meetup: doc,
      errors: err.errors
    })
  })
}

/**
 * Show
 */

exports.show = function(req, res, next){
  var allowEdit = false
    , showAttending = true
    , meetup = req.meetup
    , user = req.user

  if (user && user.id && meetup.user.id == user.id) {
    allow_edit = true
  }

  meetup.attending.forEach(function (attendee, index) {
    if (user && user.id && user.id === attendee.user.id) {
      showAttending = false
    }
  })

  res.render('meetups/show', {
    title: req.meetup.title,
    meetup: req.meetup,
    allowEdit: allowEdit,
    showAttending: showAttending
  })
}

/**
 * Attending
 */

exports.attending = function(req, res) {
  var includeUser = true
    , meetup = req.meetup
  
  meetup.attending.forEach(function (user, index) {
    if (req.user.id == user.id) {
      includeUser = false
    }
  })

  if (!includeUser) {
    req.flash('error', 'Nothing to do!  You are already attending')
    res.redirect('/meetups/'+meetup.id)
  }

  meetup.attending.push({
    user: req.user
  })
  meetup.save(function (err, doc, count) {
    req.flash('info', 'Marked as attending!')
    res.redirect('/meetups/'+meetup.id)
  })
}

/**
 * Delete the meetup
 */

exports.destroy = function(req, res){
  var meetup = req.meetup
  meetup.remove(function(err){
    req.flash('info', 'Deleted successfully')
    res.redirect('/meetups')
  })
}
