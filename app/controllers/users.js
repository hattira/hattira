var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , errors = require('../../lib/errors')

exports.authCallback = function (req, res, next) {
  res.redirect('/')
}

exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Login',
    message: req.flash('error')
  })
}

exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

exports.session = function (req, res) {
  res.redirect('/')
}

exports.profile = function (req, res) {
  var user = req.profile
  res.render('users/profile', {
    title: user.name,
    user: user
  })
}

function emailPage(res, user, err) {
  return res.render('users/reg_complete', {
    user: user,
    errors: err || []
  })
}

exports.askEmail = function (req, res) {
  var user = req.user
  if ( user.email.length ) {
    req.flash('success', 'Email updated successfully!')
    return res.redirect('/')
  }

  return emailPage(res, user)
}

// https://github.com/chriso/node-validator/blob/master/lib/validators.js
function isEmail(str) {
  return str.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/);
}

exports.updateEmail = function (req, res) {
  var user = req.user
    , email = req.body.email

  if (!isEmail(email)) {
    return emailPage(res, user, ['Not a valid email'])
  }

  user.email = email
  user.save(function (err, doc, count) {
    if (!err) {
      req.flash('success', 'Email updates successfully!')
      return res.redirect('/')
    }

    return emailPage(res, user, err.errors || err)
  })
}

/**
 * Find user by id
 */

exports.user = function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
}
