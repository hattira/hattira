
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')

module.exports = {
  development: {
    db: 'mongodb://localhost/deau_dev',
    root: rootPath,
    app: {
      name: 'deau: Developer Events Around You'
    },
    twitter: {
      clientID: "j9X8kVVckZIjepCH9G2zNQ",
      clientSecret: "YdVw6jciDdVzAIeptYjo0ZTIHqIeXXccordtb0fmm6U",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
  },
  test: {
    db: 'mongodb://localhost/deau_test',
    root: rootPath,
    app: {
      name: 'deau: Developer Events Around You'
    },
    twitter: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
  },
  production: {
    db: process.env.MONGOHQ_URL || 'mongodb://localhost/deau_prod',
    root: rootPath,
    app: {
      name: 'deau: Developer Events Around You'
    },
    twitter: {
      clientID: process.env.TWITTER_CONSUMER_KEY,
      clientSecret: process.env.TWITTER_CONSUMER_SECRET,
      callbackURL: "http://deau.pw/auth/twitter/callback"
    },
  }
}
