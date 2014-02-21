var meetups = require('../controllers/meetups')
  , mongoose = require('mongoose')
  , Meetup = mongoose.model('Meetup')

exports.index = function (req, res, next) {
  var coords = req.session['loc']
    , options = Meetup.searchOptions()

  options['query'] = {tags: req.param("tag")}
  Meetup.geoNear(coords, options, function(err, results) {
    if (err) {
      console.log(err)
      return res.render('meetups/empty')
    }
    return meetups.renderMeetups(req, res, results)
  })
}
