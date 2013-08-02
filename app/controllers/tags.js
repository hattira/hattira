
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
    , perPage = 5
    , page = req.param('page') > 0 ? req.param('page') : 0
    , tags = []
    , options = {
        perPage: perPage,
        page: page,
        criteria: criteria
      }

  Meetup.list(options, function(err, meetups) {
    if (err) {
      return res.render('500')
    }

    meetups.forEach(function(meetup, index) {
      meetup.tags.split(',').forEach(function (tag, index) {
        tag = tag.trim()
        if (tag && !tags[tag]) {
          tags.push(tag)
        }
      })
    })

    Meetup.count(criteria).exec(function (err, count) {
      res.render('meetups/index', {
        title: 'Meetups tagged ' + req.param('tag'),
        meetups: meetups,
        page: page,
        tags: tags,
        pages: count / perPage
      })
    })
  })
}
