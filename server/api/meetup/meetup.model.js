'use strict';

var mongoose = require('mongoose'),
    _ = require('lodash'),
    Schema = mongoose.Schema;

var setTags = function (tags) {
  return _.invoke(tags.split(','), 'trim')
}

var radToKilometers = function (rad) {
  return rad/6371
}

var MeetupSchema = new Schema({
  title: String,
  description: String,
  cover: String,
  startDate: Date,
  endDate: Date,
  venue: String,
  city: String,
  state: String,
  country: String,
  loc: {
    type: String,
    coordinates: []
  },
  author: {type : Schema.ObjectId, ref : 'User'},
  admins: [{
    user: { type : Schema.ObjectId, ref : 'User' },
  }],
  attending: [{
    user: { type : Schema.ObjectId, ref : 'User' },
  }],
  tags: {type: [], set: setTags},
  isFree: Boolean,
  created: {type : Date, default : Date.now},
  active: Boolean
});

MeetupSchema.index({ loc : '2dsphere' });


MeetupSchema.statics = {

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('author', 'name email provider')
      .populate('attending.user')
      .populate('admins.user')
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
  }
}

module.exports = mongoose.model('Meetup', MeetupSchema);
