
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema

/**
 * Country Schema
 */

var CountrySchema = new Schema({
  name            : String,
  twoLetterCode   : String,
  threeLetterCode : String,
  continent       : String,
  timezone        : String,
  gmtOffset       : Number,
  createdAt       : {type : Date, default : Date.now}
})

/**
 * Statics
 */

CountrySchema.statics = {

  load: function (id, cb) {
    this.findOne({ _id : id })
      .exec(cb)
  },

  byTwoLetterCode: function (code, cb) {
    this.findOne({ twoLetterCode : code })
      .exec(cb)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }
}

mongoose.model('Country', CountrySchema)
