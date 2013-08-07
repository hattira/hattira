
var rootPath = require('path').normalize(__dirname + '/..')
  , _ = require('underscore')

var _base = {
  db: 'mongodb://localhost/sntd',
  root: rootPath,
  items_per_page: 30,
  app: {
    name: 'sntd: Sommething New To Do - events in your city'
  },
  facebook: {
    clientID: "1406466249565794",
    clientSecret: "a2f0757486db1fb8ec396bf16dd86d97",
    callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  fallbackCity: 'Bangalore',
  fallbackCityId: '51fe014e1f004ba72300522c',
  MIXPANEL_ID: process.env.MIXPANEL_ID || "86d6a0a2e95c442691e4dc5543dbc833"
}

var development = _.extend({}, _base, { db: _base.db+'_dev' })
  , test        = _.extend({}, _base, { db: _base.db+'_test' })
  , production  = _.extend({}, _base, {
      db: process.env.MONGOHQ_URL || _base.db+'_prod',
      twitter: {
        clientID: process.env.TWITTER_CONSUMER_KEY,
        clientSecret: process.env.TWITTER_CONSUMER_SECRET,
        callbackURL: "http://sntd.pw/auth/twitter/callback"
      },
      fallbackCityId: '51fd5227920fc2020000522c'
    })

module.exports = {
  development: development,
  test: test,
  production: production
}
