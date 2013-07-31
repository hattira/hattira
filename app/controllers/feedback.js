
var mongoose = require('mongoose')
  , Feedback = mongoose.model('Feedback')
  , misc = require('../../lib/misc')

exports.new = function(req, res){
  res.render('feedback/new', {
    title: 'Feedback',
    feedback: new Feedback({})
  })
}

exports.create = function (req, res) {
  var user = req.user
    , feedback = new Feedback(req.body)

  feedback.save(function (err, doc, count) {
    if (!err) {
      req.flash('success', 'Thanks for your feedback!')
      return res.redirect('/')
    }
  
    res.render('feedback/new', {
      title: 'Feedback',
      feedback: feedback,
      errors: misc.errors(err.errors || err)
    })
  })
}
