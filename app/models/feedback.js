/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , util = require('util')


var FeedbackSchema = new Schema({
  title: {type : String},
  body: {type : String},
  name: {type : String},
  email: {type : String},
  type: {type : String},
  created  : {type : Date, default : Date.now}
})

function notEmpty(val) {
  return val && val.length > 0
}

function errorMessage(val) {
  return util.format('%s is required', val)
}

FeedbackSchema.path('title').validate(function (title) {
  return notEmpty(title)
}, errorMessage('Title'))

FeedbackSchema.path('name').validate(function (name) {
  return notEmpty(name)
}, errorMessage('Name'))

FeedbackSchema.path('email').validate(function (email) {
  return notEmpty(email)
}, errorMessage('Email'))

FeedbackSchema.path('body').validate(function (body) {
  return notEmpty(body)
}, errorMessage('Body'))

mongoose.model('Feedback', FeedbackSchema)
