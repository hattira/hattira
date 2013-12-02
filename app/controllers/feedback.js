
var mongoose = require('mongoose')
  , Feedback = mongoose.model('Feedback')
  , errors = require('../../lib/errors')

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
      return res.redirect('/feedback/received')
    }
  
    res.render('feedback/new', {
      title: 'Feedback',
      feedback: feedback,
      errors: errors.format(err.errors || err)
    })
  })
}

exports.received = function(req, res) {
  res.render('feedback/received', {
    title: 'Thank you'
  })
}
