var rootPath = require('path').normalize(__dirname + '/..')
  , _ = require('underscore')

var _base = {
  db: 'mongodb://localhost/hattira',
  root: rootPath,
  items_per_page: 30,
  app: {
    name: 'hattira: Events around you'
  },
  twitter: {
    clientID: "t9RpUnXyRvTEz88YrxdGDOKBr",
    clientSecret: "SmVIVCHTAyDCgbLkvMMKZMWQxN7J7V8vBqvPdniWErygIF6QKx",
    callbackURL: "http://localhost:3000/auth/twitter/callback"
  },
  facebook: {
    clientID: "1406466249565794",
    clientSecret: "a2f0757486db1fb8ec396bf16dd86d97",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  fallbackLatitude: 12.972558,
  fallbackLongitude: 77.594911,
  fallbackCity: "Bangalore",
  NEARBY_RADIUS: 250, // distance in kms
  RESULTS_PER_PAGE: 20,
  MIXPANEL_ID: process.env.MIXPANEL_ID || "86d6a0a2e95c442691e4dc5543dbc833"
}

var development = _.extend({}, _base, { db: _base.db+'_dev' })
  , test        = _.extend({}, _base, { db: _base.db+'_test' })
  , production  = _.extend({}, _base, {
      db: process.env.MONGOHQ_URL || _base.db+'_prod',
      facebook: {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://www.hattira.com/auth/facebook/callback"
      },
      twitter: {
        clientID: process.env.TWITTER_CLIENT_ID,
        clientSecret: process.env.TWITTER_CLIENT_SECRET,
        callbackURL: "http://www.hattira.com/auth/twitter/callback"
      },
      fallbackCityId: '51fd5227920fc2020000522c',
      debug: false
    })

module.exports = {
  development: development,
  test: test,
  production: production
}
