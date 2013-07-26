
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Meetup = mongoose.model('Meetup')

/**
 * List items tagged with a tag
 */

exports.index = function (req, res) {
  var criteria = { tags: req.param('tag') }
  var perPage = 5
  var page = req.param('page') > 0 ? req.param('page') : 0
  var options = {
    perPage: perPage,
    page: page,
    criteria: criteria
  }

  Meetup.list(options, function(err, meetups) {
    if (err) return res.render('500')
    Meetup.count(criteria).exec(function (err, count) {
      res.render('meetups/index', {
        title: 'Meetups tagged ' + req.param('tag'),
        meetups: meetups,
        page: page,
        pages: count / perPage
      })
    })
  })
}
