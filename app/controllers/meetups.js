
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Meetup = mongoose.model('Meetup')
  , City = mongoose.model('City')
  , async = require('async')
  , util = require('util')
  , errors = require('../../lib/errors')
  , request = require('request')
  , markdown = require( "markdown" ).markdown
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

  return ipAddress
}

function sendJson(res, msg) {
  res.writeHead(200, {"Content-Type": "application/json"})
  res.write(JSON.stringify(msg))
  return res.end()
}

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
 * List
 */

exports.index = function(req, res){

  var ip = getClientIp(req)
    , url = util.format("http://freegeoip.net/json/%s", ip)

  request(url, function(err, response, body) {
    if (err || response.statusCode != 200) {
      return res.redirect(util.format('/meetups/by-city/%s', config.fallbackCityId))
    }

    var freegeo = JSON.parse(body)
      , city = freegeo.city || config.fallbackCity
      , fp = City.getFingerprint(city)
      , options = { criteria: { fingerprint: fp } }


    //TODO: Handle the case where lookup by fingerprint fails
    City.list(options, function(err, cities) {
      if (err) {
        console.log('Failed to lookup city with fp:', fp)
        return res.render('404')
      }

      City.count().exec(function (err, count) {
        var cityId = config.fallbackCityId
        if (cities.length > 0) {
          cityId = cities[0].id
        }
        return res.redirect(util.format('/meetups/by-city/%s', cityId))
      })
    })
  })
}

/**
 * Render meetups based on the search criteria
 */

exports.bySearchCriteria = function(req, res, next, options) {
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
    , tags = []
     
  _.extend(options, { perPage: config.items_per_page, page: page })

  Meetup.list(options, function(err, meetups) {
    if (err) return next(err)
    Meetup.count().exec(function (err, count) {
      var past = []
        , upcoming = []
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
        page: page + 1,
        pages: Math.ceil(count / config.items_per_page),
        fallbackCityId: config.fallbackCityId
      })
    })
  })
}

/**
 * List by city
 */

exports.byCity = function(req, res, next){

  var options = { criteria: {city: req.city.id} }
  return module.exports.bySearchCriteria(req, res, next, options)
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
  var input = req.body.city.split(',')
    , city = (input.length && input[0]) || ''
    , state = (input.length > 1 && input[1].trim()) || ''
    , options = {
        criteria: {
          name: city,
          state: state
        }
      }

  City.list(options, function (err, cities) {
    if (err) return next(err)

    City.count().exec(function (err, count) {
      if ( !cities.length ) {
        return res.render('meetups/new', {
          title: 'New Meetup',
          meetup: new Meetup(req.body),
          errors: ["Unable to find city with that name"]
        })
      }
      
      // something weird.  We need to set the city before
      // doing new Meetup
      req.body.city = cities[0].id
      var meetup = new Meetup(req.body)
      meetup.user = req.user
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
    return sendJson(res, {
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
    return sendJson(res, {
      'status': 'error',
      'message':'Nothing to do!  You are already attending!'
    })
  }

  meetup.attending.push({ user: req.user })
  meetup.save(function (err, doc, count) {
    return sendJson(res, {
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
    if (err) return sendJson(res, {status: 'error', message: err})

    body = JSON.parse(body);
    if (body.error) return sendJson(res, {status: 'error', message: body.error})

    return sendJson(res, {status: 'ok', message: body})
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
