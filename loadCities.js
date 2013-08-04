
/*!
 * eiyc - events in your city
 * Copyright(c) 2013 Pradip Caulagi <caulagi@gmail.com>
 * MIT Licensed

 * Standalone script to load city and country information.
 * Cities and countries are picked up from http://www.geonames.org/
 *
 * Run script as
 *
 *   node data/loadCities.js
 *
 */

var fs = require('fs')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../config/config')[env]
  , mongoose = require('mongoose')
  , async = require('async')

// Bootstrap db connection
mongoose.connect(config.db)

// Bootstrap models
var models_path = __dirname + '/../app/models'
fs.readdirSync(models_path).forEach(function (file) {
  if (~file.indexOf('.js')) require(models_path + '/' + file)
})

// Load models after we have read them
var Country = mongoose.model('Country') 
  , City = mongoose.model('City')
  , countries = {}

console.log('Loading data to:', config.db)
console.log('Loading countries')

// Load each country and city, wait for it to
// be written to db and then exit
async.series([
