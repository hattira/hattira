
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Meetup = mongoose.model('Meetup')
  , async = require('async')
  , util = require('util')
  , misc = require('../../lib/misc')
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

  return '14.96.97.255'
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
  var page = (req.param('page') > 0 ? req.param('page') : 1) - 1
  var perPage = 30
  var options = {
    perPage: perPage,
    page: page
  }

  function get_area(req, callback) {
    var ip = getClientIp(req)
      , url = util.format("http://freegeoip.net/json/%s", ip)
    request(url, function(err, response, body) {
      if (err) callback(err)
      callback(null, body)
    })
  }

  function get_meetups(req, callback) {
    Meetup.list(options, function(err, meetups) {
      if (err) return callback(error)
      Meetup.count().exec(function (err, count) {
        callback(null, meetups)
      })
    })
  }

  async.series([
    function(callback) {
      return get_area(req, callback)
    },
    function(callback) {
      return get_meetups(req, callback)
    }
  ], function(err, results) {
    Meetup.count().exec(function (err, count) {
      res.render('meetups/index', {
        title: 'Meetups',
        meetups: results[1],
        area: JSON.parse(results[0]),
        page: page + 1,
        pages: Math.ceil(count / perPage)
      })
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

  meetup.uploadAndSave(req.files.image, function (err) {
    if (!err) {
      req.flash('success', 'Successfully created meetup!')
      return res.redirect('/meetups/'+meetup._id)
    }

    res.render('meetups/new', {
      title: 'New Meetup',
      meetup: meetup,
      errors: misc.errors(err.errors || err)
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

  meetup.uploadAndSave(req.files.image, function(err) {
    if (!err) {
      return res.redirect('/meetups/' + meetup._id)
    }

    res.render('meetups/edit', {
      title: 'Edit Meetup',
      meetup: meetup,
      errors: err.errors
    })
  })
}

/**
 * Show
 */

exports.show = function(req, res){
  res.render('meetups/show', {
    title: req.meetup.title,
    meetup: req.meetup
  })
}

/**
 * Delete an meetup
 */

exports.destroy = function(req, res){
  var meetup = req.meetup
  meetup.remove(function(err){
    req.flash('info', 'Deleted successfully')
    res.redirect('/meetups')
  })
}
