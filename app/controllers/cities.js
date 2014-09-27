var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , City = mongoose.model('City')
  , _ = require('underscore')


exports.search = function(req, res){
  query = String(req.query.q).toLowerCase()
  City.list({criteria: {name : RegExp(query, "i")}}, function(err, docs) {
    var cities = []
    if (err) {
      return res.locals.sendJson(res, {
        status: 'error',
        error: error
      })
    }

    _.each(docs, function(city, index) {
      cities.push([city.name, city.state, city.country].join(", "))
    })
    return res.locals.sendJson(res, {
      status: 'ok',
      cities: cities
    })
  })
}
