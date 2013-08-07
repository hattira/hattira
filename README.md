# [sntd][1] - Something New To Do

[![Build Status](https://travis-ci.org/caulagi/sntd.png?branch=master)](https://travis-ci.org/caulagi/sntd)

sntd - Something New To Do - is a webapp to allow people
to easily track what is happening in a city.  Anybody
can create a listing for free, and it will have some
social features like following.

Built with love using Nodejs and Mongodb.

## Dev setup

* Install mongodb

* Load data about cities and countries

        $ node data/loadCities.js

* Install dependencies and start node

        $ npm install
        $ nodemon server.js

## Tests
    
* Some basics tests at the moment

        $ npm test

## License

Licensed under [MIT][1]

[1]: https://github.com/caulagi/sntd/blob/master/LICENSE
[2]: https://github.com/caulagi/sntd/blob/master/CREDITS
[3]: http://sntd.pw
