
var rootPath = require('path').normalize(__dirname + '/..')
  , _ = require('underscore')

var _base = {
  db: 'mongodb://localhost/eiyc',
  root: rootPath,
  items_per_page: 30,
  app: {
    name: 'eiyc: Events In Your City'
  },
  twitter: {
    clientID: "j9X8kVVckZIjepCH9G2zNQ",
    clientSecret: "YdVw6jciDdVzAIeptYjo0ZTIHqIeXXccordtb0fmm6U",
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  fallbackCity: 'Bangalore',
  fallbackCityId: '51fd5227920fc2020000522c',
  MIXPANEL_ID: process.env.MIXPANEL_ID || "86d6a0a2e95c442691e4dc5543dbc833"
}

var development = _.extend({}, _base, { db: _base.db+'_dev' })
  , test        = _.extend({}, _base, { db: _base.db+'_test' })
  , production  = _.extend({}, _base, {
      db: process.env.MONGOHQ_URL || _base.db+'_prod',
      twitter: {
        clientID: process.env.TWITTER_CONSUMER_KEY,
        clientSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "http://eiyc.pw/auth/twitter/callback"
      },
      fallbackCityId: '51fd5227920fc2020000522c'
    })

module.exports = {
  development: development,
  test: test,
  production: production
}
