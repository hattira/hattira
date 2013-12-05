
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

  City.load(id, function (err, city) {
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
  var options = { 
    criteria: {name: new RegExp(query, "i")}
  }

  City.list(options, function (err, cities) {
    if (err) return next(err)
    City.count().exec(function (err, count) {
      req.cities = cities
      next()
    })
  })
}

/**
 * Return an object that will power the map reducer to find
 * the closest city to a lat/long
 */
function getMapReducer(scope) {
  return {
    verbose: true,
    scope: scope,

    // Map finds the distance of current location against each city
    map: function() {
      if (typeof(Number.prototype.toRad) === "undefined") {
        Number.prototype.toRad = function() {
          return this * Math.PI / 180;
        }
      }

      // Calculate distance between 2 lat/long
      // http://www.movable-type.co.uk/scripts/latlong.html
      //
      var R = 6371; // km
      var dLat = (this.latitude-lat).toRad();
      var dLon = (this.longitude-lon).toRad();
      var lat1 = lat.toRad();
      var lat2 = this.latitude.toRad();

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      emit(this.name, R*c)
    },

    // Reduce finds the closest city
    reduce: function(key, values) {
      var min = values[0]
      for (var i = 1; i < values.length; i++) {
        if (values[i] < min) {
          min = values[i]
        }
      }
      return min
    }
  }
}

/**
 * Find and return the city matching the lat/long
 */

exports.locate = function(req, res) {
  
  var lat = parseFloat(req.query.lat)
    , lon = parseFloat(req.query.lon)
    , o = getMapReducer({lat: lat, lon: lon})

  City.mapReduce(o, function(err, results) {
    if (err) return res.locals.sendJson(res, { 'status': 'error', 'message': err })
    return res.locals.sendJson(res, { 'status': 'ok', 'results': results })
  })
}

/**
 * Return the cities we have in memory as array
 */

exports.search = function(req, res) {
  var cities = []
  
  _.each(req.cities, function(city, index) {
    if (!city.country) {
      return
    }
    cities.push(util.format("%s, %s, %s",
      city.name, city.state, city.country.name))
  })

  res.writeHead(200, {"Content-Type": "application/json"});
  res.write(JSON.stringify(cities))
  return res.end()
}
