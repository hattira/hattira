#!/usr/bin/python

"""
Script to produce the js file that will load 
cities and countries to Mongo.  run as -

$ python load.py
"""

import csv
import string
from string import Template

template = """
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
"""

loading_city_template = """
    // dummy function
    function(cb) {cb(null)}
],
function(err, result) {
  if (err) process.exit(err)
})

console.log('Loading cities')
async.series([
"""

end_template = """
    // dummy function
    function(cb) {cb(null)}
],
// Done loading, exit now
function(err, result) {
  if (err) process.exit(err)
  process.exit(0)
})
"""

country_template = Template("""
  function(cb) {
    new Country({name: "$name", twoLetterCode: '$two_letter', threeLetterCode: '$three_letter', continent: '$continent', timezone: '$timezone', gmtOffset: '$gmt'}).save(function (err, doc, count) {
      if (err) return cb(err)
      countries[doc.twoLetterCode] = doc._id
      return cb(null, doc)
    })
  },
""")

city_template = Template("""
  function(cb) {
    new City({name: "$name", fingerprint: "$fp", latitude: "$lat", longitude: "$lon", state: "$state", country: countries["$country_code"]}).save(function (err, doc, count) {
      if (err) return cb(err)
      return cb(null, doc)
    })
  },
""")

def is_ascii(ch):
    return ch in string.ascii_lowercase

def fingerprint(name):
    return filter(is_ascii, name.lower())
    
def load_timezones():
    """Load timezone to a dictionary and return the dictionary"""

    d = {}
    with open('timeZones.txt', "rb") as csvfile:
        reader = csv.reader(csvfile, dialect='excel-tab')
        for (country_code, timez, gmtoffset, rest, rest1) in reader:
            d[country_code] = (timez, gmtoffset)
    return d

def load_state_codes():
    
    codes = {}
    with open('admin1CodesASCII.txt', "rb") as csvfile:
        reader = csv.reader(csvfile, dialect='excel-tab')
        for (state_code, _, state, _) in reader:
            codes[state_code] = state
    return codes

def write_city(fields, f, state_codes):
    
    name = fields[2]
    lat = fields[4]
    lon = fields[5]
    country_code = fields[8]
    fp = fingerprint(name)

    try:
        key = '{0}.{1}'.format(country_code, fields[10])
        state = state_codes[key]
    except KeyError, e:
        state = None

    f.write(city_template.substitute( name=name, fp=fp, lat=lat, lon=lon,
        country_code=country_code, state=state))

def write_country(fields, f, tz):

    iso = fields[0]
    iso3 = fields[1]
    name = fields[4]
    continent = fields[8]
    try:
        timezone, gmt_offset = tz[iso]
    except KeyError:
        timezone = ''
        gmt_offset = 0

    f.write(country_template.substitute(
        name=name, two_letter=iso, three_letter=iso3,
        continent=continent, timezone=timezone, gmt=gmt_offset))

def handle_cities(filename, f):
    codes = load_state_codes()
    with open(filename, 'rb') as csvfile:
        reader = csv.reader(csvfile, dialect='excel-tab')
        for row in reader:
            write_city(row, f, codes)

def handle_countries(filename, f):
    tz = load_timezones()
    with open(filename, "rb") as csvfile:
        reader = csv.reader(csvfile, dialect='excel-tab')
        for row in reader:
            write_country(row, f, tz)

if __name__ == "__main__":
    
    with open('loadCities.js', 'wb') as f:
        f.write(template)
        handle_countries('countryInfo.txt', f)
        f.write(loading_city_template)
        handle_cities('cities5000.txt', f)
        f.write(end_template)
