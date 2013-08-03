
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , City = mongoose.model('City')
  , util = require('util')
  , _ = require('underscore')

/**
 * Load the city details against the request object
 */

exports.load = function(req, res, next, id){

  City.byId(id, function (err, city) {
    if (err) return next(err)
    if (!city) return next(new Error('not found'))
    req.city = city
    next()
  })
}

/**
 * Find the cities that match the query
 */

exports.find = function(req, res, next, query) {
  City.byName(query, function (err, cities) {
    if (err) return next(err)
    req.cities = cities
    next()
  })
}

/**
 * Return the cities we have in memory as array
 */

exports.search = function(req, res) {
  var cities = []
  
  _.each(req.cities, function(city, index) {
    cities.push(util.format("%s, %s, %s",
      city.name, city.state, city.country.name))
  })

  res.writeHead(200, {"Content-Type": "application/json"});
  res.write(JSON.stringify(cities))
  return res.end()
}
