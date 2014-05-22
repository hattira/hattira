var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , _ = require('underscore')

var getTags = function (tags) {
  return tags.join(',')
}

var setTags = function (tags) {
  return _.invoke(tags.split(','), 'trim')
}

var radToKilometers = function (rad) {
  return rad/6371
}


var MeetupSchema = new Schema({
  title: {type : String},
  description: {type : String},
  website: {type : String},
  startDate: {type : Date},
  endDate: {type : Date},
  venue: {type : String},
  city: {type : String},
  state: {type : String},
  country: {type : String},
  loc: {
    type: { type: String }, 
    coordinates: []
  },
  user: {type : Schema.ObjectId, ref : 'User'},
  comments: [{
    body: { type : String},
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

MeetupSchema.index({ loc : '2dsphere' });


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

MeetupSchema.path('startDate').validate(function (val) {
  return val && val.getTime && val.getTime()
}, 'Meetup startDate is required')

MeetupSchema.path("endDate").validate(function (val) {
  return val && val.getTime && val.getTime()
}, 'Meetup endDate is required')

MeetupSchema.path("isFree").validate(function (isFree) {
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

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email provider')
      .populate('comments.user')
      .populate('attending.user')
      .exec(cb)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name username provider facebook twitter')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  },

  searchOptions: function() {
    return options = {
      maxDistance: radToKilometers(config.NEARBY_RADIUS),
      spherical: true,
      limit: config.RESULTS_PER_PAGE
    }
  }

}

mongoose.model('Meetup', MeetupSchema)
