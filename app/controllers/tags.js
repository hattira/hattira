var meetups = require('../controllers/meetups')
  , mongoose = require('mongoose')
  , Meetup = mongoose.model('Meetup')

exports.index = function (req, res, next) {
  var options = {
    loc: {$near: req.session['loc']},
    tags: req.param('tag')
  }
  Meetup.find(options, function(err, results) {
    if (err) {
      console.log(err)
      return res.render('meetups/empty')
    }
    return meetups.renderMeetups(req, res, results)
  })
}
