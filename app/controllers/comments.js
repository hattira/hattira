
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')

/**
 * Create comment
 */

exports.create = function (req, res) {
  var meetup = req.meetup
  var user = req.user

  if (!req.body.body) return res.redirect('/meetups/'+ meetup.id)

  meetup.addComment(user, req.body, function (err) {
    if (err) return res.render('500')
    res.redirect('/meetups/'+ meetup.id)
  })
}
