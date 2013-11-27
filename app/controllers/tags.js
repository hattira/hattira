/**
 * Module dependencies.
 */

var meetups = require('../controllers/meetups')

/**
 * List items tagged with a tag
 */

exports.index = function (req, res, next) {
  var options = { criteria: {tags: req.param('tag')} }
  return meetups.bySearchCriteria(req, res, next, options)
}
