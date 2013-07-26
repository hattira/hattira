
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Meetup = mongoose.model('Meetup')
  , utils = require('../../lib/utils')
  , _ = require('underscore')

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

  Meetup.list(options, function(err, meetups) {
    if (err) return res.render('500')
    Meetup.count().exec(function (err, count) {
      res.render('meetups/index', {
        title: 'Meetups',
        meetups: meetups,
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
      errors: utils.errors(err.errors || err)
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
