var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , Meetup = mongoose.model('Meetup')
  , errors = require('../../lib/errors')

var login = function (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/meetups/upcoming'
  delete req.session.returnTo
  res.redirect(redirectTo)
}

exports.authCallback = login

exports.signin = function (req, res) {}

exports.login = function (req, res) {
  res.render('users/login', {
    title: 'Log into hattira',
    message: req.flash('error')
  })
}

exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

exports.signup = function (req, res) {
  res.render('users/signup', {
    title: 'Sign up for hattira',
    user: new User()
  })
}

exports.session = login

exports.create = function (req, res) {
  var user = new User(req.body)
  user.provider = 'local'
  user.save(function (err) {
    if (err) {
      return res.render('users/signup', {
        error: errors.format(err.errors),
        user: user,
        title: 'Sign up'
      })
    }

    // manually login the user once successfully signed up
    req.logIn(user, function(err) {
      if (err) return next(err)
      return res.redirect('/')
    })
  })
}

var getLargePicture = function(user) {
  if (user.provider === "facebook") {
    return "//graph.facebook.com/"+user.facebook.id+"/picture?width=400&height=400"
  } else if (user.provider === "twitter") {
    return user.twitter.profile_image_url.replace("_normal.png", ".png")
  }
}

exports.profile = function (req, res, next) {
  var user = req.profile
    , options = {criteria: {user: user._id}}

  Meetup.list(options, function(err, meetups) {
    if (err) { return next(err) }

    Meetup.count().exec(function (err, count) {
      user.picture_large = getLargePicture(user)
      res.render('users/profile', { 
        title: user.name,
        user: user,
        meetups: meetups
      })
    })
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
    return res.redirect('/meetups/upcoming')
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
      if (!user) return next(new Error('User not found: ' + id))
      req.profile = user
      next()
    })
}
