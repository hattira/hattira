
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',')
}

/**
 * Meetup Schema
 */

var MeetupSchema = new Schema({
  title: {type : String, default : '', trim : true},
  description: {type : String, default : '', trim : true},
  website: {type : String, default : '', trim : true},
  startDate: {type : Date, default : '', trim : true},
  endDate: {type : Date, default : '', trim : true},
  venue: {type : String, default : '', trim : true},
  city: {type: String, default : '', trim : true},
  state: {type: String, default : '', trim : true},
  country: {type: String, default : '', trim : true},
  latitude: {type : Number, default : '', trim : true},
  longitude: {type : Number, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  comments: [{
    body: { type : String, default : '' },
    user: { type : Schema.ObjectId, ref : 'User' },
    createdAt: { type : Date, default : Date.now }
  }],
  attending: [{
    user: { type : Schema.ObjectId, ref : 'User' },
  }],
  tags: {type: [], get: getTags, set: setTags},
  isFree: {type: Boolean},
  createdAt  : {type : Date, default : Date.now}
})

/**
 * Validations
 */

MeetupSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Meetup title cannot be blank')

MeetupSchema.path('description').validate(function (description) {
  return description && description.length > 0
}, 'Meetup description cannot be blank')

MeetupSchema.path('venue').validate(function (venue) {
  return venue && venue.length > 0
}, 'Meetup venue is required')

MeetupSchema.path('city').validate(function (city) {
  return city && city.length > 0
}, 'Meetup city is required')

MeetupSchema.path('state').validate(function (state) {
  return state && state.length > 0
}, 'Meetup state is required')

MeetupSchema.path('country').validate(function (country) {
  return country && country.length > 0
}, 'Meetup country is required')

MeetupSchema.path('startDate').validate(function (val) {
  return val && val.getTime && val.getTime()
}, 'Meetup startDate is required')

MeetupSchema.path('endDate').validate(function (val) {
  return val && val.getTime && val.getTime()
}, 'Meetup endDate is required')

MeetupSchema.path('latitude').validate(function (latitude) {
  return latitude && typeof latitude === 'number'
}, 'Meetup latitude is required')

MeetupSchema.path('longitude').validate(function (longitude) {
  return longitude && typeof longitude === 'number'
}, 'Meetup longitude is required')

MeetupSchema.path('isFree').validate(function (isFree) {
  return isFree && typeof isFree === 'boolean'
}, 'Meetup isFree is required')


MeetupSchema.methods = {

  addComment: function (user, comment, cb) {
    //var notify = require('../mailer/notify')

    this.comments.push({
      body: comment.body,
      user: user._id
    })

    /*
    notify.comment({
      meetup: this,
      currentUser: user,
      comment: comment.body
    })
    */

    this.save(cb)
  },

  addAttending: function (user, cb) {
    this.attending.push({
      user: user._id
    })
  }

}

/**
 * Statics
 */

MeetupSchema.statics = {

  /**
   * Find meetup by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email username')
      .populate('comments.user')
      .populate('attending.user')
      .exec(cb)
  },

  /**
   * List meetups
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Meetup', MeetupSchema)
