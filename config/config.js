
var path = require('path')
  , rootPath = path.normalize(__dirname + '/..')
  , templatePath = path.normalize(__dirname + '/../app/mailer/templates')

module.exports = {
  development: {
    db: 'mongodb://localhost/deau_dev',
    root: rootPath,
    app: {
      name: 'deau: Developer Events Around U'
    },
    twitter: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
  },
  test: {
    db: 'mongodb://localhost/deau_test',
    root: rootPath,
    app: {
      name: 'deau: Developer Events Around U'
    },
    twitter: {
      clientID: "CONSUMER_KEY",
      clientSecret: "CONSUMER_SECRET",
      callbackURL: "http://localhost:3000/auth/twitter/callback"
    },
  },
  production: {}
}
