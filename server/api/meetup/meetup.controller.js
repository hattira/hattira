'use strict';

var _ = require('lodash');
var Meetup = require('./meetup.model');

// Get list of meetups
exports.index = function(req, res) {
  Meetup.find(function (err, meetups) {
    if(err) { return handleError(res, err); }
    return res.json(200, meetups);
  });
};

// Get a single meetup
exports.show = function(req, res) {
  Meetup.findById(req.params.id, function (err, meetup) {
    if(err) { return handleError(res, err); }
    if(!meetup) { return res.send(404); }
    return res.json(meetup);
  });
};

// Creates a new meetup in the DB.
exports.create = function(req, res) {
  Meetup.create(req.body, function(err, meetup) {
    if (err) {
      console.log(err);
      return handleError(res, err);
    }
    return res.json(201, meetup);
  });
};

// Updates an existing meetup in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Meetup.findById(req.params.id, function (err, meetup) {
    if (err) { return handleError(res, err); }
    if(!meetup) { return res.send(404); }
    var updated = _.merge(meetup, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, meetup);
    });
  });
};

// Deletes a meetup from the DB.
exports.destroy = function(req, res) {
  Meetup.findById(req.params.id, function (err, meetup) {
    if(err) { return handleError(res, err); }
    if(!meetup) { return res.send(404); }
    meetup.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
