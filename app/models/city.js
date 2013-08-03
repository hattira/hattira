
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , _ = require('underscore')

/**
 * City Schema
 */

var CitySchema = new Schema({
  name         : String,
  fingerprint  : String,
  latitude     : Number,
  longitude    : Number,
  state        : String,
  country      : {type : Schema.ObjectId, ref : 'Country'},
  createdAt    : {type : Date, default : Date.now}
})

/**
 * Statics
 */

CitySchema.statics = {

  byId: function (id, cb) {
    this.findOne({ _id : id })
      .populate('country', 'name')
      .exec(cb)
  },

  byFingerprint: function (fp, cb) {
    this.findOne({ fingerprint: fp })
      .populate('country', 'name')
      .exec(cb)
  },

  byName: function(query, cb) {
    this.find({ name: new RegExp(query, "i") })
      .populate('country', 'name')
      .exec(cb)
  },

  byParams: function (params, cb) {
    this.findOne(params)
      .populate('country', 'name')
      .exec(cb)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('country', 'name')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  },

  getFingerprint: function (cityName) {
    var isAscii = function (ch) {
      return "abcdefghijklmnopqrstuvwxyz".indexOf(ch) !== -1
    }
    return _.filter(cityName.toLowerCase(), isAscii).join('')
  }
}

mongoose.model('City', CitySchema)
