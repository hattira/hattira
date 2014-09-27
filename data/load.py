#!/usr/bin/python

"""
Script to produce the js file that will load cities to Mongo.
Run as -

$ python load.py
"""

import os
import csv
import string
from string import Template

template = """/*!
 * sntd - something new to do
 * Copyright(c) 2013 Pradip Caulagi <caulagi@gmail.com>
 * MIT Licensed

 * Standalone script to load city names from http://dev.maxmind.com/geoip/legacy/geolite/
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
var City = mongoose.model('City')

console.log('Loading data to:', config.db)
console.log('Loading cities.  This will take a while...')
async.series([
"""

end_template = """
    // dummy function
    function(cb) {cb(null)}
],
// Done loading, exit now
function(err, result) {
  if (err) process.exit(err)
  console.log("ok")
  process.exit(0)
})
"""

city_template = Template("""
  function(cb) {
    new City({name: "$name", fingerprint: "$fp", latitude: "$lat", longitude: "$lon", state: "$state", country: "$country"}).save(function (err, doc, count) {
      if (err) return cb(err)
      return cb(null, doc)
    })
  },
""")

def is_ascii(ch):
    return ch in string.ascii_lowercase

def fingerprint(name):
    return filter(is_ascii, name.lower())
    
# some cities apparently have multiple entries.  Make sure we 
# add them only once
ignore = []

def write_city(fields, f):
    
    country = fields[1]
    state = fields[2]
    name = fields[3]
    lat = fields[5]
    lon = fields[6]
    fp = fingerprint(name)

    if fingerprint(name+state+country) in ignore:
        return

    ignore.append(fingerprint(name+state+country))
    print name
    f.write(city_template.substitute(name=name, fp=fp, lat=lat, lon=lon,
        country=country, state=state))

def handle_cities(filename, f):
    with open(filename, 'rb') as csvfile:
        reader = csv.reader(csvfile)
        # ignore first 2 lines
        reader.next()
        reader.next()
        for row in reader:
            write_city(row, f)

if __name__ == "__main__":
    
    with open(os.path.join('data', 'loadCities.js'), 'wb') as f:
        print "Generating load script.  Will take a few minutes..."
        f.write(template)
        handle_cities(os.path.join('data', 'GeoLiteCity-Location.csv'), f)
        f.write(end_template)
        print "Done!"
