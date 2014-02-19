
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Meetup = mongoose.model('Meetup')
  , async = require('async')
  , util = require('util')
  , errors = require('../../lib/errors')
  , request = require('request')
  , markdown = require( "markdown" ).markdown
  , _ = require('underscore')

function monthNames() {
  return [ "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul",
    "Aug", "Sep", "Oct", "Nov", "Dec"];
}

/**
 * Load
 */

exports.load = function(req, res, next, id){
  Meetup.load(id, function (err, meetup) {
    if (err) return next(err)
    if (!meetup) return next(new Error('not found'))
    req.meetup = meetup
    next()
  })
}

/**
 * Landing page - ask user for his location
 */

exports.index = function(req, res){
  res.render('meetups/landing', {
    title: "Events around you",
    fallbackCityId: config.fallbackCityId
  })
}

exports.renderMeetups= function(res, meetups) {
  var past = []
    , upcoming = []
    , tags = []
    , now = new Date().getTime()

  _.each(meetups, function(meetup, index) {
    if (meetup.endDate.getTime() > now) {
      upcoming.push(meetup)
    } else {
      past.push(meetup)
    }

    meetup.description = markdown.toHTML(meetup.description.slice(0,250)+'...')
    _.each(meetup.tags.split(','), function (tag, index) {
      tag = tag.trim()
      if (tag && _.indexOf(tags, tag) === -1) {
        tags.push(tag)
      }
    })
  })
  res.render('meetups/index', {
    title: 'Events around you',
    past: past,
    upcoming: upcoming,
    tags: _.first(tags, 20),
    fallbackCityId: config.fallbackCityId
  })
}

/**
 * List by city
 */

exports.byLocation = function(req, res, next){

  var coords = { type: 'Point', coordinates: [
    parseFloat(req.query.lat), parseFloat(req.query.lon),
  ]}
  console.log(coords)

  Meetup.find({loc: {$near: coords}}, function(err, results) {
    if (err) {
      return res.render('meetups/empty')
    }
    return module.exports.renderMeetups(res, results)
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

exports.create = function (req, res, next) {
      
  var meetup = new Meetup(req.body)
  meetup.user = req.user
  meetup.loc = { type: 'Point', coordinates: [
    parseFloat(req.body.latitude), parseFloat(req.body.longitude)
  ]}

  meetup.save(function (err, doc, count) {
    if (!err) {
      req.flash('success', 'Successfully created meetup!')
      return res.redirect('/meetups/'+doc._id)
    }

    return res.render('meetups/new', {
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
      meetup: meetup,
      errors: errors.format(err.errors || err)
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

  if (user && user.id && (meetup.user.id == user.id)) {
    allowEdit = true
  }

  meetup.attending.forEach(function (attendee, index) {
    if (user && user.id && (user.id === attendee.user.id)) {
      showAttending = false
    }
  })

  meetup.description = markdown.toHTML(meetup.description)
  _.each(meetup.comments, function(comment, index) {
    meetup.comments[index].body = markdown.toHTML(comment.body)
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
  
  if (!req.user) {
    return res.locals.sendJson(res, {
      'status': 'error',
      'message':'You need to be logged in to complete this action'
    })
  }

  _.each(meetup.attending, function(attendee, index) {
    // Weird - toString is required to force string comparison
    if (req.user._id.toString() === attendee.user._id.toString()) {
      includeUser = false
    }
  })

  if (!includeUser) {
    return res.locals.sendJson(res, {
      'status': 'error',
      'message':'Nothing to do!  You are already attending!'
    })
  }

  meetup.attending.push({ user: req.user })
  meetup.save(function (err, doc, count) {
    return res.locals.sendJson(res, {
      'status': 'ok',
      'message':'Successfully marked as attending!'
    })
  })
}

/**
 * share on facebook
 * http://runnable.com/UTlPM1-f2W1TAABY/post-on-facebook
 */

exports.share = function(req, res, next) {
  var meetup = req.meetup
    , user = req.user
    , url = 'https://graph.facebook.com/me/feed'
    , message = util.format('I am attending this event on %s %s',
          meetup.startDate.getDate(), monthNames()[meetup.startDate.getMonth()])
    , params = {
        access_token: user.authToken,
        message: message,
        link: 'http://sntd.pw/meetups/'+meetup._id,
        name: meetup.title,
        description: markdown.toHTML(meetup.description.slice(0,250)+'...')
    }

  request.post({url: url, qs: params}, function(err, resp, body) {
    if (err) return res.locals.sendJson(res, {status: 'error', message: err})

    body = JSON.parse(body);
    if (body.error) return res.locals.sendJson(res, {status: 'error', message: body.error})

    return res.locals.sendJson(res, {status: 'ok', message: body})
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
